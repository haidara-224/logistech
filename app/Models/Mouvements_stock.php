<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mouvements_stock extends Model
{
    use Auditable, HasFactory;

    protected $table = 'mouvements_stocks';

    protected $fillable = [
        'produit_id',
        'type',
        'quantite',
        'source',
        'commande_id',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
