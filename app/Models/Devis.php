<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    protected $fillable = [
        'service',
        'nom',
        'email',
        'telephone',
        'delai',
        'message',
        'statut',
    ];

    protected $casts = [
        'statut' => 'string',
    ];
}
