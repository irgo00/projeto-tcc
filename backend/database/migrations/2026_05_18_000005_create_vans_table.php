<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestador_id')->constrained('users')->onDelete('cascade');
            $table->string('modelo', 100);
            $table->string('marca', 100);
            $table->string('placa', 10)->unique();
            $table->unsignedSmallInteger('ano');
            $table->string('cor', 50);
            $table->text('descricao')->nullable();
            $table->boolean('ar_condicionado')->default(false);
            $table->boolean('camera_interna')->default(false);
            $table->boolean('porta_automatica')->default(false);
            $table->boolean('wifi')->default(false);
            $table->boolean('acessibilidade')->default(false);
            $table->boolean('usb_carregador')->default(false);
            $table->text('outros_itens')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('prestador_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vans');
    }
};
