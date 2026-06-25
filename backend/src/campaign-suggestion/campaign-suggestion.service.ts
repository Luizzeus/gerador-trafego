import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignSuggestionService {
  constructor(private readonly prisma: PrismaService) {}

  // Lista de palavras proibidas pelo CFP/CFM (Guardrail Ético)
  private forbiddenTerms = [
    { pattern: /\bcura\b/gi, replacement: 'melhora na qualidade de vida' },
    { pattern: /\bmilagre\b/gi, replacement: 'processo terapêutico' },
    { pattern: /\binfal[ií]vel\b/gi, replacement: 'cientificamente respaldado' },
    { pattern: /\bdefinitivo\b/gi, replacement: 'contínuo e estruturado' },
    { pattern: /\bgarantido\b/gi, replacement: 'focado em resultados éticos' },
    { pattern: /\bcura imediata\b/gi, replacement: 'cuidado continuado' },
    { pattern: /\bdiagn[oó]stico imediato\b/gi, replacement: 'avaliação profissional' },
    { pattern: /\bdiagn[oó]stico online\b/gi, replacement: 'escuta clínica inicial' },
  ];

  // Aplica o Guardrail de Higienização nos Textos
  private applySemanticGuardrail(text: string): string {
    let sanitizedText = text;
    for (const term of this.forbiddenTerms) {
      sanitizedText = sanitizedText.replace(term.pattern, term.replacement);
    }
    return sanitizedText;
  }

  async generate(userId: string) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil profissional não encontrado. Configure seu perfil antes de gerar sugestões.');
    }

    const city = profile.addressCity || 'sua região';
    const isPsychologist = profile.niche === 'psychologist';

    // Modelagem das Sugestões com base no Nicho do usuário
    let googleAdsSuggestions = [];
    let metaAdsSuggestions = [];
    let socialMediaPost = '';
    let videoScript = '';

    if (isPsychologist) {
      googleAdsSuggestions = [
        {
          title: `Psicologia em ${city} | Dra. ${profile.fullName.split(' ').slice(-2).join(' ')}`,
          description: `Atendimento ético focado em saúde mental e inteligência emocional em ${city}. Agende uma primeira consulta presencial ou por videoconferência.`,
          keywords: `psicólogo em ${city}, terapia de ansiedade, psicólogo clínico ${city}, terapia cognitivo comportamental, psicólogo online`,
        },
        {
          title: `Terapia de Ansiedade | Consulta com Psicólogo`,
          description: `Aprenda a gerenciar sintomas de estresse e ansiedade com suporte clínico qualificado. Agende sua primeira sessão individual online.`,
          keywords: `tratamento de ansiedade, terapia online, psicólogo particular, consultório de psicologia, marcar psicólogo`,
        }
      ];

      metaAdsSuggestions = [
        {
          primaryText: `Muitas vezes, a correria do dia a dia nos impede de olhar para aquilo que mais importa: nossa saúde mental. Se você está enfrentando momentos de estresse intenso ou sente que a ansiedade está dominando sua rotina, saiba que não precisa passar por isso sozinho. O processo terapêutico é um espaço seguro e sigiloso para cuidarmos do seu bem-estar emocional.`,
          headline: `Apoio Clínico e Psicoterapia em ${city}`,
          description: `Atendimento presencial e online | Agende sua sessão inicial.`,
          creativeGuidance: `Imagem clean com iluminação natural, transmitindo tranquilidade e acolhimento. Evitar imagens com pessoas com semblante de dor extrema ou choro para não mercantilizar a dor alheia.`,
        }
      ];

      socialMediaPost = `Você sabia que a psicoterapia vai muito além de "desabafar"? 🤔\n\nDiferente de uma conversa com amigos, a terapia clínica oferece escuta qualificada, livre de julgamentos e baseada em evidências científicas. É um processo contínuo de autoconhecimento que ajuda a identificar padrões de comportamento e desenvolver recursos internos para lidar com os desafios cotidianos.\n\nSe você sente que é o momento de dar atenção à sua mente, agende uma avaliação.\n\n#saudemental #psicoterapia #autoconhecimento #bemestar #psicologia`;

      videoScript = `[Gancho - 3 segundos]\nVocê sabia que tentar "dar conta de tudo sozinho" pode ser o maior gatilho para a sua ansiedade?\n\n[Introdução - 10 segundos]\nOlá, sou a Dra. ${profile.fullName.split(' ').slice(-2).join(' ')}, psicóloga clínica em ${city}. Quero te convidar a refletir sobre o peso de carregar todas as pressões do dia a dia sem um suporte adequado.\n\n[Desenvolvimento - 30 segundos]\nMuita gente acredita que terapia é só para momentos de crise extrema. A verdade é que a terapia atua de forma preventiva. Ela te ajuda a entender de onde vem o estresse, a ansiedade e como organizar seus pensamentos para recuperar o equilíbrio.\n\n[Chamada para Ação - 15 segundos]\nSe você quer iniciar essa jornada de autocuidado, clique no link da bio e entre em contato via WhatsApp para alinharmos um horário. Cuidar de você é o primeiro passo.`;

    } else {
      // Nicho: Cuidador / Home Care
      googleAdsSuggestions = [
        {
          title: `Cuidadores de Idosos em ${city} | Assistência Domiciliar`,
          description: `Profissionais de cuidados qualificados e com referências em ${city}. Plantões flexíveis de 12h, 24h ou acompanhamento hospitalar. Fale conosco.`,
          keywords: `cuidador de idosos em ${city}, cuidador domiciliar, empresa de home care ${city}, acompanhante de idosos, cuidador noturno`,
        },
        {
          title: `Assistência e Cuidado Domiciliar | MedTraffic Home`,
          description: `Proporcione segurança e acolhimento familiar para quem você ama. Cuidadores checados e especializados em rotina de idosos.`,
          keywords: `cuidador home care, assistência a idosos, cuidador de idosos particular, cuidador pós operatório, cuidador em ${city}`,
        }
      ];

      metaAdsSuggestions = [
        {
          primaryText: `Conciliar a rotina de trabalho e os cuidados especiais que nossos pais ou familiares idosos precisam nem sempre é fácil. A contratação de um cuidador domiciliar qualificado proporciona não apenas a assistência nas rotinas de medicação, alimentação e higiene, mas traz de volta a tranquilidade que a sua família merece. Nossos profissionais são rigorosamente checados e capacitados.`,
          headline: `Cuidadores de Idosos e Assistência em ${city}`,
          description: `Plantões flexíveis e suporte hospitalar | Solicite contato.`,
          creativeGuidance: `Foto humanizada mostrando um cuidador sorridente auxiliando um idoso em uma atividade agradável (como leitura, caminhada leve ou conversa). Evitar imagens frias de ambiente puramente clínico/hospitalar.`,
        }
      ];

      socialMediaPost = `O envelhecimento ativo exige um olhar cuidadoso e acolhedor. 💙\n\nMais do que auxiliar nas atividades básicas de higiene e medicação, o cuidador domiciliar atua como um facilitador de bem-estar. Estar presente, ouvir histórias, incentivar pequenos exercícios cognitivos e acompanhar com carinho faz toda a diferença na qualidade de vida dos idosos.\n\nQuer entender como funciona a nossa escala de cuidadores? Envie uma mensagem!\n\n#cuidadoresdeidosos #homecare #assistenciadomiciliar #envelhecimentoativo #cuidado`;

      videoScript = `[Gancho - 3 segundos]\nVocê sente dificuldades para conciliar sua rotina profissional com os cuidados que seus pais idosos precisam?\n\n[Introdução - 10 segundos]\nOlá! Sou cuidador especializado em assistência domiciliar em ${city}. Sei que essa conciliação de rotinas gera desgaste e preocupação nas famílias.\n\n[Desenvolvimento - 30 segundos]\nContar com a ajuda de um cuidador profissional não significa afastar-se de quem você ama, mas sim garantir que eles tenham suporte especializado e seguro para alimentação, administração de medicações no horário correto e acompanhamento de mobilidade enquanto você cumpre suas obrigações.\n\n[Chamada para Ação - 15 segundos]\nProporcione tranquilidade para sua família. Clique no botão de contato abaixo ou acesse meu WhatsApp para agendarmos uma entrevista familiar sem compromisso.`;
    }

    // Aplicação estrita do Guardrail Ético em todos os campos gerados
    const sanitizeObject = (obj: any) => {
      const result: any = {};
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          result[key] = this.applySemanticGuardrail(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
      return result;
    };

    return {
      niche: profile.niche,
      googleAds: googleAdsSuggestions.map(sanitizeObject),
      metaAds: metaAdsSuggestions.map(sanitizeObject),
      socialMediaPost: this.applySemanticGuardrail(socialMediaPost),
      videoScript: this.applySemanticGuardrail(videoScript),
    };
  }
}
