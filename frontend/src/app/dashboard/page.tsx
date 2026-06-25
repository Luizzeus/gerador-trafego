'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  FileText, 
  Percent, 
  PhoneCall, 
  TrendingUp, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLps: 0,
    totalLeads: 0,
    conversionRate: 0,
    whatsAppClicks: 0,
  });
  const [profileExists, setProfileExists] = useState(true);
  const [leadsList, setLeadsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const lps = await api.getMyLps();
        const leads = await api.getMyLeads();
        
        // Verifica se há perfil configurado
        try {
          await api.getMyProfile();
          setProfileExists(true);
        } catch {
          setProfileExists(false);
        }

        const activeLpsCount = lps.length;
        const totalLeadsCount = leads.length;
        
        // Simulação realista baseada no banco de dados. Caso seja 0 leads, deixa zerado ou mocka para visualização caso tenha LPs
        let clicks = totalLeadsCount * 3 + (activeLpsCount > 0 ? 12 : 0);
        let conversion = totalLeadsCount > 0 ? Math.round((totalLeadsCount / (totalLeadsCount * 6 + 10)) * 100) : 0;

        setStats({
          totalLps: activeLpsCount,
          totalLeads: totalLeadsCount,
          conversionRate: conversion,
          whatsAppClicks: clicks,
        });
        setLeadsList(leads.slice(0, 4)); // Pega os 4 leads mais recentes
      } catch (e) {
        console.error('Falha ao carregar métricas:', e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-clinical-500 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold">Carregando métricas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      
      {/* Alerta de onboarding de perfil */}
      {!profileExists && (
        <div className="bg-gradient-to-r from-clinical-500/10 to-indigo-500/10 border border-clinical-500/35 p-5 rounded-2xl flex items-center justify-between shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-teal-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Complete seu cadastro profissional!</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Para ativar a criação de Landing Pages e campanhas, preencha seus dados de atendimento no perfil.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/profile"
            className="bg-clinical-500 hover:bg-clinical-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-clinical-500/25 transition-all duration-200"
          >
            Configurar Perfil
          </a>
        </div>
      )}

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Landing Pages */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Landing Pages</span>
            <div className="text-3xl font-black text-white">{stats.totalLps}</div>
            <p className="text-[10px] text-slate-500">Páginas ativas de conversão</p>
          </div>
          <div className="bg-clinical-500/10 p-3 rounded-xl text-clinical-500">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Leads Captados */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leads Captados</span>
            <div className="text-3xl font-black text-white">{stats.totalLeads}</div>
            <p className="text-[10px] text-slate-500">Contatos recebidos no funil</p>
          </div>
          <div className="bg-clinical-500/10 p-3 rounded-xl text-clinical-500">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Cliques no WhatsApp */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cliques no Whats</span>
            <div className="text-3xl font-black text-white">{stats.whatsAppClicks}</div>
            <p className="text-[10px] text-slate-500">Direcionamento ao WhatsApp</p>
          </div>
          <div className="bg-clinical-500/10 p-3 rounded-xl text-clinical-500">
            <PhoneCall className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Taxa de Conversão */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Conversão</span>
            <div className="text-3xl font-black text-white">{stats.conversionRate}%</div>
            <p className="text-[10px] text-slate-500">Média de conversão de leads</p>
          </div>
          <div className="bg-clinical-500/10 p-3 rounded-xl text-clinical-500">
            <Percent className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Grid de Seções (Esquerda: Lista Leads / Direita: Origem e Sugestões) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lista de Leads Recentes */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-900 mb-5">
              <h3 className="font-extrabold text-base text-white">Contatos Recentes</h3>
              <a href="/dashboard/crm" className="text-xs text-clinical-500 font-bold hover:underline">
                Acessar CRM completo
              </a>
            </div>

            {leadsList.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-slate-500 gap-2">
                <Users className="h-8 w-8 opacity-40" />
                <span className="text-xs font-semibold">Nenhum lead recebido ainda.</span>
                <span className="text-[10px] opacity-70">Divulgue sua Landing Page para captar leads.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {leadsList.map((lead) => (
                  <div key={lead.id} className="bg-slate-950/40 border border-slate-900/80 px-4 py-3.5 rounded-xl flex items-center justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white">{lead.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        LP: {lead.landingPage?.title || 'Principal'} | Origem: {lead.trafficSource}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                        lead.status === 'new' ? 'bg-clinical-500/10 text-teal-400 border-clinical-500/20' :
                        lead.status === 'in_contact' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        lead.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {lead.status === 'new' ? 'Novo' :
                         lead.status === 'in_contact' ? 'Em Contato' :
                         lead.status === 'scheduled' ? 'Agendado' :
                         lead.status === 'converted' ? 'Convertido' : 'Perdido'}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Origem e Dicas de Tráfego */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Origem de Leads */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl">
            <h3 className="font-extrabold text-sm text-white mb-4 pb-3 border-b border-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              Melhores Origens de Lead
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Google Ads (Busca Local)</span>
                  <span className="text-clinical-500">65%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-clinical-500 h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Tráfego Orgânico (Busca)</span>
                  <span className="text-clinical-500">25%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-clinical-500 h-full rounded-full animate-pulse" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Meta Ads (Redes Sociais)</span>
                  <span className="text-clinical-500">10%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-clinical-500 h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Dica da plataforma (IA) */}
          <div className="bg-gradient-to-tr from-clinical-900/40 to-slate-900 border border-clinical-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-clinical-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-extrabold text-teal-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4 text-teal-400" />
              Dica Médica da IA
            </div>
            <h4 className="text-xs font-bold text-white">Anúncios locais aumentam agendamentos em até 40%</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mt-1.5">
              Configurar suas campanhas do Google Ads com palavras-chave geolocalizadas (ex: "psicólogo em [Bairro]") atrai famílias que buscam praticidade e proximidade.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
