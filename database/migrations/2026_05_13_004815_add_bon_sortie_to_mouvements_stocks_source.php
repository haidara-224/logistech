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
            DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition', 'annulation_expedition', 'achat', 'transfert', 'bon_sortie') NULL");
        }

        Schema::table('mouvements_stocks', function (Blueprint $table) {
            $table->foreignId('bon_sortie_id')->nullable()->after('achat_id')->constrained('bons_sortie')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('mouvements_stocks', function (Blueprint $table) {
            $table->dropForeign(['bon_sortie_id']);
            $table->dropColumn('bon_sortie_id');
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE mouvements_stocks MODIFY COLUMN source ENUM('commande', 'vente', 'ajustement', 'expedition', 'annulation_expedition', 'achat', 'transfert') NULL");
        }
    }
};
