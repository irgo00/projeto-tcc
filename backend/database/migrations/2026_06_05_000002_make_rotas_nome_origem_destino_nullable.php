<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE rotas MODIFY nome VARCHAR(255) NULL");
        DB::statement("ALTER TABLE rotas MODIFY origem VARCHAR(255) NULL");
        DB::statement("ALTER TABLE rotas MODIFY destino VARCHAR(255) NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE rotas MODIFY nome VARCHAR(255) NOT NULL");
        DB::statement("ALTER TABLE rotas MODIFY origem VARCHAR(255) NOT NULL");
        DB::statement("ALTER TABLE rotas MODIFY destino VARCHAR(255) NOT NULL");
    }
};
