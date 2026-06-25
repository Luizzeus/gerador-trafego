import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import * as crypto from 'crypto';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  async capture(dto: CaptureLeadDto, ip: string, userAgent: string) {
    // Verifica se a Landing Page existe
    const lp = await this.prisma.landingPage.findUnique({
      where: { id: dto.landingPageId },
    });

    if (!lp) {
      throw new NotFoundException('Landing Page de destino não encontrada.');
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
}
