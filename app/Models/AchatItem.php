<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AchatItem extends Model
{
    protected $fillable = [
        'achat_id',
        'produit_id',
        'quantite',
        'prix_achat_unitaire',
        'prix_total',
        'ancien_prix_achat',
        'nouveau_prix_moyen',
        'prix_vente_nouveau',
    ];

    public function achat(): BelongsTo
    {
        return $this->belongsTo(Achat::class);
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}
