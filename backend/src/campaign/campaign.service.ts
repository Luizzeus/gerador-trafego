import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Conectar conta de anúncios (Mock OAuth2)
  async connectAccount(userId: string, provider: string, accountName: string, accountId: string) {
    if (provider !== 'google_ads' && provider !== 'meta_ads') {
      throw new BadRequestException('Provedor de anúncios inválido.');
    }

    const mockAccessToken = `mock_access_token_${provider}_${Math.random().toString(36).substring(2, 10)}`;
    const mockRefreshToken = `mock_refresh_token_${provider}_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias de expiração

    return this.prisma.adsCredential.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      update: {
        accountName,
        accountId,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        expiresAt,
        status: 'connected',
      },
      create: {
        userId,
        provider,
        accountName,
        accountId,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        expiresAt,
        status: 'connected',
      },
    });
  }

  // 2. Desconectar conta de anúncios
  async disconnectAccount(userId: string, provider: string) {
    try {
      return await this.prisma.adsCredential.delete({
        where: {
          userId_provider: {
            userId,
            provider,
          },
        },
      });
    } catch {
      throw new NotFoundException('Conexão não encontrada ou já desconectada.');
    }
  }

  // 3. Obter conexões de anúncios do usuário
  async getConnections(userId: string) {
    const credentials = await this.prisma.adsCredential.findMany({
      where: { userId },
      select: {
        provider: true,
        accountName: true,
        accountId: true,
        status: true,
        createdAt: true,
      },
    });
    return credentials;
  }

  // 4. Criar campanha
  async createCampaign(
    userId: string,
    data: { name: string; channel: string; landingPageId: string; budget: number; targetKeywords?: string }
  ) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new BadRequestException('Você precisa configurar um perfil profissional antes de criar campanhas.');
    }

    // Verifica se a Landing Page existe e pertence ao usuário
    const lp = await this.prisma.landingPage.findFirst({
      where: {
        id: data.landingPageId,
        professionalProfile: {
          userId,
        },
      },
    });

    if (!lp) {
      throw new NotFoundException('Landing Page não encontrada ou não pertence ao seu perfil.');
    }

    // Busca credenciais da conta de anúncios para o canal
    let adsAccountCredentialsId: string | null = null;
    if (data.channel === 'google_ads' || data.channel === 'meta_ads') {
      const cred = await this.prisma.adsCredential.findUnique({
        where: {
          userId_provider: {
            userId,
            provider: data.channel,
          },
        },
      });

      if (!cred || cred.status !== 'connected') {
        throw new BadRequestException(
          `Sua conta do ${data.channel === 'google_ads' ? 'Google Ads' : 'Meta Ads'} não está conectada. Conecte-a primeiro.`
        );
      }
      adsAccountCredentialsId = cred.id;
    }

    return this.prisma.campaign.create({
      data: {
        userId,
        landingPageId: data.landingPageId,
        name: data.name,
        channel: data.channel,
        adsAccountCredentialsId,
        budget: data.budget,
        targetKeywords: data.targetKeywords || '',
        status: 'active', // Cria a campanha já ativa
      },
    });
  }

  // 5. Listar campanhas com geração de métricas simuladas
  async getCampaigns(userId: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { userId },
      include: {
        landingPage: {
          select: {
            title: true,
            subdomain: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Injeta estatísticas simuladas
    return campaigns.map((campaign) => {
      const metrics = this.generateSimulatedMetrics(campaign);
      return {
        ...campaign,
        metrics,
      };
    });
  }

  // 6. Atualizar status da campanha
  async updateCampaignStatus(userId: string, id: string, status: string) {
    if (status !== 'active' && status !== 'paused') {
      throw new BadRequestException('Status inválido. Use "active" ou "paused".');
    }

    const campaign = await this.prisma.campaign.findFirst({
      where: { id, userId },
    });

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada.');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status },
    });
  }

  // 7. Excluir campanha
  async deleteCampaign(userId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, userId },
    });

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada.');
    }

    return this.prisma.campaign.delete({
      where: { id },
    });
  }

  // Função auxiliar para gerar métricas de performance simuladas realistas
  private generateSimulatedMetrics(campaign: any) {
    const now = new Date().getTime();
    const createdTime = new Date(campaign.createdAt).getTime();
    
    // Calcula a diferença em dias (mínimo de 0.2 dias para campanhas novas)
    const diffDays = Math.max(0.2, (now - createdTime) / (1000 * 60 * 60 * 24));
    
    // Se a campanha estiver em rascunho, retorna métricas zeradas
    if (campaign.status === 'draft') {
      return {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        spend: 0,
        conversions: 0,
        cpc: 0,
      };
    }

    // Semente determinística baseada no ID da campanha para manter as métricas consistentes entre reloads no mesmo dia
    const seed = campaign.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const random = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    // Fatores de flutuação baseados no seed
    const ctrFactor = 0.025 + random(1) * 0.035; // CTR entre 2.5% e 6.0%
    const cpcFactor = 0.5 + random(2) * 1.0;     // CPC entre R$ 0.50 e R$ 1.50
    const convRate = 0.05 + random(3) * 0.08;    // Conversão entre 5% e 13%

    // Se a campanha foi pausada, limitamos as métricas simuladas ao equivalente a 1 dia ou ao tempo que ela rodou ativa
    const activeDays = campaign.status === 'paused' ? Math.min(diffDays, 1.5) : diffDays;

    // Orçamento consumido (flutua entre 85% e 100% do orçamento diário)
    const spendPerDay = campaign.budget * (0.85 + random(4) * 0.15);
    const spend = Math.round(spendPerDay * activeDays * 100) / 100;

    // Cliques estimulados a partir do gasto e CPC médio
    const clicks = Math.max(1, Math.round(spend / cpcFactor));

    // Impressões estimadas a partir dos cliques e CTR
    const impressions = Math.round(clicks / ctrFactor);

    // CTR real recalculado
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0;

    // Conversões estimadas
    const conversions = Math.round(clicks * convRate);

    // CPC real recalculado
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0;

    return {
      impressions,
      clicks,
      ctr,
      spend,
      conversions,
      cpc,
    };
  }
}
