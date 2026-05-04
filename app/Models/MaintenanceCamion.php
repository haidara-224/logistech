<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceCamion extends Model
{
    use Auditable, HasFactory;

    protected $table = 'maintenance_camions';

    protected $fillable = [
        'camion_id',
        'type',
        'description',
        'cout',
        'kilometrage',
        'date_maintenance',
        'prochaine_maintenance',
        'statut',
    ];

    protected function casts(): array
    {
        return [
            'date_maintenance' => 'date',
            'prochaine_maintenance' => 'date',
            'cout' => 'decimal:2',
        ];
    }

    public function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class);
    }
}
