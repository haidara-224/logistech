<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class StoreChauffeurRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255|unique:chauffeurs,email',
            'permis' => 'nullable|string|max:100',
            'statut' => 'required|in:disponible,en mission,repos',
            'notes' => 'nullable|string',
        ];
    }
}
