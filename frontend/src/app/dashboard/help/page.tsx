'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send,
  User,
  Bot,
  Info,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'concepts' | 'google' | 'medtraffic';
  question: string;
  answer: string;
}

interface ArticleItem {
  id: string;
  category: 'concepts' | 'google' | 'medtraffic';
  title: string;
  summary: string;
  content: string[];
  steps?: { title: string; desc: string }[];
  tips?: string[];
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'concepts' | 'google' | 'medtraffic'>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  // Estado do Artigo em Detalhes (Modal)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Ref e Efeito para Scroll Automático do Chatbot
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Olá! Sou o Assistente Virtual do MedTraffic. Selecione uma das dúvidas comuns abaixo ou digite algo no campo para que eu possa te ajudar imediatamente!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Tópicos e Artigos da Central de Ajuda com passos detalhados
  const articles: ArticleItem[] = useMemo(() => [
    {
      id: 'concepts-1',
      category: 'concepts',
      title: 'O que é Tráfego Digital?',
      summary: 'Entenda como atrair clientes qualificados de forma contínua para sua página.',
      content: [
        'Tráfego Digital refere-se ao fluxo de visitantes que acessam sua Landing Page ou canal online. Na área da saúde, isso representa as pessoas que estão buscando ativamente por cuidadores ou terapeutas locais.',
        'Dominar a atração de tráfego é o pilar mais importante para manter uma agenda cheia sem depender apenas de indicações boca-a-boca.'
      ],
      steps: [
        { title: '1. Identifique o Público Alvo', desc: 'Defina a persona de atendimento. Para cuidadores, o público-alvo são os filhos e familiares do idoso. Para psicólogos, são pacientes que buscam especialidades específicas (ex: terapia de casal, ansiedade).' },
        { title: '2. Escolha entre Orgânico ou Pago', desc: 'O tráfego orgânico (SEO) é gratuito, mas leva meses. O tráfego pago (anúncios) atrai clientes na sua região de forma imediata (questão de horas).' },
        { title: '3. Prepare a Landing Page', desc: 'A página de captura deve ser rápida, focada em conversão, e conter um formulário simples atrelado ao consentimento LGPD.' },
        { title: '4. Facilite o Contato', desc: 'Disponibilize o botão direcionador de WhatsApp para que a conversa inicie imediatamente no celular.' }
      ],
      tips: [
        'Recomendamos iniciar com um orçamento modesto em tráfego pago local para validar a conversão da sua Landing Page rapidamente.'
      ]
    },
    {
      id: 'concepts-2',
      category: 'concepts',
      title: 'Diferença entre Google Ads e Meta Ads',
      summary: 'Saiba qual canal é ideal para os seus objetivos de marketing.',
      content: [
        'A principal diferença entre as duas plataformas de anúncios está na intenção do usuário.',
        'Entender essa dinâmica economiza orçamento e atrai contatos muito mais qualificados.'
      ],
      steps: [
        { title: '1. Google Ads (Atração por Intenção)', desc: 'Exiba seus anúncios exatamente para quem está pesquisando no buscador (ex: "cuidador de idosos home care em Pinheiros"). A intenção de contratação é imediata.' },
        { title: '2. Meta Ads (Atração por Atenção)', desc: 'Exiba posts e vídeos informativos no feed do Instagram/Facebook para pessoas baseadas em interesses e perfil demográfico. Ideal para construir autoridade e conscientizar sobre terapia.' },
        { title: '3. Definição do Orçamento de Mídia', desc: 'Cadastre seus dados de pagamento diretamente em cada canal de anúncios. O MedTraffic apenas faz a ponte técnica via API.' },
        { title: '4. Integração do Funil', desc: 'Aponte seus anúncios sempre para a sua Landing Page do MedTraffic para capturar o lead com segurança jurídica (LGPD).' }
      ],
      tips: [
        'Se você é Cuidador ou Psicólogo Clínico com foco em atendimento imediato, inicie pelo Google Ads.',
        'Se você quer divulgar infoprodutos, palestras ou posicionamento de marca, use o Meta Ads.'
      ]
    },
    {
      id: 'google-1',
      category: 'google',
      title: 'Como configurar e lançar campanhas no Google Ads',
      summary: 'Passo a passo básico para rodar seus primeiros anúncios no Google.',
      content: [
        'O assistente de campanhas do MedTraffic permite lançar anúncios de busca direto na sua conta do Google Ads de forma simplificada e integrada.'
      ],
      steps: [
        { title: '1. Crie sua conta de anunciante', desc: 'Acesse ads.google.com, faça o login com sua conta do Google e configure o faturamento (boleto, cartão ou PIX).' },
        { title: '2. Conecte sua conta no MedTraffic', desc: 'No menu lateral "Campanhas de Anúncios", clique no botão "Configurar Contas (OAuth)", escolha "Conectar Google Ads" e autorize as permissões.' },
        { title: '3. Configure sua Campanha', desc: 'Clique em "Lançar Campanha". Selecione o canal Google Ads, defina um orçamento diário (ex: R$ 25,00) e selecione a sua Landing Page publicada.' },
        { title: '4. Adicione as Palavras-Chave de Busca', desc: 'Insira termos que expressem necessidade de busca imediata, separados por vírgula (ex: "psicologo perto de mim, terapia online, consulta psicologo").' },
        { title: '5. Importe a Copy gerada por IA', desc: 'O assistente preencherá os títulos e descrições do anúncio automaticamente usando copys criadas pela IA, prontas e higienizadas.' },
        { title: '6. Publique e Acompanhe', desc: 'Clique em publicar e aguarde a barra de progresso da API. Depois, acompanhe os gastos, cliques e leads gerados direto na tabela de campanhas.' }
      ],
      tips: [
        'Acompanhe o status da campanha. Se pausá-la no MedTraffic, o Google Ads interrompe a cobrança imediatamente.',
        'Sempre monitore as palavras-chave para negativar termos irrelevantes no painel do Google Ads.'
      ]
    },
    {
      id: 'google-2',
      category: 'google',
      title: 'Diretrizes Éticas e de Conformidade (CFP / CFM)',
      summary: 'Como anunciar respeitando os limites éticos do conselho profissional.',
      content: [
        'A publicidade médica e psicológica possui regras rígidas que proíbem o mercantilismo e garantem a veracidade das informações.',
        'Descubra como estruturar sua presença digital respeitando essas diretrizes.'
      ],
      steps: [
        { title: '1. Nunca Prometa Resultados Garantidos', desc: 'Evite expressões como "cura garantida", "solução definitiva" ou "tratamento infalível".' },
        { title: '2. Foco Informativo e Educativo', desc: 'Escreva textos focados em esclarecer dúvidas de saúde, acolhimento e bem-estar, mantendo tom profissional.' },
        { title: '3. Identificação Legal Obrigatória', desc: 'Sua página de captura deve expor de forma clara seu nome completo, registro do conselho profissional (ex: CRP ou COREN/CFM) e a sigla do estado.' },
        { title: '4. Não use Preços como Barganha', desc: 'É proibido expor tabelas de valores promocionais, descontos agressivos ou pacotes fechados de consultas no anúncio.' }
      ],
      tips: [
        'Nosso gerador de conteúdo com IA possui guardrails semânticos automáticos que bloqueiam termos proibidos e convertem em terminologias éticas e informativas.'
      ]
    },
    {
      id: 'medtraffic-1',
      category: 'medtraffic',
      title: 'Gerenciando Leads no CRM e Conformidade LGPD',
      summary: 'Como gerenciar seus leads e obter segurança jurídica total de consentimento.',
      content: [
        'A plataforma automatiza a captação e organiza seus contatos para facilitar o agendamento de consultas.'
      ],
      steps: [
        { title: '1. Captura com Consentimento', desc: 'O formulário de contato da sua Landing Page obriga o visitante a marcar explicitamente a aceitação dos termos de privacidade.' },
        { title: '2. Registro do ConsentLog', desc: 'Para cada lead criado, o MedTraffic salva o IP do visitante, o navegador, a data e hora exatas e gera um Hash SHA-256 criptográfico único.' },
        { title: '3. Organização no Funil Kanban', desc: 'No menu "CRM de Leads", acompanhe os contatos divididos em colunas (Novo, Em Contato, Agendado, Convertido, Perdido) movendo os cards livremente.' },
        { title: '4. Atalho de WhatsApp Rápido', desc: 'Abra a ficha do lead ou clique no ícone de WhatsApp no card para abrir o chat de conversa imediatamente no seu celular.' },
        { title: '5. Exportação de Backups', desc: 'Caso queira auditar seus leads ou migrá-los, clique em "Exportar Leads" para baixar a planilha CSV contendo todos os dados, inclusive os hashes da LGPD.' }
      ],
      tips: [
        'Mantenha o status dos leads atualizado no CRM para que os gráficos de faturamento e conversão do Dashboard Geral fiquem corretos.'
      ]
    },
    {
      id: 'medtraffic-2',
      category: 'medtraffic',
      title: 'Sincronização de Agenda & WhatsApp',
      summary: 'Automatize avisos de reuniões e confirmações de consultas.',
      content: [
        'Aumente a conversão integrando a agenda de consultas com o envio automático de notificações no WhatsApp.'
      ],
      steps: [
        { title: '1. Conecte seu Google Agenda', desc: 'Acesse "Agenda de Consultas", clique em "Conectar Google Agenda" e aprove o consentimento OAuth2 simulado.' },
        { title: '2. Pareie seu WhatsApp Pessoal', desc: 'Acesse "Automação WhatsApp", preencha os dados e clique em gerar QR Code. Escaneie o código pelo seu aplicativo de celular.' },
        { title: '3. Captura Automática na LP', desc: 'O paciente pré-agenda uma data e horário diretamente pelo formulário de contato público da Landing Page.' },
        { title: '4. Confirmação com Google Meet', desc: 'Na lista de consultas Pendentes, clique em "Confirmar Consulta". O sistema cria o evento na agenda, gera um link dinâmico do Google Meet e atualiza o CRM.' },
        { title: '5. Disparo de WhatsApp', desc: 'O sistema dispara mensagens automáticas para o número do paciente com mensagens personalizadas de boas-vindas, confirmação (contendo o link do Meet) e cancelamento.' }
      ],
      tips: [
        'Se o WhatsApp desconectar, o card indicador na barra lateral esquerda mudará para "Desconectado" (cinza). Basta acessar a aba de automação e re-escanear o QR Code.'
      ]
    }
  ], []);

