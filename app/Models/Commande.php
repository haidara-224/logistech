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

class Commande extends Model
{
    use Auditable, HasFactory, HasFraisTotal, SoftDeletes;

    protected $fillable = [
        'client_id',
        'user_id',
        'status',
        'source',
        'montant_total',
        'frais_transport',
        'droits_douane',
        'notes',
    ];

    protected $appends = ['montant_total_avec_frais'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Commande_item::class, 'commande_id');
    }

    public function factures(): HasMany
    {
        return $this->hasMany(Facture::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function bonLivraison(): HasOne
    {
        return $this->hasOne(BonLivraison::class);
    }
}
