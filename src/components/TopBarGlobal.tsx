"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Shield,
  Users,
  Activity,
  Trophy,
  Zap,
  Clock,
  Sparkles,
  Wifi,
  ChevronDown,
  Compass,
  BookOpen,
  Calendar,
  FileText,
  Medal,
  Heart,
  Volume2,
  Award,
  Crown,
  Smartphone,
  Settings,
  Sunrise,
} from "lucide-react";
import { FootballTeamData, ProfileId } from "@/lib/types";
import { getProfileSpecs } from "@/lib/physiology";

interface TopBarGlobalProps {
  currentProfile: ProfileId;
  onSelectProfile: (profile: ProfileId) => void;
  footballData: {
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
    palmeiras?: FootballTeamData | null;
  };
  onRefreshData?: () => void;
  onOpenManual?: () => void;
  onOpenSoccerHub?: () => void;
  onOpenRaceManager?: () => void;
  onOpenReports?: () => void;
  onOpenTacticalSimulator?: () => void;
  onOpenTrophyCardGenerator?: () => void;
  onOpenClanHallOfFame?: () => void;
  onOpenSetup?: () => void;
  onOpenRaceMorning?: () => void;
  onOpenDanielTrainingPlan?: () => void;
}

export function TopBarGlobal({
  currentProfile,
  onSelectProfile,
  footballData,
  onRefreshData,
  onOpenManual,
  onOpenSoccerHub,
  onOpenRaceManager,
  onOpenReports,
  onOpenTacticalSimulator,
  onOpenTrophyCardGenerator,
  onOpenClanHallOfFame,
  onOpenSetup,
  onOpenRaceMorning,
  onOpenDanielTrainingPlan,
}: TopBarGlobalProps) {
  const [daysToSpInter, setDaysToSpInter] = useState<number>(176);
  const [daysToNike, setDaysToNike] = useState<number>(281);
  const [daysToEstacoes, setDaysToEstacoes] = useState<number>(218);

  // Easter Eggs State
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [activeEasterEgg, setActiveEasterEgg] = useState<{
    title: string;
    description: string;
    theme: "GOLD" | "FLAMENGO" | "GREMIO" | "PALMEIRAS";
  } | null>(null);

  const spec = getProfileSpecs(currentProfile);

  useEffect(() => {
    const now = new Date();
    const d1 = new Date("2027-04-11T07:00:00");
    const d2 = new Date("2027-07-25T06:30:00");
    const d3 = new Date("2027-05-23T07:00:00");

    setDaysToSpInter(Math.max(0, Math.ceil((d1.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
    setDaysToNike(Math.max(0, Math.ceil((d2.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
    setDaysToEstacoes(Math.max(0, Math.ceil((d3.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
  }, []);

  const isDaniel = currentProfile === "DANIEL";
  const isPatricia = currentProfile === "PATRICIA";
  const isGabriel = currentProfile === "GABRIEL";

  const activeTeamData = isGabriel
    ? footballData.palmeiras
    : isPatricia
    ? footballData.gremio
    : footballData.flamengo;

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setActiveEasterEgg({
        title: "🌟 MODO CLÃ LOPES OURO • HAUTE HORLOGERIE DESBLOQUEADO!",
        description:
          "Três gerações unidas pelo asfalto e pelo coração! Daniel (52a • Mengão 🔴⚫), Patrícia (56a • Imortal 🔵⚪⚫) e Gabriel (20a • Verdão 🟢⚪). O esporte transforma a nossa linhagem!",
        theme: "GOLD",
      });
      setLogoClicks(0);
      setTimeout(() => setActiveEasterEgg(null), 9000);
    }
  };

  const handleProfileClick = (profile: ProfileId) => {
    if (profile === currentProfile) {
      // Trigger individual easter egg on second click!
      if (profile === "DANIEL") {
        setActiveEasterEgg({
          title: "🛡️ MODO CIBORGUE: TITÂNIO & CORAÇÃO RUBRO-NEGRO",
          description:
            "Prótese reversa de ombro 100% blindada! Zero overhead, cadência 178 spm e Z5 desbloqueado. 'Em dezembro de 81, botou os ingleses na roda!' 🔴⚫",
          theme: "FLAMENGO",
        });
      } else if (profile === "PATRICIA") {
        setActiveEasterEgg({
          title: "👑 RAINHA DO PÓDIO: ESTABILIDADE GLÚTEA & ALMA GAÚCHA",
          description:
            "Glúteo médio blindado, joelho sem valgo dinâmico e garra imortal dos Pampas! 14k amanhã e temporada 2027 assegurada! 'Até a pé nós iremos!' 🔵⚪⚫",
          theme: "GREMIO",
        });
      } else if (profile === "GABRIEL") {
        setActiveEasterEgg({
          title: "⚡ MOTOR ALVIVERDE 2006: 20 ANOS DE PURA ARRANCADA",
          description:
            "Nascido em 15/08/2006, juventude de aço e potência anaeróbia do Allianz Parque! Sub-45 nos 10K na ponta dos cascos! 'Quando surge o Alviverde Imponente!' 🟢⚪",
          theme: "PALMEIRAS",
        });
      }
      setTimeout(() => setActiveEasterEgg(null), 8000);
    } else {
      onSelectProfile(profile);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070A11]/90 backdrop-blur-xl px-3 sm:px-6 py-2.5 transition-all shadow-2xl">
      {/* Active Easter Egg Toast Banner */}
      {activeEasterEgg && (
        <div
          className={`mb-2.5 p-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-between shadow-2xl animate-fadeIn ${
            activeEasterEgg.theme === "GOLD"
              ? "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black border border-yellow-300"
              : activeEasterEgg.theme === "FLAMENGO"
              ? "bg-gradient-to-r from-red-900 via-black to-red-950 text-red-200 border border-red-500/50"
              : activeEasterEgg.theme === "GREMIO"
              ? "bg-gradient-to-r from-sky-900 via-black to-cyan-950 text-sky-200 border border-sky-500/50"
              : "bg-gradient-to-r from-emerald-900 via-black to-green-950 text-emerald-200 border border-emerald-500/50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
            <div>
              <span className="block font-black text-sm">{activeEasterEgg.title}</span>
              <span className="block text-[11px] opacity-90">{activeEasterEgg.description}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveEasterEgg(null)}
            className="p-1 rounded-lg hover:bg-black/20 text-xs font-black ml-3"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Clan Profile Switcher */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="Clique 5x para desbloquear o Segredo do Clã!"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-400 to-amber-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
              <div className="h-full w-full bg-[#070A11] rounded-[10px] flex items-center justify-center">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-widest uppercase text-white font-mono">
                  BIO-TRIAD <span className="text-emerald-400">OS</span>
                </span>
                <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase">
                  HAUTE SPORTS
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                Lopes Clan Precision • TACO • 2027
              </p>
            </div>
          </div>

          {/* Luxury Haute Horlogerie Segmented Switcher */}
          <div className="flex items-center bg-[#0C101A] p-1 rounded-2xl border border-white/10 shadow-inner">
            {/* Daniel Profile Pill */}
            <button
              onClick={() => handleProfileClick("DANIEL")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isDaniel
                  ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Daniel (52a) • Clique novamente para o Easter Egg Ciborgue!"
            >
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              <Flame className="h-3.5 w-3.5 text-white" />
              <span>Daniel</span>
              <span className="text-[10px] opacity-90 px-1 py-0.2 rounded bg-black/40 font-mono">
                FLA 🔴⚫
              </span>
            </button>

            {/* Patrícia Profile Pill */}
            <button
              onClick={() => handleProfileClick("PATRICIA")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPatricia
                  ? "bg-gradient-to-r from-sky-600 to-cyan-700 text-white shadow-lg shadow-sky-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Patrícia (56a) • Clique novamente para o Easter Egg Rainha do Pódio!"
            >
              <span className="h-2 w-2 rounded-full bg-sky-300"></span>
              <Shield className="h-3.5 w-3.5 text-white" />
              <span>Patrícia</span>
              <span className="text-[10px] opacity-90 px-1 py-0.2 rounded bg-black/40 font-mono">
                GRE 🔵⚪⚫
              </span>
            </button>

            {/* Gabriel Profile Pill */}
            <button
              onClick={() => handleProfileClick("GABRIEL")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isGabriel
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Gabriel (20a) • Clique novamente para o Easter Egg Motor Alviverde!"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <Zap className="h-3.5 w-3.5 text-white" />
              <span>Gabriel</span>
              <span className="text-[10px] opacity-90 px-1 py-0.2 rounded bg-black/40 font-mono">
                PAL 🟢⚪
              </span>
            </button>

            {/* Clan Lopes Profile Pill */}
            <button
              onClick={() => onSelectProfile("CLAN")}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentProfile === "CLAN"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Users className="h-3.5 w-3.5 text-white" />
              <span className="hidden sm:inline">Clã</span>
            </button>
          </div>
        </div>

        {/* Dynamic Football, Races & Executive Hub Badges */}
        <div className="flex items-center flex-wrap justify-end gap-2 w-full md:w-auto">
          {/* Soccer Hub Trigger */}
          <button
            onClick={onOpenSoccerHub}
            title="Abrir Hub de Times do Clã (Flamengo, Grêmio, Palmeiras)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:text-white hover:bg-amber-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono">Hub Times</span>
          </button>

          {/* Race Manager Trigger */}
          <button
            onClick={onOpenRaceManager}
            title="Abrir Calibrador de Ritmo Base (Athenas Amanhã), Provas & Classificações"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:text-white hover:bg-emerald-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Medal className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono">Provas & Pódios</span>
          </button>

          {/* Executive Reports Trigger */}
          {/* Daniel Future Training Plan */}
          {currentProfile === "DANIEL" && (
            <button
              onClick={onOpenDanielTrainingPlan}
              title="Planilha Oficial de Treinos Futuros de Daniel (Fases 1 & 2 • 23 Semanas • Rua & Esteira)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 hover:text-white hover:bg-red-900/40 text-xs font-semibold transition-all shadow-md"
            >
              <Calendar className="h-3.5 w-3.5 text-red-400" />
              <span className="font-mono">Planilha 23 Sem.</span>
            </button>
          )}

          <button
            onClick={onOpenReports}
            title="Abrir Central de Relatórios Executivos & Dossiê"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-blue-500/40 bg-blue-950/30 text-blue-300 hover:text-white hover:bg-blue-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <FileText className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-mono">Relatórios</span>
          </button>

          {/* Race Morning Alvorada Trigger */}
          <button
            onClick={() => onOpenRaceMorning?.()}
            title="Alvorada de Prova (Rua Maracá, 132 • Deslocamento de Carro • Regra -1h • Tuya Dual Plug)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:text-white hover:bg-amber-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Sunrise className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono">Alvorada</span>
          </button>

          {/* Tactical Simulator Trigger */}
          <button
            onClick={onOpenTacticalSimulator}
            title="Abrir Simulador Tático Km a Km de Prova"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:text-white hover:bg-cyan-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono">Tática</span>
          </button>

          {/* Trophy Card & Story Generator */}
          <button
            onClick={onOpenTrophyCardGenerator}
            title="Gerar Card & Story HD de Conquista para Instagram e WhatsApp"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:text-white hover:bg-amber-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Smartphone className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono">Card/Story</span>
          </button>

          {/* Clan Hall of Fame */}
          <button
            onClick={onOpenClanHallOfFame}
            title="Hall de Recordes, 1.652 km Coletivos e Vitrine de Troféus do Clã Lopes"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-500/40 bg-purple-950/30 text-purple-300 hover:text-white hover:bg-purple-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Crown className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-mono">Hall Clã</span>
          </button>

          {/* Setup Hub Trigger */}
          <button
            onClick={onOpenSetup}
            title="Central de Setup & Conexões (Strava Patrícia/Gabriel, Tuya IoT, WhatsApp Evolution)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:text-white hover:bg-cyan-900/40 text-xs font-semibold transition-all shadow-md"
          >
            <Settings className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono">Setup</span>
          </button>

          {/* Live Football Crest & Match Badge */}
          {activeTeamData && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-md ${
                isGabriel
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                  : isPatricia
                  ? "border-sky-500/40 bg-sky-950/30 text-sky-300"
                  : "border-red-500/40 bg-red-950/30 text-red-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isGabriel ? "bg-emerald-400" : isPatricia ? "bg-sky-400" : "bg-red-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isGabriel ? "bg-emerald-500" : isPatricia ? "bg-sky-500" : "bg-red-500"
                    }`}
                  ></span>
                </span>
                <span className="font-black tracking-wide">
                  {isGabriel ? "Palmeiras:" : isPatricia ? "Grêmio:" : "Flamengo:"}
                </span>
                <span className="font-mono text-white">{activeTeamData.standingPosition}º Lugar</span>
                <span className="text-gray-400 text-[11px]">({activeTeamData.points} pts)</span>
              </div>

              {activeTeamData.nextMatches && activeTeamData.nextMatches[0] && (
                <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-white/10 text-[11px] text-gray-300">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span>
                    vs {activeTeamData.nextMatches[0].opponent} ({activeTeamData.nextMatches[0].timeBrasilia || "18:30"})
                  </span>
                  {activeTeamData.nextMatches[0].broadcastChannels && activeTeamData.nextMatches[0].broadcastChannels[0] && (
                    <span className="text-[9px] bg-white/10 border border-white/15 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                      📺 {activeTeamData.nextMatches[0].broadcastChannels[0]}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Athlete Hardware Sync Badge */}
          <button
            onClick={onRefreshData}
            title="Sincronizar telemetria real do atleta"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0C101A] text-gray-300 hover:text-white hover:border-emerald-500/40 text-xs font-medium transition-all shadow-sm"
          >
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span className="hidden sm:inline font-mono">
              {isGabriel ? "Gabriel Watch" : isPatricia ? "Patrícia Watch" : "Galaxy Ultra"}
            </span>
          </button>

          {/* Help Manual Button */}
          <button
            onClick={onOpenManual}
            title="Abrir Manual de Operação do Bio-Triad OS"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0C101A] text-gray-400 hover:text-white text-xs font-medium transition-all shadow-sm"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
