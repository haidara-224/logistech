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
        Schema::create('devis', function (Blueprint $table) {
            $table->id();
            $table->string('service');
            $table->string('nom');
            $table->string('email');
            $table->string('telephone')->nullable();
            $table->string('delai')->nullable();
            $table->text('message')->nullable();
            $table->enum('statut', ['nouveau', 'vu', 'traite'])->default('nouveau');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devis');
    }
};
