<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documentos_prestador', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestador_id')->constrained('users')->onDelete('cascade');

            $table->string('tipo', 50);

            $table->string('nome_original', 255);
            $table->string('caminho', 500);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('tamanho')->nullable();

            $table->enum('status', ['pendente', 'aprovado', 'reprovado', 'correcao'])
                  ->default('pendente');

            $table->text('observacao_admin')->nullable();
            $table->foreignId('revisado_por')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('revisado_em')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('prestador_id');
            $table->index('status');
            $table->index('tipo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documentos_prestador');
    }
};
