import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { LeadModule } from './lead/lead.module';
import { CampaignSuggestionModule } from './campaign-suggestion/campaign-suggestion.module';
import { PaymentModule } from './payment/payment.module';
import { CampaignModule } from './campaign/campaign.module';
import { AppointmentModule } from './appointment/appointment.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    LandingPageModule,
    LeadModule,
    CampaignSuggestionModule,
    PaymentModule,
    CampaignModule,
    AppointmentModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

