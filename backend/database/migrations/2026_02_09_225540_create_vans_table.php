<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
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
            $table->json('coordenadas')->nullable();
            $table->time('horario_manha')->nullable();
            $table->time('horario_tarde')->nullable();
            $table->time('horario_noite')->nullable();
            $table->integer('vagas_totais');
            $table->integer('vagas_disponiveis');
            $table->string('telefone', 20)->nullable();
            $table->string('email')->nullable();
            $table->boolean('ativa')->default(true);
            $table->decimal('avaliacao_media', 2, 1)->default(0);
            $table->integer('total_avaliacoes')->default(0);
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
