<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionPredepart extends Model
{
    protected $table = 'inspection_predeparts';

    protected $fillable = [
        'chauffeur_id', 'camion_id', 'expedition_id',
        'freins', 'pneus', 'feux', 'cargaison',
        'extincteur', 'trousse_secours', 'documents_bord', 'niveaux_fluides',
        'observations',
    ];

    protected function casts(): array
    {
        return [
            'freins' => 'boolean',
            'pneus' => 'boolean',
            'feux' => 'boolean',
            'cargaison' => 'boolean',
            'extincteur' => 'boolean',
            'trousse_secours' => 'boolean',
            'documents_bord' => 'boolean',
            'niveaux_fluides' => 'boolean',
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
