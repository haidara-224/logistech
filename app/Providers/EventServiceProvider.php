<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\PaiementRecu;
use App\Listeners\SendFactureAfterPayment;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PaiementRecu::class => [
            SendFactureAfterPayment::class,
        ],
    ];
}
