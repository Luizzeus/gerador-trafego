'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.register({
        name,
        email,
        password,
        role,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden bg-slate-950">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-clinical-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push('/')}>
        <div className="bg-gradient-to-tr from-clinical-500 to-indigo-500 p-2 rounded-xl">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
          MedTraffic
        </span>
      </div>

      {/* Card container */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white">Criar sua Conta</h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Divulgue seus serviços de saúde de forma ética e profissional.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl mb-4 font-medium text-center">
            Conta criada com sucesso! Redirecionando para login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Seu Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Dra. Ana Souza"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Seu Melhor E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana.souza@email.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Crie uma Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="No mínimo 6 caracteres"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Tipo de Atuação / Perfil
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setRole('professional')}
                className={`py-2 px-4 rounded-xl border text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
                  role === 'professional'
                    ? 'bg-clinical-500/10 border-clinical-500 text-teal-400'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                }`}
              >
                Autônomo
              </button>
              <button
                type="button"
                onClick={() => setRole('company_member')}
                className={`py-2 px-4 rounded-xl border text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
                  role === 'company_member'
                    ? 'bg-clinical-500/10 border-clinical-500 text-teal-400'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                }`}
              >
                Clínica
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-clinical-500 to-indigo-600 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-clinical-500/20 hover:shadow-clinical-500/35 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Criar Conta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Já possui uma conta?{" "}
          <span
            onClick={() => router.push('/login')}
            className="text-clinical-500 hover:text-clinical-400 font-bold cursor-pointer transition-colors"
          >
            Fazer Login
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 tracking-wide">
        <ShieldCheck className="h-4 w-4 text-teal-500" />
        Plataforma em conformidade com as regras éticas do CFP/CFM e LGPD.
      </div>
    </div>
  );
}
