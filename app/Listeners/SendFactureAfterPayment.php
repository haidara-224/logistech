<?php

namespace App\Listeners;

use App\Events\PaiementRecu;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendFactureAfterPayment implements ShouldQueue
{
    public function handle(PaiementRecu $event)
    {
        // minimal placeholder: in real app send email / generate pdf
        Log::info('Paiement reçu, id: ' . $event->paiement->id);
    }
}
