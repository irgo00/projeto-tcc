<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            DB::statement("ALTER TABLE users MODIFY COLUMN tipo ENUM('cliente','prestador','admin') NOT NULL");

            $table->enum('status_habilitacao', ['pendente', 'habilitado', 'reprovado'])
                  ->default('pendente')
                  ->after('tipo');

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
