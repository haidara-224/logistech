<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreLivraisonRequest;
use App\Models\ChauffeurNotification;
use App\Models\Livraison;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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

    public function valider(Request $request, Livraison $livraison): RedirectResponse
    {
        $request->validate([
            'statut_final' => ['required', 'in:livré,annulé'],
            'commentaire_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $statutFinal = $request->statut_final;

        $livraison->update([
            'etat' => $statutFinal,
            'valide_admin' => true,
            'valide_at' => now(),
        ]);

        $expedition = $livraison->expedition()->with(['camion', 'chauffeur'])->first();

        if ($expedition) {
            $expedition->update(['statut' => $statutFinal]);

            if ($statutFinal === 'livré' || $statutFinal === 'annulé') {
                $expedition->camion?->update(['statut' => 'disponible']);
                $expedition->chauffeur?->update(['statut' => 'disponible']);
            }
        }

        if ($expedition?->chauffeur_id) {
            $ref = $expedition->reference ?? '—';
            $type = 'livraison_'.($statutFinal === 'livré' ? 'validee' : 'annulee');

            $alreadyNotified = ChauffeurNotification::where('chauffeur_id', $expedition->chauffeur_id)
                ->where('type', $type)
                ->where('data->livraison_id', $livraison->id)
                ->exists();

            if (! $alreadyNotified) {
                $message = $statutFinal === 'livré'
                    ? "Votre livraison ({$ref}) a été validée par l'administration."
                    : "Votre livraison ({$ref}) a été annulée par l'administration.";

                ChauffeurNotification::create([
                    'chauffeur_id' => $expedition->chauffeur_id,
                    'type' => $type,
                    'message' => $message,
                    'data' => ['expedition_id' => $expedition->id, 'livraison_id' => $livraison->id],
                ]);
            }
        }

        $label = $statutFinal === 'livré' ? 'validée' : 'refusée';

        return back()->with('success', "Livraison {$label}.");
    }
}
