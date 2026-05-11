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
        Schema::create('rapport_carburants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained('chauffeurs')->cascadeOnDelete();
            $table->foreignId('camion_id')->nullable()->constrained('camions')->nullOnDelete();
            $table->foreignId('expedition_id')->nullable()->constrained('expeditions')->nullOnDelete();
            $table->decimal('litres', 8, 2);
            $table->decimal('cout', 10, 2)->nullable();
            $table->string('station')->nullable();
            $table->integer('km_compteur')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapport_carburants');
    }
};
