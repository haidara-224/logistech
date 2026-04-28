<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class StoreCamionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'immatriculation' => 'required|string|max:50|unique:camions,immatriculation',
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'capacite_poids' => 'nullable|integer|min:0',
            'capacite_volume' => 'nullable|integer|min:0',
            'statut' => 'required|in:disponible,en mission,maintenance',
            'notes' => 'nullable|string',
        ];
    }
}
