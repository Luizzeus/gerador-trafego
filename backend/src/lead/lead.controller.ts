import { Controller, Get, Post, Body, UseGuards, Req, Param, Patch, Ip, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LeadService } from './lead.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  // Rota pública para captura de Leads (vindo das Landing Pages)
  @Post()
  async captureLead(
    @Body() dto: CaptureLeadDto,
    @Req() req: Request,
    @Ip() ipAddress: string
  ) {
    const userAgent = req.headers['user-agent'] || 'Desconhecido';
    
    // Suporte a proxy reverso (IP real do visitante)
    const realIp = (req.headers['x-forwarded-for'] as string) || ipAddress;
    
    return this.leadService.capture(dto, realIp, userAgent);
  }

  // Obter todos os leads do profissional logado no CRM (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Get('crm')
  async getMyLeads(@Req() req: any) {
    return this.leadService.findByUser(req.user.id);
  }

  // Exportar leads em formato CSV (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Get('export')
  async exportLeads(@Req() req: any, @Res() res: Response) {
    const csvContent = await this.leadService.exportToCSV(req.user.id);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    return res.send(csvContent);
  }

  // Atualizar status de um lead específico no funil do CRM (Protegido por JWT)
  @UseGuards(JwtAuthGuard)
  @Patch('crm/:id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusDto
  ) {
    return this.leadService.updateStatus(req.user.id, id, dto);
  }
}
