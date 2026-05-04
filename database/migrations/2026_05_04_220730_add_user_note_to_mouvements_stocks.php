<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mouvements_stocks', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->after('commande_id');
            $table->string('note')->nullable()->after('user_id');
            $table->decimal('prix_unitaire', 12, 2)->nullable()->after('note');
        });
    }

    public function down(): void
    {
        Schema::table('mouvements_stocks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['note', 'prix_unitaire']);
        });
    }
};
