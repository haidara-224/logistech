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
        Schema::table('commandes', function (Blueprint $table) {
            $table->decimal('frais_transport', 12, 2)->default(0)->after('montant_total');
            $table->decimal('droits_douane', 12, 2)->default(0)->after('frais_transport');
            $table->text('notes')->nullable()->after('droits_douane');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->dropColumn(['frais_transport', 'droits_douane', 'notes']);
        });
    }
};
