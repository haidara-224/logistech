<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE expeditions MODIFY COLUMN statut ENUM('en préparation','en cours','livraison_soumise','livré','annulé') NOT NULL DEFAULT 'en préparation'");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE expeditions MODIFY COLUMN statut ENUM('en préparation','en cours','livré','annulé') NOT NULL DEFAULT 'en préparation'");
        }
    }
};
