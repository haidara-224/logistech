<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expedition extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'reference',
        'camion_id',
        'chauffeur_id',
        'origine',
        'destination',
        'date_depart',
        'date_arrivee_prevue',
        'statut',
        'details',
        'cout_total',
        'distance_km',
    ];

    protected $casts = [
        'date_depart' => 'date',
        'date_arrivee_prevue' => 'date',
        'cout_total' => 'decimal:2',
    ];

    public function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class);
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
    }

    public function produits(): BelongsToMany
    {
        return $this->belongsToMany(Produit::class, 'expedition_produit')
            ->withPivot('quantite')
            ->withTimestamps();
    }

    public function livraisons(): HasMany
    {
        return $this->hasMany(Livraison::class);
    }
}
