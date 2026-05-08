<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coordenadas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('van_id')->constrained('vans')->onDelete('cascade');
            $table->string('nome');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->unsignedInteger('ordem')->default(0);
            $table->timestamps();

            $table->index(['van_id', 'ordem']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coordenadas');
    }
};
