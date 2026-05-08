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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
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

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'usuario_id');
    }

    public function favoritos()
    {
        return $this->belongsToMany(Van::class, 'favoritos', 'usuario_id', 'van_id');
    }

    public function historico()
    {
        return $this->hasMany(HistoricoContato::class, 'usuario_id');
    }

    /* ======================
     | HELPERS DE TIPO
     |======================*/

    public function isPrestador(): bool
    {
        return $this->tipo === 'prestador';
    }

    public function isCliente(): bool
    {
        return $this->tipo === 'cliente';
    }
}
