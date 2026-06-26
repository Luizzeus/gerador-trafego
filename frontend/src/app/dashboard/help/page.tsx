'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  Play, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send,
  User,
  Bot,
  Info
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
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'concepts' | 'google' | 'medtraffic'>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Estados do Chatbot Simulado
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Olá! Sou o Assistente Virtual do MedTraffic. Selecione uma das dúvidas comuns abaixo ou digite algo no campo para que eu possa te ajudar imediatamente!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Tópicos e Artigos da Central de Ajuda
  const articles: ArticleItem[] = useMemo(() => [
    {
      id: 'concepts-1',
      category: 'concepts',
      title: 'O que é Tráfego Digital?',
      summary: 'Entenda como atrair clientes qualificados de forma contínua para sua página.',
      content: [
        'Tráfego Digital refere-se ao fluxo de usuários que visitam um canal online, como seu site ou Landing Page. Para profissionais de saúde, isso representa o fluxo de potenciais pacientes/clientes que buscam atendimento.',
        '• Tráfego Orgânico: Ocorre naturalmente através de buscas do Google, indicações ou postagens gratuitas nas redes sociais. É sustentável a longo prazo, mas exige bastante tempo para trazer resultados consistentes.',
        '• Tráfego Pago (Anúncios): Consiste em patrocinar links no Google ou criativos no Instagram/Facebook. Você define um orçamento diário para exibir seus serviços para pessoas da sua região que precisam de atendimento imediato, acelerando o retorno.',
        'A plataforma MedTraffic une ambos: fornece Landing Pages otimizadas para SEO (orgânico) e ferramentas de integração para lançar anúncios de forma rápida e simplificada (pago).'
      ]
    },
    {
      id: 'concepts-2',
      category: 'concepts',
      title: 'Diferença entre Google Ads e Meta Ads',
      summary: 'Saiba qual canal é ideal para os seus objetivos de marketing.',
      content: [
        '• Google Ads (Foco em Intenção): O usuário ativamente pesquisa por uma necessidade no buscador (ex: "psicólogo em São Paulo"). Os anúncios respondem diretamente a essa dor, gerando leads com altíssima intenção de contratação.',
        '• Meta Ads - Instagram/Facebook (Foco em Descoberta/Atenção): O usuário está navegando socialmente e é impactado por uma publicação visual atraente ou vídeo explicativo. É excelente para gerar consciência de marca, divulgar especialidades e atrair pacientes de forma espontânea baseada no perfil geográfico.',
        'Recomendamos utilizar o Google Ads para captação direta de serviços emergenciais ou consultas e o Meta Ads para fortalecimento de imagem profissional e conteúdos educativos.'
      ]
    },
    {
      id: 'google-1',
      category: 'google',
      title: 'Como lançar campanhas no Google Ads',
      summary: 'Passo a passo básico para rodar seus primeiros anúncios no Google.',
      content: [
        'Para lançar anúncios do Google direto no MedTraffic, siga as etapas abaixo:',
        '1. Crie ou tenha uma Conta no Google Ads: Acesse ads.google.com e configure seus dados de faturamento (boleto, cartão ou PIX).',
        '2. Conecte sua conta no MedTraffic: No menu lateral "Campanhas", clique em "Configurar Contas (OAuth)" e realize a conexão segura de login com o Google.',
        '3. Defina o Orçamento Diário: Estipule um limite diário (ex: R$ 20,00 ou R$ 30,00). O Google cobrará apenas quando alguém clicar no seu link (CPC).',
        '4. Selecione a Landing Page e as Palavras-Chave: Escolha a LP que receberá os leads e adicione as palavras que disparam seu anúncio.',
        '5. Utilize as Sugestões de IA: O sistema importará automaticamente títulos e descrições otimizados gerados pela inteligência artificial para o formulário de lançamento.'
      ]
    },
    {
      id: 'google-2',
      category: 'google',
      title: 'Diretrizes Éticas e de Conformidade (CFP / CFM)',
      summary: 'Como anunciar respeitando os limites éticos do conselho profissional.',
      content: [
        'Publicidade na área de saúde possui regras rígidas para proteger a integridade dos pacientes. Nosso gerador de conteúdo possui guardrails semânticos automáticos para evitar infrações:',
        '• O que NÃO Fazer: Não prometa "cura garantida", "métodos infalíveis" ou "diagnóstico sem consulta". Não divulgue preços promocionais como barganha ou faça concorrência desleal.',
        '• O que FAZER: Crie anúncios estritamente informativos e educativos. Apresente seus diferenciais com foco no acolhimento e na capacitação técnica.',
        '• Identificação Obrigatória: É lei exibir o seu nome completo, registro do conselho profissional (ex: CRP 06/XXXXX ou COREN) e a Unidade Federativa correspondente de forma visível no rodapé da página.'
      ]
    },
    {
      id: 'medtraffic-1',
      category: 'medtraffic',
      title: 'Gerenciando Leads no CRM e a LGPD',
      summary: 'Como gerenciar seus leads e obter segurança jurídica total de consentimento.',
      content: [
        'A plataforma conta com um CRM Kanban interativo para que você acompanhe o andamento de cada lead, desde a captura até a conversão:',
        '• Colunas do Funil: Mova os cartões por arrastar-e-soltar entre Novo, Em Contato, Agendado, Convertido e Perdido.',
        '• Redirecionamento de WhatsApp: Clique no botão de WhatsApp no card do lead para iniciar uma conversa imediata no celular.',
        '• ConsentLog da LGPD: Para cada lead que se cadastra aceitando seus termos de uso, o sistema registra o IP do visitante, o navegador, a data e hora do envio, gerando um hash SHA-256 inalterável. Isso garante conformidade com a Lei Geral de Proteção de Dados (LGPD) em caso de auditorias.'
      ]
    },
    {
      id: 'medtraffic-2',
      category: 'medtraffic',
      title: 'Sincronização de Agenda & WhatsApp',
      summary: 'Automatize avisos de reuniões e confirmações de consultas.',
      content: [
        '• Google Agenda Sync: Na tela "Agenda de Consultas", conecte sua conta Google via OAuth. Toda vez que você clicar em "Confirmar Consulta" para um lead pendente, o sistema cria automaticamente o evento e gera um link dinâmico do Google Meet.',
        '• Automação de WhatsApp: Conecte o seu número de WhatsApp pessoal via QR Code na aba "Automação WhatsApp". O sistema disparará mensagens de boas-vindas para novos leads, confirmações (incluindo o link do Google Meet) e avisos de cancelamento instantaneamente em segundo plano.'
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

  // Dúvidas comuns para o Chatbot Simulado
  const chatbotPrompts = [
    { q: 'Como configuro meu WhatsApp?', a: 'Para configurar seu WhatsApp, vá na aba "Automação WhatsApp" no menu lateral. Preencha o nome da sua instância, selecione o provedor (Evolution API ou Z-API) e clique em "Gerar Instância & Conectar". Um QR Code será exibido na tela. Abra o WhatsApp no seu celular, vá em "Aparelhos Conectados" > "Conectar um Aparelho" e escaneie o código. O status mudará imediatamente para "Conectado".' },
    { q: 'Por que meu anúncio foi rejeitado?', a: 'Anúncios podem ser rejeitados pelo Google ou Meta caso violem políticas de publicidade de saúde, como uso de linguagem agressiva, promessas irreais de tratamentos ou falta de identificação legal. Certifique-se de preencher seus dados de CRP/COREN no perfil e usar o assistente de IA com guardrail ético ativado para refazer a copy.' },
    { q: 'O que é o ConsentLog da LGPD?', a: 'O ConsentLog é o registro digital da aprovação dos termos de privacidade que o lead aceitou ao preencher seu formulário. Ele fica guardado de forma inalterável no banco de dados contendo IP do lead, data/hora e um Hash SHA-256 criptográfico. Você pode exportar esses dados a qualquer momento pelo CRM para comprovar conformidade legal.' },
    { q: 'Como sincronizo minha agenda?', a: 'Acesse a tela "Agenda de Consultas" e na seção superior clique em "Conectar Google Agenda". Aceite as permissões no fluxo OAuth2 simulado. Com a conta ativa, sempre que você confirmar um agendamento pendente, a plataforma cria um evento na sua agenda e anexa automaticamente um link do Google Meet para a sessão online.' }
  ];

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

  const handlePromptClick = (question: string, answer: string) => {
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: answer }
    ]);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');

    // Adiciona mensagem do usuário
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);

    // Busca correspondência com chatbotPrompts ou dá resposta padrão
    setTimeout(() => {
      const match = chatbotPrompts.find(p => 
        userText.toLowerCase().includes(p.q.toLowerCase()) || 
        p.q.toLowerCase().includes(userText.toLowerCase()) ||
        userText.toLowerCase().split(' ').some(word => word.length > 3 && p.q.toLowerCase().includes(word))
      );

      const botResponse = match 
        ? match.a 
        : `Entendi a sua dúvida sobre "${userText}". Para este caso específico, recomendo consultar os artigos nas abas acima ou verificar o manual completo da plataforma no menu de recursos do MedTraffic.`;

      setChatHistory(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 400);
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
                    className="group bg-slate-900/30 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 p-6 rounded-3xl flex flex-col justify-between gap-4 transition-all duration-300"
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
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="border-t border-slate-900/60 pt-4 mt-2 space-y-3">
                      {art.content.slice(0, 2).map((p, idx) => (
                        <p key={idx} className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {p}
                        </p>
                      ))}
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
                        <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-900/60 pt-4 bg-slate-950/40">
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
            <div className="flex-grow my-4 overflow-y-auto space-y-3.5 pr-2 z-10 scrollbar-thin scrollbar-thumb-slate-800">
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
                  <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[80%] ${
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
                    className="text-[9px] font-bold bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-800 text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg transition-all duration-150"
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
                placeholder="Pergunte ao assistente..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-900 focus:border-clinical-500/30 rounded-xl px-3.5 py-2.5 text-[11px] outline-none text-slate-200"
              />
              <button
                type="submit"
                className="bg-clinical-500 hover:bg-clinical-600 text-white p-2.5 rounded-xl transition-all duration-200"
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

    </div>
  );
}
