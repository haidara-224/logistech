<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Livraison extends Model
{
    use HasFactory;

    protected $fillable = [
        'expedition_id',
        'etat',
        'commentaire',
        'date_statut',
    ];

    protected $casts = [
        'date_statut' => 'datetime',
    ];

    public function expedition(): BelongsTo
    {
        return $this->belongsTo(Expedition::class);
    }
}
