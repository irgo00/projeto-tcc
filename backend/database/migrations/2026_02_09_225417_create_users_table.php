<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('cpf', 14)->unique();
            $table->date('data_nascimento');
            $table->string('telefone', 20);
            $table->string('password');
            $table->enum('tipo', ['cliente', 'prestador']);
            $table->rememberToken();
            $table->timestamps();
            $table->index('email');
            $table->index('cpf');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
