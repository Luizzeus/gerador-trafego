import { Controller, Get, Post, Patch, Delete, Body, Req, UseGuards, Param, Ip } from '@nestjs/common';
import { Request } from 'express';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // 1. Rota pública para pré-agendamento a partir da Landing Page
  @Post('schedule')
  async schedulePublic(
    @Body() body: {
      landingPageId: string;
      name: string;
      email?: string;
      phone: string;
      serviceCategoryId: number;
      scheduledTime: string;
      consentText: string;
      acceptedConsent: boolean;
      trafficSource: string;
    },
    @Req() req: Request,
    @Ip() ipAddress: string
  ) {
    const userAgent = req.headers['user-agent'] || 'Desconhecido';
    const realIp = (req.headers['x-forwarded-for'] as string) || ipAddress;

    return this.appointmentService.schedulePublic(body, realIp, userAgent);
  }

  // 2. Conectar Google Calendar (Mock OAuth2)
  @UseGuards(JwtAuthGuard)
  @Post('google-calendar')
  async connectCalendar(
    @Req() req: any,
    @Body() body: { accountName: string; accountId: string }
  ) {
    return this.appointmentService.connectCalendar(req.user.id, body.accountName, body.accountId);
  }

  // 3. Desconectar Google Calendar
  @UseGuards(JwtAuthGuard)
  @Delete('google-calendar')
  async disconnectCalendar(@Req() req: any) {
    return this.appointmentService.disconnectCalendar(req.user.id);
  }

  // 4. Obter status de conexão do calendário
  @UseGuards(JwtAuthGuard)
  @Get('google-calendar')
  async getCalendarConnection(@Req() req: any) {
    return this.appointmentService.getCalendarConnection(req.user.id);
  }

  // 5. Listar agendamentos do profissional autenticado
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAppointments(@Req() req: any) {
    return this.appointmentService.getAppointments(req.user.id);
  }

  // 6. Atualizar status de agendamento (Confirmar / Cancelar)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.appointmentService.updateStatus(req.user.id, id, body.status);
  }

  // 7. Deletar agendamento
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAppointment(@Req() req: any, @Param('id') id: string) {
    return this.appointmentService.deleteAppointment(req.user.id, id);
  }
}
