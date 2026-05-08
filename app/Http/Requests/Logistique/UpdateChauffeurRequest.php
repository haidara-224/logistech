<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChauffeurRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|nullable|string|max:255',
            'telephone' => 'sometimes|nullable|string|max:50',
            'email' => 'sometimes|nullable|email|max:255|unique:chauffeurs,email,'.$this->route('chauffeur')->id,
            'permis' => 'sometimes|nullable|string|max:100',
            'statut' => 'sometimes|required|in:disponible,en mission,en_repos',
            'notes' => 'sometimes|nullable|string',
        ];
    }
}
