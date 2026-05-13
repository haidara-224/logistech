<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BonLivraison extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $table = 'bons_livraison';

    protected $fillable = [
        'commande_id',
        'numero_bl',
        'statut',
        'date_emission',
        'notes',
    ];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }
}
