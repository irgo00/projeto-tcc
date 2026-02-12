<?php

namespace Database\Seeders;

use App\Models\Van;
use App\Models\Coordenada;
use App\Models\User;
use Illuminate\Database\Seeder;

class VanSeeder extends Seeder
{
    public function run(): void
    {
        $prestador1 = User::where('email', 'joao@prestador.com')->first();
        $prestador2 = User::where('email', 'maria@prestador.com')->first();
        $prestador3 = User::where('email', 'pedro@prestador.com')->first();

        // Van 1
        $van1 = Van::create([
            'prestador_id' => $prestador1->id,
            'nome' => 'Van Escolar Central',
            'origem' => 'Centro',
            'destino' => 'UNICENTRO',
            'instituicao' => 'UNICENTRO',
            'rota' => 'Centro → UNICENTRO (Campus Santa Cruz)',
            'horario_manha' => '06:30',
            'horario_tarde' => '13:00',
            'horario_noite' => null,
            'vagas_disponiveis' => 3,
            'vagas_totais' => 15,
            'telefone' => '(42) 99999-0001',
            'email' => 'joao.van@email.com',
            'avaliacao_media' => 4.8,
            'total_avaliacoes' => 24,
            'ativa' => true,
        ]);

        Coordenada::create([
            'van_id' => $van1->id,
            'latitude' => -25.4686,
            'longitude' => -51.0848,
            'nome' => 'Centro - Praça da República',
            'ordem' => 1,
        ]);

        Coordenada::create([
            'van_id' => $van1->id,
            'latitude' => -25.4712,
            'longitude' => -51.0892,
            'nome' => 'Rua Visconde do Rio Branco',
            'ordem' => 2,
        ]);

        Coordenada::create([
            'van_id' => $van1->id,
            'latitude' => -25.4755,
            'longitude' => -51.0945,
            'nome' => 'UNICENTRO Campus Santa Cruz',
            'ordem' => 3,
        ]);

        // Van 2
        $van2 = Van::create([
            'prestador_id' => $prestador2->id,
            'nome' => 'Transporte Universitário',
            'origem' => 'Engenheiro Gutierrez',
            'destino' => 'IFPR',
            'instituicao' => 'IFPR',
            'rota' => 'Engenheiro Gutierrez → IFPR Campus Irati',
            'horario_manha' => '07:00',
            'horario_tarde' => '13:30',
            'horario_noite' => null,
            'vagas_disponiveis' => 5,
            'vagas_totais' => 13,
            'telefone' => '(42) 99999-0002',
            'email' => 'maria.transporte@email.com',
            'avaliacao_media' => 4.9,
            'total_avaliacoes' => 31,
            'ativa' => true,
        ]);

        Coordenada::create([
            'van_id' => $van2->id,
            'latitude' => -25.4823,
            'longitude' => -51.0756,
            'nome' => 'Engenheiro Gutierrez',
            'ordem' => 1,
        ]);

        Coordenada::create([
            'van_id' => $van2->id,
            'latitude' => -25.4789,
            'longitude' => -51.0801,
            'nome' => 'Rua Coronel Emílio Gomes',
            'ordem' => 2,
        ]);

        Coordenada::create([
            'van_id' => $van2->id,
            'latitude' => -25.4652,
            'longitude' => -51.0912,
            'nome' => 'IFPR Campus Irati',
            'ordem' => 3,
        ]);

        // Van 3
        $van3 = Van::create([
            'prestador_id' => $prestador3->id,
            'nome' => 'Van Estudantil',
            'origem' => 'Alto da Glória',
            'destino' => 'Colégio Estadual',
            'instituicao' => 'Colégio Estadual',
            'rota' => 'Alto da Glória → Colégio Estadual',
            'horario_manha' => '06:45',
            'horario_tarde' => '12:45',
            'horario_noite' => null,
            'vagas_disponiveis' => 2,
            'vagas_totais' => 10,
            'telefone' => '(42) 99999-0003',
            'email' => 'pedro.estudantil@email.com',
            'avaliacao_media' => 4.7,
            'total_avaliacoes' => 18,
            'ativa' => true,
        ]);

        Coordenada::create([
            'van_id' => $van3->id,
            'latitude' => -25.4612,
            'longitude' => -51.0723,
            'nome' => 'Alto da Glória',
            'ordem' => 1,
        ]);

        Coordenada::create([
            'van_id' => $van3->id,
            'latitude' => -25.4656,
            'longitude' => -51.0789,
            'nome' => 'Rua XV de Novembro',
            'ordem' => 2,
        ]);

        Coordenada::create([
            'van_id' => $van3->id,
            'latitude' => -25.4678,
            'longitude' => -51.0834,
            'nome' => 'Colégio Estadual',
            'ordem' => 3,
        ]);

        // Van 4
        $van4 = Van::create([
            'prestador_id' => $prestador1->id,
            'nome' => 'Van Universitária Plus',
            'origem' => 'Centro',
            'destino' => 'UNICENTRO',
            'instituicao' => 'UNICENTRO',
            'rota' => 'Centro → UNICENTRO (Rota Alternativa)',
            'horario_manha' => '06:00',
            'horario_tarde' => '12:30',
            'horario_noite' => null,
            'vagas_disponiveis' => 6,
            'vagas_totais' => 15,
            'telefone' => '(42) 99999-0005',
            'email' => 'carlos.van@email.com',
            'avaliacao_media' => 4.9,
            'total_avaliacoes' => 42,
            'ativa' => true,
        ]);

        Coordenada::create([
            'van_id' => $van4->id,
            'latitude' => -25.4686,
            'longitude' => -51.0848,
            'nome' => 'Centro - Terminal',
            'ordem' => 1,
        ]);

        Coordenada::create([
            'van_id' => $van4->id,
            'latitude' => -25.4723,
            'longitude' => -51.0901,
            'nome' => 'Rua Prudente de Morais',
            'ordem' => 2,
        ]);

        Coordenada::create([
            'van_id' => $van4->id,
            'latitude' => -25.4755,
            'longitude' => -51.0945,
            'nome' => 'UNICENTRO Campus',
            'ordem' => 3,
        ]);

        // Van 5
        $van5 = Van::create([
            'prestador_id' => $prestador2->id,
            'nome' => 'Transporte IFPR Expresso',
            'origem' => 'Centro',
            'destino' => 'IFPR',
            'instituicao' => 'IFPR',
            'rota' => 'Centro → IFPR Campus Irati',
            'horario_manha' => '06:50',
            'horario_tarde' => null,
            'horario_noite' => '18:00',
            'vagas_disponiveis' => 1,
            'vagas_totais' => 12,
            'telefone' => '(42) 99999-0006',
            'email' => 'juliana.rapido@email.com',
            'avaliacao_media' => 4.5,
            'total_avaliacoes' => 12,
            'ativa' => true,
        ]);

        Coordenada::create([
            'van_id' => $van5->id,
            'latitude' => -25.4686,
            'longitude' => -51.0848,
            'nome' => 'Centro',
            'ordem' => 1,
        ]);

        Coordenada::create([
            'van_id' => $van5->id,
            'latitude' => -25.4667,
            'longitude' => -51.0878,
            'nome' => 'Av. Presidente Kennedy',
            'ordem' => 2,
        ]);

        Coordenada::create([
            'van_id' => $van5->id,
            'latitude' => -25.4652,
            'longitude' => -51.0912,
            'nome' => 'IFPR',
            'ordem' => 3,
        ]);
    }
}
