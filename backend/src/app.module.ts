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

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    LandingPageModule,
    LeadModule,
    CampaignSuggestionModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

