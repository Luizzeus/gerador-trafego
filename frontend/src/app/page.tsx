import React from 'react';
import { ArrowRight, Activity, Users, ShieldCheck, Zap, HeartHandshake, Eye, MessageSquare, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden relative">
      
      {/* Luzes de Fundo (Glow Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-clinical-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-clinical-500 to-indigo-500 p-2 rounded-xl shadow-lg shadow-clinical-500/20">
              <Activity className="h-6 w-6 text-white animate-pulse" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              MedTraffic
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#beneficios" className="hover:text-clinical-500 transition-colors">Benefícios</a>
            <a href="#nichos" className="hover:text-clinical-500 transition-colors">Nichos Atendidos</a>
            <a href="#processos" className="hover:text-clinical-500 transition-colors">Como Funciona</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Entrar
            </button>
            <button className="bg-clinical-500 hover:bg-clinical-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-clinical-500/30 hover:shadow-clinical-500/50 hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-200">
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 bg-clinical-500/10 border border-clinical-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-teal-400">
            <ShieldCheck className="h-4 w-4" /> 
            Conformidade LGPD e Regras Éticas (CFP / CFM)
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Tráfego qualificado e captação de clientes para o nicho de{" "}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Saúde
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl">
            A MedTraffic ajuda cuidadores, psicólogos e agências de home care a gerarem presença digital local, captarem leads e criarem campanhas éticas com IA.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button className="bg-gradient-to-r from-clinical-500 to-indigo-600 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-clinical-500/25 hover:shadow-clinical-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group">
              Criar minha Landing Page
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-slate-700 hover:border-slate-500 bg-slate-900/60 backdrop-blur-md text-slate-200 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-900 transition-all duration-200 flex items-center justify-center gap-2">
              Ver Demonstração
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Ética Assegurada</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">2.5x</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Mais Conversões</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">PIX</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Faturamento Asaas</div>
            </div>
          </div>
        </div>

        {/* Right Content: Premium Glassmorphic Mockup */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-clinical-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />
          
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 shadow-2xl relative backdrop-blur-xl">
            
            {/* Window bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
              </div>
              <span className="text-xs font-semibold text-slate-500">dashboard.medtraffic.com.br</span>
            </div>

            {/* Content Preview */}
            <div className="space-y-6 pt-6">
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-clinical-500/20 flex items-center justify-center border border-clinical-500/30 text-clinical-500 font-black text-lg">
                  AS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dra. Ana Souza</h4>
                  <p className="text-xs text-slate-400">Psicóloga Clínica - CRP 06/12345</p>
                </div>
                <span className="ml-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Ativa
                </span>
              </div>

              {/* CRM Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Leads Recentes (CRM)</span>
                  <span className="text-xs text-clinical-500 font-semibold cursor-pointer hover:underline">Ver todos</span>
                </div>
                
                <div className="space-y-2">
                  
                  {/* Lead 1 */}
                  <div className="bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white">Carlos E. Santos</div>
                      <div className="text-[10px] text-slate-500">Procura: Cuidador Noturno</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-clinical-500/10 text-clinical-400 border border-clinical-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        Novo Lead
                      </span>
                      <span className="text-[9px] text-slate-600 mt-1">Há 5 min</span>
                    </div>
                  </div>

                  {/* Lead 2 */}
                  <div className="bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white">Juliana M. R.</div>
                      <div className="text-[10px] text-slate-500">Procura: Terapia de Ansiedade</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        Agendado
                      </span>
                      <span className="text-[9px] text-slate-600 mt-1">Há 1 hora</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* LP Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/20 border border-slate-800/80 p-4 rounded-2xl text-center">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Visitas na LP</div>
                  <div className="text-xl font-black text-white mt-1">412</div>
                </div>
                <div className="bg-slate-800/20 border border-slate-800/80 p-4 rounded-2xl text-center">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Cliques no Whats</div>
                  <div className="text-xl font-black text-white mt-1">54</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Features Grid */}
      <section id="beneficios" className="py-20 bg-slate-950/40 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Tudo o que você precisa para captar clientes de forma ética
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Evite punições de conselhos e vazamentos de dados. Uma estrutura pensada para a conformidade legal do seu consultório ou empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-2xl hover:border-clinical-500/30 hover:translate-y-[-4px] transition-all duration-300">
              <div className="bg-clinical-500/10 p-3.5 rounded-xl w-fit text-clinical-500 mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Campanhas Locais Otimizadas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Integre suas próprias contas do Google/Meta Ads e use nossas sugestões de palavras-chave locais e anúncios focados no seu bairro.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-2xl hover:border-clinical-500/30 hover:translate-y-[-4px] transition-all duration-300">
              <div className="bg-clinical-500/10 p-3.5 rounded-xl w-fit text-clinical-500 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Registro de Consentimento LGPD</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Cada contato submetido salva um registro de consentimento criptografado (ConsentLog), assegurando conformidade jurídica completa.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-2xl hover:border-clinical-500/30 hover:translate-y-[-4px] transition-all duration-300">
              <div className="bg-clinical-500/10 p-3.5 rounded-xl w-fit text-clinical-500 mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">WhatsApp Não-Oficial Integrado</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conecte seu WhatsApp via QR Code e receba leads no mesmo instante, com mensagens automáticas personalizadas enviadas da sua conta.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-clinical-500" />
            <span className="font-extrabold text-sm text-white tracking-wide">
              MedTraffic
            </span>
          </div>
          <span className="text-xs text-slate-500">
            &copy; 2026 MedTraffic. Todos os direitos reservados. Foco comercial e de marketing em saúde.
          </span>
        </div>
      </footer>

    </div>
  );
}
