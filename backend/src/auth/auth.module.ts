import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'segredo_desenvolvimento_plataforma_trafego_saude',
      signOptions: { expiresIn: '7d' }, // Token válido por 7 dias
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [PassportModule, JwtModule],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const adminEmail = 'administrator';
    const superAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!superAdmin) {
      const passwordHash = await bcrypt.hash('@ccessINC21*', 10);
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          role: 'admin',
          status: 'active',
        },
      });
      console.log('Super-Admin "administrator" criado com sucesso com a senha "@ccessINC21*"!');
    }
  }
}
