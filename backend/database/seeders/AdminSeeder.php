<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * AdminSeeder — cria o usuário administrador da plataforma.
 *
 * COMO USAR:
 *   php artisan db:seed --class=AdminSeeder
 *
 * Lembre de alterar e-mail e senha antes de rodar em produção.
 */
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Evita duplicata ao re-rodar o seeder
        if (User::where('email', env('ADMIN_EMAIL', 'admin@pbte.com.br'))->exists()) {
            $this->command->info('Usuário admin já existe. Seeder ignorado.');
            return;
        }

        User::create([
            'nome'                => 'Administrador PBTE',
            'email'               => env('ADMIN_EMAIL', 'admin@pbte.com.br'),
            'cpf'                 => '000.000.000-00',   // CPF fictício — admin não precisa de CPF real
            'data_nascimento'     => '1990-01-01',
            'telefone'            => '(00) 00000-0000',
            'password'            => Hash::make(env('ADMIN_PASSWORD', 'Admin@2025!')),
            'tipo'                => 'admin',
            'status_habilitacao'  => 'habilitado',
            'email_verificado'    => true,
            'telefone_verificado' => true,
        ]);

        $this->command->info('Usuário admin criado com sucesso!');
        $this->command->line('  E-mail: ' . env('ADMIN_EMAIL', 'admin@pbte.com.br'));
        $this->command->line('  Senha:  ' . env('ADMIN_PASSWORD', 'Admin@2025!'));
        $this->command->warn('  ⚠  Altere a senha padrão antes de ir para produção!');
    }
}
