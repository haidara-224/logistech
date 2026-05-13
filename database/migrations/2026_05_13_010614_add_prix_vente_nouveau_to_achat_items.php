<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('achat_items', function (Blueprint $table) {
            $table->decimal('prix_vente_nouveau', 12, 2)->nullable()->after('nouveau_prix_moyen');
        });
    }

    public function down(): void
    {
        Schema::table('achat_items', function (Blueprint $table) {
            $table->dropColumn('prix_vente_nouveau');
        });
    }
};
