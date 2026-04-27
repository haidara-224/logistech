<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Facture;
use App\Models\Commande;

class FactureSeeder extends Seeder
{
    public function run()
    {
        if (Commande::count() === 0) {
            return;
        }

        Commande::inRandomOrder()->limit(10)->get()->each(function ($commande) {
            Facture::create([
                'commande_id' => $commande->id,
                'numero_facture' => 'FAC-' . strtoupper(uniqid()),
                'date_emission' => now()->toDateString(),
                'montant_total' => $commande->montant_total,
            ]);
        });
    }
}
