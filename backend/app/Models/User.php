<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\URL;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nome',
        'nome_fantasia',
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

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

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

    public function isPrestador(): bool { return $this->tipo === 'prestador'; }
    public function isCliente(): bool   { return $this->tipo === 'cliente'; }
    public function isAdmin(): bool     { return $this->tipo === 'admin'; }

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

        $etapasGate = ['email_verificado', 'documentos_enviados', 'documentos_aprovados', 'perfil_validado'];
        $gate       = array_intersect_key($etapas, array_flip($etapasGate));

        $concluidas = count(array_filter($gate));
        $percentual = (int) round(($concluidas / count($gate)) * 100);

        return [
            'etapas'    => $etapas,
            'percentual'=> $percentual,
            'habilitado'=> $etapas['perfil_validado'],
        ];
    }

    public function recalcularHabilitacao(): void
    {
        if (!$this->isPrestador()) {
            return;
        }

        $tiposObrigatorios = ['cnh', 'crlv', 'antecedentes', 'laudo_tecnico'];

        $aprovados = $this->documentos()
            ->where('status', 'aprovado')
            ->pluck('tipo')
            ->toArray();

        $todosDocsAprovados = empty(array_diff($tiposObrigatorios, $aprovados));
        $temReprovado       = $this->documentos()->where('status', 'reprovado')->exists();

        if ($todosDocsAprovados && $this->email_verificado) {
            $novoStatus = 'habilitado';
        } elseif ($temReprovado) {
            $novoStatus = 'reprovado';
        } else {
            $novoStatus = 'pendente';
        }

        if ($this->status_habilitacao !== $novoStatus) {
            $this->update(['status_habilitacao' => $novoStatus]);
        }
    }

    public function podecriarRotas(): bool
    {
        return $this->isPrestador() && $this->status_habilitacao === 'habilitado';
    }

    public function urlVerificacaoEmail(): string
    {
        return URL::temporarySignedRoute(
            'email.verify',
            now()->addHours(48),
            ['id' => $this->id, 'hash' => sha1($this->email)],
        );
    }
}
