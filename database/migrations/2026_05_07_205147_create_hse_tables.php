<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hse_chauffeur_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('numero', 100)->nullable();
            $table->date('date_emission')->nullable();
            $table->date('date_expiration')->nullable();
            $table->string('organisme', 150)->nullable();
            $table->string('document_path', 500)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['chauffeur_id', 'type']);
            $table->index('date_expiration');
        });

        Schema::create('hse_camion_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('camion_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('numero', 100)->nullable();
            $table->date('date_emission')->nullable();
            $table->date('date_expiration')->nullable();
            $table->string('organisme', 150)->nullable();
            $table->string('document_path', 500)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['camion_id', 'type']);
            $table->index('date_expiration');
        });

        Schema::create('hse_incidents', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50);
            $table->foreignId('chauffeur_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('camion_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('expedition_id')->nullable()->constrained()->nullOnDelete();
            $table->dateTime('date_incident');
            $table->string('lieu', 255)->nullable();
            $table->text('description');
            $table->boolean('blesses')->default(false);
            $table->unsignedTinyInteger('nb_blesses')->default(0);
            $table->boolean('dommages_vehicule')->default(false);
            $table->decimal('cout_estime', 12, 2)->nullable();
            $table->string('pv_numero', 100)->nullable();
            $table->json('causes')->nullable();
            $table->text('actions_correctives')->nullable();
            $table->string('num_declaration_assurance', 100)->nullable();
            $table->string('statut', 30)->default('ouvert');
            $table->json('photos_paths')->nullable();
            $table->timestamps();

            $table->index(['statut', 'date_incident']);
            $table->index('chauffeur_id');
            $table->index('camion_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hse_incidents');
        Schema::dropIfExists('hse_camion_documents');
        Schema::dropIfExists('hse_chauffeur_documents');
    }
};
