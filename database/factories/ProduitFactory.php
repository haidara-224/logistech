<?php

namespace Database\Factories;

use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->word() . ' ' . $this->faker->colorName(),
            'sku' => strtoupper($this->faker->bothify('PRD-####')),
            'description' => $this->faker->optional()->sentence(),
            'prix_vente' => $this->faker->randomFloat(2, 5, 500),
            'prix_achat' => $this->faker->randomFloat(2, 1, 400),
            'quantite_stock' => $this->faker->numberBetween(0, 100),
            'stock_minimal' => $this->faker->numberBetween(0, 10),
            'categorie_id' => Categorie::inRandomOrder()->first()->id ?? Categorie::factory(),
        ];
    }
}
