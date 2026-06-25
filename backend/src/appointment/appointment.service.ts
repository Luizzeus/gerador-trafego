import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadService } from '../lead/lead.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leadService: LeadService
  ) {}

  // 1. Conectar Google Calendar (Mock OAuth2)
  async connectCalendar(userId: string, accountName: string, accountId: string) {
    const mockAccessToken = `mock_cal_access_${Math.random().toString(36).substring(2, 10)}`;
    const mockRefreshToken = `mock_cal_refresh_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.prisma.adsCredential.upsert({
      where: {
        userId_provider: {
          userId,
          provider: 'google_calendar',
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
        provider: 'google_calendar',
        accountName,
        accountId,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        expiresAt,
        status: 'connected',
      },
    });
  }

  // 2. Desconectar Google Calendar
  async disconnectCalendar(userId: string) {
    try {
      return await this.prisma.adsCredential.delete({
        where: {
          userId_provider: {
            userId,
            provider: 'google_calendar',
          },
        },
      });
    } catch {
      throw new NotFoundException('Calendário não conectado ou já desconectado.');
    }
  }

  // 3. Obter status da conexão com Google Calendar
  async getCalendarConnection(userId: string) {
    return this.prisma.adsCredential.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'google_calendar',
        },
      },
      select: {
        accountName: true,
        accountId: true,
        status: true,
      },
    });
  }

  // 4. Agendador público da Landing Page (Cria Lead + Log LGPD + Appointment)
  async schedulePublic(
    data: {
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
    ip: string,
    userAgent: string
  ) {
    // 1. Cria o Lead utilizando a lógica do LeadService (registra o log LGPD automaticamente)
    const lead = await this.leadService.capture(
      {
        landingPageId: data.landingPageId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceCategoryId: data.serviceCategoryId,
        trafficSource: data.trafficSource,
        consentText: data.consentText,
        acceptedConsent: data.acceptedConsent,
      },
      ip,
      userAgent
    );

    // 2. Busca a Landing Page para saber qual o perfil profissional
    const lp = await this.prisma.landingPage.findUnique({
      where: { id: data.landingPageId },
      select: { professionalProfileId: true },
    });

    if (!lp || !lp.professionalProfileId) {
      throw new NotFoundException('Perfil profissional da Landing Page não encontrado para realizar o agendamento.');
    }

    // 3. Cria o registro do agendamento com status inicial 'pending'
    return this.prisma.appointment.create({
      data: {
        professionalProfileId: lp.professionalProfileId,
        leadId: lead.id,
        scheduledTime: new Date(data.scheduledTime),
        durationMinutes: 50, // Padrão: 50 minutos de consulta
        status: 'pending',
      },
      include: {
        lead: true,
      },
    });
  }

  // 5. Listar agendamentos do profissional autenticado
  async getAppointments(userId: string) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil profissional não configurado.');
    }

    return this.prisma.appointment.findMany({
      where: {
        professionalProfileId: profile.id,
      },
      include: {
        lead: {
          include: {
            serviceCategory: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledTime: 'asc' },
    });
  }

  // 6. Atualizar status do agendamento (Confirmar / Cancelar)
  async updateStatus(userId: string, id: string, status: string) {
    if (status !== 'confirmed' && status !== 'cancelled' && status !== 'completed') {
      throw new BadRequestException('Status inválido. Use "confirmed", "cancelled" ou "completed".');
    }

    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil profissional não configurado.');
    }

    const appointment = await this.prisma.appointment.findFirst({
      where: { id, professionalProfileId: profile.id },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    let meetingLink = appointment.meetingLink;

    // Se estiver confirmando e o Google Calendar estiver conectado, gera o link Meet simulado
    if (status === 'confirmed') {
      const isCalendarConnected = await this.prisma.adsCredential.findUnique({
        where: {
          userId_provider: {
            userId,
            provider: 'google_calendar',
          },
        },
      });

      if (isCalendarConnected && isCalendarConnected.status === 'connected') {
        // Gera link fictício de reunião do Google Meet
        const code1 = Math.random().toString(36).substring(2, 5);
        const code2 = Math.random().toString(36).substring(2, 6);
        const code3 = Math.random().toString(36).substring(2, 5);
        meetingLink = `https://meet.google.com/${code1}-${code2}-${code3}`;
        console.log(`[Google Calendar Sync] Evento sincronizado com sucesso. Link Meet gerado: ${meetingLink}`);
      }
    } else if (status === 'cancelled') {
      meetingLink = null;
      console.log(`[Google Calendar Sync] Evento cancelado e removido do Google Agenda.`);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { 
        status,
        meetingLink,
      },
      include: {
        lead: true,
      },
    });
  }

  // 7. Deletar agendamento
  async deleteAppointment(userId: string, id: string) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil profissional não configurado.');
    }

    const appointment = await this.prisma.appointment.findFirst({
      where: { id, professionalProfileId: profile.id },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
