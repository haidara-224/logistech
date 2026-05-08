<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Camion extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'immatriculation',
        'marque',
        'modele',
        'capacite_poids',
        'capacite_volume',
        'statut',
        'notes',
    ];

    public function expeditions(): HasMany
    {
        return $this->hasMany(Expedition::class);
    }

    public function hseDocuments(): HasMany
    {
        return $this->hasMany(HseCamionDocument::class);
    }
}
