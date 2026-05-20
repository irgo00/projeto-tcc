<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Van extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'prestador_id',
        'modelo',
        'marca',
        'placa',
        'ano',
        'cor',
        'descricao',
        'ar_condicionado',
        'camera_interna',
        'porta_automatica',
        'wifi',
        'acessibilidade',
        'usb_carregador',
        'outros_itens',
    ];

    protected $casts = [
        'ar_condicionado'  => 'boolean',
        'camera_interna'   => 'boolean',
        'porta_automatica' => 'boolean',
        'wifi'             => 'boolean',
        'acessibilidade'   => 'boolean',
        'usb_carregador'   => 'boolean',
    ];

    public function prestador()
    {
        return $this->belongsTo(User::class, 'prestador_id');
    }

    public function fotos()
    {
        return $this->hasMany(VanFoto::class)->orderBy('ordem');
    }

    public function rotas()
    {
        return $this->hasMany(Rota::class, 'van_id');
    }

    public function getFotoPrincipalAttribute(): ?VanFoto
    {
        return $this->fotos->firstWhere('principal', true)
            ?? $this->fotos->first();
    }

    public function getFotoPrincipalUrlAttribute(): ?string
    {
        $foto = $this->foto_principal;
        return $foto ? Storage::disk('public')->url($foto->caminho) : null;
    }
}
