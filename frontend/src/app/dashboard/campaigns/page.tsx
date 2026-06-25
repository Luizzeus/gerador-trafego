'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Loader2, 
  Chrome, 
  Facebook, 
  Link, 
  Check, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  DollarSign, 
  Percent, 
  Sparkles,
  AlertCircle,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'integrations'
  
  // Modais e formulários
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState<{ show: boolean; provider: string | null }>({ show: false, provider: null });
  const [creating, setCreating] = useState(false);
  
  // Campos do formulário de criação
  const [formName, setFormName] = useState('');
  const [formChannel, setFormChannel] = useState('google_ads');
  const [formLpId, setFormLpId] = useState('');
  const [formBudget, setFormBudget] = useState('30');
  const [formKeywords, setFormKeywords] = useState('');
  const [formSelectedCopy, setFormSelectedCopy] = useState<any>({ title: '', body: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [connData, campData, lpData] = await Promise.all([
        api.getAdsConnections(),
        api.getCampaigns(),
        api.getMyLps()
      ]);
      
      setConnections(connData);
      setCampaigns(campData);
      
      // Filtrar apenas LPs publicadas
      const publishedLps = lpData.filter((lp: any) => lp.status === 'published');
      setLandingPages(publishedLps);
      if (publishedLps.length > 0) {
        setFormLpId(publishedLps[0].id);
      }

      // Tenta carregar sugestões de IA de forma silenciosa para o formulário
      try {
        const sugg = await api.getCampaignSuggestions();
        setAiSuggestions(sugg);
      } catch {
        // Ignora falha de carregar sugestões se perfil não estiver preenchido
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  }

  const isConnected = (provider: string) => {
    return connections.some((c) => c.provider === provider && c.status === 'connected');
  };

  const getConnectedAccount = (provider: string) => {
    return connections.find((c) => c.provider === provider && c.status === 'connected');
  };

  // Abre popup simulado de OAuth2
  const handleOpenOAuth = (provider: string) => {
    setShowConsentModal({ show: true, provider });
  };

  // Simula confirmação do consentimento OAuth2
  const handleConfirmOAuth = async () => {
    const provider = showConsentModal.provider;
    if (!provider) return;

    try {
      setLoading(true);
      setShowConsentModal({ show: false, provider: null });
      
      const accountName = provider === 'google_ads' 
        ? `Google Ads - Luiz Rocha (109-883-2947)` 
        : `Meta Business - Luiz Rocha (ID: 88392019)`;
      const accountId = provider === 'google_ads' ? '109-883-2947' : '88392019';

      await api.connectAdsAccount({ provider, accountName, accountId });
      await loadData();
    } catch (e) {
      console.error('Erro ao conectar conta:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!confirm(`Deseja realmente desconectar sua conta do ${provider === 'google_ads' ? 'Google Ads' : 'Meta Ads'}?`)) return;
    try {
      setLoading(true);
      await api.disconnectAdsAccount(provider);
      await loadData();
    } catch (e) {
      console.error('Erro ao desconectar conta:', e);
    } finally {
      setLoading(false);
    }
  };

  // Preenche dados da cópia sugerida pela IA baseada no canal selecionado
  useEffect(() => {
    if (aiSuggestions) {
      if (formChannel === 'google_ads') {
        const ad = aiSuggestions.googleAds?.[0];
        setFormSelectedCopy({
          title: ad?.title || 'Psicologia e Bem Estar',
          body: ad?.description || 'Agende sua consulta com profissional especializado.',
          keywords: ad?.keywords || 'psicologo, terapia'
        });
        setFormKeywords(ad?.keywords || '');
      } else {
        const ad = aiSuggestions.metaAds?.[0];
        setFormSelectedCopy({
          title: ad?.headline || 'Terapia Individual',
          body: ad?.primaryText || 'Cuidar da mente é cuidar de você.',
          keywords: ''
        });
        setFormKeywords('');
      }
    }
  }, [formChannel, aiSuggestions]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLpId) {
      alert('Você precisa ter uma Landing Page publicada para veicular anúncios.');
      return;
    }

    if (!isConnected(formChannel)) {
      alert(`Sua conta de anúncios do ${formChannel === 'google_ads' ? 'Google Ads' : 'Meta Ads'} precisa estar conectada para criar a campanha.`);
      return;
    }

    try {
      setCreating(true);
      await api.createCampaign({
        name: formName || `Campanha - ${formChannel === 'google_ads' ? 'Google Ads' : 'Meta Ads'}`,
        channel: formChannel,
        landingPageId: formLpId,
        budget: parseFloat(formBudget),
        targetKeywords: formKeywords
      });

      setShowCreateModal(false);
      setFormName('');
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Erro ao criar campanha.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await api.updateCampaignStatus(id, newStatus);
      // Atualiza estado local de forma rápida
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (e) {
      console.error('Erro ao atualizar status:', e);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Deseja realmente remover esta campanha do MedTraffic e parar a simulação de tráfego?')) return;
    try {
      await api.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error('Erro ao excluir campanha:', e);
    }
  };

  if (loading && campaigns.length === 0 && connections.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando painel de campanhas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Gestão de Tráfego Local</h3>
          <p className="text-xs text-slate-500 mt-1">Conecte suas contas de anúncios e publique suas campanhas para captar leads qualificados.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'campaigns' ? 'integrations' : 'campaigns')}
            className="border border-slate-800 hover:border-slate-700 bg-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-300"
          >
            {activeTab === 'campaigns' ? 'Configurar Contas (OAuth)' : 'Ver Campanhas'}
          </button>
          
          <button
            onClick={() => {
              if (landingPages.length === 0) {
                alert('Você precisa criar e publicar pelo que menos 1 Landing Page antes de lançar uma campanha de anúncios.');
                return;
              }
              setShowCreateModal(true);
            }}
            className="bg-clinical-500 hover:bg-clinical-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Lançar Campanha
          </button>
        </div>
      </div>

      {/* Tabs */}
      {activeTab === 'campaigns' ? (
        <div className="space-y-6">
          
          {/* Alerta se não houver contas conectadas */}
          {connections.length === 0 && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/25 p-5 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Nenhuma conta de anúncios conectada</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Para publicar campanhas no Google Ads ou Meta Ads, você precisa conectar suas contas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('integrations')}
                className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/25 text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Conectar Contas
              </button>
            </div>
          )}

          {/* Cards Rápidos de Performance das Campanhas */}
          {campaigns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Gasto</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    R$ {campaigns.reduce((acc, c) => acc + (c.metrics?.spend || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-teal-400">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Visualizações (Imp.)</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    {campaigns.reduce((acc, c) => acc + (c.metrics?.impressions || 0), 0).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cliques Gerados</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    {campaigns.reduce((acc, c) => acc + (c.metrics?.clicks || 0), 0).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-emerald-400">
                  <MousePointerClick className="h-4 w-4" />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Leads de Tráfego</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    {campaigns.reduce((acc, c) => acc + (c.metrics?.conversions || 0), 0)}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-teal-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>

            </div>
          )}

          {/* Lista de Campanhas */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl">
            <h4 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
              <Megaphone className="h-4.5 w-4.5 text-teal-400" />
              Campanhas em Andamento
            </h4>

            {campaigns.length === 0 ? (
              <div className="h-[250px] flex flex-col items-center justify-center text-slate-500 gap-3 text-center max-w-sm mx-auto">
                <Megaphone className="h-10 w-10 text-slate-600 opacity-50" />
                <span className="text-xs font-bold text-slate-400">Nenhuma campanha rodando</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Crie campanhas vinculadas à sua Landing Page para capturar leads através de tráfego pago simulado de forma rápida.
                </p>
                <button
                  onClick={() => {
                    if (landingPages.length === 0) {
                      alert('Você precisa ter uma Landing Page publicada para veicular anúncios.');
                      return;
                    }
                    setShowCreateModal(true);
                  }}
                  className="bg-clinical-500/10 hover:bg-clinical-500/20 text-teal-400 border border-clinical-500/20 text-xs font-bold px-4 py-2 rounded-xl transition-all mt-2"
                >
                  Criar Minha Primeira Campanha
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Canal / Nome</th>
                      <th className="pb-3 px-4">Landing Page</th>
                      <th className="pb-3 px-4 text-right">Orçamento Diário</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 px-4 text-right">Gastos</th>
                      <th className="pb-3 px-4 text-right">Impressões</th>
                      <th className="pb-3 px-4 text-right">Cliques (CTR)</th>
                      <th className="pb-3 px-4 text-right">Leads (CV)</th>
                      <th className="pb-3 pl-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/50 text-xs text-slate-300">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${
                              c.channel === 'google_ads' 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {c.channel === 'google_ads' ? <Chrome className="h-4.5 w-4.5" /> : <Facebook className="h-4.5 w-4.5" />}
                            </div>
                            <div>
                              <div className="font-bold text-white leading-normal truncate max-w-[180px]">{c.name}</div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                                {c.channel === 'google_ads' ? 'Google Search' : 'Meta Social Ads'}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4 font-medium text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Link className="h-3.5 w-3.5 text-slate-600" />
                            <a
                              href={`/lp/${c.landingPage?.subdomain}`}
                              target="_blank"
                              className="hover:text-teal-400 hover:underline truncate max-w-[120px]"
                            >
                              {c.landingPage?.title}
                            </a>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right font-semibold text-white">
                          R$ {c.budget.toFixed(2)}/dia
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                            {c.status === 'active' ? 'Ativa' : 'Pausada'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right font-bold text-slate-200">
                          R$ {c.metrics?.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-4 text-right text-slate-400">
                          {c.metrics?.impressions.toLocaleString('pt-BR')}
                        </td>

                        <td className="py-4 px-4 text-right text-slate-200">
                          <div className="font-semibold">{c.metrics?.clicks}</div>
                          <div className="text-[10px] text-slate-500">CTR {c.metrics?.ctr}%</div>
                        </td>

                        <td className="py-4 px-4 text-right text-teal-400">
                          <div className="font-bold">{c.metrics?.conversions}</div>
                          <div className="text-[10px] text-slate-500">CPC R$ {c.metrics?.cpc.toFixed(2)}</div>
                        </td>

                        <td className="py-4 pl-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(c.id, c.status)}
                              className={`p-2 rounded-xl transition-all border ${
                                c.status === 'active' 
                                  ? 'border-slate-800 hover:border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/5' 
                                  : 'border-slate-800 hover:border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5'
                              }`}
                              title={c.status === 'active' ? 'Pausar Campanha' : 'Retomar Campanha'}
                            >
                              {c.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteCampaign(c.id)}
                              className="p-2 rounded-xl border border-slate-800 hover:border-red-500/30 text-red-400 hover:bg-red-500/5 transition-all"
                              title="Excluir Campanha"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Seção de Integrações (OAuth2) */
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 shadow-xl max-w-3xl mx-auto space-y-6">
          <h4 className="font-extrabold text-sm text-white pb-3 border-b border-slate-900 flex items-center gap-2">
            <Link className="h-4.5 w-4.5 text-teal-400" />
            Contas de Tráfego Conectadas (OAuth2)
          </h4>

          <div className="space-y-6">
            
            {/* Google Ads */}
            <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                  <Chrome className="h-7 w-7" />
                </div>
                <div>
                  <h5 className="font-extrabold text-white text-sm">Google Ads</h5>
                  <p className="text-xs text-slate-500 leading-normal mt-0.5">Veicule anúncios na rede de pesquisa e mapas do Google localmente.</p>
                  
                  {isConnected('google_ads') ? (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <Check className="h-3.5 w-3.5" />
                      Ativo: {getConnectedAccount('google_ads')?.accountName}
                    </div>
                  ) : (
                    <span className="mt-2.5 inline-block text-[10px] text-slate-500 font-semibold bg-slate-900 px-2.5 py-1 rounded-full">
                      Não conectado
                    </span>
                  )}
                </div>
              </div>

              <div>
                {isConnected('google_ads') ? (
                  <button
                    onClick={() => handleDisconnect('google_ads')}
                    className="w-full md:w-auto bg-slate-950 hover:bg-red-500/5 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 px-5 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    Desconectar Conta
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenOAuth('google_ads')}
                    className="w-full md:w-auto bg-clinical-500 hover:bg-clinical-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-clinical-500/10"
                  >
                    Conectar Google Ads
                  </button>
                )}
              </div>
            </div>

            {/* Meta Ads */}
            <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400">
                  <Facebook className="h-7 w-7" />
                </div>
                <div>
                  <h5 className="font-extrabold text-white text-sm">Meta Ads (Facebook / Instagram)</h5>
                  <p className="text-xs text-slate-500 leading-normal mt-0.5">Exiba banners e anúncios em carrossel no Instagram e Facebook.</p>
                  
                  {isConnected('meta_ads') ? (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <Check className="h-3.5 w-3.5" />
                      Ativo: {getConnectedAccount('meta_ads')?.accountName}
                    </div>
                  ) : (
                    <span className="mt-2.5 inline-block text-[10px] text-slate-500 font-semibold bg-slate-900 px-2.5 py-1 rounded-full">
                      Não conectado
                    </span>
                  )}
                </div>
              </div>

              <div>
                {isConnected('meta_ads') ? (
                  <button
                    onClick={() => handleDisconnect('meta_ads')}
                    className="w-full md:w-auto bg-slate-950 hover:bg-red-500/5 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 px-5 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    Desconectar Conta
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenOAuth('meta_ads')}
                    className="w-full md:w-auto bg-clinical-500 hover:bg-clinical-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-clinical-500/10"
                  >
                    Conectar Meta Ads
                  </button>
                )}
              </div>
            </div>

          </div>

          <div className="bg-clinical-500/5 border border-clinical-500/15 p-4 rounded-xl text-[10px] text-teal-400 font-medium leading-relaxed">
            💡 NOTA: A integração utiliza chaves e credenciais de segurança temporárias (OAuth2). Toda publicação ou alteração de campanha feita pelo painel do MedTraffic será sincronizada instantaneamente com as contas autorizadas.
          </div>
        </div>
      )}

      {/* MODAL POPUP: Consentimento OAuth2 Simulado */}
      {showConsentModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative space-y-6">
            
            {/* Header do Consentimento */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-900">
              <div className="bg-gradient-to-tr from-clinical-500 to-indigo-500 p-2 rounded-xl shrink-0">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Solicitação de Acesso</h4>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Autorização OAuth2</span>
              </div>
            </div>

            {/* Corpo */}
            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                A plataforma <strong>MedTraffic</strong> está solicitando permissão para se conectar e gerenciar sua conta de anúncios do{' '}
                <span className="text-white font-bold">
                  {showConsentModal.provider === 'google_ads' ? 'Google Ads' : 'Meta Ads'}
                </span>.
              </p>

              <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 space-y-3.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Permissões Solicitadas:</div>
                
                <div className="flex gap-2.5 items-start">
                  <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">Gerenciar campanhas, grupos de anúncios, anúncios e orçamentos.</p>
                </div>
                
                <div className="flex gap-2.5 items-start">
                  <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">Visualizar relatórios de desempenho (impressões, cliques, custos).</p>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">Editar extensões e configurações geográficas de anúncios.</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal">
                Ao clicar em "Permitir Acesso", um token de acesso seguro será gerado e vinculado à sua conta do MedTraffic em conformidade com as diretrizes de privacidade.
              </p>
            </div>

            {/* Ações */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConsentModal({ show: false, provider: null })}
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

      {/* MODAL: Criar Campanha Wizard */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 my-8">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-teal-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-white">Lançar Nova Campanha de Tráfego</h4>
                  <p className="text-[10px] text-slate-500">Configure seu orçamento e use as copys geradas pela IA.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-900 hover:border-slate-800 transition-all"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-5">
              
              {/* Canal & Nome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nome da Campanha</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Terapia Ansiedade Campinas"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Canal de Veiculação</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-clinical-500"
                  >
                    <option value="google_ads">Google Ads (Search)</option>
                    <option value="meta_ads">Meta Ads (Instagram/FB)</option>
                  </select>
                </div>
              </div>

              {/* Status de Conexão do Canal Escolhido */}
              {!isConnected(formChannel) ? (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between gap-3 text-red-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="text-[11px] font-semibold leading-relaxed">
                      Sua conta do {formChannel === 'google_ads' ? 'Google Ads' : 'Meta Ads'} não está conectada.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setActiveTab('integrations');
                      handleOpenOAuth(formChannel);
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all shrink-0"
                  >
                    Conectar Agora
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-2xl flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                  <Check className="h-4 w-4 shrink-0" />
                  Conta conectada com sucesso: {getConnectedAccount(formChannel)?.accountName}
                </div>
              )}

              {/* Orçamento e Landing Page */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Orçamento Diário (R$)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="Mínimo R$ 10"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Landing Page de Destino</label>
                  <select
                    value={formLpId}
                    onChange={(e) => setFormLpId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-clinical-500"
                  >
                    {landingPages.map((lp) => (
                      <option key={lp.id} value={lp.id}>{lp.title} ({lp.subdomain}.medtraffic.com.br)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Importação Automática das Copys de IA */}
              <div className="bg-slate-900/35 border border-slate-900 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
                    <Sparkles className="h-4 w-4 text-teal-400" />
                    Copys de Anúncio Geradas por IA
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded">
                    Sincronizado
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Título Recomendado</span>
                    <div className="bg-slate-950/40 border border-slate-900/60 p-3 rounded-xl text-xs text-slate-300 font-bold leading-normal mt-1">
                      {formSelectedCopy.title}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Texto/Descrição da Campanha</span>
                    <div className="bg-slate-950/40 border border-slate-900/60 p-3 rounded-xl text-xs text-slate-400 leading-relaxed mt-1 whitespace-pre-line">
                      {formSelectedCopy.body}
                    </div>
                  </div>

                  {formChannel === 'google_ads' && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Palavras-chave de Tráfego</span>
                      <textarea
                        value={formKeywords}
                        onChange={(e) => setFormKeywords(e.target.value)}
                        placeholder="Palavras-chave separadas por vírgula"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-clinical-500 mt-1 h-16 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={creating || !isConnected(formChannel)}
                className="w-full bg-clinical-500 hover:bg-clinical-600 disabled:bg-slate-900 disabled:text-slate-600 text-white py-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-clinical-500/10 mt-6"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Publicando Anúncio nas APIs...
                  </>
                ) : (
                  <>
                    <Check className="h-4.5 w-4.5" />
                    Publicar Campanha e Começar a Rodar
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
