@extends('emails.layout')

@section('titulo', 'Confirme seu e-mail')

@section('conteudo')
    <h1 style="margin:0 0 16px; font-size:22px; color:#111827;">Confirme seu e-mail</h1>

    <p style="margin:0 0 12px; font-size:15px; line-height:1.6; color:#374151;">
        Olá, {{ $nome }}!
    </p>

    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#374151;">
        Para concluir o cadastro como prestador e liberar a criação de rotas,
        confirme seu endereço de e-mail clicando no botão abaixo.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
            <td style="border-radius:10px; background-color:#7c3aed;">
                <a href="{{ $url }}"
                   style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">
                    Confirmar e-mail
                </a>
            </td>
        </tr>
    </table>

    <p style="margin:0 0 8px; font-size:13px; line-height:1.6; color:#6b7280;">
        Se o botão não funcionar, copie e cole o link abaixo no navegador:
    </p>
    <p style="margin:0 0 24px; font-size:13px; line-height:1.6; word-break:break-all;">
        <a href="{{ $url }}" style="color:#7c3aed;">{{ $url }}</a>
    </p>

    <p style="margin:0; font-size:13px; line-height:1.6; color:#9ca3af;">
        Este link expira em 48 horas. Se você não criou esta conta, ignore este e-mail.
    </p>
@endsection
