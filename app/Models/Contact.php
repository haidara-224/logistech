<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use Auditable;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'message',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];
}
