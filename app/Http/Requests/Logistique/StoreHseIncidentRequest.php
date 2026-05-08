<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class StoreHseIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'max:50'],
            'chauffeur_id' => ['nullable', 'exists:chauffeurs,id'],
            'camion_id' => ['nullable', 'exists:camions,id'],
            'expedition_id' => ['nullable', 'exists:expeditions,id'],
            'date_incident' => ['required', 'date'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'blesses' => ['boolean'],
            'nb_blesses' => ['integer', 'min:0', 'max:99'],
            'dommages_vehicule' => ['boolean'],
            'cout_estime' => ['nullable', 'numeric', 'min:0'],
            'pv_numero' => ['nullable', 'string', 'max:100'],
            'causes' => ['nullable', 'array'],
            'causes.*' => ['string', 'max:50'],
            'actions_correctives' => ['nullable', 'string', 'max:2000'],
            'num_declaration_assurance' => ['nullable', 'string', 'max:100'],
            'statut' => ['required', 'in:ouvert,en_investigation,clos'],
        ];
    }
}
