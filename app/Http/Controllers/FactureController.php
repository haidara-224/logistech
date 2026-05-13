<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Facture;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class FactureController extends Controller
{
    public function index()
    {
        $factures = Facture::with('commande.client')
            ->orderByDesc('created_at')
            ->paginate(20);

        $stats = [
            'total_factures' => Facture::count(),
            'montant_total' => Facture::sum('montant_total') ?? 0,
            'ce_mois' => Facture::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'montant_mois' => Facture::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('montant_total') ?? 0,
        ];

        return Inertia::render('factures/Index', compact('factures', 'stats'));
    }

    public function generate(Commande $commande): RedirectResponse
    {
        $existing = $commande->factures()->where('type', 'vente')->first();
        if ($existing) {
            return redirect()->route('factures.show', $existing->id)
                ->with('info', 'Une facture existe déjà pour cette commande.');
        }

        $nextId = (Facture::withTrashed()->max('id') ?? 0) + 1;

        $facture = Facture::create([
            'commande_id' => $commande->id,
            'numero_facture' => 'FAC-'.now()->year.'-'.str_pad($nextId, 5, '0', STR_PAD_LEFT),
            'type' => 'vente',
            'statut' => 'emise',
            'montant_total' => $commande->montant_total ?? 0,
            'frais_transport' => $commande->frais_transport ?? 0,
            'droits_douane' => $commande->droits_douane ?? 0,
            'notes' => $commande->notes,
            'date_emission' => now(),
        ]);

        return redirect()->route('factures.show', $facture->id)->with('success', 'Facture générée avec succès.');
    }

    public function show(Facture $facture)
    {
        if ($facture->type === 'achat') {
            $facture->load('achat.fournisseur', 'achat.items.produit', 'paiements');
        } else {
            $facture->load('commande.client', 'commande.items.produit', 'paiements');
        }

        return Inertia::render('factures/Show', ['facture' => $facture]);
    }
}
