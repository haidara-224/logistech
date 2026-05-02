<?php

namespace App\Http\Controllers;

use App\Events\AdminActivityEvent;
use App\Models\AdminNotification;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Commande_item;
use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(): Response
    {
        $panier = session('panier', []);

        if (empty($panier)) {
            return Inertia::render('boutique/checkout', [
                'panier' => [],
                'produits' => [],
            ]);
        }

        $ids = array_keys($panier);
        $produits = Produit::whereIn('id', $ids)->get()->keyBy('id');

        return Inertia::render('boutique/checkout', [
            'panier' => $panier,
            'produits' => $produits->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nom' => 'required|string|max:150',
            'prenom' => 'nullable|string|max:150',
            'email' => 'required|email|max:150',
            'telephone' => 'required|string|max:30',
            'quartier' => 'nullable|string|max:150',
        ]);

        $panier = session('panier', []);

        if (empty($panier)) {
            return back()->withErrors(['panier' => 'Votre panier est vide.']);
        }

        $notifData = [];

        DB::transaction(function () use ($request, $panier, &$notifData) {
            $client = Client::firstOrCreate(
                ['email' => $request->email],
                [
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'telephone' => $request->telephone,
                    'quartier' => $request->quartier,
                ],
            );

            $montantTotal = collect($panier)->sum(fn ($item) => $item['prix'] * $item['quantite']);

            $commande = Commande::create([
                'client_id' => $client->id,
                'user_id' => null,
                'status' => 'en_attente',
                'source' => 'online',

                'montant_total' => $montantTotal,
            ]);

            foreach ($panier as $item) {
                $produit = Produit::findOrFail($item['produit_id']);

                Commande_item::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $produit->id,
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix'],
                    'prix_total' => $item['prix'] * $item['quantite'],
                ]);

                Mouvements_stock::create([
                    'produit_id' => $produit->id,
                    'type' => 'sortie',
                    'quantite' => $item['quantite'],
                    'source' => 'commande',
                    'commande_id' => $commande->id,
                ]);
            }

            $notifData = [
                'client' => $client->nom,
                'commande_id' => $commande->id,
                'montant' => $montantTotal,
                'message' => "Nouvelle commande en ligne de {$client->nom} — ".number_format($montantTotal, 0, ',', ' ').' GNF',
            ];

            session(['panier' => []]);
        });

        $notif = AdminNotification::create([
            'type' => 'commande_online',
            'message' => $notifData['message'],
            'data' => ['id' => $notifData['commande_id'], 'client' => $notifData['client'], 'montant' => $notifData['montant']],
        ]);

        rescue(fn () => broadcast(new AdminActivityEvent(
            type: 'commande_online',
            message: $notif->message,
            data: array_merge($notif->data, ['notif_id' => $notif->id]),
        )));

        return redirect()->route('boutique.confirmation');
    }

    public function confirmation(): Response
    {
        return Inertia::render('boutique/confirmation');
    }
}