  // FAQ / Perguntas Frequentes
  const faqs: FaqItem[] = useMemo(() => [
    {
      id: 'faq-1',
      category: 'concepts',
      question: 'Eu preciso pagar ao Google/Meta além da assinatura do MedTraffic?',
      answer: 'Sim. A assinatura do MedTraffic cobre o uso dos nossos recursos de software (gerador de páginas, CRM, automação de WhatsApp e IA). Os custos de exibição dos anúncios (orçamento de mídia) são cobrados e pagos diretamente ao Google Ads ou Meta Ads, através da conta de anúncios que você conectar na plataforma.'
    },
    {
      id: 'faq-2',
      category: 'google',
      question: 'O que acontece se eu usar palavras proibidas pelo meu conselho nos anúncios?',
      answer: 'O Google Ads ou Meta Ads podem rejeitar a veiculação do anúncio ou, em casos graves de denúncia profissional, o conselho de classe (como o CFP) pode abrir um processo ético. Por isso, utilize sempre as sugestões de copy recomendadas por nossa IA, que já passam por um filtro semântico estrito de guardrails.'
    },
    {
      id: 'faq-3',
      category: 'medtraffic',
      question: 'Como faço para configurar meu domínio próprio (ex: www.meunome.com.br)?',
      answer: 'No card da sua Landing Page na aba "Páginas de Captura", clique em "Configurar" e digite o seu domínio personalizado. Em seguida, você precisará acessar o painel de registro onde comprou o domínio (ex: Registro.br) e apontar a entrada CNAME para o nosso servidor. A plataforma gerará e renovará o certificado SSL (HTTPS) de forma automática.'
    },
    {
      id: 'faq-4',
      category: 'medtraffic',
      question: 'Como funciona a exportação de leads do CRM?',
      answer: 'Na tela "CRM de Leads", basta clicar no botão "Exportar Leads" no canto superior direito. O sistema gerará um arquivo `.csv` codificado em UTF-8 com todas as informações dos contatos, status do funil, origem de tráfego e os dados criptográficos de consentimento da LGPD.'
    },
    {
      id: 'faq-5',
      category: 'medtraffic',
      question: 'O que é o botão de Terminal (Visualizar Logs) nas campanhas?',
      answer: 'É uma ferramenta de auditoria técnica. Clicar no botão "Terminal" abre um painel que exibe a requisição e a resposta em formato JSON bruto que a plataforma trocou com os servidores do Google ou Meta Ads. É útil para validar se as configurações da sua campanha foram enviadas com sucesso.'
    }
  ], []);

