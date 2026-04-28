<?php

namespace Database\Seeders;

use App\Models\Chauffeur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChauffeurSeeder extends Seeder
{
    public function run(): void
    {
        Chauffeur::factory()->count(12)->create();
    }
}
