import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Listar planos de assinatura ativos
  @Get('plans')
  async getPlans() {
    return this.paymentService.getPlans();
  }

  // Obter status da assinatura e faturas do usuário logado
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(@Req() req: any) {
    return this.paymentService.getStatus(req.user.id);
  }

  // Iniciar uma assinatura / gerar cobrança PIX
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Req() req: any, @Body('planId') planId: number) {
    return this.paymentService.subscribe(req.user.id, planId);
  }

  // Webhook público do Asaas
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    return this.paymentService.handleWebhook(payload);
  }

  // Rota de desenvolvimento para simular o pagamento (webhook)
  @Post('simulate-webhook/:paymentId')
  @HttpCode(HttpStatus.OK)
  async simulateWebhook(@Param('paymentId') paymentId: string) {
    return this.paymentService.simulatePayment(paymentId);
  }
}
