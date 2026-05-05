<?php

namespace App\Http\Requests\Logistique;

use App\Models\Expedition;
use App\Models\Produit;
use Illuminate\Foundation\Http\FormRequest;

class StoreExpeditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (empty($this->reference)) {
            $n = Expedition::withTrashed()->count() + 1;
            while (Expedition::withTrashed()->where('reference', 'Ref_'.$n)->exists()) {
                $n++;
            }
            $this->merge(['reference' => 'Ref_'.$n]);
        }
    }

    public function rules(): array
    {
        return [
            'reference' => 'required|string|max:255|unique:expeditions,reference',
            'camion_id' => 'required|exists:camions,id',
            'chauffeur_id' => 'required|exists:chauffeurs,id',
            'origine' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'date_depart' => 'nullable|date',
            'date_arrivee_prevue' => 'nullable|date|after_or_equal:date_depart',
            'statut' => 'required|in:en préparation,en cours,livré,annulé',
            'details' => 'nullable|string',
            'produits' => 'required|array|min:1',
            'produits.*.produit_id' => 'required|exists:produits,id',
            'produits.*.quantite' => 'required|integer|min:1',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($this->input('produits', []) as $index => $item) {
                $produit = Produit::find($item['produit_id'] ?? null);

                if (! $produit) {
                    continue;
                }

                if ($produit->quantite_stock <= 0) {
                    $validator->errors()->add("produits.$index.produit_id", 'Produit en rupture de stock.');

                    continue;
                }

                if ((int) ($item['quantite'] ?? 0) > $produit->quantite_stock) {
                    $validator->errors()->add("produits.$index.quantite", "Quantité demandée supérieure au stock disponible ({$produit->quantite_stock}).");
                }
            }
        });
    }
}
