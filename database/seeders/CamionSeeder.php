<?php

namespace Database\Seeders;

use App\Models\Camion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CamionSeeder extends Seeder
{
    public function run(): void
    {
        Camion::factory()->count(10)->create();
    }
}