  // Base de respostas detalhadas do assistente virtual
  const chatbotResponses = useMemo(() => [
    {
      keywords: ['whatsapp', 'zap', 'evolution', 'z-api', 'qr code', 'conectar celular', 'parear', 'instancia', 'instância'],
      answer: 'Para configurar e conectar seu WhatsApp no MedTraffic:\n\n' +
        '1. Acesse o menu "Automação WhatsApp" no painel lateral esquerdo.\n' +
        '2. Digite um nome para a sua instância (ex: "Consultório Ana") e selecione o provedor (Evolution API ou Z-API).\n' +
        '3. Clique em "Gerar Instância & Conectar". O sistema criará as credenciais e exibirá um QR Code.\n' +
        '4. Abra o WhatsApp no seu smartphone, acesse "Aparelhos Conectados" e clique em "Conectar um Aparelho".\n' +
        '5. Escaneie o QR Code na tela. O status mudará imediatamente para "Conectado (verde)".\n' +
        '6. Ative os switches para habilitar disparos automáticos de boas-vindas para novos leads, confirmações de consulta e avisos de cancelamento.'
    },
    {
      keywords: ['lgpd', 'consent', 'consentlog', 'privacidade', 'segurança', 'hash', 'sha256', 'lei geral'],
      answer: 'O ConsentLog é o registro que garante a segurança jurídica do seu consultório perante a LGPD:\n\n' +
        '1. Quando um visitante preenche o formulário da sua Landing Page, ele precisa marcar obrigatoriamente a caixa de aceitação dos termos de privacidade.\n' +
        '2. O MedTraffic cria um log inalterável no banco de dados contendo o endereço IP do lead, o navegador/dispositivo, data/hora e gera um Hash SHA-256 criptográfico único.\n' +
        '3. Esse Hash comprova legalmente que o lead consentiu com o contato comercial.\n' +
        '4. Você pode exportar ou consultar esses dados a qualquer momento na aba do CRM Kanban clicando em "Exportar Leads" ou acessando o Painel Admin.'
    },
    {
      keywords: ['agenda', 'sincronizar', 'conectar google', 'meet', 'google agenda', 'calendar', 'consulta', 'calendario', 'reunião', 'compromisso'],
      answer: 'Para sincronizar sua agenda com o Google Calendar e gerar salas do Google Meet:\n\n' +
        '1. Vá na aba "Agenda de Consultas" no menu lateral.\n' +
        '2. No painel superior, clique no botão "Conectar Google Agenda".\n' +
        '3. Faça o login na conta do Google pelo modal de consentimento simulado e autorize o acesso.\n' +
        '4. Com o status "Conectado", os agendamentos feitos pelos leads na sua Landing Page aparecerão na aba de Pendentes.\n' +
        '5. Ao clicar em "Confirmar Consulta", o MedTraffic cria o evento automaticamente na sua agenda e gera um link exclusivo do Google Meet.'
    },
    {
      keywords: ['rejeitado', 'reprovado', 'bloqueado', 'anúncio', 'anuncio', 'ads', 'google ads', 'meta ads', 'política', 'diretriz', 'ética', 'etica', 'cfp', 'cfm', 'coren', 'conselho', 'proibido'],
      answer: 'Se o seu anúncio foi rejeitado ou você quer evitar bloqueios dos conselhos de saúde (CFP/CFM):\n\n' +
        '1. Não prometa resultados garantidos (como "cura garantida" ou "elimine a ansiedade em 3 sessões").\n' +
        '2. Não anuncie preços ou descontos promocionais como barganha comercial.\n' +
        '3. Exiba seu registro profissional (CRP/COREN/CFM) e estado visivelmente (o MedTraffic faz isso automaticamente no rodapé da Landing Page).\n' +
        '4. Utilize as Sugestões de Copy de IA do MedTraffic. Nossa inteligência artificial possui um filtro semântico de guardrail ético que higieniza e substitui termos agressivos por linguagem informativa e acolhedora.'
    },
    {
      keywords: ['landing page', 'criar pagina', 'editar pagina', 'subdominio', 'dominio', 'cname', 'customizar', 'editor', 'bloco', 'headline', 'faq', 'beneficios', 'template', 'layout'],
      answer: 'Como gerenciar suas Landing Pages (páginas de captura):\n\n' +
        '1. Acesse "Páginas de Captura" no menu lateral.\n' +
        '2. Clique em "Criar Nova Página" para escolher um template do seu nicho (psicólogo ou cuidador) e registrar um subdomínio (ex: ana-psico).\n' +
        '3. Clique em "Editar Conteúdo" no card da página para acessar o editor visual side-by-side.\n' +
        '4. No painel esquerdo, customize headlines, subheadlines, adicione ou remova itens de Benefícios e Perguntas Frequentes (FAQ).\n' +
        '5. No painel direito, visualize o design da página e alterne entre a visualização desktop e mobile para conferir a responsividade antes de salvar.'
    },
    {
      keywords: ['crm', 'kanban', 'funil', 'leads', 'leads_export', 'exportar', 'csv', 'backup', 'baixar planilha', 'planilha'],
      answer: 'O CRM Kanban do MedTraffic ajuda a gerenciar os leads recebidos:\n\n' +
        '1. Visualização: Seus leads ficam organizados em colunas (Novo, Em Contato, Agendado, Convertido, Perdido).\n' +
        '2. Movimentação: Mova os cartões por arrastar-e-soltar de acordo com a etapa de negociação.\n' +
        '3. Contato: Clique no ícone de WhatsApp no card do lead para iniciar um chat imediatamente no celular.\n' +
        '4. Exportação: Clique no botão "Exportar Leads" no topo direito do Kanban para baixar uma planilha CSV contendo todos os dados e logs de consentimento da LGPD.'
    },
    {
      keywords: ['faturamento', 'assinar', 'plano', 'mensalidade', 'pagar', 'pagamento', 'pix', 'recebido', 'nfse', 'nfs-e', 'nota fiscal', 'asaas', 'recibo'],
      answer: 'Sobre assinaturas e faturamento no MedTraffic:\n\n' +
        '1. Acesse a aba "Assinatura e Planos" para visualizar seu status ativo ou inativo.\n' +
        '2. Escolha entre os planos Profissional ou Premium e clique em "Assinar Plano".\n' +
        '3. O sistema gerará um QR Code PIX e chave copia e cola do gateway Asaas.\n' +
        '4. Em ambiente de desenvolvimento local, clique no botão "Confirmar Pagamento (Simulação)" para ativar sua conta.\n' +
        '5. O status mudará para "Assinatura Ativa" e as faturas pagas estarão disponíveis na tabela abaixo, com links diretos para visualização fictícia da NFS-e.'
    }
  ], []);

