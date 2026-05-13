<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition', 'annulation_expedition', 'achat') NULL");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition', 'annulation_expedition') NULL");
        }
    }
};
