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
        Schema::create('image_produits', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(App\Models\Produit::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(App\Models\Image::class)->constrained()->onDelete('cascade');
            $table->softDeletes();
              
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('image_produits');
    }
};
