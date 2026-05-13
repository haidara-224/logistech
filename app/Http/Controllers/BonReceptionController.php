<?php

namespace App\Http\Controllers;

use App\Models\Achat;
use App\Models\BonReception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class BonReceptionController extends Controller
{
    public function generate(Achat $achat): RedirectResponse
    {
        $existing = $achat->bonReception;

        if ($existing) {
            return redirect()->route('bons-reception.show', $existing->id)
                ->with('info', 'Un bon de réception existe déjà pour cet achat.');
        }

        $nextId = (BonReception::withTrashed()->max('id') ?? 0) + 1;

        $br = BonReception::create([
            'achat_id' => $achat->id,
            'numero_br' => 'BR-'.now()->format('Ymd').'-'.str_pad($nextId, 4, '0', STR_PAD_LEFT),
            'statut' => 'emis',
            'date_emission' => now(),
        ]);

        return redirect()->route('bons-reception.show', $br->id)->with('success', 'Bon de réception généré.');
    }

    public function show(BonReception $bonReception)
    {
        $bonReception->load('achat.fournisseur', 'achat.items.produit');

        return Inertia::render('bons-reception/Show', ['bonReception' => $bonReception]);
    }
}
