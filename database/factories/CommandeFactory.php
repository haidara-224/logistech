<?php

namespace Database\Factories;

use App\Models\Commande;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommandeFactory extends Factory
{
    protected $model = Commande::class;

    public function definition()
    {
        return [
            'client_id' => Client::inRandomOrder()->first()->id ?? Client::factory(),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'status' => $this->faker->randomElement(['en_attente','payer','annulee','livree']),
            'source' => $this->faker->randomElement(['online', 'pos']),
            'montant_total' => 0, // updated when items are added in seeder
        ];
    }
}
