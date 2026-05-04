<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreExpeditionRequest;
use App\Http\Requests\Logistique\UpdateExpeditionRequest;
use App\Http\Requests\Logistique\UpdateExpeditionStatusRequest;
use App\Models\Expedition;
use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;

class ExpeditionController extends Controller
{
    public function store(StoreExpeditionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $expedition = Expedition::create(array_filter($validated, fn ($value) => $value !== null));

        if (! empty($validated['produits'])) {
            foreach ($validated['produits'] as $item) {
                $quantity = (int) ($item['quantite'] ?? 1);
                $expedition->produits()->attach($item['produit_id'], ['quantite' => $quantity]);

                $produit = Produit::find($item['produit_id']);
                if ($produit) {
                    $produit->quantite_stock = max(0, $produit->quantite_stock - $quantity);
                    $produit->save();

                    Mouvements_stock::create([
                        'produit_id' => $produit->id,
                        'type' => 'sortie',
                        'quantite' => $quantity,

                        'source' => 'expedition',
                    ]);
                }
            }
        }

        if ($validated['statut'] === 'en cours') {
            $expedition->camion->update(['statut' => 'en mission']);
            $expedition->chauffeur->update(['statut' => 'en mission']);
        } elseif (in_array($validated['statut'], ['livré', 'annulé', 'en préparation'], true)) {
            $expedition->camion->update(['statut' => 'disponible']);
            $expedition->chauffeur->update(['statut' => 'disponible']);
        }

        return back()->with('success', 'Expédition créée et stock mis à jour.');
    }

    public function update(UpdateExpeditionRequest $request, Expedition $expedition): RedirectResponse
    {
        $validated = $request->validated();

        $expedition->update(array_filter($validated, fn ($value) => $value !== null));

        if (array_key_exists('produits', $validated) && is_array($validated['produits'])) {
            $syncData = [];
            foreach ($validated['produits'] as $item) {
                $syncData[$item['produit_id']] = ['quantite' => (int) ($item['quantite'] ?? 1)];
            }
            $expedition->produits()->sync($syncData);
        }

        if (isset($validated['statut'])) {
            if ($validated['statut'] === 'en cours') {
                $expedition->camion->update(['statut' => 'en mission']);
                $expedition->chauffeur->update(['statut' => 'en mission']);
            } elseif (in_array($validated['statut'], ['livré', 'annulé', 'en préparation'], true)) {
                $expedition->camion->update(['statut' => 'disponible']);
                $expedition->chauffeur->update(['statut' => 'disponible']);
            }
        }

        return back()->with('success', 'Expédition mise à jour.');
    }

    public function destroy(Expedition $expedition): RedirectResponse
    {
        $expedition->delete();

        return back()->with('success', 'Expédition supprimée.');
    }

    public function updateStatus(UpdateExpeditionStatusRequest $request, Expedition $expedition): RedirectResponse
    {
        $validated = $request->validated();

        $expedition->update(['statut' => $validated['statut']]);

        if ($validated['statut'] === 'livré' || $validated['statut'] === 'annulé') {
            $expedition->camion->update(['statut' => 'disponible']);
            $expedition->chauffeur->update(['statut' => 'disponible']);
        } elseif ($validated['statut'] === 'en cours') {
            $expedition->camion->update(['statut' => 'en mission']);
            $expedition->chauffeur->update(['statut' => 'en mission']);
        }

        return back()->with('success', 'Statut de l\'expédition mis à jour.');
    }
}
