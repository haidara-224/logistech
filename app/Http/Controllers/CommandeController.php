<?php

namespace App\Http\Controllers;

use App\Contracts\CommandeServiceInterface;
use App\Http\Requests\StoreCommandeRequest;
use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class CommandeController extends Controller
{
    protected CommandeServiceInterface $service;

    public function __construct(CommandeServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $commandes = Commande::with('client', 'items.produit')->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('commandes/Index', ['commandes' => $commandes]);
    }

    public function create()
    {
        $clients = Client::select('id', 'nom', 'prenom')->orderBy('nom')->get();
        $produits = Produit::with(['images.image'])
            ->select('id', 'nom', 'sku', 'prix_vente', 'quantite_stock', 'stock_minimal')
            ->where('quantite_stock', '>', 0)
            ->orderBy('nom')
            ->get();

        return Inertia::render('commandes/Create', compact('clients', 'produits'));
    }

    public function store(StoreCommandeRequest $request): RedirectResponse
    {
        $commande = $this->service->createCommande($request->validated());

        return redirect()->route('commandes.show', $commande->id)->with('success', 'Commande créée');
    }

    public function show(Commande $commande)
    {
        $commande->load('client', 'items.produit');

        return Inertia::render('commandes/Show', ['commande' => $commande]);
    }

    public function destroy(Commande $commande): RedirectResponse
    {
        $commande->load('client');
        $clientName = $commande->client ? "{$commande->client->nom} {$commande->client->prenom}" : 'Client anonyme';
        AuditLog::record('deleted', Commande::class, $commande->id, "Suppression de la commande #{$commande->id} ({$clientName}, {$commande->montant_total} GNF)", $commande->toArray());
        $commande->delete();

        return redirect()->route('commandes.index')->with('success', 'Commande supprimée');
    }

    public function destroyAll(): RedirectResponse
    {
        $count = Commande::count();
        AuditLog::record('bulk_deleted', Commande::class, null, "Suppression en masse de {$count} commande(s)", ['count' => $count]);
        Commande::query()->delete();

        return redirect()->route('commandes.index')->with('success', 'Toutes les commandes ont été supprimées.');
    }
}
