<?php

namespace Database\Seeders;

use App\Models\Expedition;
use App\Models\Livraison;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LivraisonSeeder extends Seeder
{
    public function run(): void
    {
        $expeditions = Expedition::all();

        foreach ($expeditions as $expedition) {
            $etat = $this->fakerEtat($expedition->statut);
            Livraison::create([
                'expedition_id' => $expedition->id,
                'etat' => $etat,
                'commentaire' => 'Mise à jour du statut de livraison.',
                'date_statut' => now()->subDays(rand(0, 3)),
            ]);
        }
    }

    private function fakerEtat(string $statut): string
    {
        return match ($statut) {
            'livré' => 'livré',
            'en cours' => 'en cours',
            default => 'en préparation',
        };
    }
}
