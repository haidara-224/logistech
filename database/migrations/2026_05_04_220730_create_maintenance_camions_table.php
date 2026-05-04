<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_camions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('camion_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // révision, pneu, vidange, carrosserie, autre
            $table->text('description')->nullable();
            $table->decimal('cout', 12, 2)->nullable();
            $table->integer('kilometrage')->nullable();
            $table->date('date_maintenance');
            $table->date('prochaine_maintenance')->nullable();
            $table->string('statut')->default('planifiée'); // planifiée, en cours, terminée
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_camions');
    }
};
