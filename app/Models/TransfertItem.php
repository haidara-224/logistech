<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransfertItem extends Model
{
    protected $fillable = [
        'transfert_id',
        'produit_id',
        'quantite',
    ];

    public function transfert(): BelongsTo
    {
        return $this->belongsTo(TransfertDepot::class, 'transfert_id');
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}
