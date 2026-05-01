<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProduitRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $produitId = $this->route('produit')?->id ?? null;

        return [
            'nom' => "sometimes|required|string|max:255|unique:produits,nom,{$produitId}",
            'sku' => "nullable|string|max:100|unique:produits,sku,{$produitId}",
            'description' => 'nullable|string',
            'prix_vente' => 'sometimes|required|numeric|min:0',
            'prix_achat' => 'nullable|numeric|min:0',
            'quantite_stock' => 'nullable|integer|min:0',
            'stock_minimal' => 'nullable|integer|min:0',
            'categorie_id' => 'nullable|exists:categories,id',
        ];
    }
}
