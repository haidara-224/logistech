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
        Schema::create('bons_sortie', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('depot_id')->nullable()->constrained('depots')->nullOnDelete();
            $table->string('numero_bs')->unique();
            $table->enum('statut', ['brouillon', 'valide', 'annule'])->default('brouillon');
            $table->dateTime('date_emission')->nullable();
            $table->string('motif')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bons_sortie');
    }
};
