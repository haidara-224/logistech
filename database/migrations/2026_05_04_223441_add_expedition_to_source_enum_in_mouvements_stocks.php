<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition') NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement') NULL");
    }
};
