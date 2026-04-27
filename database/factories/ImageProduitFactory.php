<?php

namespace Database\Factories;

use App\Models\ImageProduit;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ImageProduitFactory extends Factory
{
    protected $model = ImageProduit::class;

    public function definition()
    {
        return [
            'produit_id' => Produit::inRandomOrder()->first()->id ?? Produit::factory(),
            'image_id' => \App\Models\Image::inRandomOrder()->first()->id ?? \App\Models\Image::factory(),
        ];
    }
}
