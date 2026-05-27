<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class DocumentoPrestador extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'documentos_prestador';

    protected $fillable = [
        'prestador_id',
        'tipo',
        'nome_original',
        'caminho',
        'mime_type',
        'tamanho',
        'status',
        'observacao_admin',
        'revisado_por',
        'revisado_em',
    ];

    protected $casts = [
        'revisado_em' => 'datetime',
    ];

    /* ========================
     | RELACIONAMENTOS
     |========================*/

    public function prestador()
    {
        return $this->belongsTo(User::class, 'prestador_id');
    }

    public function revisor()
    {
        return $this->belongsTo(User::class, 'revisado_por');
    }

    /* ========================
     | ACESSORES
     |========================*/

    /**
     * URL pública do arquivo armazenado.
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->caminho);
    }

    /**
     * Tamanho do arquivo formatado (KB / MB).
     */
    public function getTamanhoFormatadoAttribute(): string
    {
        if (!$this->tamanho) return '—';

        if ($this->tamanho >= 1_048_576) {
            return round($this->tamanho / 1_048_576, 1) . ' MB';
        }

        return round($this->tamanho / 1_024, 0) . ' KB';
    }

    /* ========================
     | HELPERS DE STATUS
     |========================*/

    public function isPendente(): bool  { return $this->status === 'pendente'; }
    public function isAprovado(): bool  { return $this->status === 'aprovado'; }
    public function isReprovado(): bool { return $this->status === 'reprovado'; }
    public function isCorrecao(): bool  { return $this->status === 'correcao'; }

    /* ========================
     | LABELS LEGÍVEIS
     |========================*/

    public static function tipoLabel(string $tipo): string
    {
        return match($tipo) {
            'cnh'           => 'CNH — Carteira Nacional de Habilitação',
            'crlv'          => 'CRLV — Certificado de Registro do Veículo',
            'antecedentes'  => 'Certidão de antecedentes criminais',
            'laudo_tecnico' => 'Laudo técnico do veículo',
            default         => 'Outro documento',
        };
    }

    public static function statusLabel(string $status): string
    {
        return match($status) {
            'pendente'  => 'Pendente',
            'aprovado'  => 'Aprovado',
            'reprovado' => 'Reprovado',
            'correcao'  => 'Correção solicitada',
            default     => $status,
        };
    }
}
