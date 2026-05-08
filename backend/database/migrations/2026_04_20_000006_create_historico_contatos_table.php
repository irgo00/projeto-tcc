<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historico_contatos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('van_id')->constrained('vans')->onDelete('cascade');
            $table->enum('tipo_contato', ['telefone', 'email', 'whatsapp']);
            $table->timestamps();

            $table->index(['usuario_id', 'created_at']);
            $table->index('van_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historico_contatos');
    }
};
