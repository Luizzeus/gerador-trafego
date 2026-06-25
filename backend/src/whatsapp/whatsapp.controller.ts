import { Controller, Get, Post, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('connection')
  async getConnection(@Req() req: any) {
    return this.whatsappService.getConnection(req.user.id);
  }

  @Post('connection')
  async connect(
    @Req() req: any,
    @Body() body: { instanceName: string; providerType: 'evolution' | 'zapi' }
  ) {
    return this.whatsappService.connect(req.user.id, body.instanceName, body.providerType);
  }

  @Delete('connection')
  async disconnect(@Req() req: any) {
    return this.whatsappService.disconnect(req.user.id);
  }

  @Post('settings')
  async saveSettings(@Req() req: any, @Body() body: any) {
    return this.whatsappService.saveSettings(req.user.id, body);
  }

  @Get('logs')
  async getLogs(@Req() req: any) {
    return this.whatsappService.getLogs(req.user.id);
  }
}
