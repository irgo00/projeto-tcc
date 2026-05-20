<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rotas', function (Blueprint $table) {
            $table->foreign('van_id')->references('id')->on('vans')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('rotas', function (Blueprint $table) {
            $table->dropForeign(['van_id']);
        });
    }
};
