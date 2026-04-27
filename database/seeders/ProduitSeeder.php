<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produit;
use App\Models\Categorie;

class ProduitSeeder extends Seeder
{
    public function run()
    {
        // ensure some categories exist
        if (Categorie::count() === 0) {
            Categorie::factory()->count(4)->create();
        }

        Produit::factory()->count(40)->create();
    }
}
