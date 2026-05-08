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
        'van_id',
        'tipo_contato',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function van()
    {
        return $this->belongsTo(Van::class);
    }

    public static function registrar(int $usuarioId, int $vanId, string $tipoContato): self
    {
        return self::create([
            'usuario_id'   => $usuarioId,
            'van_id'       => $vanId,
            'tipo_contato' => $tipoContato,
        ]);
    }
}
