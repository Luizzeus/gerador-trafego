'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  CreditCard, 
  Check, 
  Loader2, 
  QrCode, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Receipt,
  FileText
} from 'lucide-react';

export default function Billing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // States para o modal de pagamento PIX
  const [showPixModal, setShowPixModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  async function loadData() {
    try {
      const plansList = await api.getBillingPlans();
      setPlans(plansList);
      
      const billingStatus = await api.getBillingStatus();
      setStatusData(billingStatus);
      
      // Se houver alguma fatura pendente, já a carrega para exibição caso o usuário clique
      const pending = billingStatus.billingHistory.find((invoice: any) => invoice.status === 'pending');
      if (pending) {
        // Encontra os detalhes do PIX completos criando a assinatura (ou reaproveitando)
        const paymentDetails = await api.subscribeToPlan(pending.id || 1); 
        setPendingPayment(paymentDetails);
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados de faturamento');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setSubmitting(true);
    setError('');
    try {
      const payment = await api.subscribeToPlan(planId);
      setPendingPayment(payment);
      setShowPixModal(true);
    } catch (err: any) {
      setError(err.message || 'Falha ao iniciar assinatura.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (pendingPayment?.pixCopyPaste) {
      navigator.clipboard.writeText(pendingPayment.pixCopyPaste);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    if (!pendingPayment) return;
    setSimulatingPayment(true);
    setError('');
    try {
      await api.simulatePaymentConfirmation(pendingPayment.id);
      setSuccess('Pagamento simulado e confirmado com sucesso!');
      setShowPixModal(false);
      setPendingPayment(null);
      // Recarrega os dados do status
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao simular pagamento.');
    } finally {
      setSimulatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando dados de faturamento...</span>
      </div>
    );
  }

  const activePlan = statusData?.activePlan;
  const isSubscriber = statusData?.status === 'active';

  return (
    <div className="space-y-8 relative">
      
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 font-medium shadow-md">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 font-medium shadow-md">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          {error}
        </div>
      )}

      {/* Seção 1: Status da Assinatura */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-white">Status da Assinatura</h3>
            <p className="text-xs text-slate-500">Veja o seu plano atual e informações de faturamento.</p>
            
            <div className="flex items-center gap-3 pt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${
                isSubscriber 
                  ? 'bg-clinical-500/10 text-teal-400 border-clinical-500/20' 
                  : 'bg-slate-950 text-slate-500 border-slate-900'
              }`}>
                {isSubscriber ? 'Assinatura Ativa' : 'Sem Plano Ativo'}
              </span>

              {isSubscriber && statusData.subscriptionEndsAt && (
                <span className="text-slate-500 text-xs font-medium">
                  Renova em: <strong className="text-slate-300">{new Date(statusData.subscriptionEndsAt).toLocaleDateString('pt-BR')}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 md:w-80 shrink-0">
            {isSubscriber ? (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seu Plano</div>
                <div className="text-xl font-black text-white">{activePlan.name}</div>
                <div className="text-xs text-slate-400">
                  R$ {activePlan.priceMonthly.toFixed(2).replace('.', ',')} <span className="text-[10px] text-slate-500">/mês</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-center py-1">
                <CreditCard className="h-6 w-6 text-slate-700 mx-auto" />
                <div className="text-[11px] font-bold text-slate-400 mt-1">Acesso Limitado</div>
                <p className="text-[10px] text-slate-500 leading-relaxed px-2">Assine um plano profissional abaixo para liberar as Landing Pages e sugestões de IA.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Planos de Assinatura */}
      <div>
        <div className="mb-6">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Planos Disponíveis</h3>
          <p className="text-xs text-slate-500 mt-1">Escolha o plano ideal para alavancar seu tráfego profissional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const features = JSON.parse(plan.featuresJson);
            const isCurrent = activePlan?.id === plan.id;
            
            return (
              <div 
                key={plan.id} 
                className={`bg-slate-900/40 border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isCurrent 
                    ? 'border-clinical-500/40 shadow-xl shadow-clinical-500/5' 
                    : 'border-slate-900 hover:border-slate-800'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-clinical-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    Plano Atual
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-white">{plan.name}</h4>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">R$ {plan.priceMonthly.toFixed(2).replace('.', ',')}</span>
                      <span className="text-slate-500 text-xs font-semibold">/mês</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5 border-t border-slate-900 pt-5">
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="h-4 w-4 text-clinical-400 shrink-0 mt-0.5" />
                      <span>Criação de Landing Pages</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${features.includes('crm') ? 'text-clinical-400' : 'text-slate-700'}`} />
                      <span className={features.includes('crm') ? '' : 'text-slate-600 line-through'}>CRM e Funil de Leads</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${features.includes('ai_suggestions') ? 'text-clinical-400' : 'text-slate-700'}`} />
                      <span className={features.includes('ai_suggestions') ? '' : 'text-slate-600 line-through'}>Sugestões de Tráfego por IA</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${features.includes('whatsapp_automation') ? 'text-clinical-400' : 'text-slate-700'}`} />
                      <span className={features.includes('whatsapp_automation') ? '' : 'text-slate-600 line-through'}>Automação de WhatsApp (Fase 3)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-900">
                  <button
                    disabled={isCurrent || submitting}
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full text-xs font-bold py-3.5 rounded-xl transition-all duration-200 ${
                      isCurrent 
                        ? 'bg-slate-950 text-slate-500 border border-slate-900 cursor-default' 
                        : 'bg-clinical-500 hover:bg-clinical-600 text-white shadow-lg shadow-clinical-500/10 hover:scale-[1.01]'
                    }`}
                  >
                    {isCurrent ? 'Plano Ativo' : 'Assinar Plano'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 3: Histórico de Faturamento */}
      <div>
        <div className="mb-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Histórico de Faturamento</h3>
          <p className="text-xs text-slate-500 mt-1">Visualize suas faturas e baixe suas notas fiscais de serviço.</p>
        </div>

        {statusData?.billingHistory?.length === 0 ? (
          <div className="bg-slate-900/10 border border-dashed border-slate-900 h-[150px] rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-3">
            <Receipt className="h-8 w-8 opacity-30" />
            <p className="text-xs font-bold text-slate-500">Nenhuma fatura emitida ainda</p>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider bg-slate-950/40">
                    <th className="p-4 pl-6">Data</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Nota Fiscal (NFS-e)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/80 font-medium">
                  {statusData.billingHistory.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 pl-6 text-slate-400">
                        {new Date(invoice.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-white font-bold">{invoice.planName}</td>
                      <td className="p-4 text-slate-300">R$ {invoice.amount.toFixed(2).replace('.', ',')}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                          invoice.status === 'paid'
                            ? 'bg-clinical-500/10 text-teal-400 border-clinical-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {invoice.status === 'paid' ? (
                          <a
                            href={invoice.invoicePdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-clinical-500 hover:text-clinical-400 hover:underline font-bold"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Visualizar NFS-e
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              // Reaproveita faturas pendentes para abrir o modal de pagamento
                              setPendingPayment({
                                id: invoice.id,
                                gatewayInvoiceId: invoice.gatewayInvoiceId || 'mock-id',
                                pixCopyPaste: '00020126580014br.gov.bcb.pix...',
                                pixQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=simulate-invoice`,
                                amount: invoice.amount,
                              });
                              setShowPixModal(true);
                            }}
                            className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
                          >
                            Pagar Agora
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal do Pagamento PIX */}
      {showPixModal && pendingPayment && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-6">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6">
            
            <div>
              <h3 className="font-extrabold text-lg text-white">Pagamento PIX da Assinatura</h3>
              <p className="text-xs text-slate-500 mt-1">Escaneie o QR Code abaixo ou copie a chave PIX copia e cola.</p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center border border-slate-200">
              {pendingPayment.pixQrCodeUrl ? (
                <img 
                  src={pendingPayment.pixQrCodeUrl} 
                  alt="PIX QR Code" 
                  className="w-full h-full"
                />
              ) : (
                <QrCode className="h-20 w-20 text-slate-400 animate-pulse" />
              )}
            </div>

            {/* Detalhes do Valor */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Valor da Fatura</span>
              <span className="text-xl font-black text-white mt-1 block">R$ {pendingPayment.amount.toFixed(2).replace('.', ',')}</span>
            </div>

            {/* Chave Copia e Cola */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Chave PIX Copia e Cola</label>
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-2 pl-3">
                <input
                  type="text"
                  readOnly
                  value={pendingPayment.pixCopyPaste}
                  className="w-full bg-transparent border-none py-1 text-xs text-slate-400 focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyPix}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 p-2.5 rounded-lg ml-2 hover:text-white transition-colors"
                  title="Copiar chave"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copySuccess && (
                <span className="text-[10px] text-teal-400 font-bold block transition-all">Código copiado!</span>
              )}
            </div>

            {/* Alerta de desenvolvimento */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex gap-3 text-amber-500">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold">Ambiente de Desenvolvimento</h5>
                <p className="text-[10px] leading-relaxed mt-0.5 text-amber-500/80">
                  Como estamos em ambiente local e sem gateway produtivo, clique no botão abaixo para simular a resposta imediata do webhook do banco.
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSimulatePayment}
                disabled={simulatingPayment}
                className="w-full bg-clinical-500 hover:bg-clinical-600 text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                {simulatingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Confirmar Pagamento (Simulação)
              </button>
              
              <button
                onClick={() => setShowPixModal(false)}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white py-3 rounded-xl text-xs font-bold transition-colors"
              >
                Fechar Janela
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
