'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Activity, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  HelpCircle,
  Clock,
  Heart,
  MapPin
} from 'lucide-react';

export default function PublicLp({ params }: { params: { subdomain: string } }) {
  const [loading, setLoading] = useState(true);
  const [lp, setLp] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const consentText = "Concordo em fornecer meus dados de contato para fins de agendamento e retorno de atendimento profissional de saúde, em conformidade com as diretrizes de privacidade da LGPD.";

  useEffect(() => {
    async function loadPage() {
      try {
        const lpData = await api.getPublicLp(params.subdomain);
        setLp(lpData);
        setProfile(lpData.professionalProfile);
        
        try {
          const parsed = JSON.parse(lpData.contentJson);
          setContent(parsed);
        } catch {
          setContent({});
        }

        // Injeção de Pixels de Rastreamento se configurados
        if (lpData.pixelMetaId) {
          const metaScript = document.createElement('script');
          metaScript.innerHTML = `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${lpData.pixelMetaId}');
            fbq('track', 'PageView');
          `;
          document.head.appendChild(metaScript);
        }

        if (lpData.pixelGoogleId) {
          const googleScript = document.createElement('script');
          googleScript.src = `https://www.googletagmanager.com/gtag/js?id=${lpData.pixelGoogleId}`;
          googleScript.async = true;
          document.head.appendChild(googleScript);

          const googleInitScript = document.createElement('script');
          googleInitScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${lpData.pixelGoogleId}');
          `;
          document.head.appendChild(googleInitScript);
        }

      } catch (e) {
        console.error('Landing page não encontrada ou inativa.');
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [params.subdomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedConsent) {
      setError('Você deve concordar com os termos de consentimento.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Captura o Lead no backend
      await api.captureLead({
        landingPageId: lp.id,
        name,
        email: email || undefined,
        phone,
        serviceCategoryId: 1, // ID padrão para captação direta
        trafficSource: document.referrer ? new URL(document.referrer).hostname : 'Direto',
        consentText,
        acceptedConsent,
      });

      setSuccess(true);

      // Dispara o Pixel de Conversão
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }

      // Redireciona o visitante para o WhatsApp do profissional após 1.5s
      const message = encodeURIComponent(`Olá, vim através da sua página e gostaria de mais informações.`);
      setTimeout(() => {
        window.location.href = `https://wa.me/${profile.whatsappNumber}?text=${message}`;
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erro ao enviar dados. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-500" />
        <span className="text-xs font-semibold">Carregando página...</span>
      </div>
    );
  }

  if (!lp || !profile || !content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-4 text-center px-6">
        <Activity className="h-12 w-12 text-red-500/80 animate-pulse" />
        <h2 className="text-xl font-extrabold text-white">Página Não Encontrada</h2>
        <p className="text-xs max-w-sm leading-relaxed">
          Esta página está indisponível, em rascunho ou o subdomínio informado está incorreto.
        </p>
        <a href="/" className="text-clinical-500 font-bold hover:underline text-xs">
          Ir para a Home do MedTraffic
        </a>
      </div>
    );
  }

  const isPsychologist = profile.niche === 'psychologist';

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-clinical-500 selection:text-white ${
      isPsychologist ? 'bg-gradient-to-b from-[#0b1016] to-[#080b0f] text-slate-200' : 'bg-gradient-to-b from-[#0b0f19] to-[#0f172a] text-slate-200'
    }`}>
      
      {/* Header Público */}
      <header className="border-b border-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg tracking-tight text-white">
              {profile.fullName}
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {profile.registerNumber}
            </span>
          </div>

          <a
            href="#contato"
            className="bg-clinical-500 hover:bg-clinical-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left: Text Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            {content.headline}
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
            {content.subheadline}
          </p>

          {/* Benefits Bullet points */}
          <div className="space-y-3.5 pt-4">
            {content.benefits?.map((benefit: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="bg-clinical-500/10 p-1 rounded-md text-clinical-500 mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-xs md:text-sm text-slate-300 font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Local Information */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-900/60 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-teal-400" />
              Atendimento em {profile.addressCity} - {profile.addressState}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-400" />
              Consulta agendada
            </div>
            {isPsychologist && (
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-teal-400" />
                Presencial ou Online
              </div>
            )}
          </div>
        </div>

        {/* Right: Capture Form */}
        <div id="contato" className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-clinical-500/10 rounded-3xl blur-2xl opacity-30 pointer-events-none" />
          
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative backdrop-blur-xl">
            
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="bg-emerald-500/10 p-4 rounded-full w-fit mx-auto text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="font-extrabold text-white text-lg">Cadastro Concluído!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Seus dados foram enviados. Estamos te redirecionando para o WhatsApp do profissional para concluir seu agendamento...
                </p>
                <div className="w-6 h-6 border-2 border-clinical-500 border-t-transparent animate-spin mx-auto mt-4 rounded-full" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-extrabold text-lg text-white">Solicitar Atendimento</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Preencha seus contatos e fale diretamente com o profissional.</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    WhatsApp (DDD + Número)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ex: 11988888888"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: carlos@email.com"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-clinical-500 transition-colors"
                  />
                </div>

                {/* Checkbox LGPD */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedConsent}
                      onChange={(e) => setAcceptedConsent(e.target.checked)}
                      className="mt-1 accent-clinical-500 rounded border-slate-800 focus:ring-clinical-500"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold leading-normal">
                      {consentText}
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-clinical-500 to-indigo-600 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-clinical-500/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Enviar e Falar no WhatsApp
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </main>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-950/40 border-t border-slate-900/60 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="font-extrabold text-xl text-center text-white mb-10">Perguntas Frequentes</h3>
          <div className="space-y-6">
            {content.faqs?.map((faq: any, idx: number) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs md:text-sm text-teal-400 uppercase">
                  <HelpCircle className="h-4 w-4 text-teal-400 shrink-0" />
                  {faq.q}
                </div>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Público com Avisos Éticos Requeridos */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <div className="text-xs font-bold text-slate-400">
            {profile.fullName} | {profile.registerNumber} - Conselho de Classe do Estado de {profile.registerState}
          </div>
          
          <p className="text-[10px] text-slate-650 max-w-2xl mx-auto leading-relaxed">
            {isPsychologist ? (
              "AVISO ÉTICO IMPORTANTE: Este site tem caráter meramente informativo e de divulgação profissional. O atendimento psicológico oferecido cumpre as diretrizes e resoluções do Conselho Federal de Psicologia. Em caso de crises urgentes de saúde mental ou risco de autoextermínio, dirija-se ao pronto-socorro mais próximo ou ligue 188 para o Centro de Valorização da Vida (CVV)."
            ) : (
              "AVISO ÉTICO IMPORTANTE: Os serviços oferecidos são de suporte domiciliar e acompanhamento de cuidados não-invasivos. Para cuidados médicos específicos, tratamentos clínicos hospitalares ou diagnósticos, consulte um profissional de medicina de sua escolha."
            )}
          </p>
          
          <div className="text-[9px] text-slate-600">
            &copy; 2026 - Todos os direitos reservados. Em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </div>
        </div>
      </footer>

    </div>
  );
}
