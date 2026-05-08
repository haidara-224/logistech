<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HseCamionDocument extends Model
{
    protected $fillable = [
        'camion_id', 'type', 'numero', 'date_emission',
        'date_expiration', 'organisme', 'document_path', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_emission' => 'date',
            'date_expiration' => 'date',
        ];
    }

    public function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class);
    }

    public function getStatutAttribute(): string
    {
        if (! $this->date_expiration) {
            return 'valide';
        }

        if ($this->date_expiration->isPast()) {
            return 'expire';
        }

        if ($this->date_expiration->diffInDays(now()) <= 30) {
            return 'expire_bientot';
        }

        return 'valide';
    }

    public function getJoursRestantsAttribute(): ?int
    {
        return $this->date_expiration
            ? (int) now()->diffInDays($this->date_expiration, false)
            : null;
    }

    public static function typeLabel(string $type): string
    {
        return match ($type) {
            'carte_grise' => 'Carte grise',
            'assurance' => 'Assurance',
            'visite_technique' => 'Visite technique',
            'vignette' => 'Vignette',
            'carte_brune_cedeao' => 'Carte Brune CEDEAO',
            'autorisation_transport' => 'Autorisation de transport',
            default => $type,
        };
    }

    public static function types(): array
    {
        return ['carte_grise', 'assurance', 'visite_technique', 'vignette', 'carte_brune_cedeao', 'autorisation_transport'];
    }
}
