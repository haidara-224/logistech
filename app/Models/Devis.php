<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    use Auditable;

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
