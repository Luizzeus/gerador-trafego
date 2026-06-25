import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LeadModule } from '../lead/lead.module';

@Module({
  imports: [PrismaModule, LeadModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
