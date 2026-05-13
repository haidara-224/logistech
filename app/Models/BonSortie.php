<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BonSortie extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $table = 'bons_sortie';

    protected $fillable = [
        'user_id',
        'depot_id',
        'numero_bs',
        'statut',
        'date_emission',
        'motif',
        'notes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function depot(): BelongsTo
    {
        return $this->belongsTo(Depot::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BonSortieItem::class);
    }
}
