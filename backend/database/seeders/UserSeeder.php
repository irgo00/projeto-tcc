<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Prestadores
        User::create([
            'nome' => 'João Silva Transportes',
            'email' => 'joao@prestador.com',
            'cpf' => '123.456.789-00',
            'data_nascimento' => '1985-05-15',
            'telefone' => '(42) 99999-0001',
            'password' => Hash::make('senha123'),
            'tipo' => 'prestador',
        ]);

        User::create([
            'nome' => 'Maria Santos',
            'email' => 'maria@prestador.com',
            'cpf' => '234.567.890-11',
            'data_nascimento' => '1990-08-20',
            'telefone' => '(42) 99999-0002',
            'password' => Hash::make('senha123'),
            'tipo' => 'prestador',
        ]);

        User::create([
            'nome' => 'Pedro Oliveira',
            'email' => 'pedro@prestador.com',
            'cpf' => '345.678.901-22',
            'data_nascimento' => '1988-03-10',
            'telefone' => '(42) 99999-0003',
            'password' => Hash::make('senha123'),
            'tipo' => 'prestador',
        ]);

        // Cliente de teste
        User::create([
            'nome' => 'Ana Cliente',
            'email' => 'ana@cliente.com',
            'cpf' => '456.789.012-33',
            'data_nascimento' => '2005-12-01',
            'telefone' => '(42) 99999-9999',
            'password' => Hash::make('senha123'),
            'tipo' => 'cliente',
        ]);
    }
}
