<?php

namespace App\Http\Controllers;

use App\Models\Facture;
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

    public function show(Facture $facture)
    {
        $facture->load('commande.client', 'commande.items.produit');

        return Inertia::render('factures/Show', ['facture' => $facture]);
    }
}
