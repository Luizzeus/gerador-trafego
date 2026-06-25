import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(userId: string, dto: CreateProfileDto) {
    // Verifica se já existe um perfil para este usuário
    const existingProfile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (existingProfile) {
      // Atualiza o perfil existente
      return this.prisma.professionalProfile.update({
        where: { id: existingProfile.id },
        data: dto,
      });
    }

    // Cria um novo perfil
    return this.prisma.professionalProfile.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.professionalProfile.findFirst({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil profissional não encontrado para este usuário.');
    }

    return profile;
  }

  async findById(id: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Perfil profissional não encontrado.');
    }

    return profile;
  }
}
