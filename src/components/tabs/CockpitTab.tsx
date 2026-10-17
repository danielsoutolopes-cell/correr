"use client";

import React, { useState, useEffect } from "react";
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
  CloudSun,
  MapPin,
  Send,
  Watch,
  Timer,
  Layers,
  Award,
} from "lucide-react";
import {
  BodyMetrics,
  FootballTeamData,
  GalaxyWatchTelemetry,
  WeekendLayoutMode,
} from "@/lib/types";
import { WeatherPacingData } from "@/lib/weather-service";
import { getProfileSpecs, evaluateRaceCalendar } from "@/lib/physiology";

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
  const isDaniel = currentProfile !== "PATRICIA";
  const specs = getProfileSpecs(currentProfile);
  const races = evaluateRaceCalendar("2026-10-17", isDaniel ? "DANIEL" : "PATRICIA");

  const [selectedBodyPart, setSelectedBodyPart] = useState<string>(
    isDaniel ? "SHOULDER" : "PELVIS"
  );
  const [showTbdDrawer, setShowTbdDrawer] = useState<boolean>(false);
  const [tuyaNotification, setTuyaNotification] = useState<string | null>(null);

  const teamData = isDaniel ? footballData.flamengo : footballData.gremio;

  const [weatherData, setWeatherData] = useState<WeatherPacingData | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBodyPart(isDaniel ? "SHOULDER" : "PELVIS");
  }, [isDaniel]);

  useEffect(() => {
    fetch("/api/weather/live?city=Sao%20Paulo,BR")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setWeatherData(data);
      })
      .catch(() => {});
  }, []);

  const handleSendTelegramBriefing = async () => {
    setTelegramStatus("Disparando...");
    try {
      const res = await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ECLUSA_1830",
          message: `Atleta: ${specs.name} • Missão: ${
            isDaniel ? "Corrida Z2 55 min (Pace 6:15)" : "Corrida Z2 45 min (Pace 6:45)"
          } • Clima SP: ${weatherData?.tempC || 18}°C • Telemetria Galaxy: ${
            telemetry.recoveryReadinessPct
          }%`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTelegramStatus("Alerta Enviado!");
        setTimeout(() => setTelegramStatus(null), 4000);
      } else {
        setTelegramStatus("Falha no Envio");
      }
    } catch {
      setTelegramStatus("Erro de Rede");
    }
  };

  const handleSceneClick = (sceneName: string, label: string) => {
    onTriggerTuyaScene(sceneName);
    setTuyaNotification(`Cena "${label}" despachada via Tuya Cloud!`);
    setTimeout(() => setTuyaNotification(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Luxury Horlogerie Feedback Notification */}
      {tuyaNotification && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-blue-950/90 border border-blue-500/40 text-blue-200 text-xs font-semibold shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="font-mono tracking-wide">{tuyaNotification}</span>
          </div>
          <button
            onClick={() => setTuyaNotification(null)}
            className="text-gray-400 hover:text-white text-base px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Haute Horlogerie Athlete Identity Badge */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C101A] via-[#101726] to-[#0C101A] border border-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: isDaniel
              ? "radial-gradient(circle, #EF4444 0%, transparent 70%)"
              : "radial-gradient(circle, #0EA5E9 0%, transparent 70%)",
          }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Athlete Shield Dial */}
            <div
              className={`h-14 w-14 rounded-2xl flex items-center justify-center border text-2xl shadow-xl transition-all ${
                isDaniel
                  ? "bg-gradient-to-br from-red-950/80 to-black border-red-500/50 shadow-red-500/20"
                  : "bg-gradient-to-br from-sky-950/80 to-black border-sky-500/50 shadow-sky-500/20"
              }`}
            >
              {isDaniel ? "🔴⚫" : "🔵⚪"}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  {isDaniel ? "PERFIL MASCULINO • PROVA P1 21K" : "PERFIL FEMININO • PROVA P1 10K"}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isDaniel
                      ? "bg-red-950/60 text-red-300 border-red-800"
                      : "bg-sky-950/60 text-sky-300 border-sky-800"
                  }`}
                >
                  {specs.clubBadge}
                </span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                <span>{specs.name}</span>
                <span className="text-xs font-normal text-gray-400">({specs.weightKg}kg • {specs.heightCm}cm)</span>
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                {specs.tagline} • <span className="text-gray-300">{specs.hardware.device}</span>
              </p>
            </div>
          </div>

          {/* Quick Precision Horology Telemetry Pill */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
            <div className="bg-[#07090E]/80 border border-white/10 px-3.5 py-2 rounded-2xl text-center shadow-inner">
              <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-wider">
                Prontidão Watch
              </span>
              <span className="text-base font-mono font-black text-emerald-400">
                {telemetry.recoveryReadinessPct}%
              </span>
            </div>

            <div className="bg-[#07090E]/80 border border-white/10 px-3.5 py-2 rounded-2xl text-center shadow-inner">
              <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-wider">
                FC Repouso
              </span>
              <span className="text-base font-mono font-black text-cyan-400">
                {telemetry.restingHeartRate}{" "}
                <span className="text-[9px] font-normal text-gray-400">bpm</span>
              </span>
            </div>

            <div className="bg-[#07090E]/80 border border-white/10 px-3.5 py-2 rounded-2xl text-center shadow-inner">
              <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-wider">
                HRV rMSSD
              </span>
              <span className="text-base font-mono font-black text-purple-400">
                {telemetry.hrvRmssd}{" "}
                <span className="text-[9px] font-normal text-gray-400">ms</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section: Digital Twin + Daily Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Digital Twin Interactive Guide (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Digital Twin Biomecânico
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    {isDaniel
                      ? "Mapeamento Articular • Prótese Escapuloumeral"
                      : "Mapeamento Postural • Estabilidade Pélvica & Glúteos"}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                Biomecânica Ativa
              </span>
            </div>

            {/* Interactive Anatomical SVG Model */}
            <div className="relative py-4 flex flex-col items-center justify-center bg-[#07090E]/90 rounded-2xl border border-white/5 my-2 shadow-inner">
              <svg
                viewBox="0 0 200 320"
                className="w-44 h-64 drop-shadow-2xl cursor-pointer transition-transform"
              >
                {/* Subtle Grid Pattern in background */}
                <defs>
                  <pattern id="twinGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="200" height="320" fill="url(#twinGrid)" />

                {/* Head */}
                <circle
                  cx="100"
                  cy="35"
                  r="20"
                  fill="#1E293B"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  onClick={() => setSelectedBodyPart("HEAD")}
                  className="hover:fill-blue-900/40 transition-colors"
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
                  className="hover:fill-blue-900/40 transition-colors"
                />

                {/* Left Arm (Viewer's left = Right arm of athlete) */}
                {isDaniel ? (
                  // DANIEL: Reverse Shoulder Prosthesis with Titanium Indicator
                  <g onClick={() => setSelectedBodyPart("SHOULDER")} className="cursor-pointer">
                    <circle
                      cx="62"
                      cy="75"
                      r="11"
                      fill="#EF4444"
                      stroke="#FCA5A5"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                    <circle
                      cx="62"
                      cy="75"
                      r="17"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      className="animate-spin-slow"
                    />
                    <rect x="52" y="86" width="14" height="60" rx="6" fill="#334155" />
                  </g>
                ) : (
                  // PATRICIA: Completely Free & Healthy Arm
                  <g onClick={() => setSelectedBodyPart("ARMS")} className="cursor-pointer">
                    <circle
                      cx="62"
                      cy="75"
                      r="9"
                      fill="#1E293B"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                    />
                    <rect x="52" y="85" width="14" height="60" rx="6" fill="#334155" />
                  </g>
                )}

                {/* Right Arm (Viewer's right = Left arm) */}
                <circle
                  cx="138"
                  cy="75"
                  r="9"
                  fill="#1E293B"
                  stroke="#374151"
                  onClick={() => setSelectedBodyPart("ARMS")}
                  className="cursor-pointer"
                />
                <rect x="134" y="85" width="14" height="60" rx="6" fill="#334155" />

                {/* Pelvis & Core Zone */}
                {isDaniel ? (
                  <path
                    d="M80,170 L120,170 L115,200 L85,200 Z"
                    fill="#334155"
                    onClick={() => setSelectedBodyPart("PELVIS")}
                    className="cursor-pointer"
                  />
                ) : (
                  // PATRICIA: Active Pelvic Stability & Gluteus Focus
                  <g onClick={() => setSelectedBodyPart("PELVIS")} className="cursor-pointer">
                    <path
                      d="M78,168 L122,168 L116,202 L84,202 Z"
                      fill="#0369A1"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <circle
                      cx="100"
                      cy="185"
                      r="14"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin-slow"
                    />
                  </g>
                )}

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
                  className="hover:fill-blue-900/40 cursor-pointer"
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
                  className="hover:fill-blue-900/40 cursor-pointer"
                />

                {/* Knee alignment indicators for Patrícia */}
                {!isDaniel && (
                  <g>
                    <circle cx="89" cy="245" r="4" fill="#38BDF8" />
                    <circle cx="111" cy="245" r="4" fill="#38BDF8" />
                  </g>
                )}
              </svg>

              {/* Anatomy Pin Badge */}
              {isDaniel ? (
                <div
                  onClick={() => setSelectedBodyPart("SHOULDER")}
                  className="absolute top-5 left-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/90 border border-red-500/50 text-[10px] font-mono text-red-200 cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                  <span>Trava: Prótese Reversa (Ombro D)</span>
                </div>
              ) : (
                <div
                  onClick={() => setSelectedBodyPart("PELVIS")}
                  className="absolute top-5 left-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-950/90 border border-sky-500/50 text-[10px] font-mono text-sky-200 cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <Shield className="h-3 w-3 text-sky-400" />
                  <span>Foco: Estabilidade Pélvica & Glúteos</span>
                </div>
              )}

              {/* Quick Anatomy Detail Card */}
              <div className="w-full px-3 pt-2 text-left">
                {isDaniel && selectedBodyPart === "SHOULDER" && (
                  <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-200 space-y-1">
                    <p className="font-bold text-red-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                      Articulação Escapuloumeral Direita (Prótese Reversa)
                    </p>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Bloqueio estrito de desenvolvimentos overhead e supino reto com barra.
                      Prescrição segura: supino halteres pegada neutra 45°, elevação no plano
                      escapular (scaption 30°) e remadas com apoio esternal.
                    </p>
                  </div>
                )}

                {!isDaniel && selectedBodyPart === "PELVIS" && (
                  <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/40 text-xs text-sky-200 space-y-1">
                    <p className="font-bold text-sky-300 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-sky-400" />
                      Complexo Lombopélvico & Estabilidade de Joelho
                    </p>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Fortalecimento prioritário do glúteo médio e posteriores para neutralizar
                      o valgo dinâmico na corrida. Membros superiores e ombros 100% livres para
                      desenvolvimentos e remadas com carga progressiva.
                    </p>
                  </div>
                )}

                {selectedBodyPart === "LEGS" && (
                  <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/40 text-xs text-blue-200 space-y-1">
                    <p className="font-bold text-blue-300">
                      Gastrocnêmio, Sóleo &amp; Tendão de Aquiles
                    </p>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Cadência recomendada para rodagens:{" "}
                      {isDaniel ? "172 - 178 spm" : "175 - 182 spm"}. Amortecimento com médio-pé
                      e redução de oscilação vertical para máxima economia de corrida.
                    </p>
                  </div>
                )}

                {selectedBodyPart !== "SHOULDER" &&
                  selectedBodyPart !== "PELVIS" &&
                  selectedBodyPart !== "LEGS" && (
                    <div className="p-3.5 rounded-xl bg-[#1F2937]/50 border border-gray-700/60 text-xs text-gray-200">
                      <p className="font-semibold text-blue-400">Postura & Core Transverso</p>
                      <p className="text-[11px] text-gray-400">
                        Ativação isométrica profunda para manter o tronco ereto tanto na esteira
                        quanto no asfalto litorâneo e de São Paulo.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Body Composition Navy Summary */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
            <div className="bg-[#07090E] p-2.5 rounded-2xl border border-white/5 text-center shadow-inner">
              <span className="text-[10px] text-gray-400 block font-medium">Gordura (Navy)</span>
              <span className="text-base font-extrabold font-mono text-blue-400">
                {metrics.bodyFatPct}%
              </span>
              <span className="text-[9px] text-gray-500 block">
                {metrics.fatMassKg}kg gordura
              </span>
            </div>

            <div className="bg-[#07090E] p-2.5 rounded-2xl border border-white/5 text-center shadow-inner">
              <span className="text-[10px] text-gray-400 block font-medium">Massa Magra</span>
              <span className="text-base font-extrabold font-mono text-emerald-400">
                {metrics.leanMassKg}kg
              </span>
              <span className="text-[9px] text-gray-500 block">Metabolismo ativo</span>
            </div>

            <div className="bg-[#07090E] p-2.5 rounded-2xl border border-white/5 text-center shadow-inner">
              <span className="text-[10px] text-gray-400 block font-medium">Ganho no Pace</span>
              <span className="text-base font-extrabold font-mono text-amber-400">
                -{metrics.runningPaceGainSec}s/km
              </span>
              <span className="text-[9px] text-gray-500 block">
                ao bater {isDaniel ? "75kg" : "55kg"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mission of the Day & Live Hubs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Daily Mission Card (Tailored Haute Horlogerie Bezel) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#101726] via-[#141C30] to-[#0D121F] border border-blue-500/30 p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                  Missão do Dia • {specs.name.split(" ")[0]}
                </span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {isDaniel ? "Teto: 55 min (<= 60 min)" : "Teto: 45 min (<= 50 min)"}
                </span>
              </div>

              <button
                onClick={() => onNavigateToTab("COACH")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all"
              >
                <span>Planilha Completa</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-white tracking-tight">
              {isDaniel
                ? "Corrida Contínua Z2: Dual-Mode (Rua vs Esteira 9.5 km/h)"
                : "Corrida Contínua Z2: Dual-Mode (Rua vs Esteira 8.8 km/h)"}
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              {isDaniel
                ? "Desenvolvimento mitocondrial e lipólise sem estresse sobre a prótese do ombro."
                : "Base aeróbia com postura ereta e reforço rítmico para os 10K do Circuito das Estações."}
            </p>

            {/* Dual Mode Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Mode A: Street / Outdoor */}
              <div className="p-3.5 rounded-2xl bg-[#07090E]/80 border border-white/10 hover:border-blue-500/50 transition-all shadow-inner">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5" />
                    Opção 1: Asfalto (Rua)
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {isDaniel ? "8.5 km" : "6.0 km"}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pace Alvo:</span>
                    <span className="font-bold text-white">
                      {isDaniel ? "6:15 min/km" : "6:45 min/km"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zona FC:</span>
                    <span className="font-bold text-emerald-400">
                      {isDaniel ? "Z2 (110 a 127 bpm)" : "Z2 (131 a 148 bpm)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans mt-2 pt-2 border-t border-white/5">
                    {isDaniel
                      ? "1.5km aquec. + 6km ritmo + 1km solto. Zero impacto no braço direito."
                      : "1.0km aquec. + 4.5km ritmo + 0.5km solto. Cadência 178 spm."}
                  </p>
                </div>
              </div>

              {/* Mode B: Treadmill (Esteira) */}
              <div className="p-3.5 rounded-2xl bg-[#07090E]/80 border border-cyan-800/40 hover:border-cyan-500/60 transition-all shadow-inner">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    Opção 2: Esteira (km/h + %)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {isDaniel ? "55 min" : "45 min"}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Velocidade:</span>
                    <span className="font-bold text-white">
                      {isDaniel ? "9.5 km/h" : "8.8 km/h"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Inclinação:</span>
                    <span className="font-bold text-cyan-300">1.5% (resistência ar)</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans mt-2 pt-2 border-t border-white/5">
                    {isDaniel
                      ? "10m a 7.5 km/h + 35m a 9.5 km/h (Z2 estável) + 10m caminhada ativa."
                      : "10m a 7.0 km/h + 28m a 8.8 km/h + 7m solto. Postura alinhada."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Smart Home Tuya Control Strip */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Controle Residencial Tuya Smart Home
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Nuvem OpenAPI Ativa
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() =>
                  handleSceneClick(
                    isDaniel ? "FLAMENGO_MATCH" : "GREMIO_MATCH",
                    isDaniel ? "Match Day Mengão Rubro-Negro" : "Match Day Grêmio Imortal"
                  )
                }
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  isDaniel
                    ? "bg-red-950/20 border-red-500/40 hover:bg-red-900/30 text-red-300 shadow-md shadow-red-500/10"
                    : "bg-sky-950/20 border-sky-500/40 hover:bg-sky-900/30 text-sky-300 shadow-md shadow-sky-500/10"
                }`}
              >
                <span className="text-xs font-bold block">
                  {isDaniel ? "🔴 Modo Mengão" : "🔵 Modo Imortal"}
                </span>
                <span className="text-[10px] opacity-75">
                  {isDaniel ? "Luzes Maracanã" : "Luzes Arena Grêmio"}
                </span>
              </button>

              <button
                onClick={() => handleSceneClick("PRE_WORKOUT_FOCUS", "Foco Pré-Treino 18h30")}
                className="p-2.5 rounded-2xl bg-blue-950/20 border border-blue-500/40 hover:bg-blue-900/30 text-blue-300 text-left transition-all shadow-md shadow-blue-500/10"
              >
                <span className="text-xs font-bold block">⚡ Foco 18h30</span>
                <span className="text-[10px] opacity-75">6500K Fria (Dopamina)</span>
              </button>

              <button
                onClick={() =>
                  handleSceneClick("PARASYMPATHETIC_NIGHT", "Freio Térmico 20h30")
                }
                className="p-2.5 rounded-2xl bg-purple-950/20 border border-purple-500/40 hover:bg-purple-900/30 text-purple-300 text-left transition-all shadow-md shadow-purple-500/10"
              >
                <span className="text-xs font-bold block">🌙 Freio 20h30</span>
                <span className="text-[10px] opacity-75">2200K Âmbar (Melatonina)</span>
              </button>

              <button
                onClick={() =>
                  handleSceneClick("SUNRISE_LONG_RUN", "Simulação Amanhecer 06h30")
                }
                className="p-2.5 rounded-2xl bg-amber-950/20 border border-amber-500/40 hover:bg-amber-900/30 text-amber-300 text-left transition-all shadow-md shadow-amber-500/10"
              >
                <span className="text-xs font-bold block">🌅 Sol Longão</span>
                <span className="text-[10px] opacity-75">Despertar Suave</span>
              </button>
            </div>
          </div>

          {/* Real-time Weather-Pacing & Telegram Proactive Hub */}
          {weatherData && (
            <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Weather-Pacing em Tempo Real ({weatherData.city})
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTelegramBriefing}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/30 border border-blue-500/50 hover:bg-blue-600/50 text-[11px] font-bold text-blue-300 flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Send className="h-3 w-3" />
                    <span>{telegramStatus || "Alerta Telegram"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-2xl bg-[#07090E] border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-mono">Temperatura</span>
                  <span className="font-extrabold font-mono text-white text-sm">{weatherData.tempC}°C</span>
                  <span className="text-[9px] text-gray-500 block">Sensação {weatherData.feelsLikeC}°C</span>
                </div>

                <div className="p-2 rounded-2xl bg-[#07090E] border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-mono">Umidade</span>
                  <span className="font-extrabold font-mono text-cyan-400 text-sm">{weatherData.humidityPct}%</span>
                  <span className="text-[9px] text-gray-500 block">Vento {weatherData.windSpeedKmh}km/h</span>
                </div>

                <div className="p-2 rounded-2xl bg-[#07090E] border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-mono">Ajuste de Pace</span>
                  <span className={`font-extrabold font-mono text-sm ${weatherData.paceAdjustmentSec > 5 ? "text-amber-400" : "text-emerald-400"}`}>
                    +{weatherData.paceAdjustmentSec}s/km
                  </span>
                  <span className="text-[9px] text-gray-500 block">Custo térmico</span>
                </div>

                <div className="p-2 rounded-2xl bg-[#07090E] border border-white/5">
                  <span className="text-[10px] text-gray-400 block font-mono">Condição</span>
                  <span className="font-bold text-gray-200 text-xs truncate capitalize block">
                    {weatherData.condition}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-semibold block">
                    {weatherData.environmentalRisk === "OPTIMAL" ? "Ideal p/ Asfalto" : "Moderado"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-300 italic bg-[#07090E]/60 p-2.5 rounded-xl border border-white/5 font-sans">
                Diretriz de Pacing: {weatherData.tacticalRecommendation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2027 Season & Live Football Hub Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Individualized 2027 Marathon / 10K Season Widget */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Temporada 2027 • {specs.name.split(" ")[0]} ({races.filter(r => !r.isTbd).length} Alvos)
                </h3>
              </div>

              <button
                onClick={() => setShowTbdDrawer(!showTbdDrawer)}
                className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800/80 hover:bg-amber-900/80 transition-all"
              >
                {showTbdDrawer ? "Ocultar Rascunhos" : "+ Provas TBD"}
              </button>
            </div>

            {/* Confirmed Athlete Races */}
            <div className="space-y-3">
              {races
                .filter((race) => !race.isTbd)
                .map((race) => (
                  <div
                    key={race.id}
                    className="p-3.5 rounded-2xl bg-[#07090E] border border-amber-500/30 flex items-center justify-between shadow-inner"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {race.priority}
                        </span>
                        <span className="text-xs font-bold text-white">{race.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {race.date} • {race.location} • Pace Alvo: {race.targetPaceMinKm} min/km
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-white">
                        {race.targetFinishTime}
                      </span>
                      <span className="block text-[10px] font-mono text-emerald-400">
                        {race.daysRemaining} dias
                      </span>
                    </div>
                  </div>
                ))}

              {/* TBD Draft Race Drawer */}
              {showTbdDrawer && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  {races
                    .filter((race) => race.isTbd)
                    .map((race) => (
                      <div
                        key={race.id}
                        className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/60 shadow-inner"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 text-purple-400" />
                            {race.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200">
                            Janela: {(race as any).estimatedWindowMonth || "Segundo Semestre"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                          Prova de avaliação aeróbia litorânea. Aguardando publicação oficial do
                          calendário da Federação Paulista de Atletismo (FPA).
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-gray-400 flex items-center justify-between">
            <span>Tapering: 3 semanas regressivas</span>
            <span>Recovery Lock: 14 dias pós-prova</span>
          </div>
        </div>

        {/* Live Football Hub Widget (Flamengo vs Grêmio) */}
        {teamData && (
          <div
            className={`rounded-3xl border p-5 shadow-2xl flex flex-col justify-between ${
              isDaniel
                ? "bg-gradient-to-b from-[#180C0E] to-[#0A0D15] border-red-500/30"
                : "bg-gradient-to-b from-[#0A121F] to-[#0A0D15] border-sky-500/30"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm border ${
                      isDaniel
                        ? "bg-red-950/60 border-red-500/40 text-red-400"
                        : "bg-sky-950/60 border-sky-500/40 text-sky-400"
                    }`}
                  >
                    {isDaniel ? "🔴⚫" : "🔵⚪"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Football Hub: {teamData.teamName} (Ao Vivo)
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {isDaniel ? "Maracanã • Rio de Janeiro" : "Arena do Grêmio • Porto Alegre"}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    teamData.tensionIndex >= 4
                      ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse"
                      : "bg-gray-800 text-gray-300 border-gray-700"
                  }`}
                >
                  Tensão: {teamData.tensionIndex}/5
                </span>
              </div>

              {/* Standings Summary */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-[#07090E] p-2.5 rounded-2xl text-center border border-white/5 shadow-inner">
                  <span className="text-[9px] text-gray-400 block font-mono">Posição</span>
                  <span className="text-sm font-extrabold font-mono text-white">
                    {teamData.standingPosition}º Lugar
                  </span>
                </div>
                <div className="bg-[#07090E] p-2.5 rounded-2xl text-center border border-white/5 shadow-inner">
                  <span className="text-[9px] text-gray-400 block font-mono">Pontos</span>
                  <span className="text-sm font-extrabold font-mono text-blue-400">
                    {teamData.points}
                  </span>
                </div>
                <div className="bg-[#07090E] p-2.5 rounded-2xl text-center border border-white/5 shadow-inner">
                  <span className="text-[9px] text-gray-400 block font-mono">Jogos</span>
                  <span className="text-sm font-extrabold font-mono text-white">
                    {teamData.gamesPlayed}
                  </span>
                </div>
                <div className="bg-[#07090E] p-2.5 rounded-2xl text-center border border-white/5 shadow-inner">
                  <span className="text-[9px] text-gray-400 block font-mono">Saldo</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-400">
                    +{teamData.goalDifference}
                  </span>
                </div>
              </div>

              {/* Next Game & Logistical Adjustment */}
              {teamData.nextMatches && teamData.nextMatches[0] && (
                <div className="p-3.5 rounded-2xl bg-[#07090E] border border-white/10 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Próximo Jogo: vs {teamData.nextMatches[0].opponent}
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-semibold">
                      {teamData.nextMatches[0].date} ({teamData.nextMatches[0].timeBrasilia})
                    </span>
                  </div>

                  {teamData.logisticalAdjustments && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>
                          {teamData.logisticalAdjustments.requiresTrainingCut
                            ? `Corte logístico: Treino deve encerrar às ${teamData.logisticalAdjustments.recommendedEndTime}`
                            : "Horário de treino livre"}
                        </span>
                      </div>
                      <span className="font-mono font-bold">
                        +{teamData.logisticalAdjustments.caloricBufferKcal} kcal buffer
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
              <span className="font-mono text-[10px]">Grounding Gemini 2.5 Flash</span>
              <button
                onClick={() => onNavigateToTab("NUTRITION")}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-all text-xs"
              >
                Ver Petiscos da Partida →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
