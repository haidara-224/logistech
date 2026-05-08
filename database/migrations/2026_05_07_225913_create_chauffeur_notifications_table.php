<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chauffeur_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained('chauffeurs')->cascadeOnDelete();
            $table->string('type');
            $table->string('message');
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['chauffeur_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chauffeur_notifications');
    }
};