  // Dúvidas comuns para o Chatbot Simulado
  const chatbotPrompts = useMemo(() => [
    { q: 'Como configuro meu WhatsApp?', a: chatbotResponses[0].answer },
    { q: 'Por que meu anúncio foi rejeitado?', a: chatbotResponses[3].answer },
    { q: 'O que é o ConsentLog da LGPD?', a: chatbotResponses[1].answer },
    { q: 'Como sincronizo minha agenda?', a: chatbotResponses[2].answer }
  ], [chatbotResponses]);

  // Filtros aplicados
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesTab = activeTab === 'all' || art.category === activeTab;
      const matchesSearch = searchQuery === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [articles, activeTab, searchQuery]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesTab = activeTab === 'all' || faq.category === activeTab;
      const matchesSearch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [faqs, activeTab, searchQuery]);

  // Função para retornar a resposta apropriada com base na pergunta
  const getBotResponse = (query: string): string => {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Procurar correspondência de palavra-chave na nossa base enriquecida
    for (const item of chatbotResponses) {
      if (item.keywords.some(kw => cleanQuery.includes(kw))) {
        return item.answer;
      }
    }

    // 2. Verificar se a pergunta tem algum contexto relevante à plataforma
    const platformTerms = [
      'medtraffic', 'plataforma', 'sistema', 'site', 'página', 'anuncio', 'anúncio', 'ads', 'campanha',
      'lead', 'contato', 'crm', 'kanban', 'agenda', 'calendar', 'google', 'meet', 'whatsapp', 'zap',
      'evolution', 'z-api', 'qr code', 'conectar', 'sincronizar', 'faturamento', 'pagamento', 'pix',
      'plano', 'assinatura', 'perfil', 'registro', 'crp', 'coren', 'cfm', 'ética', 'etica', 'lgpd',
      'consentlog', 'hash', 'exportar', 'csv', 'editor', 'landing page', 'lp', 'como faço', 'ajuda', 'tutorial'
    ];

    const hasPlatformContext = platformTerms.some(term => cleanQuery.includes(term));

    if (hasPlatformContext) {
      return 'Entendi que você está buscando ajuda com a plataforma MedTraffic. Para que eu possa te responder detalhadamente, por favor faça uma pergunta específica sobre um dos seguintes recursos:\n\n' +
        '• WhatsApp (QR Code, conexão, instâncias)\n' +
        '• Google Agenda & Meet (sincronização e videoconferências)\n' +
        '• Landing Pages (criação, edição e domínio personalizado)\n' +
        '• CRM Funil de Leads & LGPD (ConsentLog e exportação CSV)\n' +
        '• Campanhas de Anúncios (Google Ads, Meta Ads e ética CFP/CFM)\n' +
        '• Assinaturas (Planos, faturas e simulação PIX)';
    }

    // 3. Resposta de fora do escopo (off-topic disclaimer)
    return 'Peço desculpas! Minha função é estritamente voltada para esclarecer dúvidas sobre o uso da plataforma MedTraffic e conceitos de tráfego digital para profissionais de saúde.\n\n' +
      'Não posso responder a perguntas sobre outros assuntos fora deste escopo. Como posso ajudar você com o MedTraffic hoje?';
  };

  // Efeito de digitação suave palavra por palavra
  const triggerBotResponse = (response: string) => {
    setIsTyping(true);
    
    // Adiciona a mensagem inicial vazia do bot
    setChatHistory(prev => [...prev, { sender: 'bot', text: '' }]);
    
    let currentText = '';
    const words = response.split(' ');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        setChatHistory(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { sender: 'bot', text: currentText };
          return copy;
        });
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 45); // 45ms por palavra: efeito rápido, humanizado e extremamente fluido!
  };

  const handlePromptClick = (question: string, answer: string) => {
    if (isTyping) return;
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: question }
    ]);
    triggerBotResponse(answer);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userText = chatInput;
    setChatInput('');

    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);

    const response = getBotResponse(userText);
    triggerBotResponse(response);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Banner Superior */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.12),transparent_50%)] pointer-events-none" />
        <div className="space-y-4 max-w-lg text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-clinical-500/10 border border-clinical-500/20 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            Central de Auto-Ajuda
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Como podemos ajudar <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">você hoje?</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Entenda o funcionamento de tráfego digital pago e tire suas dúvidas técnicas sobre cada recurso do painel MedTraffic.
          </p>
        </div>

        {/* Input de busca */}
        <div className="w-full max-w-md relative shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar guias, recursos ou palavras-chave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 focus:border-clinical-500/40 text-slate-200 text-sm rounded-2xl pl-12 pr-4 py-4 outline-none transition-all duration-200"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-500 hover:text-slate-300"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Grid Central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo - Artigos e Tutoriais */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Navegação de Abas */}
          <div className="flex gap-2 p-1 bg-slate-900/40 border border-slate-900 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide shrink-0 transition-all duration-200 ${
                activeTab === 'all' 
                  ? 'bg-clinical-500/10 text-teal-400 border border-clinical-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Todos os Guias
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide shrink-0 transition-all duration-200 ${
                activeTab === 'concepts' 
                  ? 'bg-clinical-500/10 text-teal-400 border border-clinical-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Conceitos de Tráfego
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide shrink-0 transition-all duration-200 ${
                activeTab === 'google' 
                  ? 'bg-clinical-500/10 text-teal-400 border border-clinical-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Google Ads e Regras
            </button>
            <button
              onClick={() => setActiveTab('medtraffic')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide shrink-0 transition-all duration-200 ${
                activeTab === 'medtraffic' 
                  ? 'bg-clinical-500/10 text-teal-400 border border-clinical-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Manual da Plataforma
            </button>
          </div>

          {/* Listagem de Artigos */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 px-1">
              <BookOpen className="h-5 w-5 text-clinical-500" />
              Guias de Aprendizado ({filteredArticles.length})
            </h2>

            {filteredArticles.length === 0 ? (
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-12 text-center text-slate-500">
                <Info className="h-8 w-8 mx-auto text-slate-600 mb-3" />
                Nenhum guia encontrado para a busca atual.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <div 
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="group bg-slate-900/30 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 p-6 rounded-3xl flex flex-col justify-between gap-4 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-clinical-500/5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          art.category === 'concepts' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          art.category === 'google' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        }`}>
                          {art.category === 'concepts' ? 'Tráfego' :
                           art.category === 'google' ? 'Google Ads' : 'Manual'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-clinical-400 transition-colors duration-200">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {art.summary}
                      </p>
                    </div>

                    <div className="border-t border-slate-900/60 pt-4 mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold group-hover:text-teal-400 transition-colors duration-200">Ver Passo a Passo</span>
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-200">&rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acordeão de FAQ */}
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 px-1">
              <ShieldAlert className="h-5 w-5 text-clinical-500" />
              Perguntas Frequentes (FAQ)
            </h2>

            {filteredFaqs.length === 0 ? (
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-12 text-center text-slate-500">
                Nenhuma pergunta frequente encontrada.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedFaq === faq.id;
                  return (
                    <div 
                      key={faq.id} 
                      className="bg-slate-900/20 hover:bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                      >
                        <span className="text-sm font-bold text-slate-200 hover:text-white transition-colors duration-150">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-900/60 pt-4 bg-slate-950/40 whitespace-pre-line">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Lado Direito - Assistente Virtual Simulado */}
        <div className="space-y-8">
          
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between h-[520px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            
            {/* Header do Chat */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-900 shrink-0 z-10">
              <div className="bg-gradient-to-tr from-clinical-500 to-indigo-500 p-2 rounded-xl text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Assistente MedTraffic</h3>
                <span className="text-[10px] text-teal-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Auto-ajuda online
                </span>
              </div>
            </div>

            {/* Corpo das Mensagens */}
            <div 
              ref={chatContainerRef}
              className="flex-grow my-4 overflow-y-auto space-y-3.5 pr-2 z-10 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {chatHistory.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    msg.sender === 'user' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-clinical-500/10 text-teal-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[80%] whitespace-pre-line ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600/15 text-indigo-200 rounded-tr-none border border-indigo-500/25' 
                      : 'bg-slate-950/60 text-slate-300 rounded-tl-none border border-slate-900'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Prompts / Atalhos rápidos */}
            <div className="py-2.5 border-t border-slate-900/60 shrink-0 space-y-1.5 z-10">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Perguntas Comuns:</div>
              <div className="flex flex-wrap gap-1.5">
                {chatbotPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(p.q, p.a)}
                    disabled={isTyping}
                    className="text-[9px] font-bold bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-800 text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg transition-all duration-150 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input de Envio */}
            <form onSubmit={handleSendChat} className="flex gap-2 border-t border-slate-900 pt-4 shrink-0 z-10">
              <input
                type="text"
                placeholder={isTyping ? "Digitando resposta..." : "Pergunte ao assistente..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                className="flex-grow bg-slate-950 border border-slate-900 focus:border-clinical-500/30 rounded-xl px-3.5 py-2.5 text-[11px] outline-none text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="bg-clinical-500 hover:bg-clinical-600 text-white p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Dicas Rápidas de Tráfego */}
          <div className="bg-gradient-to-tr from-slate-900/40 to-indigo-950/20 border border-slate-900 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Regras do Sucesso do Tráfego
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-500/10 text-emerald-400 p-1 rounded font-bold text-[10px]">1</span>
                <span>Foque em um raio de 5 a 10 km do seu consultório ou região de atendimento domiciliar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-500/10 text-emerald-400 p-1 rounded font-bold text-[10px]">2</span>
                <span>Use as copys geradas pela IA pois elas já possuem as tags de ética (guardrails) do CFM e CFP.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-500/10 text-emerald-400 p-1 rounded font-bold text-[10px]">3</span>
                <span>Conecte o WhatsApp para responder os leads em menos de 5 minutos, aumentando as chances de fechamento em até 80%.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Modal de Detalhe do Artigo / Manual e Passo a Passo */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 relative shadow-2xl scrollbar-thin scrollbar-thumb-slate-800">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950/40 p-2 rounded-full border border-slate-800/80 transition-all duration-150"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Cabeçalho */}
            <div className="space-y-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                selectedArticle.category === 'concepts' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                selectedArticle.category === 'google' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              }`}>
                {selectedArticle.category === 'concepts' ? 'Conceito de Tráfego' :
                 selectedArticle.category === 'google' ? 'Google Ads & Configuração' : 'Manual MedTraffic'}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedArticle.summary}
              </p>
            </div>

            {/* Conteúdo Introdução */}
            <div className="space-y-3 border-t border-slate-800/60 pt-4">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Passo a Passo Detalhado */}
            {selectedArticle.steps && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-400" />
                  Passo a Passo Recomendado
                </h3>
                <div className="space-y-4 bg-slate-950/40 border border-slate-950 p-5 rounded-2xl">
                  {selectedArticle.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="bg-clinical-500/15 border border-clinical-500/20 text-teal-400 font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">{step.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dicas Extras */}
            {selectedArticle.tips && (
              <div className="space-y-3 bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Dica de Especialista
                </h4>
                {selectedArticle.tips.map((tip, idx) => (
                  <p key={idx} className="text-[11px] text-indigo-300 leading-relaxed">
                    {tip}
                  </p>
                ))}
              </div>
            )}

            {/* Rodapé do Modal */}
            <div className="pt-4 border-t border-slate-800/60 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-clinical-500 hover:bg-clinical-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                Entendi, Fechar Guia
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
