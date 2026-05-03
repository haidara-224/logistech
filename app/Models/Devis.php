<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Devis extends Model
{
    use Auditable, SoftDeletes;

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
