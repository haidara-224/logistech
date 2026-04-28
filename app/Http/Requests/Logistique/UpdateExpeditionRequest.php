<?php

namespace App\Http\Requests\Logistique;

use App\Models\Produit;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpeditionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'reference' => 'required|string|max:255|unique:expeditions,reference,' . $this->route('expedition')->id,
            'camion_id' => 'required|exists:camions,id',
            'chauffeur_id' => 'required|exists:chauffeurs,id',
            'origine' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'date_depart' => 'nullable|date',
            'date_arrivee_prevue' => 'nullable|date|after_or_equal:date_depart',
            'statut' => 'required|in:en préparation,en cours,livré,annulé',
            'details' => 'nullable|string',
            'produits' => 'nullable|array',
            'produits.*.produit_id' => 'required_with:produits|exists:produits,id',
            'produits.*.quantite' => 'required_with:produits|integer|min:1',
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
