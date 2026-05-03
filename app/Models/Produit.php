<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produit extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'nom',
        'sku',
        'description',
        'prix_vente',
        'prix_achat',
        'quantite_stock',
        'stock_minimal',
        'categorie_id',
    ];

    protected $appends = ['stock_reel'];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function mouvements(): HasMany
    {
        return $this->hasMany(Mouvements_stock::class, 'produit_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ImageProduit::class, 'produit_id');
    }

    public function getStockReelAttribute(): int
    {
        $in = $this->mouvements()->where('type', 'entree')->sum('quantite') ?: 0;
        $out = $this->mouvements()->where('type', 'sortie')->sum('quantite') ?: 0;

        return (int) ($in - $out);
    }
}
