<?php

use App\Models\Categorie;
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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
           $table->string('nom')->unique();
           $table->index('nom');
     $table->string('sku', 100)->unique()->nullable();
            $table->text('description')->nullable();
            $table->decimal('prix_vente', 8, 2);
            $table->decimal('prix_achat', 8, 2);
            $table->integer('quantite_stock')->default(0);
            $table->integer('stock_minimal')->default(0);
            $table->foreignIdFor(Categorie::class)->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
