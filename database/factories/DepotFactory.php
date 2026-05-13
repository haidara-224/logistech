<?php

namespace Database\Factories;

use App\Models\Depot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Depot>
 */
class DepotFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->city().' '.fake()->randomElement(['Central', 'Est', 'Nord', 'Sud']),
            'adresse' => $this->faker->address(),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
