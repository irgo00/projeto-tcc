<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coordenada extends Model
{
    use HasFactory;

    protected $fillable = [
        'van_id',
        'latitude',
        'longitude',
        'nome',
        'ordem',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function van()
    {
        return $this->belongsTo(Van::class);
    }
}
