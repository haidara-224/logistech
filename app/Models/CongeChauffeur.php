<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CongeChauffeur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'chauffeur_id',
        'date_debut',
        'date_fin',
        'type',
        'motif',
        'statut',
        'commentaire_admin',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
    }

    public function getNbJoursAttribute(): int
    {
        return $this->date_debut->diffInDays($this->date_fin) + 1;
    }
}
