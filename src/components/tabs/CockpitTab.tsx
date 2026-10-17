"use client";

import React, { useState } from "react";
import {
  Activity,
  Heart,
  TrendingDown,
  Flame,
  Shield,
  Zap,
  Calendar,
  Clock,
  Compass,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import {
  BodyMetrics,
  FootballTeamData,
  GalaxyWatchTelemetry,
  WeekendLayoutMode,
} from "@/lib/types";

interface CockpitTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  metrics: BodyMetrics;
  telemetry: GalaxyWatchTelemetry;
  footballData: {
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
  };
  onTriggerTuyaScene: (scene: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export function CockpitTab({
  currentProfile,
  metrics,
  telemetry,
  footballData,
  onTriggerTuyaScene,
  onNavigateToTab,
}: CockpitTabProps) {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("SHOULDER");
  const [showTbdDrawer, setShowTbdDrawer] = useState<boolean>(false);
  const [tuyaNotification, setTuyaNotification] = useState<string | null>(null);

  const isDaniel = currentProfile !== "PATRICIA";
  const teamData = isDaniel ? footballData.flamengo : footballData.gremio;

  const handleSceneClick = (sceneName: string, label: string) => {
    onTriggerTuyaScene(sceneName);
    setTuyaNotification(`Cena "${label}" acionada via Nuvem Tuya!`);
    setTimeout(() => setTuyaNotification(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Tuya Feedback Banner */}
      {tuyaNotification && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-200 text-xs font-semibold shadow-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400 animate-bounce" />
            <span>{tuyaNotification}</span>
          </div>
          <button
            onClick={() => setTuyaNotification(null)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section: Digital Twin + Daily Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Digital Twin Interactive Guide (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#111827] border border-[#1F2937] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Digital Twin Biomecânico
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    {isDaniel ? "Daniel Souto Lopes (43a, 170cm)" : "Patrícia Lopes (40a, 162cm)"}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                Prontidão {telemetry.recoveryReadinessPct}%
              </span>
            </div>

            {/* Interactive Anatomical SVG Model */}
            <div className="relative py-4 flex flex-col items-center justify-center bg-[#090D16]/60 rounded-xl border border-gray-800/60 my-2">
              <svg
                viewBox="0 0 200 320"
                className="w-44 h-64 drop-shadow-lg cursor-pointer transition-transform"
              >
                {/* Body Silhouette */}
                {/* Head */}
                <circle
                  cx="100"
                  cy="35"
                  r="20"
                  fill="#1E293B"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  onClick={() => setSelectedBodyPart("HEAD")}
                  className="hover:fill-blue-900/40"
                />
                {/* Neck */}
                <rect x="94" y="55" width="12" height="15" fill="#334155" />
                {/* Torso */}
                <path
                  d="M70,70 L130,70 L120,170 L80,170 Z"
                  fill="#1E293B"
                  stroke="#374151"
                  strokeWidth="1.5"
                  onClick={() => setSelectedBodyPart("TORSO")}
                  className="hover:fill-blue-900/40"
                />
                {/* Left Arm (Viewer's left = Right arm of person) -> Daniel's Shoulder Prosthesis */}
                <circle
                  cx="62"
                  cy="75"
                  r="10"
                  fill={isDaniel ? "#EF4444" : "#1E293B"}
                  stroke={isDaniel ? "#FCA5A5" : "#3B82F6"}
                  strokeWidth={isDaniel ? "2.5" : "1"}
                  onClick={() => setSelectedBodyPart("SHOULDER")}
                  className={isDaniel ? "animate-pulse cursor-pointer" : ""}
                />
                <rect x="52" y="85" width="14" height="60" rx="6" fill="#334155" />

                {/* Right Arm (Viewer's right = Left arm) */}
                <circle
                  cx="138"
                  cy="75"
                  r="9"
                  fill="#1E293B"
                  stroke="#374151"
                  onClick={() => setSelectedBodyPart("ARMS")}
                />
                <rect x="134" y="85" width="14" height="60" rx="6" fill="#334155" />

                {/* Pelvis & Legs */}
                <path d="M80,170 L120,170 L115,200 L85,200 Z" fill="#334155" />
                {/* Left Leg */}
                <rect
                  x="82"
                  y="200"
                  width="15"
                  height="100"
                  rx="6"
                  fill="#1E293B"
                  stroke="#3B82F6"
                  strokeWidth="1"
                  onClick={() => setSelectedBodyPart("LEGS")}
                  className="hover:fill-blue-900/40"
                />
                {/* Right Leg */}
                <rect
                  x="103"
                  y="200"
                  width="15"
                  height="100"
                  rx="6"
                  fill="#1E293B"
                  stroke="#3B82F6"
                  strokeWidth="1"
                  onClick={() => setSelectedBodyPart("LEGS")}
                  className="hover:fill-blue-900/40"
                />

                {/* Highlight Pulse Rings on Shoulder if Daniel */}
                {isDaniel && (
                  <circle
                    cx="62"
                    cy="75"
                    r="16"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="animate-spin-slow"
                  />
                )}
              </svg>

              {/* Anatomy Pin Badge */}
              {isDaniel && (
                <div
                  onClick={() => setSelectedBodyPart("SHOULDER")}
                  className="absolute top-6 left-5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/90 border border-red-500/50 text-[10px] text-red-200 cursor-pointer shadow-md"
                >
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                  <span>Prótese Reversa (Ombro D)</span>
                </div>
              )}

              {/* Quick Anatomy Detail Card */}
              <div className="w-full px-3 pt-2 text-left">
                {selectedBodyPart === "SHOULDER" && isDaniel && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-200 space-y-1">
                    <p className="font-bold text-red-300">
                      Articulação Escapuloumeral Direita (Prótese Reversa)
                    </p>
                    <p className="text-[11px] text-gray-300">
                      Bloqueio estrito de desenvolvimentos overhead e supino barra. Substituído
                      por supino halteres pegada neutra 45° e elevação no plano escapular.
                    </p>
                  </div>
                )}

                {selectedBodyPart !== "SHOULDER" && (
                  <div className="p-3 rounded-lg bg-[#1F2937]/50 border border-gray-700/60 text-xs text-gray-200">
                    <p className="font-semibold text-blue-400">
                      Gastrocnêmio & Cadeia Posterior
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Prontos para rodagem de asfalto. Recomenda-se cadência de 172-178 spm
                      para economia de corrida.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body Composition Navy Summary */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
            <div className="bg-[#090D16] p-2.5 rounded-xl border border-gray-800/80 text-center">
              <span className="text-[10px] text-gray-400 block font-medium">Gordura (Navy)</span>
              <span className="text-base font-extrabold text-blue-400">
                {metrics.bodyFatPct}%
              </span>
              <span className="text-[9px] text-gray-500 block">
                {metrics.fatMassKg}kg gordura
              </span>
            </div>

            <div className="bg-[#090D16] p-2.5 rounded-xl border border-gray-800/80 text-center">
              <span className="text-[10px] text-gray-400 block font-medium">Massa Magra</span>
              <span className="text-base font-extrabold text-emerald-400">
                {metrics.leanMassKg}kg
              </span>
              <span className="text-[9px] text-gray-500 block">Metabolismo ativo</span>
            </div>

            <div className="bg-[#090D16] p-2.5 rounded-xl border border-gray-800/80 text-center">
              <span className="text-[10px] text-gray-400 block font-medium">Ganho no Pace</span>
              <span className="text-base font-extrabold text-amber-400">
                -{metrics.runningPaceGainSec}s/km
              </span>
              <span className="text-[9px] text-gray-500 block">ao atingir 75kg</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mission of the Day & Live Hubs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Daily Mission Card (Dual Mode: Outdoor vs Treadmill <= 60 min) */}
          <div className="rounded-2xl bg-gradient-to-br from-[#111827] via-[#161F33] to-[#111827] border border-blue-500/30 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                  Missão do Dia (Terça-Feira)
                </span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Teto: 55 min (&lt;= 60 min úteis)
                </span>
              </div>

              <button
                onClick={() => onNavigateToTab("COACH")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Ver Planilha</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-white">
              Corrida Contínua Z2: Dual-Mode (Rua vs Esteira)
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Foco metabólico em lipólise e capilarização muscular sem sobrecarga articular.
            </p>

            {/* Dual Mode Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Mode A: Street / Outdoor */}
              <div className="p-3.5 rounded-xl bg-[#090D16]/80 border border-gray-800 hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5" />
                    Opção 1: Asfalto (Rua)
                  </span>
                  <span className="text-[10px] text-gray-400">8.5 km</span>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Pace Alvo:</span>
                    <span className="font-bold text-white">6:15 min/km</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Zona FC:</span>
                    <span className="font-bold text-emerald-400">Z2 (110 a 127 bpm)</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Trajeto plano. Aquecimento 1.5km + 6km contínuo + desaquecimento.
                  </p>
                </div>
              </div>

              {/* Mode B: Treadmill (Esteira) */}
              <div className="p-3.5 rounded-xl bg-[#090D16]/80 border border-cyan-800/50 hover:border-cyan-500/60 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    Opção 2: Esteira (km/h + %)
                  </span>
                  <span className="text-[10px] text-cyan-300">55 min</span>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Velocidade:</span>
                    <span className="font-bold text-white">9.5 km/h</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Inclinação:</span>
                    <span className="font-bold text-cyan-300">1.5% (resistência ar)</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Degraus: 10m aquec. (7.5 km/h) + 35m Z2 (9.5 km/h) + 10m solto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Smart Home Tuya Control Strip */}
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Controle Residencial Tuya Smart Home
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Nuvem OpenAPI Conectada
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() =>
                  handleSceneClick(
                    isDaniel ? "FLAMENGO_MATCH" : "GREMIO_MATCH",
                    isDaniel ? "Match Day Rubro-Negro" : "Match Day Tricolor"
                  )
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isDaniel
                    ? "bg-red-950/20 border-red-500/40 hover:bg-red-900/30 text-red-300"
                    : "bg-sky-950/20 border-sky-500/40 hover:bg-sky-900/30 text-sky-300"
                }`}
              >
                <span className="text-xs font-bold block">
                  {isDaniel ? "🔴 Modo Flamengo" : "🔵 Modo Grêmio"}
                </span>
                <span className="text-[10px] opacity-75">Luzes do time</span>
              </button>

              <button
                onClick={() => handleSceneClick("PRE_WORKOUT_FOCUS", "Foco Pré-Treino 18h30")}
                className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 hover:bg-blue-900/30 text-blue-300 text-left transition-all"
              >
                <span className="text-xs font-bold block">⚡ Foco 18h30</span>
                <span className="text-[10px] opacity-75">6500K Fria (Dopamina)</span>
              </button>

              <button
                onClick={() =>
                  handleSceneClick("PARASYMPATHETIC_NIGHT", "Freio Térmico 20h30")
                }
                className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/40 hover:bg-purple-900/30 text-purple-300 text-left transition-all"
              >
                <span className="text-xs font-bold block">🌙 Freio 20h30</span>
                <span className="text-[10px] opacity-75">2200K Âmbar (Melatonina)</span>
              </button>

              <button
                onClick={() =>
                  handleSceneClick("SUNRISE_LONG_RUN", "Simulação Amanhecer 06h30")
                }
                className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/40 hover:bg-amber-900/30 text-amber-300 text-left transition-all"
              >
                <span className="text-xs font-bold block">🌅 Sol Longão</span>
                <span className="text-[10px] opacity-75">Despertar Suave</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2027 Season & Live Football Hub Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 2027 Marathon Cycle Widget with TBD Drawer Button */}
        <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Ciclo de Meias-Maratonas 2027 (Alvos P1)
                </h3>
              </div>

              <button
                onClick={() => setShowTbdDrawer(!showTbdDrawer)}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/80 hover:bg-amber-900/80"
              >
                {showTbdDrawer ? "Ocultar Provas TBD" : "+ Provas TBD (Praia Grande)"}
              </button>
            </div>

            {/* Confirmed P1 Races */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#090D16] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-300">P1 CONFIRMADA</span>
                    <span className="text-xs font-bold text-white">
                      Maratona Internacional de SP (21k)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    11 de Abril de 2027 • Ibirapuera, SP • Pace Alvo: 5:30 min/km
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-white">1h 55m</span>
                  <span className="block text-[10px] text-emerald-400">Fase: Base Aeróbia</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-300">P1 CONFIRMADA</span>
                    <span className="text-xs font-bold text-white">
                      Nike SP City Marathon (21k)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    25 de Julho de 2027 • Pacaembu / Jockey • Pace Alvo: 5:25 min/km
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-white">1h 54m</span>
                  <span className="block text-[10px] text-blue-400">Fase: Volume Inicial</span>
                </div>
              </div>

              {/* TBD Draft Race Drawer */}
              {showTbdDrawer && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/60 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5 text-purple-400" />
                      Rascunho TBD: Meia Maratona de Praia Grande (21k)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-200">
                      Janela: Set/Out 2027
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1">
                    Prova teste litorânea (percurso 100% plano, nível do mar). Prioridade P2 Prep.
                    Data oficial aguardando publicação do calendário da FPA.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Protocolo Tapering: 3 semanas regressivas</span>
            <span>Recovery Lock: 14 dias pós-21k</span>
          </div>
        </div>

        {/* Live Football Hub Widget */}
        {teamData && (
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame
                    className={`h-4 w-4 ${isDaniel ? "text-red-500" : "text-sky-400"}`}
                  />
                  <h3 className="text-sm font-bold text-white">
                    Family Football Hub: {teamData.teamName} (Dados Reais)
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    teamData.tensionIndex >= 4
                      ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse"
                      : "bg-gray-800 text-gray-300 border-gray-700"
                  }`}
                >
                  Índice de Tensão: {teamData.tensionIndex}/5
                </span>
              </div>

              {/* Standings Summary */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-[#090D16] p-2 rounded-lg text-center border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Posição</span>
                  <span className="text-sm font-extrabold text-white">
                    {teamData.standingPosition}º Lugar
                  </span>
                </div>
                <div className="bg-[#090D16] p-2 rounded-lg text-center border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Pontos</span>
                  <span className="text-sm font-extrabold text-blue-400">
                    {teamData.points}
                  </span>
                </div>
                <div className="bg-[#090D16] p-2 rounded-lg text-center border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Jogos</span>
                  <span className="text-sm font-extrabold text-white">
                    {teamData.gamesPlayed}
                  </span>
                </div>
                <div className="bg-[#090D16] p-2 rounded-lg text-center border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Saldo</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    +{teamData.goalDifference}
                  </span>
                </div>
              </div>

              {/* Next Game & Logistical Adjustment */}
              {teamData.nextMatches && teamData.nextMatches[0] && (
                <div className="p-3 rounded-xl bg-[#090D16] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Próximo Jogo: vs {teamData.nextMatches[0].opponent}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      {teamData.nextMatches[0].date} ({teamData.nextMatches[0].timeBrasilia})
                    </span>
                  </div>

                  {teamData.logisticalAdjustments && (
                    <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>
                          {teamData.logisticalAdjustments.requiresTrainingCut
                            ? `Corte logístico: Treino deve encerrar às ${teamData.logisticalAdjustments.recommendedEndTime}`
                            : "Horário de treino livre"}
                        </span>
                      </div>
                      <span className="font-bold">
                        +{teamData.logisticalAdjustments.caloricBufferKcal} kcal buffer petisco
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Pesquisa em tempo real via Gemini 2.5 Flash</span>
              <button
                onClick={() => onNavigateToTab("NUTRITION")}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Ver Petiscos Saudáveis →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
