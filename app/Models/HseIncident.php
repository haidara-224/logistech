<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HseIncident extends Model
{
    protected $fillable = [
        'type', 'chauffeur_id', 'camion_id', 'expedition_id',
        'date_incident', 'lieu', 'description',
        'blesses', 'nb_blesses', 'dommages_vehicule', 'cout_estime',
        'pv_numero', 'causes', 'actions_correctives',
        'num_declaration_assurance', 'statut', 'photos_paths',
    ];

    protected function casts(): array
    {
        return [
            'date_incident' => 'datetime',
            'blesses' => 'boolean',
            'dommages_vehicule' => 'boolean',
            'cout_estime' => 'decimal:2',
            'causes' => 'array',
            'photos_paths' => 'array',
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

    public static function typeLabel(string $type): string
    {
        return match ($type) {
            'accident' => 'Accident',
            'panne' => 'Panne',
            'vol' => 'Vol',
            'dommage_cargo' => 'Dommage cargo',
            'presqu_accident' => 'Presque-accident',
            'blessure' => 'Blessure',
            default => $type,
        };
    }

    public static function types(): array
    {
        return ['accident', 'panne', 'vol', 'dommage_cargo', 'presqu_accident', 'blessure'];
    }

    public static function causes(): array
    {
        return [
            'vitesse', 'fatigue', 'etat_route', 'defaillance_mecanique',
            'meteo', 'animaux', 'autre_conducteur', 'chargement', 'autre',
        ];
    }
}
