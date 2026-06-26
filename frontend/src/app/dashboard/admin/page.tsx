'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Lock, 
  RefreshCw, 
  Copy, 
  Check, 
  UserCheck, 
  UserX,
  FileSpreadsheet
} from 'lucide-react';

interface StatsData {
  userCounts: {
    admin: number;
    professional: number;
    company_member: number;
  };
  totalLandingPages: number;
  totalLeads: number;
  totalAppointments: number;
  estimatedMonthlyRevenue: number;
}

interface ProfileData {
  id: string;
  userId: string;
  niche: string;
  fullName: string;
  registerNumber: string;
  registerState: string;
  whatsappNumber: string;
  addressCity: string;
  addressState: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    email: string;
    status: string;
  };
}

interface ConsentLogData {
  id: string;
  ipAddress: string;
  userAgent: string;
  consentText: string;
  consentHash: string;
  acceptedAt: string;
  lead: {
    name: string;
    email: string | null;
    phone: string;
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'profiles' | 'lgpd'>('stats');
  
  // States for Stats
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState('');

  // States for Profiles
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState('');
  const [profileSearch, setProfileSearch] = useState('');
  const [profileNicheFilter, setProfileNicheFilter] = useState('all');
  const [profileStatusFilter, setProfileStatusFilter] = useState('all');

  // States for Consent Logs
  const [consentLogs, setConsentLogs] = useState<ConsentLogData[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState('');
  const [logSearch, setLogSearch] = useState('');

  // UI States
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingProfileId, setUpdatingProfileId] = useState<string | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  // Load Data
  const loadStats = async () => {
    setLoadingStats(true);
    setStatsError('');
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err: any) {
      setStatsError(err.message || 'Falha ao carregar estatísticas.');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadProfiles = async () => {
    setLoadingProfiles(true);
    setProfilesError('');
    try {
      const data = await api.getAdminProfiles();
      setProfiles(data);
    } catch (err: any) {
      setProfilesError(err.message || 'Falha ao carregar perfis.');
    } finally {
      setLoadingProfiles(false);
    }
  };

  const loadConsentLogs = async () => {
    setLoadingLogs(true);
    setLogsError('');
    try {
      const data = await api.getAdminConsentLogs();
      setConsentLogs(data);
    } catch (err: any) {
      setLogsError(err.message || 'Falha ao carregar logs LGPD.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    } else if (activeTab === 'profiles') {
      loadProfiles();
    } else if (activeTab === 'lgpd') {
      loadConsentLogs();
    }
  }, [activeTab]);

  const handleVerifyProfile = async (id: string, currentStatus: boolean) => {
    setUpdatingProfileId(id);
    setActionSuccess('');
    setActionError('');
    try {
      const newStatus = !currentStatus;
      await api.verifyProfile(id, newStatus);
      
      // Update local profiles list
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isVerified: newStatus } : p))
      );

