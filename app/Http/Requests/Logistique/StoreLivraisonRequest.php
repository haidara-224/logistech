<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class StoreLivraisonRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'expedition_id' => 'required|exists:expeditions,id',
            'etat' => 'required|in:en préparation,en cours,livré,annulé',
            'commentaire' => 'nullable|string',
            'date_statut' => 'required|date',
        ];
    }
}
