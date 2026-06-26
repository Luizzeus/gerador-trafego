'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login({ email, password });
      
      // Salva os dados retornados no localStorage
      localStorage.setItem('medtraffic_token', response.access_token);
      localStorage.setItem('medtraffic_user', JSON.stringify(response.user));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
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
          <h2 className="text-2xl font-black text-white">Acessar sua Conta</h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Gerencie suas campanhas, páginas e acompanhe seus leads.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Seu E-mail
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana.souza@email.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Sua Senha
              </label>
              <span className="text-[10px] text-slate-500 hover:text-slate-350 cursor-pointer">
                Esqueceu a senha?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-clinical-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-clinical-500 to-indigo-600 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-clinical-500/20 hover:shadow-clinical-500/35 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Não possui uma conta?{" "}
          <span
            onClick={() => router.push('/register')}
            className="text-clinical-500 hover:text-clinical-400 font-bold cursor-pointer transition-colors"
          >
            Cadastrar-se
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
