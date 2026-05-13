<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasFraisTotal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Achat extends Model
{
    use Auditable, HasFactory, HasFraisTotal, SoftDeletes;

    protected $fillable = [
        'fournisseur_id',
        'user_id',
        'numero_achat',
        'statut',
        'montant_total',
        'frais_transport',
        'droits_douane',
        'notes',
        'date_achat',
    ];

    protected $appends = ['montant_total_avec_frais'];

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(AchatItem::class);
    }

    public function facture(): HasOne
    {
        return $this->hasOne(Facture::class);
    }

    public function bonReception(): HasOne
    {
        return $this->hasOne(BonReception::class);
    }
}
