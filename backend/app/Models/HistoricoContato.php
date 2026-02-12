<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoContato extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'van_id',
        'tipo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function van()
    {
        return $this->belongsTo(Van::class);
    }
}
