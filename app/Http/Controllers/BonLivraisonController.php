<?php

namespace App\Http\Controllers;

use App\Models\BonLivraison;
use App\Models\Commande;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class BonLivraisonController extends Controller
{
    public function generate(Commande $commande): RedirectResponse
    {
        $existing = $commande->bonLivraison;

        if ($existing) {
            return redirect()->route('bons-livraison.show', $existing->id)
                ->with('info', 'Un bon de livraison existe déjà pour cette commande.');
        }

        $nextId = (BonLivraison::withTrashed()->max('id') ?? 0) + 1;

        $bl = BonLivraison::create([
            'commande_id' => $commande->id,
            'numero_bl' => 'BL-'.now()->format('Ymd').'-'.str_pad($nextId, 4, '0', STR_PAD_LEFT),
            'statut' => 'emis',
            'date_emission' => now(),
        ]);

        return redirect()->route('bons-livraison.show', $bl->id)->with('success', 'Bon de livraison généré.');
    }

    public function show(BonLivraison $bonLivraison)
    {
        $bonLivraison->load('commande.client', 'commande.items.produit');

        return Inertia::render('bons-livraison/Show', ['bonLivraison' => $bonLivraison]);
    }
}
