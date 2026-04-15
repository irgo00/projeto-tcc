<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Van extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'prestador_id',
        'nome',
        'origem',
        'destino',
        'instituicao',
        'rota',
        'coordenadas',
        'horario_manha',
        'horario_tarde',
        'horario_noite',
        'vagas_totais',
        'vagas_disponiveis',
        'telefone',
        'email',
        'ativa',
    ];

    protected $casts = [
        'coordenadas' => 'array',
        'ativa' => 'boolean',
    ];

    /* ======================
     | RELACIONAMENTOS
     |======================*/

    public function prestador()
    {
        return $this->belongsTo(User::class, 'prestador_id');
    }

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class);
    }

    public function favoritos()
    {
        return $this->belongsToMany(User::class, 'favoritos');
    }

    public function coordenadas()
    {
        return $this->hasMany(Coordenada::class);
    }

    public function getHorarioFormatadoAttribute()
    {
        return collect([
            'manha' => $this->horario_manha,
            'tarde' => $this->horario_tarde,
            'noite' => $this->horario_noite,
        ])->filter()->all();
    }

    public function getAvaliacaoMediaAttribute()
    {
        return round($this->avaliacoes()->avg('nota'), 1);
    }

    public function getTotalAvaliacoesAttribute()
    {
        return $this->avaliacoes()->count();
    }

    public function scopeAtivas($query)
    {
        return $query->where('ativa', true);
    }
}
