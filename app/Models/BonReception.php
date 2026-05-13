<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BonReception extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $table = 'bons_reception';

    protected $fillable = [
        'achat_id',
        'numero_br',
        'statut',
        'date_emission',
        'notes',
    ];

    public function achat(): BelongsTo
    {
        return $this->belongsTo(Achat::class);
    }
}
