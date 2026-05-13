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
        Schema::create('bons_reception', function (Blueprint $table) {
            $table->id();
            $table->foreignId('achat_id')->unique()->constrained('achats')->cascadeOnDelete();
            $table->string('numero_br')->unique();
            $table->enum('statut', ['emis', 'recu'])->default('emis');
            $table->dateTime('date_emission')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bons_reception');
    }
};
