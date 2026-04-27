<?php

namespace Database\Factories;

use App\Models\Commande_item;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommandeItemFactory extends Factory
{
    protected $model = Commande_item::class;

    public function definition()
    {
        $produit = Produit::inRandomOrder()->first() ?? Produit::factory();
        $quantite = $this->faker->numberBetween(1, 5);
        $prix_unitaire = $produit->prix_vente ?? $this->faker->randomFloat(2, 5, 200);

        return [
            'commande_id' => Commande::inRandomOrder()->first()->id ?? Commande::factory(),
            'produit_id' => $produit->id ?? Produit::factory(),
            'quantite' => $quantite,
            'prix_unitaire' => $prix_unitaire,
            'prix_total' => (float) ($quantite * $prix_unitaire),
        ];
    }
}
