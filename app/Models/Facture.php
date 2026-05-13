<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasFraisTotal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facture extends Model
{
    use Auditable, HasFactory, HasFraisTotal, SoftDeletes;

    protected $appends = ['montant_total_avec_frais'];

    protected $fillable = [
        'commande_id',
        'achat_id',
        'numero_facture',
        'type',
        'statut',
        'montant_total',
        'frais_transport',
        'droits_douane',
        'notes',
        'date_emission',
    ];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function achat(): BelongsTo
    {
        return $this->belongsTo(Achat::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }
}
