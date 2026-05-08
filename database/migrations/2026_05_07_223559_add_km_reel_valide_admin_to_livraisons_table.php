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
        Schema::table('livraisons', function (Blueprint $table) {
            $table->unsignedInteger('km_reel')->nullable()->after('commentaire');
            $table->boolean('valide_admin')->default(false)->after('km_reel');
            $table->timestamp('valide_at')->nullable()->after('valide_admin');
        });
    }

    public function down(): void
    {
        Schema::table('livraisons', function (Blueprint $table) {
            $table->dropColumn(['km_reel', 'valide_admin', 'valide_at']);
        });
    }
};
