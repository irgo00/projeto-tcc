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

            /*
             * Tipos aceitos:
             *   cnh            – Carteira Nacional de Habilitação
             *   crlv           – Certificado de Registro e Licenciamento do Veículo
             *   antecedentes   – Certidão de antecedentes criminais
             *   laudo_tecnico  – Laudo técnico do veículo
             *   outros         – Qualquer outro documento solicitado pelo admin
             */
            $table->string('tipo', 50);

            $table->string('nome_original', 255);   // nome do arquivo original
            $table->string('caminho', 500);          // path no disco (storage/app/public)
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('tamanho')->nullable(); // bytes

            /*
             * Status do documento:
             *   pendente      – aguardando análise do admin
             *   aprovado      – aprovado pelo admin
             *   reprovado     – reprovado com justificativa
             *   correcao      – correção solicitada pelo admin
             */
            $table->enum('status', ['pendente', 'aprovado', 'reprovado', 'correcao'])
                  ->default('pendente');

            $table->text('observacao_admin')->nullable(); // motivo de recusa/correção
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
