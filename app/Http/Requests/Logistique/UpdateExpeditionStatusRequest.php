<?php

namespace App\Http\Requests\Logistique;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpeditionStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'statut' => 'required|in:en préparation,en cours,livré,annulé',
        ];
    }
}
