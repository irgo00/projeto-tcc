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
            $table->string('nome');
            $table->string('origem');
            $table->string('destino');
            $table->string('instituicao');
            $table->string('rota', 500);
            $table->string('horario_manha', 10)->nullable();
            $table->string('horario_tarde', 10)->nullable();
            $table->string('horario_noite', 10)->nullable();
            $table->unsignedInteger('vagas_totais');
            $table->unsignedInteger('vagas_disponiveis');
            $table->decimal('valor_mensal', 8, 2)->nullable();
            $table->string('telefone', 20)->nullable();
            $table->string('email')->nullable();
            $table->boolean('ativa')->default(true);
            $table->decimal('avaliacao_media', 3, 2)->default(0.00);
            $table->unsignedInteger('total_avaliacoes')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('prestador_id');
            $table->index('origem');
            $table->index('instituicao');
            $table->index('ativa');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vans');
    }
};
