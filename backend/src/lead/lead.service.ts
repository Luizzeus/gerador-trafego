import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import * as crypto from 'crypto';

@Injectable()
export class LeadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService
  ) {}

  async capture(dto: CaptureLeadDto, ip: string, userAgent: string) {
    // Verifica se a Landing Page existe e busca o userId do profissional
    const lp = await this.prisma.landingPage.findUnique({
      where: { id: dto.landingPageId },
      include: {
        professionalProfile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!lp || !lp.professionalProfile) {
      throw new NotFoundException('Landing Page ou perfil profissional de destino não encontrado.');
    }

    // Cria o Lead no banco de dados com status inicial 'new'
    const newLead = await this.prisma.lead.create({
      data: {
        landingPageId: dto.landingPageId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        serviceCategoryId: dto.serviceCategoryId,
        status: 'new',
        trafficSource: dto.trafficSource,
      },
    });

    // Geração do Hash SHA-256 do consentimento para LGPD
    const timestamp = new Date().toISOString();
    const hashData = `${ip}|${timestamp}|${dto.consentText}|${newLead.id}`;
    const consentHash = crypto.createHash('sha256').update(hashData).digest('hex');

    // Grava o log de consentimento inalterável (ConsentLog)
    await this.prisma.consentLog.create({
      data: {
        leadId: newLead.id,
        ipAddress: ip,
        userAgent: userAgent,
        consentText: dto.consentText,
        consentHash: consentHash,
      },
    });

    // Dispara notificação automática de boas-vindas do WhatsApp se habilitada
    try {
      await this.whatsappService.triggerWelcome(lp.professionalProfile.userId, newLead);
    } catch (err) {
      console.error('[WhatsApp Trigger Error] Falha ao enviar boas-vindas:', err);
    }

    return newLead;
  }

  async updateStatus(userId: string, leadId: string, dto: UpdateLeadStatusDto) {
    // Busca o perfil profissional do usuário logado
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil profissional não configurado.');
    }

    // Busca o lead garantindo que ele pertence à Landing Page do profissional logado
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        landingPage: true,
      },
    });

    if (!lead || lead.landingPage.professionalProfileId !== profile.id) {
      throw new NotFoundException('Lead não encontrado.');
    }

    // Atualiza o status
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { status: dto.status },
    });
  }

  async findByUser(userId: string) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    // Retorna todos os leads das LPs pertencentes ao perfil do profissional
    return this.prisma.lead.findMany({
      where: {
        landingPage: {
          professionalProfileId: profile.id,
        },
      },
      include: {
        landingPage: {
          select: {
            title: true,
            subdomain: true,
          },
        },
        serviceCategory: {
          select: {
            name: true,
          },
        },
        consentLogs: {
          select: {
            consentHash: true,
            acceptedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async exportToCSV(userId: string): Promise<string> {
    const leads = await this.findByUser(userId);

    const headers = [
      'ID',
      'Nome',
      'E-mail',
      'Telefone',
      'Status',
      'Origem de Trafego',
      'Landing Page (Subdominio)',
      'Landing Page (Titulo)',
      'Categoria de Servico',
      'Data de Criacao',
      'Hash LGPD',
      'Data Aceite LGPD'
    ];

    const rows = leads.map(lead => [
      lead.id,
      lead.name,
      lead.email || '',
      lead.phone,
      lead.status,
      lead.trafficSource || '',
      lead.landingPage?.subdomain || '',
      lead.landingPage?.title || '',
      lead.serviceCategory?.name || '',
      lead.createdAt instanceof Date ? lead.createdAt.toISOString() : new Date(lead.createdAt).toISOString(),
      lead.consentLogs?.[0]?.consentHash || '',
      lead.consentLogs?.[0]?.acceptedAt
        ? (lead.consentLogs[0].acceptedAt instanceof Date 
            ? lead.consentLogs[0].acceptedAt.toISOString() 
            : new Date(lead.consentLogs[0].acceptedAt).toISOString())
        : ''
    ]);

    const escapeCSV = (val: string) => {
      const cleanVal = val ? val.replace(/"/g, '""') : '';
      return `"${cleanVal}"`;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(val => escapeCSV(String(val))).join(','))
    ].join('\n');

    return csvContent;
  }
}
