<?php

namespace Database\Seeders;

use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use App\Models\Produit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpeditionSeeder extends Seeder
{
    public function run(): void
    {
        $products = Produit::all();
        $camions = Camion::all();
        $chauffeurs = Chauffeur::all();

        if ($products->isEmpty() || $camions->isEmpty() || $chauffeurs->isEmpty()) {
            return;
        }

        for ($index = 1; $index <= 12; $index++) {
            $expedition = Expedition::create([
                'reference' => 'EXP-' . str_pad((string) $index, 4, '0', STR_PAD_LEFT),
                'camion_id' => $camions->random()->id,
                'chauffeur_id' => $chauffeurs->random()->id,
                'origine' => $this->fakerCity(),
                'destination' => $this->fakerCity(),
                'date_depart' => now()->subDays(rand(0, 10))->toDateString(),
                'date_arrivee_prevue' => now()->addDays(rand(1, 15))->toDateString(),
                'statut' => $this->fakerStatut(),
                'details' => 'Livraison de matériel logistique.',
            ]);

            $selectedProducts = $products->random(rand(1, min(4, $products->count())));
            $pivot = [];
            foreach ($selectedProducts as $product) {
                $pivot[$product->id] = ['quantite' => rand(1, 10)];
            }
            $expedition->produits()->sync($pivot);
        }
    }

    private function fakerCity(): string
    {
        $cities = ['Conakry', 'Kindia', 'Nzérékoré', 'Kankan', 'Mamou', 'Lélouma', 'Fria'];
        return $cities[array_rand($cities)];
    }

    private function fakerStatut(): string
    {
        $statuts = ['en préparation', 'en cours', 'livré'];
        return $statuts[array_rand($statuts)];
    }
}
