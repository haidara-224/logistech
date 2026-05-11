<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RapportCarburant extends Model
{
    protected $fillable = [
        'chauffeur_id', 'camion_id', 'expedition_id',
        'litres', 'cout', 'station', 'km_compteur',
    ];

    protected function casts(): array
    {
        return [
            'litres' => 'decimal:2',
            'cout' => 'decimal:2',
        ];
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
    }

    public function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class);
    }

    public function expedition(): BelongsTo
    {
        return $this->belongsTo(Expedition::class);
    }
}
