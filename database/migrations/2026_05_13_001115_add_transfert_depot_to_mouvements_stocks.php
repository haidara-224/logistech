<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition', 'annulation_expedition', 'achat', 'transfert') NULL");
        }

        Schema::table('mouvements_stocks', function (Blueprint $table) {
            $table->foreignId('transfert_id')->nullable()->after('commande_id')->constrained('transferts_depot')->nullOnDelete();
            $table->foreignId('achat_id')->nullable()->after('transfert_id')->constrained('achats')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('mouvements_stocks', function (Blueprint $table) {
            $table->dropForeign(['transfert_id']);
            $table->dropForeign(['achat_id']);
            $table->dropColumn(['transfert_id', 'achat_id']);
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition', 'annulation_expedition', 'achat') NULL");
        }
    }
};
