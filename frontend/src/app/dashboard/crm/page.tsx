'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Download
} from 'lucide-react';

export default function CRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await api.exportLeads();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erro ao exportar leads:', e);
      alert('Falha ao exportar leads. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { key: 'new', title: 'Novo Lead', color: 'border-teal-500 text-teal-400 bg-teal-500/5' },
    { key: 'in_contact', title: 'Em Contato', color: 'border-yellow-500 text-yellow-400 bg-yellow-500/5' },
    { key: 'scheduled', title: 'Agendado', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/5' },
    { key: 'converted', title: 'Convertido', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/5' },
    { key: 'lost', title: 'Perdido', color: 'border-red-500 text-red-400 bg-red-500/5' },
  ];

  async function loadLeads() {
    try {
      const data = await api.getMyLeads();
      setLeads(data);
    } catch (e) {
      console.error('Falha ao buscar leads');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const updated = await api.updateLeadStatus(leadId, newStatus);
      setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
    } catch (e) {
      console.error('Erro ao atualizar status do lead');
    } finally {
      setUpdatingId(null);
    }
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    // Limpa caracteres especiais do telefone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Olá ${name}, obrigado por entrar em contato através da nossa página. Como posso te ajudar hoje?`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando funil de leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Gestão do Funil Comercial (CRM)</h3>
          <p className="text-xs text-slate-500 mt-1">Acompanhe a jornada de atração de cada lead e inicie o contato direto via WhatsApp.</p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exporting || leads.length === 0}
          className="bg-slate-900/60 hover:bg-slate-800 border border-slate-900 px-5 py-3 rounded-2xl flex items-center gap-2 hover:border-slate-800 transition-all font-bold text-xs uppercase tracking-wider text-slate-300 disabled:opacity-55 disabled:cursor-not-allowed shrink-0"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin text-clinical-500" />
          ) : (
            <Download className="h-4 w-4 text-clinical-500" />
          )}
          Exportar Leads
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-x-auto pb-4">
        
        {columns.map((col) => {
          const colLeads = leads.filter(lead => lead.status === col.key);
          
          return (
            <div key={col.key} className="bg-slate-900/20 border border-slate-900 rounded-3xl p-4 min-w-[250px] flex flex-col h-[70vh] shrink-0">
              
              {/* Column Header */}
              <div className={`border-b-2 px-3 pb-3 mb-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider ${col.color}`}>
                <span>{col.title}</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded-full text-[10px] text-slate-400">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-grow space-y-3 overflow-y-auto pr-1">
                {colLeads.length === 0 ? (
                  <div className="h-[100px] flex flex-col items-center justify-center text-slate-700 text-center gap-1 border border-dashed border-slate-900/60 rounded-2xl">
                    <Users className="h-5 w-5 opacity-30" />
                    <span className="text-[9px] font-semibold">Sem contatos</span>
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const hasConsentLog = lead.consentLogs && lead.consentLogs.length > 0;
                    const consentHash = hasConsentLog ? lead.consentLogs[0].consentHash.slice(0, 12) : null;
                    
                    return (
                      <div 
                        key={lead.id} 
                        className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-md hover:border-slate-700 transition-all duration-200 space-y-3 relative overflow-hidden"
                      >
                        {updatingId === lead.id && (
                          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                            <Loader2 className="h-4 w-4 animate-spin text-clinical-500" />
                          </div>
                        )}

                        {/* Name and Origin */}
                        <div>
                          <h4 className="text-xs font-bold text-white truncate">{lead.name}</h4>
                          <span className="text-[9px] text-slate-500 block mt-0.5 truncate">
                            Origem: {lead.trafficSource} | LP: {lead.landingPage?.subdomain || 'Principal'}
                          </span>
                        </div>

                        {/* WhatsApp Redirect Action */}
                        <a
                          href={getWhatsAppLink(lead.phone, lead.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Falar no WhatsApp
                        </a>

                        {/* LGPD Evidence Log Indicator */}
                        {consentHash && (
                          <div className="bg-slate-950/40 border border-slate-900/60 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-[8px] text-slate-500 font-semibold leading-none">
                            <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                            <span className="truncate">LGPD Hash: {consentHash}...</span>
                          </div>
                        )}

                        {/* Status Select dropdown */}
                        <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between gap-2">
                          <span className="text-[9px] text-slate-500 font-bold uppercase">Mudar Status</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="bg-slate-950 border border-slate-900 text-slate-300 text-[10px] font-semibold rounded-lg px-1.5 py-1 focus:outline-none focus:border-clinical-500"
                          >
                            <option value="new">Novo</option>
                            <option value="in_contact">Em Contato</option>
                            <option value="scheduled">Agendado</option>
                            <option value="converted">Convertido</option>
                            <option value="lost">Perdido</option>
                          </select>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
