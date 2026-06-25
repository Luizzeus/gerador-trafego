'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle,
  Smartphone,
  Monitor,
  Check,
  ExternalLink,
  MessageSquare,
  MapPin,
  Clock,
  Heart,
  Info,
  ChevronDown
} from 'lucide-react';

export default function BlocksEditor() {
  const router = useRouter();
  const params = useParams();
  const lpId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lp, setLp] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  // Visual Mode: 'desktop' | 'mobile'
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Form Content states (parsed from contentJson)
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('Enviar e Falar no WhatsApp');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  // Notification states
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadLpData();
  }, [lpId]);

  async function loadLpData() {
    try {
      setLoading(true);
      const lpData = await api.getLpById(lpId);
      setLp(lpData);
      
      const profileData = await api.getMyProfile();
      setProfile(profileData);

      // Parse JSON de Conteúdo
      let content: any = {};
      try {
        content = JSON.parse(lpData.contentJson);
      } catch {
        content = {};
      }

      setHeadline(content.headline || '');
      setSubheadline(content.subheadline || '');
      setCtaText(content.ctaText || 'Enviar e Falar no WhatsApp');
      setBenefits(content.benefits || []);
      setFaqs(content.faqs || []);
    } catch (e) {
      console.error('Erro ao carregar dados do editor:', e);
      setErrorMsg('Não foi possível carregar as informações desta Landing Page.');
    } finally {
      setLoading(false);
    }
  }

  // Ações de Benefício
  const handleAddBenefit = () => {
    setBenefits([...benefits, 'Novo benefício atrativo']);
  };

  const handleUpdateBenefit = (index: number, val: string) => {
    const updated = [...benefits];
    updated[index] = val;
    setBenefits(updated);
  };

  const handleDeleteBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  // Ações de FAQ
  const handleAddFaq = () => {
    setFaqs([...faqs, { q: 'Nova Pergunta?', a: 'Escreva a resposta acolhedora aqui.' }]);
  };

  const handleUpdateFaq = (index: number, field: 'q' | 'a', val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: val };
    setFaqs(updated);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  // Salvar no Banco
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus('saving');
      setErrorMsg('');

      const updatedContent = {
        headline,
        subheadline,
        ctaText,
        benefits,
        faqs
      };

      await api.updateLp(lpId, {
        title: lp.title,
        subdomain: lp.subdomain,
        pixelMetaId: lp.pixelMetaId || undefined,
        pixelGoogleId: lp.pixelGoogleId || undefined,
        status: lp.status,
        contentJson: JSON.stringify(updatedContent)
      });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e: any) {
      console.error('Erro ao salvar:', e);
      setSaveStatus('error');
      setErrorMsg(e.message || 'Falha ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-clinical-500" />
        <span className="text-sm font-semibold tracking-wider">Carregando editor visual de blocos...</span>
      </div>
    );
  }

  if (errorMsg && !lp) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-center max-w-md mx-auto gap-4">
        <Info className="h-10 w-10 text-red-500 animate-pulse" />
        <h3 className="font-extrabold text-white text-lg">Erro ao Carregar Editor</h3>
        <p className="text-xs text-slate-400">{errorMsg}</p>
        <button
          onClick={() => router.push('/dashboard/landing-pages')}
          className="bg-slate-900 border border-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          Voltar para Páginas de Captura
        </button>
      </div>
    );
  }

  const isPsychologist = profile?.niche === 'psychologist';

  return (
    <div className="flex flex-col h-screen -m-6 bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-900/80 bg-slate-950 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/landing-pages')}
            className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm text-white">Editor de Blocos</h2>
              <span className="bg-clinical-500/10 border border-clinical-500/25 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {lp?.status === 'published' ? 'No Ar' : 'Rascunho'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Editando: {lp?.title} (lp/{lp?.subdomain})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
              <Check className="h-4 w-4" />
              Salvo com sucesso!
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-xs text-red-400 font-bold bg-red-500/15 border border-red-500/20 px-3.5 py-1.5 rounded-xl">
              {errorMsg || 'Erro ao salvar'}
            </span>
          )}
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-clinical-500 hover:bg-clinical-600 disabled:bg-clinical-500/40 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-clinical-500/20 transition-all duration-200 flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Alterações
          </button>
        </div>
      </header>

      {/* Main Container: Editor Panel (Left) & Live Preview (Right) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Accordion Controls */}
        <aside className="w-1/2 border-r border-slate-900/80 p-6 overflow-y-auto space-y-6">
          
          {/* Hero Block accordion */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900/80">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-clinical-500" />
                Bloco 1: Seção Principal (Hero)
              </h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Headline (Título de Impacto)
                </label>
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Ex: Cuidado Psicológico Dedicado"
                  rows={2}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Subheadline (Subtítulo de Apoio)
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Ex: Atendimento focado em ansiedade e fobias..."
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Texto do Botão de Contato (CTA)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: Enviar e Falar no WhatsApp"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Benefits Block accordion */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900/80">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-clinical-500" />
                Bloco 2: Lista de Benefícios / Recursos
              </h4>
              <button
                onClick={handleAddBenefit}
                className="bg-clinical-500/10 hover:bg-clinical-500/20 text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-clinical-500/20 transition-all flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                  <span className="text-[10px] font-bold text-slate-500 w-5 text-center">#{idx + 1}</span>
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleUpdateBenefit(idx, e.target.value)}
                    className="flex-1 bg-transparent border-none py-1 text-xs text-white focus:outline-none placeholder-slate-700"
                  />
                  <button
                    onClick={() => handleDeleteBenefit(idx)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {benefits.length === 0 && (
                <p className="text-[10px] text-slate-500 text-center py-4">Nenhum benefício cadastrado. Adicione um acima.</p>
              )}
            </div>
          </div>

          {/* FAQ Block accordion */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900/80">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-clinical-500" />
                Bloco 3: Perguntas Frequentes (FAQ)
              </h4>
              <button
                onClick={handleAddFaq}
                className="bg-clinical-500/10 hover:bg-clinical-500/20 text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-clinical-500/20 transition-all flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">FAQ #{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteFaq(idx)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faq.q}
                      placeholder="Qual é a pergunta?"
                      onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-clinical-500"
                    />
                    <textarea
                      value={faq.a}
                      placeholder="Insira a resposta aqui..."
                      rows={2}
                      onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-clinical-500"
                    />
                  </div>
                </div>
              ))}
              {faqs.length === 0 && (
                <p className="text-[10px] text-slate-500 text-center py-4">Nenhum FAQ cadastrado. Adicione um acima.</p>
              )}
            </div>
          </div>

        </aside>

        {/* Right Side: Live Mockup Preview */}
        <main className="w-1/2 bg-slate-950/60 p-6 flex flex-col items-center overflow-y-auto relative border-l border-slate-900/80">
          
          {/* View Mode controls */}
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-2.5 mb-6 flex justify-between items-center shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-2">
              Visualização em tempo real
            </div>
            
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-clinical-500 text-white shadow-lg shadow-clinical-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-clinical-500 text-white shadow-lg shadow-clinical-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>
          </div>

          {/* LP Preview Container */}
          <div
            className={`w-full bg-slate-950 text-slate-200 border border-slate-900 rounded-3xl shadow-2xl transition-all duration-300 relative ${
              viewMode === 'mobile'
                ? 'max-w-[375px] min-h-[640px] border-8 border-slate-800 rounded-[38px]'
                : 'max-w-2xl min-h-[600px]'
            }`}
          >
            {/* Mock Phone Status Bar */}
            {viewMode === 'mobile' && (
              <div className="h-6 w-full bg-slate-950 flex items-center justify-between px-6 select-none border-b border-slate-900/60 rounded-t-[30px]">
                <span className="text-[10px] text-slate-500 font-bold">17:15</span>
                <div className="w-16 h-3 bg-slate-900 rounded-full" />
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 bg-slate-700 rounded-sm" />
                </div>
              </div>
            )}

            {/* Simulated LP Header */}
            <div className="border-b border-slate-900/40 bg-slate-950/60 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-[70%]">
                <span className="font-extrabold text-xs text-white truncate">
                  {profile?.fullName || 'Nome do Profissional'}
                </span>
                <span className="bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {profile?.registerNumber || 'REGISTRO'}
                </span>
              </div>
              <span className="bg-clinical-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg opacity-80 select-none">
                WhatsApp
              </span>
            </div>

            {/* Simulated LP Body */}
            <div className="p-5 space-y-6">
              
              {/* Headline & Subheadline */}
              <div className="space-y-3 text-left">
                <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight text-white">
                  {headline || 'Escreva o Título Principal'}
                </h1>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {subheadline || 'Escreva o subtítulo explicativo para prender a atenção do seu lead.'}
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-2 pt-2">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-clinical-500 mt-0.5 shrink-0" />
                    <span className="text-slate-300 font-medium">{benefit}</span>
                  </div>
                ))}
                {benefits.length === 0 && (
                  <div className="text-xs text-slate-650 italic">Insira benefícios atrativos no painel esquerdo.</div>
                )}
              </div>

              {/* Simulated Form Card */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-sm select-none">
                <div className="text-center">
                  <h3 className="font-bold text-xs text-white">Solicitar Atendimento</h3>
                  <p className="text-[9px] text-slate-500 mt-0.5">Preencha seus contatos e fale com o profissional.</p>
                </div>
                
                <div className="space-y-2 text-[10px] text-slate-500">
                  <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5">Carlos Silva</div>
                  <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5">11 98888-8888</div>
                  <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5">carlos@email.com</div>
                </div>

                <div className="bg-gradient-to-r from-clinical-500 to-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-clinical-500/10">
                  {ctaText}
                </div>
              </div>

              {/* FAQ Block */}
              <div className="pt-4 border-t border-slate-900/60">
                <h4 className="font-bold text-xs text-white text-center mb-4">Perguntas Frequentes</h4>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-900/20 border border-slate-900 p-3 rounded-xl space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold text-[10px] text-teal-400 uppercase">
                        <HelpCircle className="h-3 w-3 text-teal-400 shrink-0" />
                        {faq.q}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed pl-4">{faq.a}</p>
                    </div>
                  ))}
                  {faqs.length === 0 && (
                    <div className="text-xs text-slate-650 text-center italic">Insira FAQs no painel esquerdo.</div>
                  )}
                </div>
              </div>

              {/* Ethics Footer */}
              <div className="text-center text-[8px] text-slate-600 pt-6 border-t border-slate-900/40 space-y-2">
                <div className="font-bold">
                  {profile?.fullName || 'Nome do Profissional'} | {profile?.registerNumber || 'REGISTRO'}
                </div>
                <p className="leading-relaxed">
                  {isPsychologist
                    ? "AVISO ÉTICO IMPORTANTE: Este site tem caráter meramente informativo e de divulgação profissional. O atendimento psicológico oferecido cumpre as diretrizes do Conselho Federal de Psicologia..."
                    : "AVISO ÉTICO IMPORTANTE: Os serviços oferecidos são de suporte domiciliar e acompanhamento de cuidados não-invasivos..."}
                </p>
              </div>

            </div>
          </div>
          
        </main>
      </div>

    </div>
  );
}
