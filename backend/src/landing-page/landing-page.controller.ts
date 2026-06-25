import { Controller, Get, Post, Body, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { CreateLpDto } from './dto/create-lp.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('landing-pages')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  // Criar uma nova Landing Page (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createLp(@Req() req: any, @Body() dto: CreateLpDto) {
    return this.landingPageService.createOrUpdate(req.user.id, dto);
  }

  // Atualizar uma Landing Page existente (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateLp(@Req() req: any, @Param('id') id: string, @Body() dto: CreateLpDto) {
    return this.landingPageService.createOrUpdate(req.user.id, dto, id);
  }

  // Obter todas as Landing Pages do usuário logado (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyLps(@Req() req: any) {
    return this.landingPageService.findByUser(req.user.id);
  }

  // Rota pública para buscar Landing Page pelo subdomínio (Usado pelo renderizador)
  @Get('public/:subdomain')
  async getPublicLp(@Param('subdomain') subdomain: string) {
    return this.landingPageService.findBySubdomain(subdomain);
  }

  // Rota pública para buscar Landing Page pelo ID
  @Get(':id')
  async getLpById(@Param('id') id: string) {
    return this.landingPageService.findById(id);
  }
}
