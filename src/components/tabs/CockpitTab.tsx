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
  Medal,
  Trophy,
  Star,
  Dumbbell,
  Bike,
  Check,
  CalendarDays,
  Lock,
  ShieldAlert,
} from "lucide-react";
import {
  BodyMetrics,
  FootballTeamData,
  GalaxyWatchTelemetry,
  WeekendLayoutMode,
  ProfileId,
  TargetRaceItem,
} from "@/lib/types";
import { WeatherPacingData } from "@/lib/weather-service";
import {
  getProfileSpecs,
  evaluateRaceCalendar,
  buildWeeklyScheduleTemplate,
  getStrengthFicha,
} from "@/lib/physiology";
import { PatriciaMorningCheckin } from "@/components/PatriciaMorningCheckin";
import { TuyaManifestoModal } from "@/components/TuyaManifestoModal";
import { ActiveWorkoutModal } from "@/components/ActiveWorkoutModal";
import {
  Snowflake,
  Leaf,
  Volume2,
  VolumeX,
  Sliders,
  Smartphone,
  Crown,
  Share2,
  Sunrise,
  Car,
  Coffee,
  Moon,
  Navigation,
} from "lucide-react";
import { audioCoach } from "@/lib/audio-coach";
import {
  calculateRaceMorningSchedule,
  resolveVenueMetrics,
  resolveRaceDefaultStartTime,
  MARACA_HOME_ADDRESS,
} from "@/lib/race-logistics";

interface CockpitTabProps {
  currentProfile: ProfileId;
  metrics: BodyMetrics;
  telemetry: GalaxyWatchTelemetry;
  footballData: {
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
    palmeiras?: FootballTeamData | null;
  };
  onTriggerTuyaScene: (scene: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenRaceManager?: () => void;
  onOpenTacticalSimulator?: () => void;
  onOpenTrophyCardGenerator?: () => void;
  onOpenClanHallOfFame?: () => void;
  onOpenRaceMorning?: (raceId?: string) => void;
  onOpenDanielTrainingPlan?: () => void;
}

export function CockpitTab({
  currentProfile,
  metrics,
  telemetry,
  footballData,
  onTriggerTuyaScene,
  onNavigateToTab,
  onOpenRaceManager,
  onOpenTacticalSimulator,
  onOpenTrophyCardGenerator,
  onOpenClanHallOfFame,
  onOpenRaceMorning,
  onOpenDanielTrainingPlan,
}: CockpitTabProps) {
  const isDaniel = currentProfile === "DANIEL";
  const specs = getProfileSpecs(currentProfile);
  const races = evaluateRaceCalendar("2026-10-17", currentProfile);

  const [selectedBodyPart, setSelectedBodyPart] = useState<string>(
    isDaniel ? "SHOULDER" : "PELVIS"
  );
  const [showTbdDrawer, setShowTbdDrawer] = useState<boolean>(false);
  const [showTuyaManifesto, setShowTuyaManifesto] = useState<boolean>(false);
  const [tuyaNotification, setTuyaNotification] = useState<string | null>(null);

  const teamData =
    currentProfile === "GABRIEL"
      ? footballData.palmeiras
      : currentProfile === "PATRICIA"
      ? footballData.gremio
      : footballData.flamengo;

  const [weatherData, setWeatherData] = useState<WeatherPacingData | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);
  const [storedRaces, setStoredRaces] = useState<TargetRaceItem[]>([]);
  const [twinEasterEgg, setTwinEasterEgg] = useState<string | null>(null);
  const [selectedAlvoradaRaceId, setSelectedAlvoradaRaceId] = useState<string>("");

  // Dynamic scheduled upcoming races for currentProfile
  const profileUpcomingRaces = [
    ...races.filter((r) => !r.isTbd && r.date),
    ...storedRaces
      .filter((r) => r.athleteId === currentProfile && !r.isCompleted && !races.some((cr) => cr.id === r.id))
      .map((r) => ({
        id: r.id,
        name: r.name,
        priority: r.priority,
        distanceKm: r.distanceKm,
        date: r.raceDate,
        isTbd: false,
        location: r.location,
        targetPaceMinKm: r.targetPaceMinKm,
        targetFinishTime: r.targetFinishTime,
        taperingWeeks: r.taperingWeeksCount,
        carbLoadingDays: r.carbLoadingDaysBefore,
        raceStartTime: r.raceStartTime,
      })),
  ];

  const activeAlvoradaRace =
    profileUpcomingRaces.find((r) => r.id === selectedAlvoradaRaceId) ||
    profileUpcomingRaces[0] ||
    races[0];

  const alvoradaStartTime = (() => {
    if (typeof window !== "undefined" && activeAlvoradaRace) {
      const savedTime = localStorage.getItem(`RACE_START_TIME_${activeAlvoradaRace.id}`);
      if (savedTime) return savedTime;
    }
    return (
      activeAlvoradaRace?.raceStartTime ||
      resolveRaceDefaultStartTime(activeAlvoradaRace?.distanceKm || 21, activeAlvoradaRace?.name || "")
    );
  })();

  const venueResolved = resolveVenueMetrics(activeAlvoradaRace?.location || "");

  const alvoradaPlan = calculateRaceMorningSchedule({
    raceStartTime: alvoradaStartTime,
    selectedPresetId: venueResolved.matchedPresetId,
    customVenueName: activeAlvoradaRace?.location,
    venueArrivalBufferMinutes: 60,
    raceName: activeAlvoradaRace?.name || "Athenas Mizuno Run Longer",
    raceDate: activeAlvoradaRace?.date || undefined,
    athleteId: currentProfile === "PATRICIA" ? "PATRICIA" : currentProfile === "GABRIEL" ? "GABRIEL" : "DANIEL",
    hotBeveragePreference:
      currentProfile === "PATRICIA" ? "MATE" : currentProfile === "CLAN" ? "BOTH" : "CAFEZINHO",
  });

  // JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  // WeeklySchedule index: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  const getTodayScheduleIndex = () => {
    const day = new Date().getDay();
    if (day === 0) return 6; // Sunday
    return day - 1; // Mon=0 .. Sat=5
  };

  const todayIndex = getTodayScheduleIndex();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex);
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({});
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState<boolean>(false);
  const [activeFichaForModal, setActiveFichaForModal] = useState<"A" | "B" | "C">("A");

  // Audio Coach & Metronome State
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [metronomeBpm, setMetronomeBpm] = useState<number>(() => {
    if (currentProfile === "GABRIEL") return 185;
    if (currentProfile === "PATRICIA") return 180;
    return 178;
  });
  const [isSpeakingCoach, setIsSpeakingCoach] = useState<boolean>(false);
  const [weatherViewMode, setWeatherViewMode] = useState<"LIVE_NOW" | "TOMORROW">("TOMORROW");

  const handleSpeakTomorrowWeather = () => {
    if (!weatherData?.tomorrow) return;
    const t = weatherData.tomorrow;
    const text = `Previsão oficial para a prova de amanhã, domingo! Na largada às 06h30 teremos temperatura fresca de ${t.tempStartC} graus, sensação de ${t.feelsLikeC} graus e umidade de ${t.humidityPct} por cento. Vento suave de ${t.windSpeedKmh} quilômetros por hora. Condições térmicas ideais, com zero perda por calor. Vista regata leve, bermuda com bolso para gel e prepare o pódio!`;
    audioCoach.speakCoachBriefing(text);
  };

  const handleSpeakPreGameCutoffLock = () => {
    if (!teamData?.nextMatches?.[0]) return;
    const nm = teamData.nextMatches[0];
    const cutoff = teamData.logisticalAdjustments?.recommendedEndTime || "17:30";
    const team = teamData.teamName;
    const athleteName = isDaniel ? "Daniel" : currentProfile === "PATRICIA" ? "Patrícia" : "Gabriel";
    const text = `Atenção ${athleteName}! A trava inteligente de corte de treino vespertino está ativada para o próximo jogo do ${team} contra o ${nm.opponent}. A partida começa às ${nm.timeBrasilia}. Por disciplina tática e proteção metabólica, seu treino vespertino deve encerrar impreterivelmente às ${cutoff}, exatamente uma hora antes do pontapé inicial. Você terá 60 minutos para desaquecimento da frequência cardíaca, banho relaxante e foco total na torcida!`;
    audioCoach.speakCoachBriefing(text);
  };

  useEffect(() => {
    if (currentProfile === "GABRIEL") setMetronomeBpm(185);
    else if (currentProfile === "PATRICIA") setMetronomeBpm(180);
    else setMetronomeBpm(178);
    if (audioCoach.isPlaying()) {
      audioCoach.stopMetronome();
      setIsMetronomeActive(false);
    }
  }, [currentProfile]);

  const handleToggleMetronome = (targetBpm?: number) => {
    const bpmToUse = targetBpm || metronomeBpm;
    if (isMetronomeActive) {
      audioCoach.stopMetronome();
      setIsMetronomeActive(false);
    } else {
      audioCoach.startMetronome(bpmToUse);
      setIsMetronomeActive(true);
    }
  };

  const handleAdjustBpm = (delta: number) => {
    const nextBpm = Math.max(140, Math.min(210, metronomeBpm + delta));
    setMetronomeBpm(nextBpm);
    if (isMetronomeActive) {
      audioCoach.startMetronome(nextBpm);
    }
  };

  const handleSpeakDailyBriefing = () => {
    if (isSpeakingCoach) {
      audioCoach.stopSpeaking();
      setIsSpeakingCoach(false);
      return;
    }

    const athleteName = specs.name;
    const weatherInfo = weatherData
      ? `Temperatura em São Paulo está em ${weatherData.tempC} graus, com umidade de ${weatherData.humidityPct} por cento.`
      : "Clima ameno em São Paulo.";

    let speechText = "";
    if (todayIndex === 5) {
      // Sábado Véspera da Athenas Mizuno
      speechText = `Atenção ${athleteName}! Hoje é sábado, véspera da Athenas Mizuno Run Longer. ${weatherInfo} ${
        isDaniel
          ? "Daniel, 21 quilômetros amanhã na Marginal Pinheiros! Hoje protocolo estrito: hidratação isotônica constante, carbo loading de 58 por cento na panela, verificação do chip de cronometragem no cadarço e descanso. Cadência travada em 178 passos por minuto para amortecer impacto e proteger a prótese reversa."
          : currentProfile === "PATRICIA"
          ? "Patrícia, 14 quilômetros amanhã! Ativação isométrica do glúteo médio, joelhos alinhados e estabilidade rítmica a 180 passos por minuto. A prova é sua!"
          : "Gabriel, motor alviverde ligado a 185 passos por minuto! Pronto para explodir nos 10 quilômetros sub 45."
      } Vamos juntos rumo ao pódio do Clã Lopes!`;
    } else {
      speechText = `Atenção ${athleteName}! Treino de hoje calibrado com sucesso pelo Bio-Triad OS. Cadência recomendada de ${metronomeBpm} passos por minuto. Mantenha foco e hidratação!`;
    }

    setIsSpeakingCoach(true);
    audioCoach.speakCoachBriefing(speechText);
    setTimeout(() => setIsSpeakingCoach(false), 24000);
  };

  useEffect(() => {
    setSelectedDayIndex(getTodayScheduleIndex());
  }, [currentProfile]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_COMPLETED_WORKOUTS");
      if (stored) {
        setCompletedWorkouts(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleToggleCompleteWorkout = (key: string) => {
    const next = { ...completedWorkouts, [key]: !completedWorkouts[key] };
    setCompletedWorkouts(next);
    try {
      localStorage.setItem("BIO_TRIAD_COMPLETED_WORKOUTS", JSON.stringify(next));
    } catch (e) {}
  };

  useEffect(() => {
    setSelectedBodyPart(isDaniel ? "SHOULDER" : "PELVIS");
  }, [isDaniel]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_RACES_V3");
      if (stored) {
        setStoredRaces(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleBodyPartClick = (part: string) => {
    setSelectedBodyPart(part);
    if (part === "SHOULDER" && isDaniel) {
      setTwinEasterEgg("🛡️ MODO CIBORGUE: Prótese reversa em titânio cirúrgico 100% blindada! Zero overhead, proteção articular ativa e Z5 pronto para amanhã!");
      setTimeout(() => setTwinEasterEgg(null), 7000);
    } else if (part === "PELVIS" && !isDaniel) {
      setTwinEasterEgg("👑 RAINHA DO PÓDIO: Estabilidade do glúteo médio de aço, zero valgo dinâmico e garra tricolor!");
      setTimeout(() => setTwinEasterEgg(null), 7000);
    } else if (currentProfile === "GABRIEL" && (part === "TORSO" || part === "ARMS" || part === "LEGS")) {
      setTwinEasterEgg("⚡ MOTOR ALVIVERDE 2006: 20 anos, fibra tipo IIx veloz e arrancada rumo ao sub-45!");
      setTimeout(() => setTwinEasterEgg(null), 7000);
    }
  };

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

      {/* Patricia Morning Check-in Card (Subjective Readiness without Galaxy Watch) */}
      {!isDaniel && <PatriciaMorningCheckin />}

      {/* Haute Horlogerie Tactical Command Center & Precision Audio Metronome */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C1220] via-[#0F172A] to-[#0A0E18] border border-cyan-500/30 p-4 sm:p-5 shadow-[0_8px_32px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 relative z-10">
          {/* Metronome Control Dial */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleMetronome()}
                className={`h-12 w-12 rounded-2xl flex items-center justify-center font-mono font-black transition-all shadow-lg ${
                  isMetronomeActive
                    ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-black border-2 border-cyan-300 shadow-cyan-500/40 animate-pulse"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                title={isMetronomeActive ? "Parar Metrônomo Sonoro" : "Iniciar Metrônomo Sonoro de Cadência"}
              >
                {isMetronomeActive ? (
                  <Volume2 className="h-6 w-6 text-black" />
                ) : (
                  <VolumeX className="h-6 w-6 text-gray-400" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
                    METRÔNOMO DE CADÊNCIA
                  </span>
                  {isMetronomeActive && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black font-mono text-white tracking-tight">
                    {metronomeBpm}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-400">SPM</span>
                  <span className="text-[10px] text-gray-400 ml-2 hidden sm:inline">
                    ({isDaniel ? "Daniel 178" : currentProfile === "PATRICIA" ? "Patrícia 180" : "Gabriel 185"})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick SPM Presets & Fine Tuning */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => handleAdjustBpm(-2)}
                className="px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                title="Diminuir cadência em 2 SPM"
              >
                -2
              </button>
              <button
                onClick={() => handleAdjustBpm(2)}
                className="px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                title="Aumentar cadência em 2 SPM"
              >
                +2
              </button>
              <button
                onClick={() => {
                  setMetronomeBpm(178);
                  if (isMetronomeActive) audioCoach.startMetronome(178);
                }}
                className={`px-2 py-1 rounded-lg border text-[11px] ${
                  metronomeBpm === 178
                    ? "bg-red-500/20 border-red-500 text-red-300 font-bold"
                    : "bg-black/30 border-white/10 text-gray-400"
                }`}
              >
                178 FLA
              </button>
              <button
                onClick={() => {
                  setMetronomeBpm(180);
                  if (isMetronomeActive) audioCoach.startMetronome(180);
                }}
                className={`px-2 py-1 rounded-lg border text-[11px] ${
                  metronomeBpm === 180
                    ? "bg-sky-500/20 border-sky-500 text-sky-300 font-bold"
                    : "bg-black/30 border-white/10 text-gray-400"
                }`}
              >
                180 GRE
              </button>
              <button
                onClick={() => {
                  setMetronomeBpm(185);
                  if (isMetronomeActive) audioCoach.startMetronome(185);
                }}
                className={`px-2 py-1 rounded-lg border text-[11px] ${
                  metronomeBpm === 185
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                    : "bg-black/30 border-white/10 text-gray-400"
                }`}
              >
                185 PAL
              </button>
            </div>

            {/* Coach Voice Synthesis Button */}
            <button
              onClick={handleSpeakDailyBriefing}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                isSpeakingCoach
                  ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse"
                  : "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>{isSpeakingCoach ? "Parar Áudio Treinador" : "🎙️ Ouvir Briefing de Hoje"}</span>
            </button>
          </div>

          {/* Direct Flagship Feature Launchers */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => onOpenRaceMorning?.(activeAlvoradaRace?.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-orange-600/30 border border-amber-500/50 text-amber-300 hover:text-white hover:bg-amber-600/40 text-xs font-mono font-bold transition-all shadow-md shadow-amber-500/10"
              title="Alvorada de Prova (Rua Maracá, 132 • Deslocamento de Carro • Regra -1h • Tuya Dual Plug)"
            >
              <Sunrise className="h-3.5 w-3.5 text-amber-400" />
              <span>Alvorada de Prova</span>
            </button>

            <button
              onClick={onOpenTacticalSimulator}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-900/40 text-xs font-mono font-bold transition-all shadow-md"
              title="Abrir Simulador Tático Km a Km de Prova (Splits, Carbogéis & Hidratação)"
            >
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>Simulador Tático</span>
            </button>

            <button
              onClick={onOpenTrophyCardGenerator}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-900/40 text-xs font-mono font-bold transition-all shadow-md"
              title="Gerar Card HD de Conquista para Instagram Story e WhatsApp"
            >
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              <span>Card & Story</span>
            </button>

            <button
              onClick={onOpenClanHallOfFame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-900/40 text-xs font-mono font-bold transition-all shadow-md"
              title="Hall de Recordes, 1.652 km Coletivos e Vitrine de Troféus do Clã Lopes"
            >
              <Crown className="h-3.5 w-3.5 text-purple-400" />
              <span>Hall do Clã</span>
            </button>
          </div>
        </div>
      </div>

      {/* Race Day Morning Logistics & Alvorada Quick Dispatch Banner (Dynamic for ALL Races) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#14120B] via-[#10141D] to-[#0D121B] border border-amber-500/30 p-4 sm:p-5 shadow-[0_8px_32px_rgba(245,158,11,0.12)] relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          {/* Header & Main Badges */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/30 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                <Sunrise className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black font-mono text-white tracking-wide uppercase">
                    Alvorada & Logística Inteligente Pré-Prova
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    REGRA -1h CHEGADA
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                    Origem: Rua Maracá, 132
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                    Largada T-Gun: {alvoradaStartTime}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-sans mt-1">
                  <strong>{activeAlvoradaRace?.name}</strong> • Chegada antecipada às <strong>{alvoradaPlan.venueArrivalTarget}</strong> • 
                  Saída de carro às <strong>{alvoradaPlan.departureFromHomeTime}</strong> ({alvoradaPlan.distanceKm} km • {alvoradaPlan.totalTransitMinutes} min) • 
                  {currentProfile === "PATRICIA" ? "Tomada Dupla switch_2 (Mate)" : "Tomada Dupla switch_1 (Café)"} às <strong>{alvoradaPlan.hotDrinksBrewTime}</strong>.
                </p>
              </div>
            </div>

            {/* Quick Actions (Test Tuya, Waze, Full Dispatch) */}
            <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  onTriggerTuyaScene("RACE_MORNING_ALVORADA");
                  setTuyaNotification(
                    `🌅 Alvorada disparada para ${activeAlvoradaRace?.name}! Quarto 2700K + Tomada Dupla (${
                      currentProfile === "PATRICIA" ? "switch_2 Mate" : "switch_1 Café"
                    }) + Closet 4000K ligados!`
                  );
                  setTimeout(() => setTuyaNotification(null), 7000);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-mono font-bold transition-all shadow"
                title="Disparar Alvorada Tuya no Quarto, Tomada Dupla e Closet"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>⚡ Testar Tuya</span>
              </button>

              <a
                href={alvoradaPlan.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 text-xs font-mono font-bold transition-all shadow"
              >
                <Car className="h-3.5 w-3.5 text-cyan-400" />
                <span>Waze ({alvoradaPlan.distanceKm} km)</span>
              </a>

              <button
                onClick={() => onOpenRaceMorning?.(activeAlvoradaRace?.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-mono font-black transition-all shadow-md shadow-amber-500/20"
              >
                <Clock className="h-3.5 w-3.5 text-black" />
                <span>Abrir Cronograma Completo</span>
              </button>
            </div>
          </div>

          {/* Quick Race Switcher Chips (Dynamic for all scheduled races) */}
          {profileUpcomingRaces.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin border-t border-white/5">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold shrink-0 mr-1 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-amber-400" />
                Trocar Prova Alvo:
              </span>
              {profileUpcomingRaces.map((r) => {
                const isSelected = activeAlvoradaRace?.id === r.id;
                const rStartTime = (() => {
                  if (typeof window !== "undefined") {
                    const st = localStorage.getItem(`RACE_START_TIME_${r.id}`);
                    if (st) return st;
                  }
                  return (r as any).raceStartTime || resolveRaceDefaultStartTime(r.distanceKm, r.name);
                })();
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedAlvoradaRaceId(r.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow"
                        : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{r.name.split("•")[0].trim()}</span>
                    <span className="text-[10px] text-amber-400/90 font-bold">({rStartTime})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 6 Key Reverse Milestones Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
            {/* Largada */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/40">
              <span className="text-[9px] text-amber-400 block uppercase font-bold">🏁 Largada T-Gun</span>
              <span className="text-base font-black text-white">{alvoradaStartTime}</span>
              <span className="text-[9px] text-gray-400 block truncate">{activeAlvoradaRace?.location.split("-")[1] || activeAlvoradaRace?.location}</span>
            </div>

            {/* Chegada na Arena */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[9px] text-gray-400 block uppercase font-bold">📍 Arena (-1h)</span>
              <span className="text-base font-black text-amber-300">{alvoradaPlan.venueArrivalTarget}</span>
              <span className="text-[9px] text-gray-500 block">Curral & chip</span>
            </div>

            {/* Saída de Casa */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[9px] text-gray-400 block uppercase font-bold">🚗 Saída Maracá 132</span>
              <span className="text-base font-black text-cyan-300">{alvoradaPlan.departureFromHomeTime}</span>
              <span className="text-[9px] text-gray-400 block">{alvoradaPlan.totalTransitMinutes} min ({alvoradaPlan.distanceKm} km)</span>
            </div>

            {/* Bebidas Tuya Dupla */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[9px] text-gray-400 block uppercase font-bold">
                {currentProfile === "PATRICIA" ? "🧉 Tomada Dupla Chá" : "☕ Tomada Dupla Café"}
              </span>
              <span className="text-base font-black text-emerald-300">{alvoradaPlan.hotDrinksBrewTime}</span>
              <span className="text-[9px] text-gray-400 block">
                {currentProfile === "PATRICIA" ? "switch_2 (Mate 10m)" : "switch_1 (Café 15m)"}
              </span>
            </div>

            {/* Alvorada Quarto */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[9px] text-gray-400 block uppercase font-bold">🌅 Alvorada Quarto</span>
              <span className="text-base font-black text-amber-200">{alvoradaPlan.circadianSunriseTime}</span>
              <span className="text-[9px] text-gray-400 block">Luz 2700K âmbar</span>
            </div>

            {/* Sono Véspera */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-purple-500/30">
              <span className="text-[9px] text-purple-400 block uppercase font-bold flex items-center gap-1">
                <Moon className="h-2.5 w-2.5" />
                <span>🌙 Sono Véspera</span>
              </span>
              <span className="text-base font-black text-purple-300">{alvoradaPlan.recommendedBedtime}</span>
              <span className="text-[9px] text-purple-400/80 block">8h de sono N3</span>
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

            {/* Biomechanical Twin Easter Egg Alert Banner */}
            {twinEasterEgg && (
              <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-black font-mono text-xs font-bold shadow-xl animate-fadeIn flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>{twinEasterEgg}</span>
                </div>
                <button
                  onClick={() => setTwinEasterEgg(null)}
                  className="p-1 rounded-lg hover:bg-black/20 text-xs font-black ml-2"
                >
                  ✕
                </button>
              </div>
            )}

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
                  onClick={() => handleBodyPartClick("HEAD")}
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
                  onClick={() => handleBodyPartClick("TORSO")}
                  className="hover:fill-blue-900/40 transition-colors"
                />

                {/* Left Arm (Viewer's left = Right arm of athlete) */}
                {isDaniel ? (
                  // DANIEL: Reverse Shoulder Prosthesis with Titanium Indicator
                  <g onClick={() => handleBodyPartClick("SHOULDER")} className="cursor-pointer">
                    <title>Prótese Reversa de Titânio • Clique para inspecionar!</title>
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
                  <g onClick={() => handleBodyPartClick("ARMS")} className="cursor-pointer">
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
                  onClick={() => handleBodyPartClick("ARMS")}
                  className="cursor-pointer"
                />
                <rect x="134" y="85" width="14" height="60" rx="6" fill="#334155" />

                {/* Pelvis & Core Zone */}
                {isDaniel ? (
                  <path
                    d="M80,170 L120,170 L115,200 L85,200 Z"
                    fill="#334155"
                    onClick={() => handleBodyPartClick("PELVIS")}
                    className="cursor-pointer"
                  />
                ) : (
                  // PATRICIA: Active Pelvic Stability & Gluteus Focus
                  <g onClick={() => handleBodyPartClick("PELVIS")} className="cursor-pointer">
                    <title>Estabilidade Pélvica & Glúteo Médio • Clique para inspecionar!</title>
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
          {/* Daily Mission Card (Dynamic Treino do Dia) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#101726] via-[#141C30] to-[#0D121F] border border-blue-500/40 p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header: Today's Status & Action Ribbons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                      selectedDayIndex === todayIndex
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400 shadow-md shadow-red-600/30 animate-pulse"
                        : "bg-blue-950/80 text-blue-300 border-blue-800"
                    }`}
                  >
                    {selectedDayIndex === todayIndex ? "🔥 TREINO DE HOJE" : "📅 TREINO PLANEJADO"} • {(() => {
                      const sched = buildWeeklyScheduleTemplate({
                        weekendMode: "CLASSIC_SUNDAY_LONG",
                        hasShoulderRestriction: isDaniel,
                        profile: currentProfile,
                      });
                      return (sched[selectedDayIndex] || sched[todayIndex] || sched[5]).dayNamePt.toUpperCase();
                    })()}
                  </span>

                  <span className="text-xs text-amber-300 font-bold flex items-center gap-1 font-mono px-2 py-0.5 rounded-lg bg-black/40 border border-white/10">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {(() => {
                      const sched = buildWeeklyScheduleTemplate({
                        weekendMode: "CLASSIC_SUNDAY_LONG",
                        hasShoulderRestriction: isDaniel,
                        profile: currentProfile,
                      });
                      const w = sched[selectedDayIndex] || sched[todayIndex] || sched[5];
                      return w.durationMin > 0 ? `Teto: ${w.durationMin} min` : "Dia OFF";
                    })()}
                  </span>

                  {(() => {
                    const sched = buildWeeklyScheduleTemplate({
                      weekendMode: "CLASSIC_SUNDAY_LONG",
                      hasShoulderRestriction: isDaniel,
                      profile: currentProfile,
                    });
                    const w = sched[selectedDayIndex] || sched[todayIndex] || sched[5];
                    const wKey = `${currentProfile}_${w.dayOfWeek}_2026-10-17`;
                    return completedWorkouts[wKey] ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-400" />
                        CONCLUÍDO HOJE
                      </span>
                    ) : null;
                  })()}
                </div>

                <h3 className="text-lg font-black text-white tracking-tight mt-2 flex items-center gap-2">
                  <span>
                    {(() => {
                      const sched = buildWeeklyScheduleTemplate({
                        weekendMode: "CLASSIC_SUNDAY_LONG",
                        hasShoulderRestriction: isDaniel,
                        profile: currentProfile,
                      });
                      return (sched[selectedDayIndex] || sched[todayIndex] || sched[5]).title;
                    })()}
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {(() => {
                  const sched = buildWeeklyScheduleTemplate({
                    weekendMode: "CLASSIC_SUNDAY_LONG",
                    hasShoulderRestriction: isDaniel,
                    profile: currentProfile,
                  });
                  const w = sched[selectedDayIndex] || sched[todayIndex] || sched[5];
                  const wKey = `${currentProfile}_${w.dayOfWeek}_2026-10-17`;
                  const isDone = !!completedWorkouts[wKey];

                  return (
                    <button
                      onClick={() => handleToggleCompleteWorkout(wKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow ${
                        isDone
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border border-white/15"
                      }`}
                      title={isDone ? "Marcar como pendente" : "Marcar como concluído"}
                    >
                      <CheckCircle2 className={`h-3.5 w-3.5 ${isDone ? "text-white" : "text-emerald-400"}`} />
                      <span>{isDone ? "Concluído ✅" : "Marcar Concluído"}</span>
                    </button>
                  );
                })()}

                <button
                  onClick={() => onNavigateToTab("COACH")}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-600/20 border border-blue-500/30 flex items-center gap-1 transition-all"
                  title="Abrir a planilha completa do Treinador"
                >
                  <span className="hidden sm:inline">Planilha</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Daniel 23-Week Future Plan Link */}
            {isDaniel && (
              <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#160B0F] to-black/60 border border-red-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Planilha Oficial Futura de Treinos</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">23 Semanas</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Fase 1 (Olga Kos 9K) • Fase 2 (Meia de SP Sub-2h) • Versões Rua & Esteira
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenDanielTrainingPlan}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <span>Ver Planilha Completa</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* 7-Day Quick Day Switcher Bar (Always keeping TODAY prominent) */}
            <div className="mb-4 bg-black/50 p-1.5 rounded-2xl border border-white/10 flex items-center justify-between gap-1 overflow-x-auto text-xs font-mono">
              {[
                { label: "Seg", dayPt: "Segunda", idx: 0 },
                { label: "Ter", dayPt: "Terça", idx: 1 },
                { label: "Qua", dayPt: "Quarta", idx: 2 },
                { label: "Qui", dayPt: "Quinta", idx: 3 },
                { label: "Sex", dayPt: "Sexta", idx: 4 },
                { label: "Sáb", dayPt: "Sábado", idx: 5 },
                { label: "Dom", dayPt: "Domingo", idx: 6 },
              ].map((d) => {
                const isThisDayToday = d.idx === todayIndex;
                const isSelected = d.idx === selectedDayIndex;
                const sched = buildWeeklyScheduleTemplate({
                  weekendMode: "CLASSIC_SUNDAY_LONG",
                  hasShoulderRestriction: isDaniel,
                  profile: currentProfile,
                });
                const dWorkout = sched[d.idx];
                const dKey = `${currentProfile}_${dWorkout.dayOfWeek}_2026-10-17`;
                const isDone = !!completedWorkouts[dKey];

                return (
                  <button
                    key={d.idx}
                    onClick={() => setSelectedDayIndex(d.idx)}
                    className={`flex-1 py-1 px-1.5 rounded-xl text-center transition-all min-w-[42px] relative ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-white/20"
                        : isThisDayToday
                        ? "bg-red-950/60 text-red-300 border border-red-700/60 font-bold"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-[11px]">{d.label}</span>
                    {isThisDayToday && (
                      <span className="text-[8px] font-black uppercase text-amber-300 block -mt-0.5">
                        HOJE
                      </span>
                    )}
                    {isDone && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Special Race Eve Context Alert (Saturday 17/10 -> Tomorrow Sunday 18/10) */}
            {selectedDayIndex === 5 && (
              <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1F170E] to-black/40 border border-amber-500/50 flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>⚡ Protocolo de Véspera: Athenas Mizuno Run Longer (Amanhã!)</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    {isDaniel
                      ? "Daniel corre os 21.097 km amanhã! Hoje: ativação muito leve de 15 min Z1 (ou descanso passivo), hidratação com eletrólitos a cada hora, carbo-loading (58% panela TACO) e revisão do chip no cadarço. Meta: Sub-1h55!"
                      : currentProfile === "PATRICIA"
                      ? "Patrícia corre os 14.0 km amanhã! Hoje: rodagem solta de 15 min Z1 + ativação isométrica do glúteo médio com miniband + 42% carbo na panela. Meta: 5:55/km estável e sem valgo dinâmico!"
                      : "Gabriel foca em velocidade nos 10k sub-45 min. Hoje: descanso ativo ou rodagem leve."}
                  </p>
                </div>
              </div>
            )}

            {/* Special Race Day Context Alert (Sunday 18/10) */}
            {selectedDayIndex === 6 && (
              <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/50 via-[#261014] to-black/40 border border-red-500/50 flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5 animate-pulse">
                  <Flame className="h-4 w-4" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-red-300 flex items-center gap-1.5">
                    <span>🏆 DIA DA PROVA OFICIAL: ATHENAS MIZUNO RUN LONGER</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Marginal Pinheiros • Largada {isDaniel ? "05:30 (21k)" : currentProfile === "PATRICIA" ? "06:30 (14k)" : "06:30"}. {isDaniel ? "Daniel 21k (Pace 5:26)" : currentProfile === "PATRICIA" ? "Patrícia 14k (Pace 5:55)" : "Gabriel 10k"}.
                    Ao terminar, use o botão de Lançar Resultados para registrar o Chip Time oficial!
                  </p>
                </div>
              </div>
            )}

            {/* Trava Inteligente de Corte Vespertino Pré-Jogo (Sincronizada a 1h do Jogo) */}
            {teamData?.nextMatches && teamData.nextMatches[0] && (
              <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#18130B] to-black/60 border border-amber-500/40 text-xs font-mono space-y-2 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <span>🔒 TRAVA INTELIGENTE DE CORTE VESPERTINO</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-normal">
                          1h Antes do Jogo
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans">
                        Sincronização: {teamData.teamName} vs {teamData.nextMatches[0].opponent} às {teamData.nextMatches[0].timeBrasilia} ({teamData.nextMatches[0].date})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={handleSpeakPreGameCutoffLock}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                      title="Ouvir instrução da trava pré-jogo narrada pelo Treinador"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>🎙️ Ouvir Trava</span>
                    </button>

                    <span className="px-2.5 py-1 rounded-xl bg-red-600/30 border border-red-500 text-red-300 font-black text-xs">
                      Trava: {teamData.logisticalAdjustments?.recommendedEndTime || "17:30"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-white/5 text-[11px]">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400 text-[10px]">Pontapé Inicial</span>
                    <span className="font-bold text-white">{teamData.nextMatches[0].timeBrasilia} (Brasília)</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-amber-500/30 flex items-center justify-between">
                    <span className="text-amber-400 text-[10px]">Trava de Término</span>
                    <span className="font-bold text-amber-300">
                      {teamData.logisticalAdjustments?.recommendedEndTime || "17:30"}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-gray-400 text-[10px]">Transição Segura</span>
                    <span className="font-bold text-emerald-400">60 min Protegidos</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-300 leading-relaxed font-sans">
                  💡 {teamData.logisticalAdjustments?.lockReason || `O treino vespertino deve terminar impreterivelmente às ${teamData.logisticalAdjustments?.recommendedEndTime || "17:30"} para permitir 60 minutos de estabilização da frequência cardíaca, banho relaxante e início da torcida.`}
                </p>
              </div>
            )}

            {/* Dual Mode Running Prescription (If activeDay has running) */}
            {(() => {
              const sched = buildWeeklyScheduleTemplate({
                weekendMode: "CLASSIC_SUNDAY_LONG",
                hasShoulderRestriction: isDaniel,
                profile: currentProfile,
              });
              const activeDay = sched[selectedDayIndex] || sched[todayIndex] || sched[5];

              if (!activeDay.runPrescriptionOutdoor) return null;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Outdoor Street Option */}
                  <div className="p-3.5 rounded-2xl bg-[#07090E]/80 border border-white/10 hover:border-blue-500/50 transition-all shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Compass className="h-3.5 w-3.5" />
                        Opção 1: Asfalto (Rua)
                      </span>
                      <span className="text-[11px] font-mono font-black text-white">
                        {activeDay.runPrescriptionOutdoor.totalDistanceKm} km
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span className="text-gray-400">Pace Alvo:</span>
                        <span className="font-bold text-white">
                          {activeDay.runPrescriptionOutdoor.targetPaceMinKm} min/km
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span className="text-gray-400">Zonas FC:</span>
                        <span className="font-bold text-emerald-400">
                          {activeDay.runPrescriptionOutdoor.targetZones.join(", ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 font-sans mt-2 pt-1.5 border-t border-white/5 leading-relaxed">
                        {activeDay.runPrescriptionOutdoor.mainSetDescription}
                      </p>
                    </div>
                  </div>

                  {/* Treadmill Option */}
                  <div className="p-3.5 rounded-2xl bg-[#07090E]/80 border border-cyan-800/40 hover:border-cyan-500/60 transition-all shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" />
                        Opção 2: Esteira Calibrada
                      </span>
                      <span className="text-[11px] font-mono text-cyan-300 font-bold">
                        {activeDay.runPrescriptionTreadmill?.totalDurationMin || activeDay.durationMin} min
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span className="text-gray-400">Velocidade Média:</span>
                        <span className="font-bold text-white">
                          {activeDay.runPrescriptionTreadmill?.averageSpeedKmh || (isDaniel ? 9.5 : currentProfile === "PATRICIA" ? 8.8 : 11.5)} km/h
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span className="text-gray-400">Inclinação Obrigatória:</span>
                        <span className="font-bold text-cyan-300">1.0% (compensação ar)</span>
                      </div>
                      <p className="text-[11px] text-gray-300 font-sans mt-2 pt-1.5 border-t border-white/5 leading-relaxed">
                        {activeDay.runPrescriptionTreadmill?.steps
                          ? activeDay.runPrescriptionTreadmill.steps.map((s) => `${s.durationMin}m @ ${s.speedKmh}km/h`).join(" → ")
                          : "Aquecimento gradual + rodagem contínua aeróbia + 5m solto."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rest Day Display */}
            {(() => {
              const sched = buildWeeklyScheduleTemplate({
                weekendMode: "CLASSIC_SUNDAY_LONG",
                hasShoulderRestriction: isDaniel,
                profile: currentProfile,
              });
              const activeDay = sched[selectedDayIndex] || sched[todayIndex] || sched[5];

              if (activeDay.modality !== "REST") return null;

              return (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-2 font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Heart className="h-4 w-4" />
                    <span>Protocolo de Recuperação Passiva & Reset Neuro-Metabólico</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    {activeDay.description || "Descanso total para absorção neuromuscular e reposição mitocondrial. Hidratação reforçada e sono reparador."}
                  </p>
                </div>
              );
            })()}

            {/* Strength Workout Option (If activeDay has strength) */}
            {(() => {
              const sched = buildWeeklyScheduleTemplate({
                weekendMode: "CLASSIC_SUNDAY_LONG",
                hasShoulderRestriction: isDaniel,
                profile: currentProfile,
              });
              const activeDay = sched[selectedDayIndex] || sched[todayIndex] || sched[5];

              if (!activeDay.strengthPrescription) return null;

              return (
                <div className="mt-3 p-3.5 rounded-2xl bg-[#080D18] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                  <div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        Musculação Funcional Ficha {activeDay.strengthPrescription.ficha}: {activeDay.strengthPrescription.focus}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                      {activeDay.strengthPrescription.exercises.length} exercícios programados • {isDaniel ? "Blindagem do ombro direito ativa" : "Reforço glúteo e postural"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveFichaForModal(activeDay.strengthPrescription?.ficha || "A");
                      setIsActiveWorkoutOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    <span>Iniciar Treino Guiado</span>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Quick Smart Home Tuya Control Strip */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Controle Residencial Tuya Smart Home
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTuyaManifesto(true)}
                  className="px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-900/50 text-[10px] font-mono font-bold transition-all flex items-center gap-1 shadow-md shadow-purple-500/10"
                >
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  Manifesto & Automações
                </button>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Nuvem OpenAPI Ativa
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
              <button
                onClick={() =>
                  handleSceneClick(
                    currentProfile === "GABRIEL"
                      ? "PALMEIRAS_MATCH"
                      : isDaniel
                      ? "FLAMENGO_MATCH"
                      : "GREMIO_MATCH",
                    currentProfile === "GABRIEL"
                      ? "Match Day Palmeiras"
                      : isDaniel
                      ? "Match Day Mengão"
                      : "Match Day Grêmio"
                  )
                }
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  currentProfile === "GABRIEL"
                    ? "bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-900/30 text-emerald-300"
                    : isDaniel
                    ? "bg-red-950/20 border-red-500/40 hover:bg-red-900/30 text-red-300"
                    : "bg-sky-950/20 border-sky-500/40 hover:bg-sky-900/30 text-sky-300"
                }`}
              >
                <span className="text-xs font-bold block">
                  {currentProfile === "GABRIEL"
                    ? "🟢 Modo Verdão"
                    : isDaniel
                    ? "🔴 Modo Mengão"
                    : "🔵 Modo Imortal"}
                </span>
                <span className="text-[10px] opacity-75">
                  {currentProfile === "GABRIEL"
                    ? "Luzes Allianz"
                    : isDaniel
                    ? "Luzes Maracanã"
                    : "Luzes Arena"}
                </span>
              </button>

              <button
                onClick={() => handleSceneClick("CINEMA_MODE", "Modo Cinema & TV (Netflix / Doramas)")}
                className="p-2.5 rounded-2xl bg-rose-950/20 border border-rose-500/40 hover:bg-rose-900/30 text-rose-300 text-left transition-all shadow-md shadow-rose-500/10"
              >
                <span className="text-xs font-bold block">🎬 Modo Cinema</span>
                <span className="text-[10px] opacity-75">TV & 15% Âmbar</span>
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
                  handleSceneClick("PRE_COOLING_TREADMILL", "Pré-Resfriamento Esteira 19°C")
                }
                className="p-2.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 hover:bg-cyan-900/30 text-cyan-300 text-left transition-all shadow-md shadow-cyan-500/10"
              >
                <span className="text-xs font-bold block flex items-center gap-1">
                  <Snowflake className="h-3 w-3" /> AC 19°C
                </span>
                <span className="text-[10px] opacity-75">Costill Esteira</span>
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

              <button
                onClick={() =>
                  handleSceneClick("ECO_ALL_OFF", "Modo Fui Correr (Eco-Green All Off)")
                }
                className="p-2.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 hover:bg-emerald-900/30 text-emerald-300 text-left transition-all shadow-md shadow-emerald-500/10"
              >
                <span className="text-xs font-bold block flex items-center gap-1">
                  <Leaf className="h-3 w-3" /> Eco Off
                </span>
                <span className="text-[10px] opacity-75">Fui Correr</span>
              </button>
            </div>
          </div>

          {/* Interactive Tuya Manifesto Modal */}
          <TuyaManifestoModal
            isOpen={showTuyaManifesto}
            onClose={() => setShowTuyaManifesto(false)}
            onTriggerScene={handleSceneClick}
            currentProfile={currentProfile}
          />

          {/* Dual Weather Station: Real-time Weather-Pacing & Tomorrow's Race Eve Forecast */}
          {weatherData && (
            <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-cyan-500/30 p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                      <span>ESTAÇÃO METEOROLÓGICA DE PACING</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                        {weatherData.city}
                      </span>
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Monitoramento Térmico, Vento e Planejamento para o Dia Seguinte
                    </p>
                  </div>
                </div>

                {/* Switcher: Hoje vs Amanhã */}
                <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono self-end sm:self-auto">
                  <button
                    onClick={() => setWeatherViewMode("TOMORROW")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      weatherViewMode === "TOMORROW"
                        ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-black shadow-md font-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>🌅 Amanhã (Prova / Longão)</span>
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </button>

                  <button
                    onClick={() => setWeatherViewMode("LIVE_NOW")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      weatherViewMode === "LIVE_NOW"
                        ? "bg-blue-600/30 border border-blue-500 text-blue-300 shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>☀️ Tempo Real (Hoje)</span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: PREVISÃO DO TEMPO PARA AMANHÃ (DOMINGO / PROVA ATHENAS MIZUNO) */}
              {weatherViewMode === "TOMORROW" && weatherData.tomorrow && (
                <div className="space-y-3 animate-fadeIn">
                  {/* Tomorrow Race Header Banner */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1C160C] to-black border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏁</span>
                      <div>
                        <span className="font-bold text-amber-300 font-mono block">
                          {weatherData.tomorrow.dateFormatted} • {weatherData.tomorrow.raceTimeFormatted}
                        </span>
                        <span className="text-[10px] text-gray-300 font-mono">
                          Marginal Pinheiros • Athenas Mizuno Run Longer (Daniel 21k • Patrícia 14k)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSpeakTomorrowWeather}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                        title="Ouvir previsão do tempo de amanhã narrada pelo treinador"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>🎙️ Ouvir Previsão</span>
                      </button>

                      <button
                        onClick={handleSendTelegramBriefing}
                        className="px-2.5 py-1 rounded-xl bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-blue-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                      >
                        <Send className="h-3 w-3" />
                        <span>{telegramStatus || "Telegram"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Tomorrow Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-amber-500/30">
                      <span className="text-[10px] text-amber-400 block font-mono">Largada (06h30)</span>
                      <span className="font-black font-mono text-white text-base">
                        {weatherData.tomorrow.tempStartC}°C
                      </span>
                      <span className="text-[9px] text-gray-400 block">
                        Sensação {weatherData.tomorrow.feelsLikeC}°C
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-white/5">
                      <span className="text-[10px] text-gray-400 block font-mono">Chegada (~09h00)</span>
                      <span className="font-black font-mono text-emerald-400 text-base">
                        {weatherData.tomorrow.tempFinishC}°C
                      </span>
                      <span className="text-[9px] text-gray-400 block">Aquecimento suave</span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-white/5">
                      <span className="text-[10px] text-gray-400 block font-mono">Umidade & Vento</span>
                      <span className="font-black font-mono text-cyan-400 text-base">
                        {weatherData.tomorrow.humidityPct}%
                      </span>
                      <span className="text-[9px] text-gray-400 block truncate">
                        {weatherData.tomorrow.windSpeedKmh}km/h {weatherData.tomorrow.windDirectionText}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 block font-mono">Ajuste no Pace</span>
                      <span className="font-black font-mono text-emerald-300 text-base">
                        +{weatherData.tomorrow.paceAdjustmentSec}s/km
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block">
                        Condição Ótima (RP)
                      </span>
                    </div>
                  </div>

                  {/* Hourly Temperature Splits During Race */}
                  {weatherData.tomorrow.hourlySplits && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide block">
                        Evolução Horária ao Longo da Prova (06h às 09h):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
                        {weatherData.tomorrow.hourlySplits.map((h, idx) => (
                          <div key={idx} className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-center">
                            <span className="text-[9px] text-gray-400 block">{h.timeStr}</span>
                            <span className="font-bold text-white text-xs">{h.tempC}°C</span>
                            <span className="text-[8px] text-gray-500 block truncate">{h.condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gear & Hydration Recommendation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                    <div className="p-2.5 rounded-xl bg-[#07090E] border border-white/5 space-y-0.5">
                      <span className="font-bold text-amber-300 block font-mono">🎽 Traje Recomendado de Prova:</span>
                      <p className="text-gray-300">{weatherData.tomorrow.gearRecommendation}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#07090E] border border-white/5 space-y-0.5">
                      <span className="font-bold text-cyan-300 block font-mono">💧 Estratégia de Hidratação:</span>
                      <p className="text-gray-300">{weatherData.tomorrow.hydrationPlan}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-300 italic bg-[#07090E]/60 p-2.5 rounded-xl border border-white/5 font-sans">
                    Diretriz Tática para Amanhã: {weatherData.tomorrow.tacticalAdvice}
                  </p>
                </div>
              )}

              {/* VIEW 2: TEMPO REAL HOJE */}
              {weatherViewMode === "LIVE_NOW" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-white/5">
                      <span className="text-[10px] text-gray-400 block font-mono">Temperatura Atual</span>
                      <span className="font-extrabold font-mono text-white text-sm">{weatherData.tempC}°C</span>
                      <span className="text-[9px] text-gray-500 block">Sensação {weatherData.feelsLikeC}°C</span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-white/5">
                      <span className="text-[10px] text-gray-400 block font-mono">Umidade Atual</span>
                      <span className="font-extrabold font-mono text-cyan-400 text-sm">{weatherData.humidityPct}%</span>
                      <span className="text-[9px] text-gray-500 block">Vento {weatherData.windSpeedKmh}km/h</span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-white/5">
                      <span className="text-[10px] text-gray-400 block font-mono">Ajuste de Pace</span>
                      <span className={`font-extrabold font-mono text-sm ${weatherData.paceAdjustmentSec > 5 ? "text-amber-400" : "text-emerald-400"}`}>
                        +{weatherData.paceAdjustmentSec}s/km
                      </span>
                      <span className="text-[9px] text-gray-500 block">Custo térmico hoje</span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#07090E] border border-white/5">
                      <span className="text-[10px] text-gray-400 block font-mono">Condição Atual</span>
                      <span className="font-bold text-gray-200 text-xs truncate capitalize block">
                        {weatherData.condition}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block">
                        {weatherData.environmentalRisk === "OPTIMAL" ? "Ideal p/ Asfalto" : "Moderado"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-300 italic bg-[#07090E]/60 p-2.5 rounded-xl border border-white/5 font-sans">
                    Diretriz de Pacing de Hoje: {weatherData.tacticalRecommendation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🏆 Palmarés Oficial, Resultados Homologados & Classificações de Faixa Etária */}
      <div className="rounded-3xl bg-gradient-to-b from-[#141A29] via-[#0F1420] to-[#0A0D15] border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Palmarés Oficial & Classificações de Faixa Etária
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  {isDaniel ? "Categoria M50-54" : currentProfile === "PATRICIA" ? "Categoria F55-59" : "Categoria M20-24"}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Chip Times • Classificações Homologadas • Athenas Mizuno Run Longer (Amanhã!)
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRaceManager}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Medal className="h-3.5 w-3.5" />
            <span>Lançar / Ver Resultados Oficiais</span>
          </button>
        </div>

        {/* Display official completed races & Tomorrow's Action Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Most recent official completed race */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 font-mono">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Última Prova Homologada
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
                  {isDaniel
                    ? "🏅 Finisher 30 Anos Intl SP"
                    : currentProfile === "PATRICIA"
                    ? "🏅 40 Anos Tribuna Santos"
                    : "⚡ Top 3% Jovens (M20-24)"}
                </span>
              </div>

              <h4 className="text-sm font-black text-white mt-1">
                {isDaniel
                  ? "30ª Maratona Internacional de SP 2026 (21k)"
                  : currentProfile === "PATRICIA"
                  ? "40º 10 KM Tribuna Terracom Santos"
                  : "Corrida Sargento Gonzaguinha 2026 (5k)"}
              </h4>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[8px] text-gray-400 uppercase block">Chip Time</span>
                <span className="text-xs font-black text-emerald-400 block mt-0.5">
                  {isDaniel ? "02:22:05" : currentProfile === "PATRICIA" ? "01:10:12" : "00:21:15"}
                </span>
                <span className="text-[8px] text-gray-500 block">
                  {isDaniel ? "6:46/km" : currentProfile === "PATRICIA" ? "7:01/km" : "4:15/km"}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[8px] text-gray-400 uppercase block">Gun Time</span>
                <span className="text-xs font-bold text-gray-300 block mt-0.5">
                  {isDaniel ? "02:49:28" : currentProfile === "PATRICIA" ? "01:12:34" : "00:21:40"}
                </span>
                <span className="text-[8px] text-gray-500 block">Bruto</span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[8px] text-gray-400 uppercase block">Faixa Etária</span>
                <span className="text-xs font-black text-amber-400 block mt-0.5">
                  {isDaniel ? "332º" : currentProfile === "PATRICIA" ? "430ª" : "6º / 220"}
                </span>
                <span className="text-[8px] text-amber-300/80 block">
                  {isDaniel ? "M50-54" : currentProfile === "PATRICIA" ? "F50-59" : "M20-24"}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[8px] text-gray-400 uppercase block">Geral / Sexo</span>
                <span className="text-xs font-bold text-white block mt-0.5">
                  {isDaniel ? "3.824º" : currentProfile === "PATRICIA" ? "9.739ª" : "78º"}
                </span>
                <span className="text-[8px] text-cyan-400 block">
                  {isDaniel ? "Masc" : currentProfile === "PATRICIA" ? "3.009ª Fem" : "65º Masc"}
                </span>
              </div>
            </div>
          </div>

          {/* Race Countdown & Launch Call */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 to-black/40 border border-red-500/40 flex flex-col justify-between space-y-3 font-mono">
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${currentProfile === "PATRICIA" ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                  <Flame className="h-3 w-3" />
                  {currentProfile === "PATRICIA" ? "PROVA CONCLUÍDA HOJE (18/10/2026)!" : "Próxima Prova • HOJE (18/10/2026)!"}
                </span>
                <span className={`text-[9px] text-white px-2 py-0.5 rounded font-black uppercase ${currentProfile === "PATRICIA" ? "bg-emerald-600" : "bg-red-600"}`}>
                  {currentProfile === "PATRICIA" ? "OFICIAL HOMOLOGADO" : "Alvo P1"}
                </span>
              </div>

              <h4 className="text-sm font-black text-white mt-1">
                Athenas Mizuno Run Longer {isDaniel ? "21k" : currentProfile === "PATRICIA" ? "14k" : "10k"}
              </h4>
              <p className="text-[11px] text-gray-300 mt-1">
                {currentProfile === "PATRICIA"
                  ? "Marginal Pinheiros • Nº 10967 • Tempo Líquido Oficial: 01:43:02 (Pace 07:21 min/km)"
                  : `Marginal Pinheiros • Largada ${isDaniel ? "05:30" : "06:30"} • ${isDaniel ? "21.097 km" : "10.0 km"}`}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-gray-400">
                {currentProfile === "PATRICIA" ? (
                  <>Oficial: <strong className="text-emerald-400">01:43:02 (26ª F55-59)</strong></>
                ) : (
                  <>Meta: <strong className="text-amber-400">{isDaniel ? "01:54:40 (5:26/km)" : "00:44:10 (4:25/km)"}</strong></>
                )}
              </span>

              <button
                onClick={onOpenRaceManager}
                className="px-3 py-1.5 rounded-xl bg-red-600/30 border border-red-500/50 hover:bg-red-600/50 text-white text-[11px] font-bold transition-all shadow"
              >
                {currentProfile === "PATRICIA" ? "Ver Palmarés & Calibrador →" : "Registrar Tempo Oficial →"}
              </button>
            </div>
          </div>
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

              {/* Next Game & Smart Workout Cutoff Lock */}
              {teamData.nextMatches && teamData.nextMatches[0] && (
                <div className="p-3.5 rounded-2xl bg-[#07090E] border border-amber-500/30 space-y-2.5 shadow-inner">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">⚽</span>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          vs {teamData.nextMatches[0].opponent}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {teamData.nextMatches[0].date} • {teamData.nextMatches[0].timeBrasilia} (Brasília)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleSpeakPreGameCutoffLock}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-all self-end sm:self-auto"
                      title="Ouvir aviso da trava inteligente narrado pelo treinador"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>🎙️ Ouvir Trava</span>
                    </button>
                  </div>

                  {teamData.logisticalAdjustments && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-amber-300">
                            Trava de Corte Vespertino: {teamData.logisticalAdjustments.recommendedEndTime}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-[10px]">
                          +{teamData.logisticalAdjustments.caloricBufferKcal} kcal buffer
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-300 font-sans">
                        Sincronizada automaticamente para 1h antes do pontapé inicial ({teamData.nextMatches[0].timeBrasilia}). Garante 60 min de transição para banho e hidratação.
                      </p>
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

      {/* Interactive Active Workout Modal for Gym Guidance */}
      <ActiveWorkoutModal
        isOpen={isActiveWorkoutOpen}
        onClose={() => setIsActiveWorkoutOpen(false)}
        currentProfile={currentProfile}
        initialFicha={activeFichaForModal}
      />
    </div>
  );
}
