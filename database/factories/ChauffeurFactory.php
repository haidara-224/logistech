<?php

namespace Database\Factories;

use App\Models\Chauffeur;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChauffeurFactory extends Factory
{
    protected $model = Chauffeur::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'telephone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'permis' => $this->faker->randomElement(['B', 'C', 'D', 'CE']),
            'statut' => $this->faker->randomElement(['disponible', 'en mission', 'repos']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
