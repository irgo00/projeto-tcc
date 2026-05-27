<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            /*
             * Adiciona o tipo 'admin' ao enum existente.
             * ATENÇÃO: em MySQL não é possível usar $table->enum() para
             * alterar uma coluna existente diretamente — usamos statement raw.
             */
            DB::statement("ALTER TABLE users MODIFY COLUMN tipo ENUM('cliente','prestador','admin') NOT NULL");

            /*
             * Status de habilitação do prestador.
             *   pendente          – documentos ainda não enviados / em análise
             *   habilitado        – todos os documentos aprovados
             *   reprovado         – algum documento foi reprovado e o prestador precisa corrigir
             */
            $table->enum('status_habilitacao', ['pendente', 'habilitado', 'reprovado'])
                  ->default('pendente')
                  ->after('tipo');

            // Booleanos de verificação de e-mail e telefone
            $table->boolean('email_verificado')->default(false)->after('status_habilitacao');
            $table->boolean('telefone_verificado')->default(false)->after('email_verificado');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            DB::statement("ALTER TABLE users MODIFY COLUMN tipo ENUM('cliente','prestador') NOT NULL");
            $table->dropColumn(['status_habilitacao', 'email_verificado', 'telefone_verificado']);
        });
    }
};
