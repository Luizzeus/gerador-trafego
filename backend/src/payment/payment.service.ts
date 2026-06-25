import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  private readonly asaasApiKey = process.env.ASAAS_API_KEY;
  private readonly asaasApiUrl = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

  constructor(private readonly prisma: PrismaService) {}

  // Listar planos ativos
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' },
    });
  }

  // Obter status de assinatura e histórico de faturas
  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Busca o histórico de pagamentos do usuário
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      include: {
        subscriptionPlan: {
          select: {
            name: true,
            priceMonthly: true,
            featuresJson: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Encontra o último pagamento confirmado (pago) nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activePayment = payments.find(
      (p) => p.status === 'paid' && new Date(p.createdAt) >= thirtyDaysAgo,
    );

    let activePlan = null;
    let subscriptionEndsAt = null;

    if (activePayment) {
      activePlan = {
        id: activePayment.subscriptionPlanId,
        name: activePayment.subscriptionPlan.name,
        priceMonthly: activePayment.subscriptionPlan.priceMonthly,
        features: JSON.parse(activePayment.subscriptionPlan.featuresJson),
      };
      // Expiração é 30 dias após a data do pagamento pago
      const expiry = new Date(activePayment.createdAt);
      expiry.setDate(expiry.getDate() + 30);
      subscriptionEndsAt = expiry;
    }

    return {
      status: activePlan ? 'active' : 'inactive',
      activePlan,
      subscriptionEndsAt,
      billingHistory: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        paymentMethod: p.paymentMethod,
        invoicePdfUrl: p.invoicePdfUrl,
        createdAt: p.createdAt,
        planName: p.subscriptionPlan.name,
      })),
    };
  }

  // Criar uma nova cobrança de assinatura (PIX)
  async subscribe(userId: string, planId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano de assinatura não encontrado.');
    }

    // Verifica se já existe uma cobrança pendente para este mesmo plano
    const existingPending = await this.prisma.payment.findFirst({
      where: {
        userId,
        subscriptionPlanId: planId,
        status: 'pending',
      },
    });

    if (existingPending) {
      return existingPending;
    }

    let gatewayInvoiceId = `mock-inv-${Math.random().toString(36).substr(2, 9)}`;
    let pixCopyPaste = '00020126580014br.gov.bcb.pix0136mock-pix-key-for-medtraffic-billing2508000000005303986540599.905802BR5910MedTraffic6009Sao Paulo62070503***6304E63C';
    let pixQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://medtraffic.com.br/pix-simulation/' + gatewayInvoiceId)}`;

    // Se a chave de API do Asaas estiver configurada, tenta criar no gateway real (Sandbox/Produção)
    if (this.asaasApiKey) {
      try {
        // 1. Criar ou buscar cliente no Asaas
        // (Para simplificar, criamos um cliente simulado por usuário ou usamos dados mockados do Asaas)
        const customerResponse = await fetch(`${this.asaasApiUrl}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            access_token: this.asaasApiKey,
          },
          body: JSON.stringify({
            name: user.email.split('@')[0],
            email: user.email,
            notificationDisabled: true,
          }),
        });

        const customer = await customerResponse.json();
        if (customer.id) {
          // 2. Criar cobrança no Asaas (PIX)
          const paymentResponse = await fetch(`${this.asaasApiUrl}/payments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              access_token: this.asaasApiKey,
            },
            body: JSON.stringify({
              customer: customer.id,
              billingType: 'PIX',
              value: plan.priceMonthly,
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 dia de vencimento
              description: `Assinatura MedTraffic - Plano ${plan.name}`,
            }),
          });

          const asaasPayment = await paymentResponse.json();
          if (asaasPayment.id) {
            gatewayInvoiceId = asaasPayment.id;
            
            // 3. Obter dados do PIX (QR Code e Copia/Cola)
            const pixResponse = await fetch(`${this.asaasApiUrl}/payments/${asaasPayment.id}/pixQrCode`, {
              method: 'GET',
              headers: {
                access_token: this.asaasApiKey,
              },
            });
            const pixData = await pixResponse.json();
            if (pixData.payload) {
              pixCopyPaste = pixData.payload;
              pixQrCodeUrl = pixData.encodedImage 
                ? `data:image/png;base64,${pixData.encodedImage}`
                : pixQrCodeUrl;
            }
          }
        }
      } catch (err) {
        console.error('Erro ao integrar com o Asaas, fallback para Mock Mode:', err);
      }
    }

    // Cria o registro de pagamento pendente no banco de dados local
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        subscriptionPlanId: planId,
        gatewayInvoiceId,
        pixCopyPaste,
        pixQrCodeUrl,
        amount: plan.priceMonthly,
        status: 'pending',
        paymentMethod: 'pix',
      },
    });

    return payment;
  }

  // Processar Webhook do Asaas (real ou simulado)
  async handleWebhook(payload: any) {
    const event = payload.event;
    const paymentId = payload.payment?.id || payload.paymentId;

    if (!paymentId) {
      throw new BadRequestException('ID do pagamento ausente no payload.');
    }

    // Apenas nos interessam os eventos de pagamento recebido/confirmado
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const payment = await this.prisma.payment.findFirst({
        where: { gatewayInvoiceId: paymentId },
      });

      if (!payment) {
        throw new NotFoundException('Fatura não encontrada para o ID fornecido.');
      }

      if (payment.status === 'paid') {
        return { message: 'Pagamento já processado anteriormente.' };
      }

      // Atualiza o status do pagamento para 'pago' e gera a URL da nota fiscal simulada
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'paid',
          // O frontend proverá uma visualização rica da nota fiscal simulada nesta URL
          invoicePdfUrl: `http://localhost:3001/invoice-simulation/${payment.id}`,
        },
      });

      // Atualiza o status do usuário para ativo
      await this.prisma.user.update({
        where: { id: payment.userId },
        data: { status: 'active' },
      });

      console.log(`Pagamento confirmado: ${payment.id} (Usuário: ${payment.userId})`);
      return updatedPayment;
    }

    return { message: 'Evento ignorado pelo webhook.' };
  }

  // Simular confirmação de pagamento para desenvolvimento local
  async simulatePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    // Simula a estrutura do payload que o Asaas enviaria no webhook
    const mockPayload = {
      event: 'PAYMENT_CONFIRMED',
      payment: {
        id: payment.gatewayInvoiceId,
        status: 'RECEIVED',
      },
    };

    return this.handleWebhook(mockPayload);
  }
}
