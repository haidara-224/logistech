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
        Schema::create('achats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->string('numero_achat')->unique();
            $table->enum('statut', ['brouillon', 'valide', 'annule'])->default('brouillon');
            $table->decimal('montant_total', 15, 2)->default(0);
            $table->decimal('frais_transport', 12, 2)->default(0);
            $table->decimal('droits_douane', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamp('date_achat')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achats');
    }
};
