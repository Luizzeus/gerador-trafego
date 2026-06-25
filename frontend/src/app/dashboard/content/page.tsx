'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Sparkles, 
  Copy, 
  CheckCircle, 
  HelpCircle, 
  Loader2, 
  Search, 
  Instagram, 
  Video, 
  Megaphone,
  ShieldCheck
} from 'lucide-react';

export default function ContentSuggestions() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('google');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const result = await api.getCampaignSuggestions();
        setData(result);
      } catch (e: any) {
        setError(e.message || 'Adicione seu perfil profissional antes de acessar as sugestões.');
      } finally {
        setLoading(false);
      }
    }
    loadSuggestions();
  }, []);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">A IA do MedTraffic está formatando suas sugestões...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-slate-500 text-center max-w-md mx-auto gap-4">
        <Sparkles className="h-10 w-10 text-clinical-500 opacity-60 animate-pulse" />
        <h3 className="font-extrabold text-white text-lg">Perfil Profissional Necessário</h3>
        <p className="text-xs leading-relaxed">
          Para que a inteligência artificial gere ideias personalizadas com a sua geolocalização e especialidade, você deve preencher seu perfil profissional primeiro.
        </p>
        <a
          href="/dashboard/profile"
          className="bg-clinical-500 hover:bg-clinical-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          Configurar Meu Perfil
        </a>
      </div>
    );
  }

  const tabs = [
    { id: 'google', name: 'Google Search Ads', icon: Search },
    { id: 'meta', name: 'Meta Ads', icon: Megaphone },
    { id: 'instagram', name: 'Instagram Post', icon: Instagram },
    { id: 'video', name: 'Roteiro de Vídeo', icon: Video },
  ];

  return (
    <div className="space-y-6 relative max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Criação de Conteúdo & Tráfego com IA</h3>
          <p className="text-xs text-slate-500 mt-1">Ideias de anúncio e conteúdos informativos gerados com base na sua localização e nicho profissional.</p>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-clinical-500/10 border border-clinical-500/25 px-3 py-1.5 rounded-full text-[10px] font-bold text-teal-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Guardrail de Linguagem Ativo
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-900 overflow-x-auto gap-2 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 ${
                isActive 
                  ? 'border-clinical-500 text-teal-400 bg-clinical-500/5' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="pt-2">
        
        {/* Google Ads Content */}
        {activeTab === 'google' && (
          <div className="space-y-6">
            {data.googleAds.map((ad: any, idx: number) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-4">
                
                {/* Visual Preview Simulating Google Search results */}
                <div className="bg-slate-950/65 border border-slate-900 p-5 rounded-2xl space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Visualização do Anúncio no Google</div>
                  <div className="text-clinical-500 hover:underline font-semibold text-sm cursor-pointer truncate">
                    {ad.title}
                  </div>
                  <div className="text-emerald-500 text-xs truncate">https://{data.niche === 'psychologist' ? 'ana-souza' : 'cuidados'}.medtraffic.com.br</div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{ad.description}</p>
                </div>

                {/* Copiable Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  <div className="md:col-span-10 text-xs">
                    <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px] mb-1">Palavras-chave recomendadas</span>
                    <p className="bg-slate-950/30 border border-slate-900 px-4 py-2.5 rounded-xl text-slate-300 font-medium">
                      {ad.keywords}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      onClick={() => handleCopy(ad.keywords, `keywords-${idx}`)}
                      className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      {copiedText === `keywords-${idx}` ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copiar Palavras
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

        {/* Meta Ads Content */}
        {activeTab === 'meta' && (
          <div className="space-y-6">
            {data.metaAds.map((ad: any, idx: number) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Copiable Texts */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Texto Principal</span>
                      <button
                        onClick={() => handleCopy(ad.primaryText, `meta-primary-${idx}`)}
                        className="text-clinical-500 hover:text-clinical-400 text-xs font-bold flex items-center gap-1"
                      >
                        {copiedText === `meta-primary-${idx}` ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedText === `meta-primary-${idx}` ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <p className="bg-slate-950/40 border border-slate-900 px-4 py-3 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {ad.primaryText}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Título do Criativo</span>
                      <button
                        onClick={() => handleCopy(ad.headline, `meta-head-${idx}`)}
                        className="text-clinical-500 hover:text-clinical-400 text-xs font-bold flex items-center gap-1"
                      >
                        {copiedText === `meta-head-${idx}` ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedText === `meta-head-${idx}` ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <p className="bg-slate-950/40 border border-slate-900 px-4 py-3 rounded-xl text-xs text-slate-300 font-bold">
                      {ad.headline}
                    </p>
                  </div>
                </div>

                {/* Creative Guidance */}
                <div className="lg:col-span-5 bg-slate-950/40 border border-slate-900/60 p-6 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Diretriz Visual para o Criativo (Banner)</span>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {ad.creativeGuidance}
                    </p>
                  </div>
                  
                  <div className="bg-clinical-500/10 border border-clinical-500/20 p-4 rounded-xl text-[10px] text-teal-400 leading-normal font-semibold mt-4">
                    💡 DICA: Use imagens reais e humanizadas. O Conselho de Classe proíbe fotos apelativas que induzam cura imediata ou promovam mercantilização.
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Instagram Post */}
        {activeTab === 'instagram' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Post Educativo Informativo</span>
              
              <button
                onClick={() => handleCopy(data.socialMediaPost, 'ig-post')}
                className="bg-clinical-500/10 hover:bg-clinical-500/20 text-teal-400 border border-clinical-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedText === 'ig-post' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Conteúdo Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar Legenda
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium">
              {data.socialMediaPost}
            </div>
          </div>
        )}

        {/* Video Script */}
        {activeTab === 'video' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Roteiro de Vídeo Curto (Reels/TikTok/Shorts)</span>
              
              <button
                onClick={() => handleCopy(data.videoScript, 'video-script')}
                className="bg-clinical-500/10 hover:bg-clinical-500/20 text-teal-400 border border-clinical-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedText === 'video-script' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Roteiro Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar Roteiro
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
              {data.videoScript}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
