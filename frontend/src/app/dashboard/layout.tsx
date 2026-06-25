'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCircle, 
  LogOut, 
  Activity, 
  MessageSquare, 
  Loader2,
  Sparkles,
  CreditCard,
  Megaphone,
  Calendar
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('medtraffic_token');
    const userJson = localStorage.getItem('medtraffic_user');

    if (!token || !userJson) {
      localStorage.removeItem('medtraffic_token');
      localStorage.removeItem('medtraffic_user');
      router.push('/login');
    } else {
      try {
        const user = JSON.parse(userJson);
        setUserName(user.name || user.email);
        setUserRole(user.role === 'professional' ? 'Profissional da Saúde' : 'Clínica / Home Care');
        setLoading(false);

        // Busca status do WhatsApp em segundo plano
        api.getWhatsappConnection()
          .then((conn) => setWhatsappConnected(conn && conn.status === 'connected'))
          .catch(() => setWhatsappConnected(false));
      } catch (e) {
        localStorage.clear();
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-clinical-500" />
        <span className="text-sm font-semibold tracking-wide">Autenticando sessão...</span>
      </div>
    );
  }

  const menuItems = [
    { name: 'Geral', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Páginas de Captura', path: '/dashboard/landing-pages', icon: FileText },
    { name: 'CRM de Leads', path: '/dashboard/crm', icon: Users },
    { name: 'Sugestões de Tráfego', path: '/dashboard/content', icon: Sparkles },
    { name: 'Campanhas de Anúncios', path: '/dashboard/campaigns', icon: Megaphone },
    { name: 'Agenda de Consultas', path: '/dashboard/agenda', icon: Calendar },
    { name: 'Automação WhatsApp', path: '/dashboard/whatsapp', icon: MessageSquare },
    { name: 'Assinatura e Planos', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Perfil Profissional', path: '/dashboard/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between p-6 shrink-0 z-30">
        <div className="space-y-8">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="bg-gradient-to-tr from-clinical-500 to-indigo-500 p-2 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              MedTraffic
            </span>
          </div>
  
          {/* Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                    isActive 
                      ? 'bg-clinical-500/10 text-teal-400 border border-clinical-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
  
        {/* User Card & Logout */}
        <div className="space-y-4 pt-6 border-t border-slate-900">
          
          {/* WhatsApp Connection status indicator */}
          <div className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-2xl flex items-center gap-3">
            <div className={`p-2 rounded-lg ${whatsappConnected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Status</div>
              {whatsappConnected ? (
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                  Conectado
                </div>
              ) : (
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 block" />
                  Desconectado
                </div>
              )}
            </div>
          </div>
  
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold uppercase text-sm">
              {userName ? userName.slice(0, 2) : 'US'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">{userRole}</div>
            </div>
          </div>
  
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </button>
        </div>
      </aside>
  
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-y-auto max-h-screen">
        
        {/* Top Header */}
        <header className="border-b border-slate-900 px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="font-extrabold text-lg tracking-tight text-white uppercase">
            {pathname === '/dashboard' ? 'Geral' : 
             pathname === '/dashboard/landing-pages' ? 'Páginas de Captura' : 
             pathname === '/dashboard/crm' ? 'CRM Funil de Leads' : 
             pathname === '/dashboard/content' ? 'Sugestões de Tráfego & IA' : 
             pathname === '/dashboard/campaigns' ? 'Campanhas de Anúncios' : 
             pathname === '/dashboard/agenda' ? 'Agenda de Consultas' : 
             pathname === '/dashboard/billing' ? 'Assinatura e Planos' : 
             pathname === '/dashboard/profile' ? 'Configuração de Perfil' : 'Painel'}
          </h2>

          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 bg-slate-900/40 border border-slate-900 px-4 py-2 rounded-xl">
            Ambiente Local: <span className="text-clinical-500 font-bold">SQLite (Ativo)</span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
