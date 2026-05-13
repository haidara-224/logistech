<?php

namespace App\Traits;

trait HasFraisTotal
{
    public function getMontantTotalAvecFraisAttribute(): float
    {
        return (float) ($this->montant_total ?? 0)
            + (float) ($this->frais_transport ?? 0)
            + (float) ($this->droits_douane ?? 0);
    }
}
