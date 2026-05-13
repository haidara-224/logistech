<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransfertDepot extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $table = 'transferts_depot';

    protected $fillable = [
        'depot_source_id',
        'depot_destination_id',
        'user_id',
        'numero_transfert',
        'statut',
        'notes',
        'date_transfert',
    ];

    public function depotSource(): BelongsTo
    {
        return $this->belongsTo(Depot::class, 'depot_source_id');
    }

    public function depotDestination(): BelongsTo
    {
        return $this->belongsTo(Depot::class, 'depot_destination_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransfertItem::class, 'transfert_id');
    }
}
