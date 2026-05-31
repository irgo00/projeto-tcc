@extends('emails.layout')

@section('titulo', 'Vagas disponíveis')

@section('conteudo')
    {{-- Faixa de destaque com a quantidade de vagas --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin:0 0 24px; background:linear-gradient(135deg,#7c3aed 0%,#9333ea 100%); border-radius:12px;">
        <tr>
            <td align="center" style="padding:24px 20px;">
                <p style="margin:0 0 4px; font-size:13px; color:#ede9fe; letter-spacing:0.4px; text-transform:uppercase;">
                    Boas notícias!
                </p>
                <p style="margin:0; font-size:28px; font-weight:bold; color:#ffffff; line-height:1.2;">
                    {{ $vagas }} {{ $vagas === 1 ? 'vaga disponível' : 'vagas disponíveis' }}
                </p>
                <p style="margin:8px 0 0; font-size:14px; color:#ede9fe;">
                    em uma rota que você favoritou
                </p>
            </td>
        </tr>
    </table>

    <p style="margin:0 0 12px; font-size:15px; line-height:1.6; color:#374151;">
        Olá, <strong>{{ $nomeUsuario }}</strong>!
    </p>

    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#374151;">
        A rota <strong>{{ $nomeRota }}</strong>, que estava sem vagas, acaba de
        abrir oportunidades. Veja os detalhes abaixo e entre em contato com o
        prestador antes que as vagas sejam preenchidas.
    </p>

    {{-- Card com detalhes da rota --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin:0 0 24px; background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">
        <tr>
            <td style="padding:20px 22px;">
                <p style="margin:0 0 4px; font-size:11px; color:#9ca3af; letter-spacing:0.4px; text-transform:uppercase;">
                    Rota
                </p>
                <p style="margin:0 0 14px; font-size:17px; font-weight:bold; color:#111827;">
                    {{ $nomeRota }}
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#374151;">
                    <tr>
                        <td style="padding:4px 0; width:110px; color:#6b7280;">Trajeto</td>
                        <td style="padding:4px 0;"><strong>{{ $origem }}</strong> → <strong>{{ $destino }}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0; color:#6b7280;">Instituição</td>
                        <td style="padding:4px 0;">{{ $instituicao }}</td>
                    </tr>
                    @if (!empty($descricaoRota))
                        <tr>
                            <td style="padding:4px 0; color:#6b7280; vertical-align:top;">Descrição</td>
                            <td style="padding:4px 0;">{{ $descricaoRota }}</td>
                        </tr>
                    @endif
                    @if (!empty($horarios))
                        <tr>
                            <td style="padding:4px 0; color:#6b7280;">Horários</td>
                            <td style="padding:4px 0;">
                                @foreach ($horarios as $periodo => $hora)
                                    <span style="display:inline-block; padding:2px 8px; margin:0 4px 4px 0; background-color:#ede9fe; color:#6d28d9; border-radius:9999px; font-size:12px; font-weight:600;">
                                        {{ $periodo }} {{ $hora }}
                                    </span>
                                @endforeach
                            </td>
                        </tr>
                    @endif
                    @if ($valorFormatado)
                        <tr>
                            <td style="padding:4px 0; color:#6b7280;">Mensalidade</td>
                            <td style="padding:4px 0;"><strong>{{ $valorFormatado }}</strong></td>
                        </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    {{-- Contato direto com o prestador --}}
    @if ($telefone || $emailContato)
        <p style="margin:0 0 10px; font-size:13px; color:#6b7280; letter-spacing:0.3px; text-transform:uppercase;">
            Fale com o prestador
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="margin:0 0 24px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
            <tr>
                <td style="padding:14px 20px; font-size:14px; color:#374151;">
                    @if ($telefone)
                        <p style="margin:0 0 6px;">
                            <span>{{ $telefone }}</span>
                        </p>
                    @endif
                    @if ($emailContato)
                        <p style="margin:0;">
                            <span>{{ $emailContato }}</span>
                        </p>
                    @endif
                </td>
            </tr>
        </table>
    @endif

    {{-- CTA --}}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
            <td style="border-radius:10px; background-color:#7c3aed;">
                <a href="{{ $urlBusca }}"
                   style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">
                    Ver rotas disponíveis
                </a>
            </td>
        </tr>
    </table>

    <p style="margin:0; font-size:12px; line-height:1.6; color:#9ca3af;">
        Você está recebendo este e-mail porque favoritou esta rota na PBTE.
    </p>
@endsection
