<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCamionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'immatriculation' => 'sometimes|required|string|max:50|unique:camions,immatriculation,' . $this->route('camion')->id,
            'marque' => 'sometimes|nullable|string|max:255',
            'modele' => 'sometimes|nullable|string|max:255',
            'capacite_poids' => 'sometimes|nullable|integer|min:0',
            'capacite_volume' => 'sometimes|nullable|integer|min:0',
            'statut' => 'sometimes|required|in:disponible,en mission,maintenance',
            'notes' => 'sometimes|nullable|string',
        ];
    }
}
