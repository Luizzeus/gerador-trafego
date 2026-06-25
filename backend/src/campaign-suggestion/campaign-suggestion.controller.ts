import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { CampaignSuggestionService } from './campaign-suggestion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaign-suggestions')
export class CampaignSuggestionController {
  constructor(private readonly campaignSuggestionService: CampaignSuggestionService) {}

  // Rota protegida para buscar as sugestões com IA e Guardrail ético do usuário logado
  @UseGuards(JwtAuthGuard)
  @Get('generate')
  async generateSuggestions(@Req() req: any) {
    return this.campaignSuggestionService.generate(req.user.id);
  }
}
