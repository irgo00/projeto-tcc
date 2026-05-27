<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nome',
        'email',
        'cpf',
        'data_nascimento',
        'telefone',
        'password',
        'tipo',
        'status_habilitacao',
        'email_verificado',
        'telefone_verificado',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'data_nascimento'    => 'date',
        'email_verificado'   => 'boolean',
        'telefone_verificado'=> 'boolean',
    ];

    /* ======================
     | JWT IMPLEMENTATION
     |======================*/

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    /* ======================
     | RELACIONAMENTOS
     |======================*/

    public function vans()
    {
        return $this->hasMany(Van::class, 'prestador_id');
    }

    public function rotas()
    {
        return $this->hasMany(Rota::class, 'prestador_id');
    }

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'usuario_id');
    }

    public function favoritos()
    {
        return $this->belongsToMany(Rota::class, 'favoritos', 'usuario_id', 'rota_id');
    }

    public function historico()
    {
        return $this->hasMany(HistoricoContato::class, 'usuario_id');
    }

    public function documentos()
    {
        return $this->hasMany(DocumentoPrestador::class, 'prestador_id');
    }

    /* ======================
     | HELPERS DE TIPO
     |======================*/

    public function isPrestador(): bool { return $this->tipo === 'prestador'; }
    public function isCliente(): bool   { return $this->tipo === 'cliente'; }
    public function isAdmin(): bool     { return $this->tipo === 'admin'; }

    /* ======================
     | HABILITAÇÃO
     |======================*/

    /**
     * Calcula e retorna o progresso de habilitação do prestador.
     * Retorna array com as 5 etapas e o percentual geral.
     */
    public function progressoHabilitacao(): array
    {
        $documentosEnviados = $this->documentos()->whereIn('status', ['pendente','aprovado','correcao'])->count() >= 4;
        $documentosAprovados = $this->documentos()->where('status', 'aprovado')->count() >= 4;

        $etapas = [
            'email_verificado'     => (bool) $this->email_verificado,
            'telefone_verificado'  => (bool) $this->telefone_verificado,
            'documentos_enviados'  => $documentosEnviados,
            'documentos_aprovados' => $documentosAprovados,
            'perfil_validado'      => $this->status_habilitacao === 'habilitado',
        ];

        $concluidas = count(array_filter($etapas));
        $percentual = (int) round(($concluidas / count($etapas)) * 100);

        return [
            'etapas'    => $etapas,
            'percentual'=> $percentual,
            'habilitado'=> $etapas['perfil_validado'],
        ];
    }

    /**
     * Verifica se o prestador pode criar rotas.
     */
    public function podecriarRotas(): bool
    {
        return $this->isPrestador() && $this->status_habilitacao === 'habilitado';
    }
}
