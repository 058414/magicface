/**
 * MAGICFACE - GERADOR DE PROTOCOLO
 * Integração com Claude API para gerar protocolos personalizados
 */

async function gerarProtocoloComIA(nomeUsuaria, dadosQuiz, imagensMeiasFaces) {
  try {
    console.log('🚀 Iniciando geração de protocolo para:', nomeUsuaria);

    // Montar o prompt com os dados do quiz
    const systemPrompt = criarSystemPromptMagicFace(nomeUsuaria);
    console.log('✅ System prompt criado');

    const userPrompt = montarPromptUsuaria(nomeUsuaria, dadosQuiz);
    console.log('✅ User prompt criado');

    // Chamar endpoint (local em dev, Vercel em prod)
    const isLocalhost = window.location.hostname === 'localhost';
    const apiUrl = isLocalhost
      ? 'http://localhost:3001/api/gerar-protocolo'
      : '/api/gerar-protocolo';

    console.log('📡 Chamando endpoint:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nomeUsuaria,
        quiz: dadosQuiz,
        systemPrompt: systemPrompt,
        userPrompt: userPrompt
      })
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na requisição:', response.status, errorText);
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Resposta recebida');

    if (data.error) {
      console.error('❌ Erro ao gerar protocolo:', data.error);
      return null;
    }

    console.log('🎉 Protocolo gerado com sucesso!');
    return data.protocolo;

  } catch (error) {
    console.error('❌ Erro ao chamar API:', error);
    // Fallback: usar versão simplificada se API falhar
    console.log('⚠️ Usando fallback...');
    return gerarProtocoloFallback(nomeUsuaria, dadosQuiz);
  }
}

function montarPromptUsuaria(nomeUsuaria, quiz) {
  // Mapear respostas do quiz para descrições legíveis
  const mapLinhas = {
    'retas': 'retas e angulosas',
    'curvas': 'curvas e arredondadas',
    'mistura': 'mistura de retas e curvas'
  };

  const mapBiotipo = {
    'retangulo': 'Retângulo',
    'pera': 'Pêra',
    'triangulo_inv': 'Triângulo Invertido',
    'ampulheta': 'Ampulheta',
    'oval': 'Oval'
  };

  const mapComprimento = {
    'curto': 'Curto (acima dos ombros)',
    'medio': 'Médio (na altura dos ombros)',
    'longo': 'Longo (próximo da cintura ou abaixo)'
  };

  const mapImagem = {
    'autoridade': 'Autoridade e presença',
    'afeto': 'Afeto e delicadeza',
    'dinamismo': 'Dinamismo e modernidade',
    'sensualidade': 'Sensualidade elegante'
  };

  return `DADOS DE ${nomeUsuaria.toUpperCase()}:

Perceção do Rosto: ${quiz.percepcaoRosto || 'Não especificado'}
Linhas do Rosto: ${mapLinhas[quiz.linhasRosto] || quiz.linhasRosto}
Linhas do Corpo: ${mapLinhas[quiz.linhasCorpo] || quiz.linhasCorpo}
Divisão de Cabelo: ${quiz.divisaoCabelo === 'sim' ? 'Usa ao meio' : 'Divide de lado'}
Franja: ${quiz.franja || 'Não usa'}
Queixo/Papada: ${quiz.queixo === 'sim' ? 'Gostaria de amenizar' : (quiz.queixo === 'um_pouco' ? 'Um pouco' : 'Não incomoda')}
Biotipo: ${mapBiotipo[quiz.biotipo] || quiz.biotipo}
Comprimento Atual: ${mapComprimento[quiz.comprimentoCabelo] || quiz.comprimentoCabelo}
Cores das Roupas: ${quiz.coresRoupas || 'Não especificado'}
Marca de Cintura: ${quiz.cintura === 'sim' ? 'Sim, marca muito' : (quiz.cintura === 'raramente' ? 'Raramente' : 'Nunca')}
Energia/Imagem Desejada: ${mapImagem[quiz.imagem] || quiz.imagem}

Com base nestes dados, gere um protocolo de corte especializado para ${nomeUsuaria}.

Estruture exatamente como solicitado:
1. Sua Assimetria Facial — O Mapa do Seu Rosto
2. Seu Corpo — Como o Corte Dialoga com Seu Biotipo
3. Seu Corte Ideal — Técnicas e Posicionamento
4. Estilização Diária — Compensação Visual na Prática

Lembre-se: PROFUNDO, ESPECÍFICO, com cada recomendação explicada visualmente. 1200-1500 palavras.`;
}

// Fallback se API falhar
function gerarProtocoloFallback(nomeUsuaria, quiz) {
  return `**1. Sua Assimetria Facial — O Mapa do Seu Rosto**

${nomeUsuaria}, seu rosto tem características únicas que devem ser celebradas, não escondidas. A análise facial que você realizou revelou padrões específicos que vamos usar para construir um corte que realmente funcione com você, não contra você.

Seu rosto é percebido como ${quiz.percepcaoRosto || 'único'}. Isso significa que o corte ideal para você deve trabalhar essa característica como aliada. Se seu rosto é longo, usaremos volume lateral para criar equilíbrio. Se é mais largo, usaremos linhas verticais para alongar visualmente.

As linhas predominantes no seu rosto são ${quiz.linhasRosto}. Isso importa porque define qual tipo de corte vai se harmonizar naturalmente com seus traços.

**2. Seu Corpo — Como o Corte Dialoga com Seu Biotipo**

Você tem biotipo ${quiz.biotipo}. Cada biotipo pede uma estratégia diferente de corte. O comprimento atual é ${quiz.comprimentoCabelo}, que pode ser mantido ou adaptado conforme sua preferência.

O objetivo é criar proporções visuais que equilibrem seu corpo de forma natural. O corte trabalha como ferramenta — não é sobre esconder, é sobre potencializar.

**3. Seu Corte Ideal — Técnicas e Posicionamento**

Baseado em sua análise, o corte que vai funcionar para você combina:
- Comprimento estratégico
- Técnicas específicas (camadas, movimento, estrutura)
- Posicionamento inteligente para compensar assimetria
- Franja (ou não), conforme sua preferência

A forma de pentear, a posição do volume e o posicionamento lateral podem variar conforme o dia — você tem controle total.

**4. Estilização Diária — Compensação Visual na Prática**

O corte é uma ferramenta. Você aprende como usá-la nos diferentes contextos do seu dia. Como pentear quando quer expandir ou retrair, como trabalhar com secador, como a gola da roupa dialoga com o corte.

A verdadeira liberdade está em escolher conscientemente — reforçar o que você ama em você, atenuar o que não está legal segundo sua ótica. Você tem total liberdade de decisão.

---

*Este é um protocolo simplificado. Para análise completa e personalizada, regenere o protocolo.*`;
}
