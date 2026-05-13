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
        Schema::create('transferts_depot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('depot_source_id')->constrained('depots');
            $table->foreignId('depot_destination_id')->constrained('depots');
            $table->foreignId('user_id')->constrained('users');
            $table->string('numero_transfert')->unique();
            $table->enum('statut', ['en_cours', 'complete', 'annule'])->default('en_cours');
            $table->text('notes')->nullable();
            $table->timestamp('date_transfert')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transferts_depot');
    }
};
