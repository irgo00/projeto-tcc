<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rota extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rotas';

    protected $fillable = [
        'prestador_id',
        'van_id',
        'nome',
        'origem',
        'destino',
        'instituicao',
        'rota',
        'horario_manha',
        'horario_tarde',
        'horario_noite',
        'vagas_totais',
        'vagas_disponiveis',
        'valor_mensal',
        'telefone',
        'email',
        'ativa',
    ];

    protected $casts = [
        'ativa' => 'boolean',
        'valor_mensal' => 'decimal:2',
    ];

    public function prestador()
    {
        return $this->belongsTo(User::class, 'prestador_id');
    }

    public function van()
    {
        return $this->belongsTo(Van::class, 'van_id');
    }

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'rota_id');
    }

    public function favoritos()
    {
        return $this->belongsToMany(User::class, 'favoritos', 'rota_id', 'usuario_id');
    }

    public function historicoContatos()
    {
        return $this->hasMany(HistoricoContato::class, 'rota_id');
    }

    public function getHorarioFormatadoAttribute(): array
    {
        return collect([
            'manha' => $this->horario_manha,
            'tarde' => $this->horario_tarde,
            'noite' => $this->horario_noite,
        ])->filter()->all();
    }

    public function getAvaliacaoMediaAttribute(): float
    {
        return round((float) $this->avaliacoes()->avg('nota'), 1);
    }

    public function getTotalAvaliacoesAttribute(): int
    {
        return $this->avaliacoes()->count();
    }

    public function scopeAtivas($query)
    {
        return $query->where('ativa', true);
    }
}
