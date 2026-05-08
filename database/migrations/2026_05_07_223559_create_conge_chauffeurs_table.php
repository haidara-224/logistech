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
        Schema::create('conge_chauffeurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained()->cascadeOnDelete();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('type', 30)->default('conge_annuel');
            $table->text('motif')->nullable();
            $table->string('statut', 20)->default('en_attente');
            $table->text('commentaire_admin')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conge_chauffeurs');
    }
};
