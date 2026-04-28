<?php

namespace Database\Factories;

use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpeditionFactory extends Factory
{
    protected $model = Expedition::class;

    public function definition()
    {
        return [
            'reference' => strtoupper('EXP-' . $this->faker->bothify('####')),
            'camion_id' => Camion::inRandomOrder()->first()->id ?? Camion::factory()->create()->id,
            'chauffeur_id' => Chauffeur::inRandomOrder()->first()->id ?? Chauffeur::factory()->create()->id,
            'origine' => $this->faker->city(),
            'destination' => $this->faker->city(),
            'date_depart' => $this->faker->dateTimeBetween('-10 days', '+10 days')->format('Y-m-d'),
            'date_arrivee_prevue' => $this->faker->dateTimeBetween('now', '+15 days')->format('Y-m-d'),
            'statut' => $this->faker->randomElement(['en préparation', 'en cours', 'livré', 'annulé']),
            'details' => $this->faker->optional()->sentence(),
        ];
    }
}
