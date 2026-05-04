<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expeditions', function (Blueprint $table) {
            $table->decimal('cout_total', 12, 2)->nullable()->after('statut');
            $table->integer('distance_km')->nullable()->after('cout_total');
        });
    }

    public function down(): void
    {
        Schema::table('expeditions', function (Blueprint $table) {
            $table->dropColumn(['cout_total', 'distance_km']);
        });
    }
};
