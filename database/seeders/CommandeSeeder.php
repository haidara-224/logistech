<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Commande;
use App\Models\Commande_item;
use App\Models\Produit;
use App\Models\Client;
use App\Models\User;
use App\Models\Mouvements_stock;

class CommandeSeeder extends Seeder
{
    public function run()
    {
        // ensure prerequisites
        if (Client::count() === 0) {
            Client::factory()->count(10)->create();
        }
        if (Produit::count() === 0) {
            Produit::factory()->count(30)->create();
        }
        if (User::count() === 0) {
            User::factory()->count(3)->create();
        }

        // Create commandes with items and corresponding stock mouvements
        Commande::factory()->count(30)->create()->each(function ($commande) {
            $itemsCount = rand(1, 4);
            $total = 0;

            for ($i = 0; $i < $itemsCount; $i++) {
                $produit = Produit::inRandomOrder()->first();
                $quantite = rand(1, 5);
                $prix_unitaire = $produit->prix_vente ?? rand(5, 200);
                $prix_total = $quantite * $prix_unitaire;

                Commande_item::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $produit->id,
                    'quantite' => $quantite,
                    'prix_unitaire' => $prix_unitaire,
                    'prix_total' => $prix_total,
                ]);

                // create stock mouvement (out)
                Mouvements_stock::create([
                    'produit_id' => $produit->id,
                    'type' => 'sortie',
                    'quantite' => $quantite,
                    'source' => 'commande',
                    'commande_id' => $commande->id,
                ]);

                $total += $prix_total;
            }

            $commande->update(['montant_total' => $total]);
        });
    }
}
