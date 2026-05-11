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
        Schema::create('inspection_predeparts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained('chauffeurs')->cascadeOnDelete();
            $table->foreignId('camion_id')->nullable()->constrained('camions')->nullOnDelete();
            $table->foreignId('expedition_id')->nullable()->constrained('expeditions')->nullOnDelete();
            $table->boolean('freins')->default(false);
            $table->boolean('pneus')->default(false);
            $table->boolean('feux')->default(false);
            $table->boolean('cargaison')->default(false);
            $table->boolean('extincteur')->default(false);
            $table->boolean('trousse_secours')->default(false);
            $table->boolean('documents_bord')->default(false);
            $table->boolean('niveaux_fluides')->default(false);
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspection_predeparts');
    }
};
