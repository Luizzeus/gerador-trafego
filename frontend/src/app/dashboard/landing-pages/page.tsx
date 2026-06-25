'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  FileText, 
  Plus, 
  ExternalLink, 
  Eye, 
  Activity, 
  Loader2, 
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Edit3
} from 'lucide-react';

export default function LandingPages() {
  const router = useRouter();
  const [lps, setLps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // States para o modal de criação/edição
  const [showModal, setShowModal] = useState(false);
  const [editingLp, setEditingLp] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [pixelMetaId, setPixelMetaId] = useState('');
  const [pixelGoogleId, setPixelGoogleId] = useState('');
  const [status, setStatus] = useState('published');
  
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const myProfile = await api.getMyProfile();
        setProfile(myProfile);
        
        const myLps = await api.getMyLps();
        setLps(myLps);
      } catch (e) {
        console.error('Perfil não configurado ou erro ao buscar LPs');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingLp(null);
    setTitle('');
    setSubdomain('');
    setPixelMetaId('');
    setPixelGoogleId('');
    setStatus('published');
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (lp: any) => {
    setEditingLp(lp);
    setTitle(lp.title);
    setSubdomain(lp.subdomain);
    setPixelMetaId(lp.pixelMetaId || '');
    setPixelGoogleId(lp.pixelGoogleId || '');
    setStatus(lp.status);
    setModalError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    // Prepara o template inicial conforme o nicho do profissional
    const initialContent = profile?.niche === 'psychologist' 
      ? {
          headline: "Cuidado e Suporte Psicológico para a sua Saúde Mental",
          subheadline: "Atendimento clínico presencial e online focado em bem-estar emocional e superação de dores cotidianas.",
          benefits: ["Ambiente seguro e sem julgamentos", "Abordagem baseada em evidências científicas", "Horários flexíveis para sessões online"],
          faqs: [
            { q: "Como funciona a primeira sessão?", a: "A primeira sessão serve para entender suas demandas e alinhar os objetivos da terapia." },
            { q: "As sessões online são seguras?", a: "Sim, são realizadas através de plataformas criptografadas em total sigilo profissional." }
          ]
        }
      : {
          headline: "Cuidado Profissional e Acolhimento que sua Família Merece",
          subheadline: "Acompanhamento humanizado de idosos e assistência domiciliar especializada com foco em segurança.",
          benefits: ["Cuidadores qualificados e checados", "Plantões flexíveis (12h, 24h ou por hora)", "Apoio em rotinas de medicação e higiene"],
          faqs: [
            { q: "Vocês atendem no hospital?", a: "Sim, oferecemos acompanhamento hospitalar completo durante períodos de internação." },
            { q: "Como é feita a escolha do cuidador?", a: "Selecionamos o profissional com base no perfil de cuidados e preferências da família." }
          ]
        };

    try {
      if (editingLp) {
        // Edição
        const updated = await api.updateLp(editingLp.id, {
          title,
          subdomain,
          pixelMetaId: pixelMetaId || undefined,
          pixelGoogleId: pixelGoogleId || undefined,
          status,
          contentJson: JSON.stringify(initialContent),
        });
        setLps(lps.map(item => item.id === updated.id ? updated : item));
        setSuccessMsg('Landing Page atualizada com sucesso!');
      } else {
        // Criação
        const created = await api.createLp({
          title,
          subdomain,
          pixelMetaId: pixelMetaId || undefined,
          pixelGoogleId: pixelGoogleId || undefined,
          status,
          contentJson: JSON.stringify(initialContent),
        });
        setLps([created, ...lps]);
        setSuccessMsg('Landing Page criada com sucesso!');
      }

      setShowModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setModalError(err.message || 'Falha ao salvar a Landing Page.');
    } finally {
      setModalLoading(false);
    }
  };

  const toggleStatus = async (lp: any) => {
    try {
      const newStatus = lp.status === 'published' ? 'draft' : 'published';
      const updated = await api.updateLp(lp.id, {
        ...lp,
        status: newStatus,
      });
      setLps(lps.map(item => item.id === updated.id ? updated : item));
    } catch (err) {
      console.error('Falha ao alternar status da LP');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando landing pages...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-slate-500 text-center max-w-md mx-auto gap-4">
        <Activity className="h-10 w-10 text-clinical-500 opacity-60 animate-pulse" />
        <h3 className="font-extrabold text-white text-lg">Perfil Não Configurado</h3>
        <p className="text-xs leading-relaxed">
          Você precisa criar seu perfil profissional antes de gerenciar suas Landing Pages de captura.
        </p>
        <a
          href="/dashboard/profile"
          className="bg-clinical-500 hover:bg-clinical-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          Configurar Perfil Agora
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 font-medium shadow-md">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Header com Ação */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Suas Páginas de Captação</h3>
          <p className="text-xs text-slate-500 mt-1">Crie subdomínios focados para cada tipo de campanha ou serviço.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-clinical-500 hover:bg-clinical-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg shadow-clinical-500/25 hover:scale-[1.01] transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar Landing Page
        </button>
      </div>

      {/* Grid de LPs */}
      {lps.length === 0 ? (
        <div className="bg-slate-900/10 border border-dashed border-slate-900 h-[250px] rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-3">
          <FileText className="h-10 w-10 opacity-30" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">Nenhuma Landing Page criada</p>
            <p className="text-xs text-slate-600 mt-0.5">Clique em "Criar Landing Page" no topo para lançar sua primeira página.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lps.map((lp) => {
            const publicLink = `/lp/${lp.subdomain}`;
            return (
              <div key={lp.id} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-800 transition-all duration-300">
                <div className="space-y-4">
                  {/* Título e Badges */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-white truncate max-w-[200px]">{lp.title}</h4>
                      <div className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-1">
                        URL: 
                        <a
                          href={publicLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-clinical-500 hover:underline flex items-center gap-1"
                        >
                          lp/{lp.subdomain}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                      lp.status === 'published'
                        ? 'bg-clinical-500/10 text-teal-400 border-clinical-500/20'
                        : 'bg-slate-950 text-slate-500 border-slate-900'
                    }`}>
                      {lp.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>

                  {/* Detalhes de Pixel */}
                  <div className="bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-semibold">
                    <div>
                      Meta Pixel:{" "}
                      <span className={lp.pixelMetaId ? "text-teal-400" : "text-slate-600"}>
                        {lp.pixelMetaId ? "Configurado" : "Nenhum"}
                      </span>
                    </div>
                    <div>
                      Google Tag:{" "}
                      <span className={lp.pixelGoogleId ? "text-teal-400" : "text-slate-600"}>
                        {lp.pixelGoogleId ? "Configurado" : "Nenhum"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-900 mt-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(lp)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title={lp.status === 'published' ? 'Desativar página' : 'Publicar página'}
                    >
                      {lp.status === 'published' ? (
                        <ToggleRight className="h-7 w-7 text-clinical-500" />
                      ) : (
                        <ToggleLeft className="h-7 w-7" />
                      )}
                    </button>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {lp.status === 'published' ? 'Ativa no ar' : 'Pausada'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={publicLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver Página
                    </a>
                    <button
                      onClick={() => openEditModal(lp)}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200"
                    >
                      Configurar
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/landing-pages/${lp.id}/editor`)}
                      className="bg-clinical-500/10 hover:bg-clinical-500/20 text-teal-400 text-xs font-bold px-3 py-2 rounded-xl border border-clinical-500/20 transition-all duration-200 flex items-center gap-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Editar Conteúdo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Overlay para criar / editar */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-6">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="font-extrabold text-lg text-white mb-1">
              {editingLp ? 'Editar Landing Page' : 'Criar Nova Landing Page'}
            </h3>
            <p className="text-[11px] text-slate-500 mb-6">
              Templates éticos são injetados automaticamente de acordo com o nicho de atuação ({profile.niche === 'psychologist' ? 'Psicologia' : 'Cuidador'}).
            </p>

            {modalError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-4">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Título Interno da Página
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Consultas de Ansiedade e Depressão"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subdomínio de Acesso (Apenas letras e hífens)
                </label>
                <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-4 focus-within:border-clinical-500 transition-colors">
                  <span className="text-slate-600 text-xs pr-1 font-semibold">lp/</span>
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                    placeholder="ana-terapeuta"
                    className="w-full bg-transparent border-none py-3 text-sm text-white placeholder-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  ID do Pixel do Facebook (Opcional)
                </label>
                <input
                  type="text"
                  value={pixelMetaId}
                  onChange={(e) => setPixelMetaId(e.target.value)}
                  placeholder="Ex: 1234567890"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  ID do Google Analytics / GTM (Opcional)
                </label>
                <input
                  type="text"
                  value={pixelGoogleId}
                  onChange={(e) => setPixelGoogleId(e.target.value)}
                  placeholder="Ex: G-XXXXXXXXXX"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-clinical-500 hover:bg-clinical-600 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-clinical-500/25 transition-colors flex items-center gap-2"
                >
                  {modalLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar Configuração
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
