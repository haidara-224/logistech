<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mouvements_stock;
use App\Models\Produit;

class MouvementsStockSeeder extends Seeder
{
    public function run()
    {
        if (Produit::count() === 0) {
            Produit::factory()->count(20)->create();
        }

        // create some initial 'in' mouvements to populate stock
        Produit::all()->each(function ($p) {
            Mouvements_stock::create([
                'produit_id' => $p->id,
                'type' => 'entree',
                'quantite' => rand(5, 50),
                'source' => 'ajustement',
                'commande_id' => null,
            ]);
        });

        // add a few random adjustments
        Mouvements_stock::factory()->count(50)->create();
    }
}
