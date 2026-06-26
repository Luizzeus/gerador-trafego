import { Controller, Get, Patch, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
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

  @Get('users')
  async getUsers(@Req() req: any) {
    if (req.user.email !== 'administrator') {
      throw new ForbiddenException('Acesso exclusivo do Administrador Principal.');
    }
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  async updateRole(
    @Req() req: any,
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    if (req.user.email !== 'administrator') {
      throw new ForbiddenException('Acesso exclusivo do Administrador Principal.');
    }
    return this.adminService.updateUserRole(id, role);
  }

  @Patch('users/:id/password')
  async updatePassword(
    @Req() req: any,
    @Param('id') id: string,
    @Body('password') passwordPlain: string,
  ) {
    if (req.user.email !== 'administrator') {
      throw new ForbiddenException('Acesso exclusivo do Administrador Principal.');
    }
    return this.adminService.updateUserPassword(id, passwordPlain);
  }
}
