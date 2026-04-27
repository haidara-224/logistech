<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImageProduit;
use App\Models\Produit;

class ImageProduitSeeder extends Seeder
{
    public function run()
    {
        if (Produit::count() === 0) {
            return;
        }

        Produit::all()->each(function ($p) {
            // attach 0..3 images
            $count = rand(0, 3);
            for ($i = 0; $i < $count; $i++) {
                $image = \App\Models\Image::create([
                    'image_path' => 'products/' . uniqid() . '.jpg',
                ]);

                ImageProduit::create([
                    'produit_id' => $p->id,
                    'image_id' => $image->id,
                ]);
            }
        });
    }
}
