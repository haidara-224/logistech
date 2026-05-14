<?php

namespace App\Http\Requests;

use App\Models\Produit;
use Illuminate\Foundation\Http\FormRequest;

class StoreCommandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'user_id' => 'nullable|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix_unitaire' => 'required|numeric|min:0',
            'frais_transport' => 'nullable|numeric|min:0',
            'droits_douane' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            foreach ($this->input('items', []) as $index => $item) {
                $produit = Produit::find($item['produit_id'] ?? null);
                if (! $produit) {
                    continue;
                }
                if ((int) ($item['quantite'] ?? 0) > $produit->quantite_stock) {
                    $validator->errors()->add(
                        "items.$index.quantite",
                        "Quantité demandée supérieure au stock disponible ({$produit->quantite_stock}) pour « {$produit->nom} »."
                    );
                }
            }
        });
    }
}
