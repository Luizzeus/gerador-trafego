'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Calendar, 
  Clock, 
  Video, 
  Check, 
  X, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Loader2, 
  CheckCircle, 
  Phone, 
  Mail, 
  MessageSquare,
  AlertCircle,
  HelpCircle,
  CalendarCheck
} from 'lucide-react';

export default function AgendaPage() {
  const [loading, setLoading] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarAccount, setCalendarAccount] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'confirmed' | 'cancelled'
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [calData, apptData] = await Promise.all([
        api.getGoogleCalendarConnection(),
        api.getAppointments()
      ]);

      if (calData && calData.status === 'connected') {
        setCalendarConnected(true);
        setCalendarAccount(calData);
      } else {
        setCalendarConnected(false);
        setCalendarAccount(null);
      }

      setAppointments(apptData);
    } catch (e) {
      console.error('Erro ao carregar agenda:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenOAuth = () => {
    setShowConsentModal(true);
  };

  const handleConfirmOAuth = async () => {
    try {
      setLoading(true);
      setShowConsentModal(false);
      const accountName = 'Google Agenda - luiz.rocha@gmail.com';
      const accountId = 'luiz.rocha@gmail.com';
      
      await api.connectGoogleCalendar({ accountName, accountId });
      await loadData();
    } catch (e) {
      console.error('Erro ao conectar Google Agenda:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Deseja realmente desconectar sua conta do Google Agenda? Novas consultas confirmadas não gerarão links do Meet automaticamente.')) return;
    try {
      setLoading(true);
      await api.disconnectGoogleCalendar();
      await loadData();
    } catch (e) {
      console.error('Erro ao desconectar Google Agenda:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateAppointmentStatus(id, status);
      // Atualiza o estado local rapidamente
      loadData();
    } catch (e: any) {
      alert(e.message || 'Erro ao atualizar agendamento.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este agendamento do sistema?')) return;
    try {
      await api.deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (e: any) {
      alert(e.message || 'Erro ao excluir agendamento.');
    }
  };

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredAppointments = appointments.filter((a) => {
    if (activeFilter === 'pending') return a.status === 'pending';
    if (activeFilter === 'confirmed') return a.status === 'confirmed';
    return a.status === 'cancelled' || a.status === 'completed';
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando seus compromissos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Agenda de Atendimentos</h3>
          <p className="text-xs text-slate-500 mt-1">Gerencie seus horários, confirme consultas e envie links de videoconferência automáticos.</p>
        </div>

        {/* Status de Conexão com Google Agenda */}
        <div className="bg-slate-900/40 border border-slate-900 px-5 py-3 rounded-2xl flex items-center gap-4 hover:border-slate-800 transition-all shrink-0">
          <div className="bg-red-500/10 p-2 rounded-xl text-red-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Google Agenda</div>
            {calendarConnected ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-white max-w-[150px] truncate">{calendarAccount?.accountName.split(' - ')[1]}</span>
                <button
                  onClick={handleDisconnect}
                  className="text-[9px] font-extrabold text-red-400 hover:text-red-300 underline uppercase tracking-wider"
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenOAuth}
                className="text-[10px] font-bold text-clinical-500 hover:text-clinical-400 underline mt-0.5"
              >
                Conectar Minha Agenda
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex border-b border-slate-900 overflow-x-auto gap-2 pb-px">
        {[
          { id: 'pending', name: 'Pendentes de Confirmação', count: appointments.filter(a => a.status === 'pending').length },
          { id: 'confirmed', name: 'Consultas Confirmadas', count: appointments.filter(a => a.status === 'confirmed').length },
          { id: 'cancelled', name: 'Histórico / Canceladas', count: appointments.filter(a => a.status === 'cancelled' || a.status === 'completed').length },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 ${
                isActive 
                  ? 'border-clinical-500 text-teal-400 bg-clinical-500/5' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-clinical-500/20 text-teal-400' : 'bg-slate-900 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listagem */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-slate-900/10 border border-slate-900/60 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <CalendarCheck className="h-10 w-10 text-slate-600 opacity-55 mx-auto animate-pulse" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sem agendamentos nesta aba</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Os pré-agendamentos feitos pelos leads na sua Landing Page aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div 
              key={appt.id} 
              className={`bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-3xl p-6 shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${
                appt.status === 'confirmed' ? 'relative overflow-hidden' : ''
              }`}
            >
              {appt.status === 'confirmed' && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
              )}

              {/* Data & Horário */}
              <div className="lg:col-span-4 flex items-center gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900/80 text-center min-w-[75px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hora</span>
                  <span className="text-base font-black text-teal-400 mt-1 block">{formatTime(appt.scheduledTime)}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Consulta Pré-Agendada
                  </div>
                  <h4 className="text-xs font-bold text-white capitalize leading-snug">{formatDate(appt.scheduledTime)}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold block">Duração: {appt.durationMinutes} minutos</span>
                </div>
              </div>

              {/* Paciente / Contato */}
              <div className="lg:col-span-4 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Paciente / Lead</div>
                <div className="font-bold text-white text-xs">{appt.lead?.name}</div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-semibold">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-550" />
                    {appt.lead?.phone}
                  </div>
                  {appt.lead?.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-550" />
                      {appt.lead.email}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-clinical-500 font-bold bg-clinical-500/5 border border-clinical-500/10 px-2 py-0.5 rounded w-fit">
                  Serviço: {appt.lead?.serviceCategory?.name || 'Avaliação Inicial'}
                </div>
              </div>

              {/* Ações / Links Meet */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                
                {/* Agendamento Pendente */}
                {appt.status === 'pending' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                      className="flex-1 sm:flex-initial bg-slate-950 hover:bg-red-500/5 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Recusar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                      className="flex-1 sm:flex-initial bg-clinical-500 hover:bg-clinical-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Confirmar
                    </button>
                  </div>
                )}

                {/* Agendamento Confirmado */}
                {appt.status === 'confirmed' && (
                  <div className="w-full space-y-2.5">
                    {appt.meetingLink ? (
                      <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 truncate">
                          <Video className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="text-[10px] text-emerald-400 font-bold tracking-tight truncate max-w-[180px]">
                            {appt.meetingLink}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleCopy(appt.meetingLink, appt.id)}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
                            title="Copiar link da reunião"
                          >
                            {copiedText === appt.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <a
                            href={appt.meetingLink}
                            target="_blank"
                            className="bg-clinical-500 hover:bg-clinical-600 p-1.5 rounded-lg text-white transition-all"
                            title="Entrar no Google Meet"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-slate-500 bg-slate-900 px-3 py-2 rounded-xl text-center">
                        Confirmada (Sem Agenda conectada)
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                        className="text-[10px] font-bold text-slate-500 hover:text-red-400 hover:underline transition-colors"
                      >
                        Cancelar Consulta
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors"
                        title="Remover Registro"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Agendamento Cancelado ou Concluído */}
                {(appt.status === 'cancelled' || appt.status === 'completed') && (
                  <div className="flex items-center gap-3 w-full justify-between sm:justify-end">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                      appt.status === 'completed' 
                        ? 'bg-slate-900 text-slate-400 border-slate-800' 
                        : 'bg-red-500/10 text-red-400 border-red-500/10'
                    }`}>
                      {appt.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </span>
                    <button
                      onClick={() => handleDelete(appt.id)}
                      className="p-2.5 bg-slate-950 hover:bg-red-500/5 text-slate-500 hover:text-red-400 border border-slate-900 hover:border-red-500/20 rounded-xl transition-all"
                      title="Excluir Agendamento"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL POPUP: Consentimento Google Calendar Simulado */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-900">
              <div className="bg-gradient-to-tr from-clinical-500 to-indigo-500 p-2 rounded-xl shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Google Calendar Sync</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Autorização Google OAuth2</span>
              </div>
            </div>

            {/* Corpo */}
            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                A plataforma <strong>MedTraffic</strong> está solicitando permissão para sincronizar seus compromissos com o{' '}
                <span className="text-white font-bold">Google Agenda</span>.
              </p>

              <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 space-y-3.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Permissões Solicitadas:</div>
                
                <div className="flex gap-2.5 items-start">
                  <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">Ver, editar, compartilhar e excluir permanentemente todos os eventos nas suas agendas.</p>
                </div>
                
                <div className="flex gap-2.5 items-start">
                  <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">Criar reuniões automáticas do Google Meet vinculadas aos novos agendamentos.</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal">
                Ao clicar em "Permitir Acesso", sua conta do Google Agenda será integrada com segurança ao MedTraffic.
              </p>
            </div>

            {/* Ações */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConsentModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white py-3 rounded-xl text-xs font-bold transition-all text-center border border-slate-800"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleConfirmOAuth}
                className="bg-clinical-500 hover:bg-clinical-600 text-white py-3 rounded-xl text-xs font-bold transition-all text-center shadow-lg shadow-clinical-500/10"
              >
                Permitir Acesso
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
