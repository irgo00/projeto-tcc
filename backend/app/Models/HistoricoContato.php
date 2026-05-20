<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoContato extends Model
{
    use HasFactory;

    protected $table = 'historico_contatos';

    protected $fillable = [
        'usuario_id',
        'rota_id',
        'tipo_contato',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function rota()
    {
        return $this->belongsTo(Rota::class, 'rota_id');
    }

    public static function registrar(int $usuarioId, int $rotaId, string $tipoContato): self
    {
        return self::create([
            'usuario_id'   => $usuarioId,
            'rota_id'      => $rotaId,
            'tipo_contato' => $tipoContato,
        ]);
    }
}
