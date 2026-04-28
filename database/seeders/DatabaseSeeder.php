<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       $this->call([
        //    RoleSeeder::class,
        //    CategorieSeeder::class,
        //    ProduitSeeder::class,
        //    ClientSeeder::class,
        //    MouvementsStockSeeder::class,
        //    CommandeSeeder::class,
        //    PaiementSeeder::class,
        //    FactureSeeder::class,
        //    ImageProduitSeeder::class,
           CamionSeeder::class,
           ChauffeurSeeder::class,
           ExpeditionSeeder::class,
           LivraisonSeeder::class,
       ]);
    }
}
