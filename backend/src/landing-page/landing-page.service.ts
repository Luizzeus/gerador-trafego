import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLpDto } from './dto/create-lp.dto';

@Injectable()
export class LandingPageService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(userId: string, dto: CreateLpDto, lpId?: string) {
    // Busca o perfil profissional do usuário para vincular à LP
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Você precisa criar um perfil profissional antes de criar uma Landing Page.');
    }

    // Verifica unicidade de subdomínio
    const subdomainExists = await this.prisma.landingPage.findFirst({
      where: {
        subdomain: dto.subdomain.toLowerCase(),
        NOT: lpId ? { id: lpId } : undefined,
      },
    });

    if (subdomainExists) {
      throw new ConflictException('Este subdomínio já está em uso por outro profissional.');
    }

    if (lpId) {
      // Atualiza a LP existente
      const existingLp = await this.prisma.landingPage.findUnique({
        where: { id: lpId },
      });

      if (!existingLp || existingLp.professionalProfileId !== profile.id) {
        throw new NotFoundException('Landing Page não encontrada.');
      }

      return this.prisma.landingPage.update({
        where: { id: lpId },
        data: {
          ...dto,
          subdomain: dto.subdomain.toLowerCase(),
        },
      });
    }

    // Cria nova LP
    return this.prisma.landingPage.create({
      data: {
        professionalProfileId: profile.id,
        title: dto.title,
        subdomain: dto.subdomain.toLowerCase(),
        customDomain: dto.customDomain,
        status: dto.status,
        contentJson: dto.contentJson,
        pixelMetaId: dto.pixelMetaId,
        pixelGoogleId: dto.pixelGoogleId,
      },
    });
  }

  async findByUser(userId: string) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    return this.prisma.landingPage.findMany({
      where: { professionalProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySubdomain(subdomain: string) {
    const lp = await this.prisma.landingPage.findFirst({
      where: {
        subdomain: subdomain.toLowerCase(),
        status: 'published',
      },
      include: {
        professionalProfile: true,
      },
    });

    if (!lp) {
      throw new NotFoundException('Landing Page não encontrada ou está em rascunho.');
    }

    return lp;
  }

  async findById(id: string) {
    const lp = await this.prisma.landingPage.findUnique({
      where: { id },
      include: {
        professionalProfile: true,
      },
    });

    if (!lp) {
      throw new NotFoundException('Landing Page não encontrada.');
    }

    return lp;
  }
}
