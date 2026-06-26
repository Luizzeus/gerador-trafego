import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getGlobalStats();
  }

  @Get('profiles')
  async getProfiles() {
    return this.adminService.getAllProfiles();
  }

  @Patch('profiles/:id/verify')
  async verifyProfile(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.adminService.toggleProfileVerification(id, isVerified);
  }

  @Get('consent-logs')
  async getConsentLogs() {
    return this.adminService.getAllConsentLogs();
  }
}
