<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Depot extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected $fillable = [
        'nom',
        'adresse',
        'description',
    ];

    public function transfertsSource(): HasMany
    {
        return $this->hasMany(TransfertDepot::class, 'depot_source_id');
    }

    public function transfertsDestination(): HasMany
    {
        return $this->hasMany(TransfertDepot::class, 'depot_destination_id');
    }
}
