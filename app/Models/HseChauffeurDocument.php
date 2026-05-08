<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HseChauffeurDocument extends Model
{
    protected $fillable = [
        'chauffeur_id', 'type', 'numero', 'date_emission',
        'date_expiration', 'organisme', 'document_path', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_emission' => 'date',
            'date_expiration' => 'date',
        ];
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
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
            'permis_conduire' => 'Permis de conduire',
            'certificat_medical' => 'Certificat médical',
            'carte_professionnelle' => 'Carte professionnelle CEDEAO',
            'formation_securite' => 'Formation sécurité',
            default => $type,
        };
    }

    public static function types(): array
    {
        return ['permis_conduire', 'certificat_medical', 'carte_professionnelle', 'formation_securite'];
    }
}
