<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE chauffeurs MODIFY COLUMN statut ENUM('disponible','en mission','en_repos') NOT NULL DEFAULT 'disponible'");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE chauffeurs MODIFY COLUMN statut ENUM('disponible','en mission','repos') NOT NULL DEFAULT 'disponible'");
        }
    }
};
