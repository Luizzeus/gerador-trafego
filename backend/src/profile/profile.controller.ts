import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Criar ou atualizar o perfil do usuário logado (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Post()
  async saveProfile(@Req() req: any, @Body() dto: CreateProfileDto) {
    return this.profileService.createOrUpdate(req.user.id, dto);
  }

  // Obter o perfil do usuário logado (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: any) {
    return this.profileService.findByUserId(req.user.id);
  }

  // Endpoint público para buscar o perfil (usado para renderizar a Landing Page)
  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    return this.profileService.findById(id);
  }
}
