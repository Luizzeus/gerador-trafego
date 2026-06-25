'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  MessageSquare,
  RefreshCw,
  CheckCircle,
  XCircle,
  Settings,
  QrCode,
  Smartphone,
  Info,
  Loader2,
  Lock,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export default function WhatsappAutomationPage() {
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Connection states
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'pending'>('disconnected');
  const [instanceName, setInstanceName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [providerType, setProviderType] = useState<'evolution' | 'zapi'>('evolution');
  const [pairingQr, setPairingQr] = useState<string | null>(null);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [formInstanceName, setFormInstanceName] = useState('');

  // Notification templates states
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [welcomeTemplate, setWelcomeTemplate] = useState('');
  const [confirmEnabled, setConfirmEnabled] = useState(true);
  const [confirmTemplate, setConfirmTemplate] = useState('');
  const [cancelEnabled, setCancelEnabled] = useState(true);
  const [cancelTemplate, setCancelTemplate] = useState('');

  // Message Logs list
  const [logs, setLogs] = useState<any[]>([]);

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState<'welcome' | 'confirm' | 'cancel' | null>('welcome');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const conn = await api.getWhatsappConnection();
      setStatus(conn.status);
      setInstanceName(conn.instanceName);
      setPhoneNumber(conn.phoneNumber);
      setProviderType(conn.providerType || 'evolution');
      
      // Load templates settings
      setWelcomeEnabled(conn.settings.welcomeEnabled);
      setWelcomeTemplate(conn.settings.welcomeTemplate);
      setConfirmEnabled(conn.settings.confirmEnabled);
      setConfirmTemplate(conn.settings.confirmTemplate);
      setCancelEnabled(conn.settings.cancelEnabled);
      setCancelTemplate(conn.settings.cancelTemplate);

      // Load logs
      await loadLogs();
    } catch (e) {
      console.error('Erro ao carregar dados do WhatsApp:', e);
    } finally {
      setLoading(false);
    }
  }

  async function loadLogs() {
    try {
      setLogsLoading(true);
      const data = await api.getWhatsappLogs();
      const parsedLogs = data.map((log: any) => {
        let details: any = {};
        try {
          details = JSON.parse(log.details);
        } catch {
          details = { to: 'Desconhecido', text: log.details, type: 'Disparo' };
        }
        return {
          id: log.id,
          to: details.to,
          text: details.text,
          type: details.type,
          status: details.status || 'sent',
          createdAt: log.createdAt
        };
      });
      setLogs(parsedLogs);
    } catch (e) {
      console.error('Erro ao carregar logs:', e);
    } finally {
      setLogsLoading(false);
    }
  }

  // Iniciar pareamento
  const handleStartPairing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInstanceName) return;

    try {
      setLoading(true);
      const res = await api.connectWhatsapp({
        instanceName: formInstanceName,
        providerType
      });
      
      // Exibe o mock QR Code
      setPairingQr(res.qrCode);
      setShowPairingModal(true);
      setStatus('pending');
    } catch (e) {
      console.error('Erro ao parear:', e);
      alert('Erro ao gerar instância do WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  // Simular escaneamento do QR Code
  const handleSimulateScan = async () => {
    try {
      setLoading(true);
      setShowPairingModal(false);
      
      // Salva o status conectado de vez
      await loadData();
      
      // Força recarregamento da página para reavaliar sidebar
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  // Desconectar WhatsApp
  const handleDisconnect = async () => {
    if (!confirm('Deseja realmente desconectar seu WhatsApp da plataforma? Todos os disparos automáticos serão pausados.')) return;

    try {
      setLoading(true);
      await api.disconnectWhatsapp();
      await loadData();
      
      // Recarrega para atualizar a sidebar
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Erro ao desconectar.');
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações
  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const settings = {
        welcomeEnabled,
        welcomeTemplate,
        confirmEnabled,
        confirmTemplate,
        cancelEnabled,
        cancelTemplate
      };
      await api.saveWhatsappSettings(settings);
      alert('Configurações de templates salvas com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar configurações.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-clinical-500" />
        <span className="text-sm font-semibold tracking-wider">Carregando automação do WhatsApp...</span>
      </div>
    );
  }

  const isConnected = status === 'connected';

  return (
    <div className="space-y-8 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Automação de WhatsApp</h3>
          <p className="text-xs text-slate-500 mt-1">Dispare mensagens de acolhimento e confirmação de agenda automaticamente.</p>
        </div>
        <button
          onClick={loadLogs}
          disabled={logsLoading}
          className="bg-slate-900 hover:bg-slate-900/80 border border-slate-800 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
          Atualizar Logs
        </button>
      </div>

      {/* Grid: Configuração de Conexão & Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Connection Box (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-6">
          <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Smartphone className="h-4.5 w-4.5 text-clinical-500" />
            Conexão com Aparelho
          </h4>

          {isConnected ? (
            // Connected View
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/25 p-5 rounded-2xl flex items-center gap-4">
                <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400 animate-pulse">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status da Instância</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">Operacional & Conectado</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">Instância: <span className="text-white">{instanceName}</span></div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-400 font-semibold bg-slate-950/40 border border-slate-900 p-4 rounded-xl">
                <div className="flex justify-between">
                  <span>Provedor:</span>
                  <span className="text-white font-bold uppercase">{providerType === 'evolution' ? 'Evolution API' : 'Z-API'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Número Pareado:</span>
                  <span className="text-white font-bold">+{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status do Disparador:</span>
                  <span className="text-emerald-400 font-bold">Pronto para Enviar</span>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 text-red-400 font-bold py-3.5 rounded-xl text-xs transition-all duration-200"
              >
                Desconectar Aparelho
              </button>
            </div>
          ) : (
            // Disconnected Form
            <form onSubmit={handleStartPairing} className="space-y-5">
              <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex gap-3">
                <Info className="h-5 w-5 text-clinical-500 shrink-0 mt-0.5" />
                <p className="text-[10.5px] leading-relaxed text-slate-400 font-medium">
                  Integre com instâncias da <strong>Evolution API</strong> ou <strong>Z-API</strong> para testar. Nós geraremos um QR Code simulado para pareamento instantâneo.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Nome da Instância do WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={formInstanceName}
                    onChange={(e) => setFormInstanceName(e.target.value)}
                    placeholder="Ex: Instancia Psico Clinica"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Selecione o Gateway de API
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProviderType('evolution')}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        providerType === 'evolution'
                          ? 'bg-clinical-500/10 border-clinical-500/40 text-teal-400'
                          : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Evolution API
                    </button>
                    <button
                      type="button"
                      onClick={() => setProviderType('zapi')}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        providerType === 'zapi'
                          ? 'bg-clinical-500/10 border-clinical-500/40 text-teal-400'
                          : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Z-API (Gateway)
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-clinical-500 hover:bg-clinical-600 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-clinical-500/20 transition-all duration-200"
              >
                Gerar Instância & Conectar
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Notification templates & edit box (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-6">
          <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Settings className="h-4.5 w-4.5 text-clinical-500" />
            Configuração de Eventos & Templates
          </h4>

          <div className="space-y-4">
            
            {/* 1. Welcome template accordion */}
            <div className="border border-slate-900 bg-slate-950/30 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'welcome' ? null : 'welcome')}
                className="w-full p-4 flex items-center justify-between font-bold text-xs text-white"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={welcomeEnabled}
                    onChange={(e) => setWelcomeEnabled(e.target.checked)}
                    onClick={(e) => e.stopPropagation()} // impede clique no accordion
                    className="accent-clinical-500 rounded border-slate-800"
                  />
                  <span>Evento: Boas-vindas a Leads</span>
                </div>
                {activeAccordion === 'welcome' ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>

              {activeAccordion === 'welcome' && (
                <div className="px-4 pb-5 space-y-3.5 border-t border-slate-900/60 pt-4">
                  <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Mensagem automática disparada imediatamente após o visitante preencher o formulário de contato da LP pública.
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cópia da Mensagem</label>
                    <textarea
                      value={welcomeTemplate}
                      onChange={(e) => setWelcomeTemplate(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500"
                    />
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold bg-slate-950/60 p-2 rounded-lg border border-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-clinical-500 shrink-0" />
                    Tags disponíveis: <span className="text-teal-400 font-extrabold">[Nome]</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Confirm template accordion */}
            <div className="border border-slate-900 bg-slate-950/30 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'confirm' ? null : 'confirm')}
                className="w-full p-4 flex items-center justify-between font-bold text-xs text-white"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={confirmEnabled}
                    onChange={(e) => setConfirmEnabled(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="accent-clinical-500 rounded border-slate-800"
                  />
                  <span>Evento: Consulta Confirmada</span>
                </div>
                {activeAccordion === 'confirm' ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>

              {activeAccordion === 'confirm' && (
                <div className="px-4 pb-5 space-y-3.5 border-t border-slate-900/60 pt-4">
                  <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Mensagem automática enviada quando o profissional clica em "Confirmar Consulta" no painel da Agenda.
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cópia da Mensagem</label>
                    <textarea
                      value={confirmTemplate}
                      onChange={(e) => setConfirmTemplate(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500"
                    />
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold bg-slate-950/60 p-2 rounded-lg border border-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-clinical-500 shrink-0" />
                    Tags: <span className="text-teal-400 font-extrabold">[Nome], [Data], [Hora], [MeetLink]</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Cancel template accordion */}
            <div className="border border-slate-900 bg-slate-950/30 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'cancel' ? null : 'cancel')}
                className="w-full p-4 flex items-center justify-between font-bold text-xs text-white"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={cancelEnabled}
                    onChange={(e) => setCancelEnabled(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="accent-clinical-500 rounded border-slate-800"
                  />
                  <span>Evento: Consulta Cancelada / Recusada</span>
                </div>
                {activeAccordion === 'cancel' ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>

              {activeAccordion === 'cancel' && (
                <div className="px-4 pb-5 space-y-3.5 border-t border-slate-900/60 pt-4">
                  <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Mensagem automática disparada quando o agendamento é declinado ou cancelado no painel da Agenda.
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cópia da Mensagem</label>
                    <textarea
                      value={cancelTemplate}
                      onChange={(e) => setCancelTemplate(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500"
                    />
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold bg-slate-950/60 p-2 rounded-lg border border-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-clinical-500 shrink-0" />
                    Tags: <span className="text-teal-400 font-extrabold">[Nome], [Data], [Hora]</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="w-full bg-clinical-500 hover:bg-clinical-600 disabled:bg-clinical-500/40 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-clinical-500/20 flex items-center justify-center gap-2"
          >
            {savingSettings && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar Configurações de Templates
          </button>
        </div>

      </div>

      {/* Message Dispatched Logs Section */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6">
        <h4 className="font-extrabold text-sm text-white flex items-center gap-2 mb-6">
          <Lock className="h-4.5 w-4.5 text-clinical-500" />
          Histórico de Disparos de WhatsApp (Logs)
        </h4>

        {logs.length === 0 ? (
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-12 text-center text-slate-500 space-y-2">
            <MessageSquare className="h-8 w-8 mx-auto opacity-35" />
            <p className="text-xs font-bold text-slate-400">Nenhum log de disparo encontrado</p>
            <p className="text-[10px] text-slate-600">Dispare notificações ao captar leads ou atualizar consultas para popular esta tabela.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-3 px-4">Destinatário</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 max-w-xs truncate">Conteúdo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/20 text-slate-300">
                    <td className="py-3.5 px-4 font-bold">+{log.to}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-clinical-500/10 text-teal-400 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium" title={log.text}>
                      {log.text}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 w-fit px-2 py-0.5 rounded">
                        <CheckCircle className="h-3 w-3" />
                        Enviado
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pairing QR Code Modal */}
      {showPairingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-6">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-white">Vincular Celular ao WhatsApp</h3>
              <p className="text-[10px] text-slate-400 mt-1">Abra seu aplicativo do WhatsApp, vá em "Aparelhos Conectados" e escaneie o código abaixo.</p>
            </div>

            {/* QR Code Graphic Mockup */}
            <div className="bg-white p-6 rounded-2xl w-fit mx-auto shadow-inner relative group">
              <QrCode className="h-44 w-44 text-slate-950" />
              <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <Smartphone className="h-10 w-10 text-clinical-500 animate-bounce" />
                <span className="text-[10px] text-slate-500 font-bold mt-2">Aparelho Detectado...</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-left text-[9.5px] leading-relaxed text-slate-400 font-semibold space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-teal-400">1.</span>
                  <span>Certifique-se de que seu celular está conectado à internet.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-teal-400">2.</span>
                  <span>Mantenha esta página aberta até o pareamento terminar.</span>
                </div>
              </div>

              <button
                onClick={handleSimulateScan}
                className="w-full bg-clinical-500 hover:bg-clinical-600 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-clinical-500/25 transition-all duration-200"
              >
                Simular Escaneamento (Conectar)
              </button>
              
              <button
                onClick={() => {
                  setShowPairingModal(false);
                  setStatus('disconnected');
                }}
                className="text-xs text-slate-500 hover:text-slate-400 font-bold block mx-auto pt-1"
              >
                Cancelar Pareamento
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
