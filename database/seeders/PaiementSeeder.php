<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paiement;
use App\Models\Commande;

class PaiementSeeder extends Seeder
{
    public function run()
    {
        if (Commande::count() === 0) {
            return;
        }

        // create payments for some commandes
        Commande::inRandomOrder()->limit(15)->get()->each(function ($commande) {
            Paiement::create([
                'commande_id' => $commande->id,
                'montant' => $commande->montant_total * (rand(70, 100) / 100),
                'mode_paiement' => ['espece','carte_bancaire','mobile_money'][array_rand(['espece','carte_bancaire','mobile_money'])],
                'status' => 'effectue',
                'date_paiement' => now(),
            ]);
        });
    }
}
