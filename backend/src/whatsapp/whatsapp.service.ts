import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_SETTINGS = {
  welcomeEnabled: true,
  welcomeTemplate: 'Olá, [Nome]! Agradecemos o seu contato em nossa página de captação. Retornaremos em breve para alinhar os detalhes do seu atendimento.',
  confirmEnabled: true,
  confirmTemplate: 'Olá, [Nome]! Sua consulta foi confirmada para o dia [Data] às [Hora]. Aqui está o link do Google Meet para nossa videoconferência: [MeetLink]',
  cancelEnabled: true,
  cancelTemplate: 'Olá, [Nome]! Informamos que sua consulta agendada para o dia [Data] às [Hora] foi cancelada. Se tiver dúvidas, entre em contato.'
};

@Injectable()
export class WhatsappService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Obter status e configurações da conexão com WhatsApp
  async getConnection(userId: string) {
    const credential = await this.prisma.adsCredential.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'whatsapp_api',
        },
      },
    });

    if (!credential) {
      return {
        status: 'disconnected',
        instanceName: null,
        phoneNumber: null,
        providerType: null,
        settings: DEFAULT_SETTINGS,
      };
    }

    let settings = DEFAULT_SETTINGS;
    try {
      if (credential.refreshToken) {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(credential.refreshToken) };
      }
    } catch {
      // Ignora erro de parsing e usa o padrão
    }

    return {
      status: credential.status, // 'connected' ou 'pending'
      instanceName: credential.accountName,
      phoneNumber: credential.accountId,
      providerType: credential.accessToken.split('_')[0], // 'evolution' ou 'zapi'
      settings,
    };
  }

  // 2. Conectar e gerar QR Code simulado
  async connect(userId: string, instanceName: string, providerType: 'evolution' | 'zapi') {
    const mockPhoneNumber = `551999${Math.floor(1000000 + Math.random() * 9000000)}`;
    const mockAccessToken = `${providerType}_token_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 365); // 1 ano

    const credential = await this.prisma.adsCredential.upsert({
      where: {
        userId_provider: {
          userId,
          provider: 'whatsapp_api',
        },
      },
      update: {
        accountName: instanceName,
        accountId: mockPhoneNumber,
        accessToken: mockAccessToken,
        expiresAt,
        status: 'connected',
      },
      create: {
        userId,
        provider: 'whatsapp_api',
        accountName: instanceName,
        accountId: mockPhoneNumber,
        accessToken: mockAccessToken,
        refreshToken: JSON.stringify(DEFAULT_SETTINGS),
        expiresAt,
        status: 'connected',
      },
    });

    // Retorna dados fictícios de QR Code
    const dummyQrCode = `mock_qr_code_data_for_whatsapp_${Math.random().toString(36).substring(2, 12)}`;
    return {
      qrCode: dummyQrCode,
      status: credential.status,
      instanceName: credential.accountName,
      phoneNumber: credential.accountId,
    };
  }

  // 3. Desconectar WhatsApp
  async disconnect(userId: string) {
    try {
      return await this.prisma.adsCredential.delete({
        where: {
          userId_provider: {
            userId,
            provider: 'whatsapp_api',
          },
        },
      });
    } catch {
      throw new NotFoundException('Conexão do WhatsApp não encontrada.');
    }
  }

  // 4. Salvar configurações de templates e toggles
  async saveSettings(userId: string, settings: any) {
    const credential = await this.prisma.adsCredential.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'whatsapp_api',
        },
      },
    });

    // Se não tiver credencial criada, cria uma temporária desconectada para salvar configurações
    if (!credential) {
      return this.prisma.adsCredential.create({
        data: {
          userId,
          provider: 'whatsapp_api',
          accountName: 'WhatsApp Padrão',
          accountId: 'não configurado',
          accessToken: 'default_token',
          refreshToken: JSON.stringify(settings),
          expiresAt: new Date(),
          status: 'disconnected',
        },
      });
    }

    return this.prisma.adsCredential.update({
      where: {
        userId_provider: {
          userId,
          provider: 'whatsapp_api',
        },
      },
      data: {
        refreshToken: JSON.stringify(settings),
      },
    });
  }

  // 5. Obter histórico de mensagens disparadas (AuditLog com ação SEND_WHATSAPP_NOTIFICATION)
  async getLogs(userId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        userId,
        action: 'SEND_WHATSAPP_NOTIFICATION',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
  }

  // 6. Gatilho de Boas-vindas para novos Leads
  async triggerWelcome(userId: string, lead: any) {
    const connection = await this.getConnection(userId);
    if (connection.status !== 'connected' || !connection.settings.welcomeEnabled) {
      return;
    }

    let text = connection.settings.welcomeTemplate;
    text = text.replace(/\[Nome\]/g, lead.name);

    await this.sendSimulatedMessage(userId, lead.phone, text, 'Boas-vindas (Lead)');
  }

  // 7. Gatilho para Confirmação / Cancelamento de Consultas
  async triggerAppointment(userId: string, appointment: any, status: 'confirmed' | 'cancelled') {
    const connection = await this.getConnection(userId);
    if (connection.status !== 'connected') {
      return;
    }

    const isConfirm = status === 'confirmed';
    const enabled = isConfirm ? connection.settings.confirmEnabled : connection.settings.cancelEnabled;
    if (!enabled) {
      return;
    }

    let text = isConfirm ? connection.settings.confirmTemplate : connection.settings.cancelTemplate;

    // Resolve os detalhes do Lead e Data
    const lead = await this.prisma.lead.findUnique({ where: { id: appointment.leadId } });
    if (!lead) return;

    const dateObj = new Date(appointment.scheduledTime);
    const dateFormatted = dateObj.toLocaleDateString('pt-BR');
    const timeFormatted = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    text = text.replace(/\[Nome\]/g, lead.name);
    text = text.replace(/\[Data\]/g, dateFormatted);
    text = text.replace(/\[Hora\]/g, timeFormatted);
    text = text.replace(/\[MeetLink\]/g, appointment.meetingLink || 'Link não gerado');

    const messageType = isConfirm ? 'Confirmação (Agenda)' : 'Cancelamento (Agenda)';
    await this.sendSimulatedMessage(userId, lead.phone, text, messageType);
  }

  // 8. Enviar mensagem simulada e gravar log
  private async sendSimulatedMessage(userId: string, to: string, text: string, type: string) {
    console.log(`[WhatsApp Outbox] Enviando mensagem para ${to} [Tipo: ${type}]: "${text}"`);
    
    // Grava log de auditoria representativo
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SEND_WHATSAPP_NOTIFICATION',
        ipAddress: '127.0.0.1',
        details: JSON.stringify({
          to,
          text,
          type,
          status: 'sent',
          timestamp: new Date().toISOString(),
        }),
      },
    });
  }
}
