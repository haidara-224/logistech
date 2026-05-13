<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BonSortieItem extends Model
{
    protected $fillable = [
        'bon_sortie_id',
        'produit_id',
        'quantite',
    ];

    public function bonSortie(): BelongsTo
    {
        return $this->belongsTo(BonSortie::class);
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}
