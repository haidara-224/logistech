<?php

namespace App\Events;

use App\Models\Paiement;
use Illuminate\Queue\SerializesModels;

class PaiementRecu
{
    use SerializesModels;

    public Paiement $paiement;

    public function __construct(Paiement $paiement)
    {
        $this->paiement = $paiement;
    }
}
