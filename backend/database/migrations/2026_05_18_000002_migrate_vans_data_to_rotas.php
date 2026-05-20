<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('
            INSERT INTO rotas (
                id, prestador_id, van_id, nome, origem, destino, instituicao,
                rota, horario_manha, horario_tarde, horario_noite,
                vagas_totais, vagas_disponiveis, valor_mensal, telefone, email,
                ativa, avaliacao_media, total_avaliacoes, created_at, updated_at, deleted_at
            )
            SELECT
                id, prestador_id, NULL, nome, origem, destino, instituicao,
                rota, horario_manha, horario_tarde, horario_noite,
                vagas_totais, vagas_disponiveis, valor_mensal, telefone, email,
                ativa, avaliacao_media, total_avaliacoes, created_at, updated_at, deleted_at
            FROM vans
        ');
    }

    public function down(): void
    {
        DB::table('rotas')->truncate();
    }
};
