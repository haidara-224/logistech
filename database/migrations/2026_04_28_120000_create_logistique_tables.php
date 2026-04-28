<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('camions', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation')->unique();
            $table->string('marque')->nullable();
            $table->string('modele')->nullable();
            $table->integer('capacite_poids')->default(0);
            $table->integer('capacite_volume')->default(0);
            $table->enum('statut', ['disponible', 'en mission', 'maintenance'])->default('disponible');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('chauffeurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom')->nullable();
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->string('permis')->nullable();
            $table->enum('statut', ['disponible', 'en mission', 'repos'])->default('disponible');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('expeditions', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('camion_id')->constrained('camions')->cascadeOnDelete();
            $table->foreignId('chauffeur_id')->constrained('chauffeurs')->cascadeOnDelete();
            $table->string('origine');
            $table->string('destination');
            $table->date('date_depart')->nullable();
            $table->date('date_arrivee_prevue')->nullable();
            $table->enum('statut', ['en préparation', 'en cours', 'livré', 'annulé'])->default('en préparation');
            $table->text('details')->nullable();
            $table->timestamps();
        });

        Schema::create('expedition_produit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expedition_id')->constrained('expeditions')->cascadeOnDelete();
            $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
            $table->integer('quantite')->default(1);
            $table->timestamps();
        });

        Schema::create('livraisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expedition_id')->constrained('expeditions')->cascadeOnDelete();
            $table->enum('etat', ['en préparation', 'en cours', 'livré'])->default('en préparation');
            $table->text('commentaire')->nullable();
            $table->dateTime('date_statut')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livraisons');
        Schema::dropIfExists('expedition_produit');
        Schema::dropIfExists('expeditions');
        Schema::dropIfExists('chauffeurs');
        Schema::dropIfExists('camions');
    }
};
