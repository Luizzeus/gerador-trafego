import { Controller, Get, Post, Patch, Delete, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaign')
@UseGuards(JwtAuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  // 1. Conectar conta de anúncios (Mock OAuth2)
  @Post('connections')
  async connectAccount(
    @Req() req: any,
    @Body() body: { provider: string; accountName: string; accountId: string }
  ) {
    return this.campaignService.connectAccount(
      req.user.id,
      body.provider,
      body.accountName,
      body.accountId
    );
  }

  // 2. Obter conexões de anúncios do usuário
  @Get('connections')
  async getConnections(@Req() req: any) {
    return this.campaignService.getConnections(req.user.id);
  }

  // 3. Desconectar conta de anúncios
  @Delete('connections/:provider')
  async disconnectAccount(@Req() req: any, @Param('provider') provider: string) {
    return this.campaignService.disconnectAccount(req.user.id, provider);
  }

  // 4. Listar campanhas do usuário
  @Get()
  async getCampaigns(@Req() req: any) {
    return this.campaignService.getCampaigns(req.user.id);
  }

  // 5. Criar nova campanha
  @Post()
  async createCampaign(
    @Req() req: any,
    @Body() body: { name: string; channel: string; landingPageId: string; budget: number; targetKeywords?: string }
  ) {
    return this.campaignService.createCampaign(req.user.id, body);
  }

  // 6. Atualizar status da campanha (Play/Pause)
  @Patch(':id/status')
  async updateCampaignStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.campaignService.updateCampaignStatus(req.user.id, id, body.status);
  }

  // 7. Excluir campanha
  @Delete(':id')
  async deleteCampaign(@Req() req: any, @Param('id') id: string) {
    return this.campaignService.deleteCampaign(req.user.id, id);
  }
}
