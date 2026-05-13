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
        Schema::create('achat_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('achat_id')->constrained('achats')->cascadeOnDelete();
            $table->foreignId('produit_id')->constrained('produits');
            $table->integer('quantite');
            $table->decimal('prix_achat_unitaire', 12, 2);
            $table->decimal('prix_total', 15, 2)->default(0);
            $table->decimal('ancien_prix_achat', 12, 2)->default(0);
            $table->decimal('nouveau_prix_moyen', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achat_items');
    }
};
