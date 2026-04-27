<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes,HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'quartier',
        'piece',
        'email',
        'telephone'
    ];

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }
}
