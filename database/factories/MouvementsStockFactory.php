<?php

namespace Database\Factories;

use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class MouvementsStockFactory extends Factory
{
    protected $model = Mouvements_stock::class;

    public function definition()
    {
        return [
            'produit_id' => Produit::inRandomOrder()->first()->id ?? Produit::factory(),
            'type' => $this->faker->randomElement(['entree','sortie']),
            'quantite' => $this->faker->numberBetween(1, 20),
            'source' => $this->faker->randomElement(['commande','vente','ajustement']),
            'commande_id' => null,
        ];
    }
}
