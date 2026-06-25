'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UserCircle, ShieldCheck, Save, Loader2, CheckCircle } from 'lucide-react';

export default function Profile() {
  const [niche, setNiche] = useState('psychologist');
  const [fullName, setFullName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [registerState, setRegisterState] = useState('');
  const [bio, setBio] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZipcode, setAddressZipcode] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await api.getMyProfile();
        if (profile) {
          setNiche(profile.niche);
          setFullName(profile.fullName);
          setRegisterNumber(profile.registerNumber);
          setRegisterState(profile.registerState);
          setBio(profile.bio || '');
          setAddressCity(profile.addressCity);
          setAddressState(profile.addressState);
          setAddressZipcode(profile.addressZipcode);
          setWhatsappNumber(profile.whatsappNumber);
        }
      } catch (e: any) {
        // Ignora erro 404 (perfil ainda não configurado é esperado no onboarding)
        if (e.message && !e.message.includes('não encontrado')) {
          setError('Erro ao carregar dados do perfil profissional.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      await api.saveProfile({
        niche,
        fullName,
        registerNumber,
        registerState,
        bio,
        addressCity,
        addressState,
        addressZipcode,
        whatsappNumber,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando dados de perfil...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 font-medium shadow-md">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          Perfil profissional atualizado com sucesso no banco de dados local SQLite!
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 font-medium shadow-md">
          {error}
        </div>
      )}

      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Sessão 1: Informações Gerais */}
          <div>
            <h3 className="font-extrabold text-base text-white mb-4 pb-2 border-b border-slate-900 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-teal-400" />
              Identificação do Profissional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Área de Atuação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNiche('psychologist')}
                    className={`py-3 rounded-xl border text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                      niche === 'psychologist'
                        ? 'bg-clinical-500/10 border-clinical-500 text-teal-400'
                        : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Psicólogo Clínico
                  </button>
                  <button
                    type="button"
                    onClick={() => setNiche('caregiver')}
                    className={`py-3 rounded-xl border text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                      niche === 'caregiver'
                        ? 'bg-clinical-500/10 border-clinical-500 text-teal-400'
                        : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Cuidador / Home Care
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Nome Profissional Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Dra. Ana Souza"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Número de Registro (Ex: CRP ou COREN)
                </label>
                <input
                  type="text"
                  required
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  placeholder="Ex: CRP 06/12345"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Estado de Emissão (UF)
                </label>
                <input
                  type="text"
                  required
                  value={registerState}
                  onChange={(e) => setRegisterState(e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="Ex: SP"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

            </div>
          </div>

          {/* Sessão 2: Contatos e Endereço */}
          <div>
            <h3 className="font-extrabold text-base text-white mb-4 pb-2 border-b border-slate-900">
              Contato e Localização de Atendimento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  WhatsApp para Leads (Com DDI e DDD, apenas números)
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: 5511999999999"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  required
                  value={addressZipcode}
                  onChange={(e) => setAddressZipcode(e.target.value)}
                  placeholder="Ex: 01001-000"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cidade de Atendimento
                </label>
                <input
                  type="text"
                  required
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  required
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="Ex: SP"
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors"
                />
              </div>

            </div>
          </div>

          {/* Sessão 3: Apresentação */}
          <div>
            <h3 className="font-extrabold text-base text-white mb-4 pb-2 border-b border-slate-900">
              Descrição e Biografia
            </h3>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Apresentação Profissional (Exibido nas Landing Pages)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Conte sobre sua formação, experiência profissional e como você ajuda seus pacientes/cuidando das famílias de forma ética..."
                className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-clinical-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-end pt-4 border-t border-slate-900">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-clinical-500 to-indigo-600 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-clinical-500/20 hover:shadow-clinical-500/35 active:scale-[0.99] transition-all duration-200 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando dados...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <div className="flex items-center gap-2.5 text-[10px] text-slate-500 justify-center">
        <ShieldCheck className="h-4 w-4 text-teal-500" />
        Suas informações são armazenadas de forma criptografada localmente.
      </div>

    </div>
  );
}
