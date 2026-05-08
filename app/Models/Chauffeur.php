<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chauffeur extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'telephone',
        'email',
        'permis',
        'statut',
        'notes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function expeditions(): HasMany
    {
        return $this->hasMany(Expedition::class);
    }

    public function hseDocuments(): HasMany
    {
        return $this->hasMany(HseChauffeurDocument::class);
    }

    public function conges(): HasMany
    {
        return $this->hasMany(CongeChauffeur::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(ChauffeurNotification::class);
    }
}
