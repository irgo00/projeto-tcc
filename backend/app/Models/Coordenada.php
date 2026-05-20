<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coordenada extends Model
{
    use HasFactory;

    protected $fillable = [
        'rota_id',
        'latitude',
        'longitude',
        'nome',
        'ordem',
    ];

    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
    ];

    public function rota()
    {
        return $this->belongsTo(Rota::class, 'rota_id');
    }
}
