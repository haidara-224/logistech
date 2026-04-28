<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreLivraisonRequest;
use App\Models\Livraison;
use Illuminate\Http\RedirectResponse;

class LivraisonController extends Controller
{
    public function store(StoreLivraisonRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $livraison = Livraison::create(array_filter($validated, fn ($value) => $value !== null));

        $expedition = $livraison->expedition;
        if ($expedition) {
            $expedition->update(['statut' => $livraison->etat]);

            if ($livraison->etat === 'livré') {
                $expedition->camion->update(['statut' => 'disponible']);
                $expedition->chauffeur->update(['statut' => 'disponible']);
            }
        }

        return back()->with('success', 'État de livraison enregistré.');
    }
}
