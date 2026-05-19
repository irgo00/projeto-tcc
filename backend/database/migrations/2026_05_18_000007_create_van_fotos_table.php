<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('van_fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('van_id')->constrained('vans')->onDelete('cascade');
            $table->string('caminho', 500);
            $table->boolean('principal')->default(false);
            $table->unsignedTinyInteger('ordem')->default(0);
            $table->timestamps();

            $table->index('van_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('van_fotos');
    }
};
