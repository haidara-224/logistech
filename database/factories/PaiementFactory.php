<?php

namespace Database\Factories;

use App\Models\Paiement;
use App\Models\Commande;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaiementFactory extends Factory
{
    protected $model = Paiement::class;

    public function definition()
    {
        return [
            'commande_id' => Commande::inRandomOrder()->first()->id ?? Commande::factory(),
            'montant' => $this->faker->randomFloat(2, 5, 1000),
            'mode_paiement' => $this->faker->randomElement(['espece','carte_bancaire','mobile_money']),
            'status' => $this->faker->randomElement(['en_attente','effectue','annule']),
            'date_paiement' => $this->faker->optional()->dateTimeThisYear(),
        ];
    }
}
