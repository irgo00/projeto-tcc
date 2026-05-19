<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class VanFoto extends Model
{
    protected $table = 'van_fotos';

    protected $fillable = [
        'van_id',
        'caminho',
        'principal',
        'ordem',
    ];

    protected $casts = [
        'principal' => 'boolean',
    ];

    public function van()
    {
        return $this->belongsTo(Van::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->caminho);
    }
}
