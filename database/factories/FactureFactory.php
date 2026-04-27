<?php

namespace Database\Factories;

use App\Models\Facture;
use App\Models\Commande;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactureFactory extends Factory
{
    protected $model = Facture::class;

    public function definition()
    {
        return [
            'commande_id' => Commande::inRandomOrder()->first()->id ?? Commande::factory(),
            'numero_facture' => strtoupper($this->faker->bothify('FAC-########')),
            'date_emission' => $this->faker->dateTimeThisYear()->format('Y-m-d'),
            'montant_total' => $this->faker->randomFloat(2, 5, 2000),
        ];
    }
}
