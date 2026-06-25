import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { LeadModule } from './lead/lead.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfileModule, LandingPageModule, LeadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
