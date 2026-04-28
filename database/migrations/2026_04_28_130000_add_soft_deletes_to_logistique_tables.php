<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('camions', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('chauffeurs', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('expeditions', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('expeditions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('chauffeurs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('camions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
