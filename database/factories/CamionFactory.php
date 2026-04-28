<?php

namespace Database\Factories;

use App\Models\Camion;
use Illuminate\Database\Eloquent\Factories\Factory;

class CamionFactory extends Factory
{
    protected $model = Camion::class;

    public function definition()
    {
        return [
            'immatriculation' => strtoupper($this->faker->bothify('??-####')),
            'marque' => $this->faker->randomElement(['Volvo', 'Mercedes', 'Scania', 'MAN', 'Renault']),
            'modele' => $this->faker->word() . ' ' . $this->faker->numberBetween(200, 900),
            'capacite_poids' => $this->faker->numberBetween(5000, 25000),
            'capacite_volume' => $this->faker->numberBetween(20, 120),
            'statut' => $this->faker->randomElement(['disponible', 'en mission', 'maintenance']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
