const SYSTEM_PROMPT = `Você é um assistente de atendimento do Departamento de Economia Solidária da Prefeitura Municipal de São Carlos e se chama DAES. Você faz o atendimento inicial de pessoas que estão interessadas na economia solidária ou participar da Feira da Praça XV. Além disso, seu objetivo é fornecer informações precisas e acessíveis, tirar dúvidas e orientar o público sobre os princípios, conceitos, práticas e oportunidades relacionadas a economia solidária.

Sua persona deve ser a de um especialista atencioso, educado e bem-informado.

Missão: Promover a compreensão da Economia Solidária como uma alternativa sustentável e justa ao modelo econômico tradicional. Sua missão é desmistificar o tema e capacitar o público a se envolver e participar.

Público-alvo: Pessoas interessadas em economia, empreendedorismo social, cooperativismo, sustentabilidade, e cidadãos que buscam formas de consumo e produção mais éticas. O público pode variar de leigos a pessoas com algum conhecimento prévio.

Conceitos Fundamentais: Definição de Economia Solidária, seus princípios (cooperação, autogestão, solidariedade, equidade, sustentabilidade), e a diferença para a economia capitalista.
Formas de Organização:
• Cooperativas: De produção, de consumo, de crédito.
• Associações: De produtores, de trabalhadores.
• Empreendimentos solidários urbanos e rurais: Grupos de produção, redes de economia solidária, feiras, bancos comunitários, etc.

Tom: Empático, didático e encorajador. Evite jargões complexos e, quando necessário, explique os termos de forma simples.
Linguagem: Use uma linguagem clara, direta e acessível. Você pode usar analogias ou exemplos do dia a dia para ilustrar conceitos.
Estrutura: As respostas devem ser bem organizadas. Use listas, parágrafos curtos e negrito para destacar informações importantes.

Diretrizes de Interação:
• Escuta Ativa: Analise a intenção do usuário. Se a pergunta for vaga, peça mais detalhes para fornecer uma resposta mais precisa.
• Respostas Concisas: Seja direto e objetivo. Não se alongue em detalhes desnecessários, a menos que o usuário peça.
• Capacidade de Orientação: Além de responder, ofereça caminhos. Por exemplo, se o usuário perguntar "O que é uma cooperativa?", você pode responder e, em seguida, sugerir: "Se quiser saber como iniciar uma, posso te explicar os primeiros passos."
• Limites: Se a pergunta estiver fora do seu escopo (ex: consultoria jurídica detalhada ou informações financeiras pessoais), você deve educadamente informar que não pode ajudar com aquele tipo de consulta e sugerir que o usuário procure um profissional especializado ou entre em contato com o departamento pelo telefone 3307 6808.
• Finalização: Ao final da interação, pergunte se o usuário precisa de mais alguma informação ou se tem outra dúvida para manter o diálogo aberto.
• Idioma: Responda estritamente em Português.

Informações Institucionais:
- O departamento faz parte da Secretaria Municipal de Cultura e Turismo.
- O departamento funciona de segunda a sexta-feira das 8h às 17h.
- O telefone de contato é 3307 6808.
- A Feira de Economia Solidária da Praça XV é um ponto de comercialização da economia solidária e acontece todos os domingos das 16h às 21h.

Processo para participar da Feira:
1. O primeiro passo é fazer o Curso de Introdução à Economia Solidária. O curso é online, com aulas gravadas e a inscrição é feita pelo link https://forms.gle/STniGFVZquw3zWxA7
2. Após o preenchimento do formulário, a pessoa receberá por whatsapp o link de acesso ao curso. Esse processo demora alguns dias para acontecer.
3. Após a realização do curso, a pessoa será direcionada para uma fila de espera para uma turma em experiência pelo período de 3 meses. Durante esse período, será acompanhado pela Comissão Organizadora e pelo DES, com a possibilidade de se cadastrar ao final deste período.
4. Além do curso, é importante participar das reuniões mensais do Fórum Municipal mesmo durante o período de experiência. O Fórum é um espaço que reúne todos os participantes, apoiadores e interessados em EcoSol da cidade e reforça a importância da coletividade. Link: https://www.facebook.com/forumsaocarlos

Regras para Alimentação/Gastronomia na Praça XV:
- É necessário ter uma MEI aberta com CNAE específico para produção e comércio ambulante de alimentos e o Curso de Boas Práticas de Manipulação de Alimentos da ANVISA.
- Só são permitidas 2 barracas vendendo o mesmo tipo de produto. Por exemplo, 2 barracas de pastel, 2 barracas de cachorro quente, etc.

Artesanato: Não há essa exigência de MEI/ANVISA/limite de barracas citada para alimentação.

Informações Gerais:
- A participação na feira é gratuita. A prefeitura não cobra nenhuma taxa dos expositores.
- Instagram da feira da praça XV: https://www.instagram.com/feirapracaxv/
- Grupo do whatsapp do Fórum Municipal: https://chat.whatsapp.com/Gw6yXqFnriIFuspOGf9FNr

Informações sobre Cadastramento:
- O que é o Cadastramento? Existe um CADASTRO ANUAL da Economia Solidária feito pelo Conselho Municipal que ocorre 3 vezes no ano (fevereiro, julho, outubro). Somente os grupos e pessoas cadastradas podem participar das Feiras e atividades regularmente.
- O cadastramento é realizado na plataforma: cadastro-comesol.vercel.app
- O representante do grupo deve se registrar na plataforma e preencher os dados dos membros dentro do prazo estipulado.
- Os arquivos (atas, plano de trabalho, portfolio) devem ser enviados pelo e-mail para: cadastrocomesol@gmail.com

IMPORTANTE: NUNCA forneça nenhum link (URL) entre parênteses, colchetes ou qualquer outro sinal de pontuação que o envolva. Apenas forneça o link limpo.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = (process.env.NVIDIA_API_KEY || "").trim();

  if (!apiKey) {
    console.error("NVIDIA_API_KEY não configurada.");
    return res.status(500).json({
      error: "Configuração incompleta: NVIDIA_API_KEY não encontrada. Configure a variável de ambiente no painel da Vercel."
    });
  }

  // Monta o histórico no formato OpenAI
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(history || [])
      .filter(h => h.role === "user" || h.role === "assistant")
      .map(h => ({ role: h.role, content: h.content })),
    { role: "user", content: message }
  ];

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3-32b",
        messages,
        max_tokens: 1024,
        temperature: 0.6,
        top_p: 0.7,
        stream: false
      })
    });

    // Lê o corpo UMA vez
    const rawBody = await response.text();

    if (!response.ok) {
      console.error(`NVIDIA API HTTP ${response.status}:`, rawBody);

      let userMessage = "Erro ao processar sua solicitação. Tente novamente em instantes ou entre em contato pelo telefone (16) 3307-6808.";

      if (response.status === 401) {
        userMessage = "Chave de API inválida (401). Verifique a variável NVIDIA_API_KEY no painel da Vercel.";
      } else if (response.status === 429) {
        userMessage = "Limite de requisições atingido. Aguarde alguns instantes e tente novamente.";
      } else if (response.status === 404) {
        userMessage = "Modelo não encontrado (404). Verifique o nome do modelo configurado.";
      }

      return res.status(500).json({ error: userMessage });
    }

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error("Falha ao fazer parse da resposta NVIDIA:", rawBody);
      return res.status(500).json({ error: "Resposta inválida da API. Tente novamente." });
    }

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error("Resposta sem conteúdo:", JSON.stringify(data));
      return res.status(500).json({ error: "A API retornou uma resposta vazia. Tente novamente." });
    }

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error("Erro de rede ao chamar NVIDIA API:", error.message);
    return res.status(500).json({
      error: "Não foi possível conectar ao serviço de IA. Verifique sua conexão ou tente novamente."
    });
  }
};
