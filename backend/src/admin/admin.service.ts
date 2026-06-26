import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Contagem de usuários por papel
    const usersGroup = await this.prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    const userCounts = {
      admin: 0,
      professional: 0,
      company_member: 0,
    };

    usersGroup.forEach((group) => {
      if (group.role in userCounts) {
        userCounts[group.role] = group._count.id;
      }
    });

    // 2. Total de LPs publicadas
    const totalLandingPages = await this.prisma.landingPage.count({
      where: { status: 'published' },
    });

    // 3. Total de leads captados
    const totalLeads = await this.prisma.lead.count();

    // 4. Total de consultas marcadas
    const totalAppointments = await this.prisma.appointment.count();

    // 5. Receita estimada mensal (soma dos planos das assinaturas ativas na tabela Payment nos últimos 30 dias)
    const activePayments = await this.prisma.payment.findMany({
      where: {
        status: 'paid',
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        amount: true,
      },
    });

    const estimatedMonthlyRevenue = activePayments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    return {
      userCounts,
      totalLandingPages,
      totalLeads,
      totalAppointments,
      estimatedMonthlyRevenue,
    };
  }

  async getAllProfiles() {
    return this.prisma.professionalProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async toggleProfileVerification(id: string, isVerified: boolean) {
    return this.prisma.professionalProfile.update({
      where: { id },
      data: { isVerified },
    });
  }

  async getAllConsentLogs() {
    return this.prisma.consentLog.findMany({
      include: {
        lead: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        acceptedAt: 'desc',
      },
    });
  }
}
