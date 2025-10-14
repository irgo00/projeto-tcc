<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('cpf', 14);
            $table->date('birth_date');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('responsible_id')->constrained('responsibles')->onDelete('cascade');
            $table->foreignId('instituition_id')->constrained('instituitions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
