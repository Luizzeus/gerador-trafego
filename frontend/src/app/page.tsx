'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Activity,
  Users,
  ShieldCheck,
  Zap,
  HeartHandshake,
  MessageSquare,
  Target,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Laptop,
  CheckCircle,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function Home() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Control playback timer of the simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayTime((prev) => {
          const next = prev + 0.1 * playSpeed;
          if (next >= 60) {
            return 0; // loop back to start
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  // Restart video simulation from start when modal opens
  const openModal = () => {
    setPlayTime(0);
    setIsPlaying(true);
    setShowDemoModal(true);
  };

  const closeModal = () => {
    setIsPlaying(false);
    setShowDemoModal(false);
  };

  // Helper to render the screen of the mock video player
  const renderSimulatedScreen = () => {
    if (playTime < 15) {
      // Step 1: LP Editor (0s - 15s)
      const fullText = "Psicologia e Acompanhamento Clínico - Dra. Ana Souza";
      // typing text from 1s to 7s
      let textToShow = "";
      if (playTime >= 1 && playTime < 7) {
        const charCount = Math.floor(((playTime - 1) / 6) * fullText.length);
        textToShow = fullText.substring(0, charCount);
      } else if (playTime >= 7) {
        textToShow = fullText;
      }
      
      // Theme changes color from 8s to 10s
      const isTealTheme = playTime >= 9;

      // Show published modal from 13s to 15s
      const isPublished = playTime >= 13;

      return (
        <div className="w-full h-full bg-slate-950 p-4 flex flex-col justify-between relative text-slate-200 overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Laptop className="h-4 w-4 text-clinical-500" />
              <span className="text-xs font-bold text-slate-400">Editor de Landing Page - MedTraffic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-green-500/80" />
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-grow grid grid-cols-12 gap-3 items-stretch overflow-hidden">
            {/* Left Control Panel */}
            <div className="col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Configuração de Conteúdo</div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-semibold block">Título Principal (Headline)</label>
                  <div className="bg-slate-950 border border-slate-805 p-2 rounded text-[10px] min-h-[36px] font-mono flex items-center relative">
                    {textToShow}
                    {playTime >= 1 && playTime < 7 && (
                      <span className="inline-block w-1.5 h-3 bg-clinical-500 animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-semibold block">Cor de Destaque</label>
                  <div className="flex items-center gap-2">
                    <button className={`w-4 h-4 rounded-full bg-indigo-500 border ${!isTealTheme ? 'ring-2 ring-white border-transparent' : 'border-slate-700'}`} />
                    <button className={`w-4 h-4 rounded-full bg-clinical-500 border ${isTealTheme ? 'ring-2 ring-white border-transparent' : 'border-slate-700'}`} />
                  </div>
                </div>
              </div>

              <div className={`w-full py-1.5 rounded-lg text-xs font-bold text-white transition-colors duration-200 flex items-center justify-center gap-1.5 ${isPublished ? 'bg-emerald-600' : 'bg-clinical-500'}`}>
                {isPublished ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                {isPublished ? 'Página Publicada!' : 'Publicar Página'}
              </div>
            </div>

            {/* Right Live Preview Mockup */}
            <div className="col-span-7 bg-slate-900/50 border border-slate-800/80 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-[8px] absolute top-1.5 left-2 bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                Visualização Mobile
              </div>

              {/* Mobile Phone Frame */}
              <div className="w-[110px] h-[170px] bg-slate-950 border border-slate-805 rounded-2xl p-1.5 flex flex-col justify-between overflow-hidden shadow-2xl relative">
                {/* Speaker/Camera notch */}
                <div className="w-8 h-2 bg-slate-800 rounded-full mx-auto mb-1.5" />

                {/* Page Content */}
                <div className="flex-grow flex flex-col justify-between p-1 space-y-1">
                  <div className="flex items-center justify-between border-b border-slate-905 pb-1">
                    <span className="text-[6px] font-bold text-white">MedTraffic</span>
                    <span className="text-[5px] text-slate-500">Menu</span>
                  </div>

                  <div className="text-center space-y-1 py-1">
                    <h5 className="text-[7px] font-black leading-tight text-white">
                      {textToShow || "Sua headline aqui..."}
                    </h5>
                    <p className="text-[5px] text-slate-500">Atendimento clínico humanizado e ético de psicologia.</p>
                  </div>

                  <div className="bg-slate-900/80 p-1 rounded text-center space-y-1">
                    <div className={`w-full py-1 rounded text-[5px] font-bold text-white text-center ${isTealTheme ? 'bg-clinical-500' : 'bg-indigo-500'}`}>
                      Agendar Consulta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating success banner */}
          {isPublished && (
            <div className="absolute inset-x-4 top-12 bg-emerald-500/90 border border-emerald-400/30 text-white rounded-xl p-2.5 flex items-center gap-2 shadow-2xl animate-bounce backdrop-blur-sm z-30">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <div>
                <div className="text-[10px] font-bold">Sucesso! Página publicada.</div>
                <div className="text-[8px] text-emerald-100 font-mono">medtraffic.com.br/lp/dra-ana</div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (playTime >= 15 && playTime < 30) {
      // Step 2: Ethics AI (15s - 30s)
      const inputPrompt = "Garanto a cura imediata da depressão e ansiedade em 3 consultas!";
      
      // typing input prompt from 16s to 21s
      let inputToShow = "";
      if (playTime >= 16 && playTime < 21) {
        const charCount = Math.floor(((playTime - 16) / 5) * inputPrompt.length);
        inputToShow = inputPrompt.substring(0, charCount);
      } else if (playTime >= 21) {
        inputToShow = inputPrompt;
      }

      // Show ethics warning from 21s onwards
      const showWarning = playTime >= 21;

      // Show rewrote approved content from 23s onwards
      const showRewritten = playTime >= 23;
      const rewroteText = "Acompanhamento profissional de saúde mental e atendimento ético para quadros de depressão e ansiedade.";

      let rewrittenToShow = "";
      if (showRewritten) {
        if (playTime >= 23 && playTime < 28) {
          const charCount = Math.floor(((playTime - 23) / 5) * rewroteText.length);
          rewrittenToShow = rewroteText.substring(0, charCount);
        } else {
          rewrittenToShow = rewroteText;
        }
      }

      return (
        <div className="w-full h-full bg-slate-950 p-4 flex flex-col justify-between relative text-slate-200 overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-400">Sugestões de Tráfego por IA & Guardrail Ético</span>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
              CFP / CFM Audited
            </span>
          </div>

          <div className="flex-grow space-y-3 overflow-hidden">
            {/* Input prompt area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <div className="text-[9px] uppercase font-bold text-slate-500">Ideia Original do Profissional</div>
              <div className="bg-slate-950 border border-slate-850 p-2.5 rounded text-[10px] font-mono min-h-[34px] flex items-center text-slate-300">
                {inputToShow || "Digitando ideia..."}
                {playTime >= 16 && playTime < 21 && (
                  <span className="inline-block w-1.5 h-3 bg-indigo-500 animate-pulse ml-0.5" />
                )}
              </div>
            </div>

            {/* Warning and AI Rewrite */}
            <div className="grid grid-cols-12 gap-3 items-stretch">
              {/* Warnings Column */}
              <div className="col-span-5 flex flex-col justify-center">
                {showWarning && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 space-y-1 animate-pulse">
                    <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Infração Ética Detectada</div>
                    <p className="text-[8px] text-red-200 leading-tight">
                      ❌ Prometer &quot;cura imediata&quot; e &quot;garantir resultados&quot; viola as normas dos conselhos profissionais de saúde.
                    </p>
                  </div>
                )}
              </div>

              {/* Rewritten Output */}
              <div className="col-span-7">
                {showRewritten ? (
                  <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 space-y-2 relative shadow-lg shadow-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-emerald-400">Sugestão Ética Recomendada</span>
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                        100% Seguro
                      </span>
                    </div>
                    <div className="bg-slate-950 border border-slate-850 p-2.5 rounded text-[10px] font-mono min-h-[38px] text-slate-200 relative">
                      {rewrittenToShow}
                      {playTime >= 23 && playTime < 28 && (
                        <span className="inline-block w-1.5 h-3 bg-emerald-500 animate-pulse ml-0.5" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-850 border-dashed rounded-xl p-8 flex items-center justify-center text-[10px] text-slate-500">
                    {showWarning ? "Ajustando conteúdo..." : "Aguardando ideia..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (playTime >= 30 && playTime < 45) {
      // Step 3: WhatsApp Setup (30s - 45s)
      const showQRScan = playTime >= 31 && playTime < 37;
      const isConnected = playTime >= 37;
      
      // WhatsApp message log from 39s onwards
      const showMsgLog = playTime >= 39;

      return (
        <div className="w-full h-full bg-slate-950 p-4 flex flex-col justify-between relative text-slate-200 overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-400">Automação de Notificações - WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
              <span className="text-[9px] font-bold text-slate-400">{isConnected ? 'Conectado' : 'Aguardando QR Code'}</span>
            </div>
          </div>

          <div className="flex-grow grid grid-cols-12 gap-3 items-stretch overflow-hidden">
            {/* Left QR Code / Connection Box */}
            <div className="col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between">
              <div className="text-center w-full">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-2">Conectar Instância</span>
                
                {isConnected ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center my-2 space-y-1">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto" />
                    <div className="text-[10px] font-bold text-white">WhatsApp Pareado</div>
                    <div className="text-[8px] text-slate-400 font-mono">+55 (11) 99999-1234</div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white p-1 rounded-lg mx-auto relative overflow-hidden flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-200 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-200 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-200 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-200 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-200 rounded" />
                      <div className="bg-slate-950 rounded" />
                      <div className="bg-slate-205 rounded" />
                      <div className="bg-slate-950 rounded" />
                    </div>

                    {showQRScan && (
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500 animate-bounce shadow-[0_0_8px_rgba(16,185,129,1)] z-20" />
                    )}
                  </div>
                )}
              </div>

              <div className="text-[8px] text-slate-500 text-center font-medium leading-tight">
                {isConnected ? 'Sincronizado via Evolution API' : 'Abra o WhatsApp > Dispositivos Conectados'}
              </div>
            </div>

            {/* Right WhatsApp Web mockup */}
            <div className="col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col justify-between overflow-hidden relative">
              <div className="bg-slate-850 px-2 py-1.5 rounded-lg flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[8px] font-bold text-white">C</div>
                <div>
                  <div className="text-[8px] font-bold text-white">Carlos Eduardo (Lead)</div>
                  <div className="text-[6px] text-slate-400">online</div>
                </div>
              </div>

              {/* Chat View */}
              <div className="flex-grow space-y-2 p-1 overflow-hidden flex flex-col justify-end min-h-[90px]">
                {showMsgLog && (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 max-w-[85%] self-start text-[8px] leading-relaxed text-slate-300">
                    Olá Dra. Ana, vi sua página na internet e gostaria de agendar uma consulta de atendimento clínico e acompanhamento.
                  </div>
                )}
                {showMsgLog && playTime >= 40 && (
                  <div className="bg-emerald-600/95 border border-emerald-500/20 text-white rounded-lg p-2 max-w-[85%] self-end text-[8px] leading-relaxed shadow-lg">
                    Olá Carlos! Obrigado pelo contato. Recebemos sua solicitação. O seu horário de atendimento e acompanhamento pré-agendado está registrado! Em instantes confirmamos sua sessão.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Step 4: CRM & Dashboard (45s - 60s)
      const visitors = playTime < 45 ? 350 : Math.min(425, 350 + Math.floor((playTime - 45) * 5));
      const leads = playTime < 45 ? 28 : Math.min(36, 28 + Math.floor((playTime - 45) * 0.5));
      
      const isCardDragged = playTime >= 51;
      const isConfirmed = playTime >= 54;

      return (
        <div className="w-full h-full bg-slate-950 p-4 flex flex-col justify-between relative text-slate-200 overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-clinical-500" />
              <span className="text-xs font-bold text-slate-400">MedTraffic CRM & Agenda de Consultas</span>
            </div>
            <span className="bg-clinical-500/10 text-clinical-400 border border-clinical-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
              Sincronização Google Agenda
            </span>
          </div>

          {/* Stats Summary cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-lg text-center">
              <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider">Visitas LP</div>
              <div className="text-xs font-black text-white mt-0.5">{visitors}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-lg text-center">
              <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider">Leads Obtidos</div>
              <div className="text-xs font-black text-white mt-0.5">{leads}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-lg text-center">
              <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider">Consultas</div>
              <div className="text-xs font-black text-white mt-0.5">14</div>
            </div>
          </div>

          {/* CRM Kanban Columns */}
          <div className="flex-grow grid grid-cols-3 gap-2 overflow-hidden items-stretch">
            {/* Column 1: Novos Leads */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 space-y-2 flex flex-col justify-start">
              <div className="text-[8px] font-bold text-slate-400 pb-1 border-b border-slate-850">
                Novos Leads ({!isCardDragged ? '1' : '0'})
              </div>
              
              {!isCardDragged && (
                <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg space-y-1 shadow-md hover:border-clinical-500 transition-colors animate-pulse">
                  <div className="text-[9px] font-bold text-white">Carlos E. Santos</div>
                  <div className="text-[7px] text-slate-500">Terapia/Acompanhamento</div>
                  <div className="bg-clinical-500/10 text-clinical-400 border border-clinical-500/20 text-[6px] font-bold px-1 py-0.5 rounded w-fit">
                    Pendente
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Agendados */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 space-y-2 flex flex-col justify-start">
              <div className="text-[8px] font-bold text-slate-400 pb-1 border-b border-slate-850">
                Agendados ({isCardDragged ? '1' : '0'})
              </div>

              {isCardDragged && (
                <div className="bg-slate-950 border border-clinical-500/30 p-2 rounded-lg space-y-1 shadow-lg shadow-clinical-500/5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-white">Carlos E. Santos</span>
                    {isConfirmed && (
                      <span className="bg-emerald-500/15 text-emerald-400 text-[6px] font-bold px-1 rounded">Ativo</span>
                    )}
                  </div>
                  <div className="text-[7px] text-slate-400">Consulta Ter. 14:00</div>
                  {isConfirmed ? (
                    <div className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-[6px] font-semibold p-1 rounded font-mono flex items-center justify-between mt-1 select-all cursor-pointer">
                      <span>meet.google.com/ana-carlos</span>
                    </div>
                  ) : (
                    <div className="text-[6px] text-slate-500 font-mono italic animate-pulse">Gerando Google Meet...</div>
                  )}
                </div>
              )}
            </div>

            {/* Column 3: Histórico */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 space-y-2 flex flex-col justify-start">
              <div className="text-[8px] font-bold text-slate-400 pb-1 border-b border-slate-850">Histórico</div>
              <div className="bg-slate-950/40 border border-slate-900 p-2 rounded-lg text-slate-600 text-[7px] text-center border-dashed">
                Nenhum concluído hoje
              </div>
            </div>
          </div>

          {/* Toast Alert popup for sync confirmation */}
          {isConfirmed && (
            <div className="absolute right-4 bottom-14 bg-indigo-600 border border-indigo-400/20 text-white rounded-xl p-2.5 flex items-center gap-2 shadow-2xl z-30 max-w-[200px]">
              <Calendar className="h-4 w-4 shrink-0 text-indigo-200" />
              <div className="text-[8px] leading-tight">
                <strong>Google Agenda!</strong><br />
                Consulta e sala do Meet criadas automaticamente na agenda do profissional.
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // Interpolate mouse cursor coordinate based on playTime
  const getCursorPos = () => {
    if (playTime >= 7 && playTime < 10) {
      // Stage 1: Move to color button. Start (50, 50), End (30, 75)
      const t = (playTime - 7) / 3;
      return { x: 50 + (30 - 50) * t, y: 50 + (75 - 50) * t, visible: true, clicking: playTime > 9.8 };
    }
    if (playTime >= 10 && playTime < 13) {
      // Stage 1: Move to Publicar. Start (30, 75), End (85, 12)
      const t = (playTime - 10) / 3;
      return { x: 30 + (85 - 30) * t, y: 75 + (12 - 75) * t, visible: true, clicking: playTime > 12.8 };
    }
    if (playTime >= 48 && playTime < 52) {
      // Stage 4: Drag card. Start (25, 45), End (65, 45)
      const t = (playTime - 48) / 4;
      return { x: 25 + (65 - 25) * t, y: 45, visible: true, clicking: true };
    }
    if (playTime >= 53 && playTime < 55) {
      // Stage 4: Click Confirmar. Start (65, 45), End (50, 60)
      const t = (playTime - 53) / 2;
      return { x: 65 + (50 - 65) * t, y: 45 + (60 - 45) * t, visible: true, clicking: playTime > 54.8 };
    }
    return { x: 0, y: 0, visible: false, clicking: false };
  };

  const cursor = getCursorPos();

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
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="bg-clinical-500 hover:bg-clinical-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-clinical-500/30 hover:shadow-clinical-500/50 hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-200 text-center">
              Começar Agora
            </Link>
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
            <Link href="/register" className="bg-gradient-to-r from-clinical-500 to-indigo-650 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-clinical-500/25 hover:shadow-clinical-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group text-center">
              Criar minha Landing Page
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={openModal}
              className="border border-slate-700 hover:border-slate-500 bg-slate-900/60 backdrop-blur-md text-slate-200 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-900 transition-all duration-200 flex items-center justify-center gap-2 text-center"
            >
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

      {/* Nichos Atendidos Section */}
      <section id="nichos" className="py-20 bg-slate-950/20 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-indigo-400">
              <Users className="h-4 w-4" />
              Público-Alvo do MedTraffic
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Nichos Atendidos
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              A MedTraffic é destinada a **profissionais de saúde** que têm serviços a oferecer como **atendimento** e **acompanhamento**. Estruturamos campanhas e funis seguros, facilitando a captação de forma legítima e ética.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-clinical-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-clinical-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-clinical-500/10 p-3 rounded-xl w-fit text-clinical-500 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Psicólogos e Terapeutas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ideal para profissionais que oferecem consultas de terapia online ou presencial e buscam manter o acompanhamento contínuo dos pacientes em conformidade com o CFP.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-clinical-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-indigo-500/10 p-3 rounded-xl w-fit text-indigo-400 mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cuidadores e Home Care</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Destinado a cuidadores de idosos, equipes de enfermagem domiciliar e prestadores de serviços de assistência que ofertam atendimento e acompanhamento residencial.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-clinical-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-clinical-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-clinical-500/10 p-3 rounded-xl w-fit text-clinical-500 mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Médicos e Clínicas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Para médicos que desejam atrair pacientes em sua região para atendimento especializado, consultas periódicas de diagnóstico ou acompanhamento clínico programado.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-clinical-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-indigo-500/10 p-3 rounded-xl w-fit text-indigo-400 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fisioterapia e Outros</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fisioterapeutas, fonoaudiólogos e nutricionistas que necessitam agendar sessões recorrentes de atendimento e prestar acompanhamento de reabilitação física ou alimentar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="processos" className="py-20 bg-slate-950/40 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 bg-clinical-500/10 border border-clinical-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-teal-400">
              <Zap className="h-4 w-4" />
              Fluxo MedTraffic Fim a Fim
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Como funciona o MedTraffic?
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Desde a criação da sua página até a chegada de pacientes pelo WhatsApp, nosso sistema simplifica e protege cada etapa do processo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative mb-12">
            {/* Linha conectora nas telas grandes */}
            <div className="hidden lg:block absolute top-16 left-8 right-8 h-0.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 opacity-20 -z-10" />

            {/* Passo 1 */}
            <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl relative text-left">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-clinical-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-clinical-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">Crie sua LP</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Use nosso editor simplificado para criar e publicar sua página de captura otimizada e responsiva em poucos minutos.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl relative text-left">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">Guardrail Ético</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nossa IA ajusta automaticamente os textos e anúncios, filtrando palavras proibidas e garantindo conformidade com o CFP/CFM.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl relative text-left">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-clinical-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-clinical-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">WhatsApp Automático</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conecte seu WhatsApp por QR Code e dispare mensagens automáticas personalizadas para cada lead que solicitar atendimento.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl relative text-left">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-500/30">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">CRM & Google Agenda</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitore contatos no funil visual, confirme pré-agendamentos e gere links automáticos do Google Meet para as consultas.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-clinical-500 to-indigo-655 hover:from-clinical-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-clinical-500/20 hover:shadow-clinical-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-3"
            >
              <Play className="h-5 w-5 fill-current" />
              Ver Demonstração do Processo Completo
            </button>
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

      {/* Interactive Video Simulation Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col relative aspect-video animate-fade-in">
            
            {/* Modal Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Demonstração Interativa MedTraffic</span>
              </div>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Screen Content */}
            <div className="flex-grow relative bg-slate-950 overflow-hidden select-none">
              {renderSimulatedScreen()}

              {/* Mock Mouse Cursor overlay */}
              {cursor.visible && (
                <div
                  className="absolute pointer-events-none z-50 transition-all duration-75"
                  style={{
                    left: `${cursor.x}%`,
                    top: `${cursor.y}%`,
                    transform: 'translate(-4px, -4px)',
                  }}
                >
                  <svg className={`h-6 w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${cursor.clicking ? 'scale-90 text-teal-400' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 3v15.2l4.7-4.6 3.8 8.8 2.8-1.2-3.8-8.8 5.7-.5z" />
                  </svg>
                  {cursor.clicking && (
                    <span className="absolute top-0 left-0 w-8 h-8 -mt-1 -ml-1 border-2 border-teal-400 rounded-full animate-ping opacity-75" />
                  )}
                </div>
              )}

              {/* Watermark/REC badge overlay */}
              <div className="absolute top-16 right-4 bg-slate-900/60 border border-slate-850 backdrop-blur-sm px-2.5 py-1 rounded-md text-[8px] font-bold text-slate-400 flex items-center gap-1.5 pointer-events-none z-10">
                <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : ''}`} />
                <span>REC SIMULATION</span>
              </div>
            </div>

            {/* Steps Nav-Tabs under screen */}
            <div className="bg-slate-900 border-t border-slate-800 grid grid-cols-4 text-center border-b border-slate-850">
              <button 
                onClick={() => { setPlayTime(0); setIsPlaying(true); }}
                className={`py-2 text-[10px] font-bold border-r border-slate-800 transition-colors ${playTime < 15 ? 'bg-slate-800/80 text-clinical-400 border-b-2 border-b-clinical-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                1. Editor de Landing Page
              </button>
              <button 
                onClick={() => { setPlayTime(15); setIsPlaying(true); }}
                className={`py-2 text-[10px] font-bold border-r border-slate-800 transition-colors ${playTime >= 15 && playTime < 30 ? 'bg-slate-800/80 text-indigo-400 border-b-2 border-b-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                2. Guardrail de IA Ética
              </button>
              <button 
                onClick={() => { setPlayTime(30); setIsPlaying(true); }}
                className={`py-2 text-[10px] font-bold border-r border-slate-800 transition-colors ${playTime >= 30 && playTime < 45 ? 'bg-slate-800/80 text-emerald-400 border-b-2 border-b-emerald-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                3. WhatsApp Automático
              </button>
              <button 
                onClick={() => { setPlayTime(45); setIsPlaying(true); }}
                className={`py-2 text-[10px] font-bold transition-colors ${playTime >= 45 ? 'bg-slate-800/80 text-clinical-400 border-b-2 border-b-clinical-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                4. CRM & Google Meet
              </button>
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-900 px-6 py-4 flex flex-col gap-3">
              {/* Progress timeline slider */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 select-none">
                  0:{(Math.floor(playTime)).toString().padStart(2, '0')}
                </span>
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    setPlayTime(percentage * 60);
                  }}
                  className="flex-grow h-1.5 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group hover:h-2 transition-all"
                >
                  <div 
                    className="h-full bg-gradient-to-r from-clinical-500 to-indigo-500 transition-all duration-75 relative"
                    style={{ width: `${(playTime / 60) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 select-none">
                  1:00
                </span>
              </div>

              {/* Lower Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl border border-slate-750 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>

                  {/* Mute toggles */}
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Speed & Stage badge */}
                <div className="flex items-center gap-3">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-slate-850 px-2 py-1 rounded-md border border-slate-800">
                    Etapa {playTime < 15 ? '1/4' : playTime < 30 ? '2/4' : playTime < 45 ? '3/4' : '4/4'}
                  </div>

                  {/* Playback speed selector */}
                  <div className="flex items-center gap-1 bg-slate-850 p-1 rounded-lg border border-slate-800 text-[10px] font-black">
                    {[1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaySpeed(speed)}
                        className={`px-2 py-0.5 rounded transition-all ${playSpeed === speed ? 'bg-clinical-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-350'}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
