<?php

namespace Database\Factories;

use App\Models\Expedition;
use App\Models\Livraison;
use Illuminate\Database\Eloquent\Factories\Factory;

class LivraisonFactory extends Factory
{
    protected $model = Livraison::class;

    public function definition()
    {
        $etat = $this->faker->randomElement(['en préparation', 'en cours', 'livré']);

        return [
            'expedition_id' => Expedition::inRandomOrder()->first()->id ?? Expedition::factory()->create()->id,
            'etat' => $etat,
            'commentaire' => $this->faker->optional()->sentence(),
            'date_statut' => $this->faker->dateTimeBetween('-5 days', 'now'),
        ];
    }
}
