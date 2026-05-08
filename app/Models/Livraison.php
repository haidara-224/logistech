<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Livraison extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'expedition_id',
        'etat',
        'commentaire',
        'km_reel',
        'date_statut',
        'valide_admin',
        'valide_at',
    ];

    protected $casts = [
        'date_statut' => 'datetime',
        'valide_at' => 'datetime',
        'valide_admin' => 'boolean',
    ];

    public function expedition(): BelongsTo
    {
        return $this->belongsTo(Expedition::class);
    }
}