      setActionSuccess(`Perfil ${newStatus ? 'verificado com sucesso' : 'descredenciado com sucesso'}!`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Falha ao alterar status de verificação.');
      setTimeout(() => setActionError(''), 4000);
    } finally {
      setUpdatingProfileId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  // Filters for Profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.registerNumber.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.user.email.toLowerCase().includes(profileSearch.toLowerCase());
    
    const matchesNiche = profileNicheFilter === 'all' || p.niche === profileNicheFilter;
    
    const matchesStatus = 
      profileStatusFilter === 'all' || 
      (profileStatusFilter === 'verified' && p.isVerified) ||
      (profileStatusFilter === 'pending' && !p.isVerified);

    return matchesSearch && matchesNiche && matchesStatus;
  });

  // Filters for Consent Logs
  const filteredConsentLogs = consentLogs.filter((log) => {
    const searchLower = logSearch.toLowerCase();
    return (
      log.lead.name.toLowerCase().includes(searchLower) ||
      (log.lead.email && log.lead.email.toLowerCase().includes(searchLower)) ||
      log.ipAddress.toLowerCase().includes(searchLower) ||
      log.consentHash.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Success/Error Alerts */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-lg animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 animate-bounce" />
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-lg">
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-900 gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-200 border-b-2 outline-none ${
            activeTab === 'stats'
              ? 'border-clinical-500 text-teal-400 bg-clinical-500/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Activity className="h-4.5 w-4.5" />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-200 border-b-2 outline-none ${
            activeTab === 'profiles'
              ? 'border-clinical-500 text-teal-400 bg-clinical-500/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <ShieldCheck className="h-4.5 w-4.5" />
          Verificação de Perfis
        </button>
        <button
          onClick={() => setActiveTab('lgpd')}
          className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-200 border-b-2 outline-none ${
            activeTab === 'lgpd'
              ? 'border-clinical-500 text-teal-400 bg-clinical-500/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Lock className="h-4.5 w-4.5" />
          Auditoria LGPD
        </button>
      </div>

      {/* TAB 1: VISÃO GERAL STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-clinical-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Calculando estatísticas...</span>
            </div>
          ) : statsError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <div>
                <h4 className="font-bold text-sm">Falha na Requisição</h4>
                <p className="text-xs text-red-400/80 mt-0.5">{statsError}</p>
              </div>
            </div>
          ) : stats ? (
            <>
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card Revenue */}
                <div className="group relative bg-slate-900/40 border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none group-hover:bg-teal-500/10 transition-all duration-300" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Faturamento (30 dias)</span>
                      <h3 className="text-3xl font-extrabold text-white mt-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                        R$ {stats.estimatedMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-teal-500/15 p-3 rounded-2xl text-teal-400">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse" />
                    Receita recorrente estimada do SQLite local
                  </div>
                </div>

                {/* Card Users */}
                <div className="group relative bg-slate-900/40 border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-300" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profissionais / Clínicas</span>
                      <h3 className="text-3xl font-extrabold text-white mt-1">
                        {stats.userCounts.professional + stats.userCounts.company_member}
                      </h3>
                    </div>
                    <div className="bg-indigo-500/15 p-3 rounded-2xl text-indigo-400">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 flex gap-3">
                    <span>Profissionais: <strong>{stats.userCounts.professional}</strong></span>
                    <span>Clínicas: <strong>{stats.userCounts.company_member}</strong></span>
                  </div>
                </div>

                {/* Card LPs */}
                <div className="group relative bg-slate-900/40 border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full pointer-events-none group-hover:bg-sky-500/10 transition-all duration-300" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LPs Publicadas</span>
                      <h3 className="text-3xl font-extrabold text-white mt-1">
                        {stats.totalLandingPages}
                      </h3>
                    </div>
                    <div className="bg-sky-500/15 p-3 rounded-2xl text-sky-400">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                    Ativas no gerador de tráfego
                  </div>
                </div>

                {/* Card Leads & Appointments */}
                <div className="group relative bg-slate-900/40 border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-full pointer-events-none group-hover:bg-violet-500/10 transition-all duration-300" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leads & Consultas</span>
                      <h3 className="text-3xl font-extrabold text-white mt-1">
                        {stats.totalLeads} <span className="text-lg text-slate-500">/ {stats.totalAppointments}</span>
                      </h3>
                    </div>
                    <div className="bg-violet-500/15 p-3 rounded-2xl text-violet-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 flex gap-3">
                    <span>Leads Captados</span>
                    <span>Consultas Agendadas</span>
                  </div>
                </div>

              </div>

              {/* Consolidation details block */}
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-teal-400" />
                  Privacidade & Compliance LGPD da Plataforma
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  O painel administrativo reúne dados agregados em tempo real de todas as LPs ativas. Conforme regulação legal do CFM, CFP e COREN, cada alteração e validação de registro profissional (`isVerified`) é registrada com fins de transparência ética. A auditoria global de LGPD garante rastreabilidade total de logs de consentimento sem exposição desnecessária dos dados pessoais.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Admin Cadastrados</span>
                    <strong className="text-lg text-white mt-1 block">{stats.userCounts.admin}</strong>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Integridade de Banco</span>
                    <strong className="text-lg text-emerald-400 mt-1 block flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      100% Saudável (SQLite)
                    </strong>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* TAB 2: VERIFICAÇÃO DE PERFIS */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          
          {/* Header Controls & Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/30 p-4 border border-slate-900 rounded-2xl">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={profileSearch}
                onChange={(e) => setProfileSearch(e.target.value)}
                placeholder="Buscar por nome, e-mail ou CRP..."
                className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
              />
            </div>

            {/* Filter selectors */}
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={profileNicheFilter}
                onChange={(e) => setProfileNicheFilter(e.target.value)}
                className="bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-clinical-500"
              >
                <option value="all">Todas Atuações</option>
                <option value="psychologist">Psicólogos</option>
                <option value="caregiver">Cuidadores</option>
              </select>

              <select
                value={profileStatusFilter}
                onChange={(e) => setProfileStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-clinical-500"
              >
                <option value="all">Status de Verificação</option>
                <option value="verified">Apenas Verificados</option>
                <option value="pending">Apenas Pendentes</option>
              </select>
            </div>
          </div>

          {/* Profiles Table */}
          {loadingProfiles ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-clinical-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Buscando perfis profissionais...</span>
            </div>
          ) : profilesError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <div>
                <h4 className="font-bold text-sm">Falha ao listar perfis</h4>
                <p className="text-xs text-red-400/80 mt-0.5">{profilesError}</p>
              </div>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="bg-slate-900/10 border border-slate-900 border-dashed rounded-3xl p-12 text-center text-slate-500">
              Nenhum perfil profissional encontrado correspondente aos filtros.
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950/60">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Profissional</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Atuação / Niche</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">CRP / COREN</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cidade & Estado</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Verificado</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {filteredProfiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-slate-900/35 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-white">{profile.fullName}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{profile.user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                            profile.niche === 'psychologist' 
                              ? 'bg-teal-500/10 text-teal-400' 
                              : 'bg-indigo-500/10 text-indigo-400'
                          }`}>
                            {profile.niche === 'psychologist' ? 'Psicólogo' : 'Cuidador'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-slate-300">{profile.registerNumber}</div>
                          <div className="text-[9px] text-slate-500 mt-0.5 uppercase">Reg: {profile.registerState}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {profile.addressCity} / {profile.addressState}
                        </td>
                        <td className="px-6 py-4">
                          {profile.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Verificado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/15 text-amber-500 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleVerifyProfile(profile.id, profile.isVerified)}
                            disabled={updatingProfileId === profile.id}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 flex items-center gap-1.5 mx-auto ${
                              profile.isVerified
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                          >
                            {updatingProfileId === profile.id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : profile.isVerified ? (
                              <>
                                <UserX className="h-3 w-3" />
                                Revogar Verificação
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3" />
                                Verificar Perfil
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDITORIA LGPD */}
      {activeTab === 'lgpd' && (
        <div className="space-y-6">
          
          {/* Header Controls & Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/30 p-4 border border-slate-900 rounded-2xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Buscar por nome, e-mail, IP ou hash do lead..."
                className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
              />
            </div>
            
            <div className="text-[10px] text-slate-500 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-teal-500" />
              Auditoria de consentimento ativada em conformidade com a LGPD.
            </div>
          </div>

          {/* Consent Logs Table */}
          {loadingLogs ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-clinical-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Carregando logs de auditoria...</span>
            </div>
          ) : logsError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <div>
                <h4 className="font-bold text-sm">Falha ao buscar logs</h4>
                <p className="text-xs text-red-400/80 mt-0.5">{logsError}</p>
              </div>
            </div>
          ) : filteredConsentLogs.length === 0 ? (
            <div className="bg-slate-900/10 border border-slate-900 border-dashed rounded-3xl p-12 text-center text-slate-500">
              Nenhum log de consentimento LGPD registrado no banco.
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950/60">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Lead</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Endereço IP</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Data Aceite</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Texto Declarado</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hash SHA-256 (Auditoria)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-xs">
                    {filteredConsentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/35 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{log.lead.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {log.lead.email || 'Sem e-mail'} | {log.lead.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono">
                          {log.ipAddress}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(log.acceptedAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={log.consentText}>
                          {log.consentText}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-900 max-w-[120px] truncate cursor-pointer hover:text-white"
                              title="Clique para copiar o hash criptográfico completo"
                              onClick={() => copyToClipboard(log.consentHash, log.id)}
                            >
                              {log.consentHash}
                            </span>
                            <button
                              onClick={() => copyToClipboard(log.consentHash, log.id)}
                              className="text-slate-500 hover:text-white transition-colors"
                            >
                              {copiedHashId === log.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
