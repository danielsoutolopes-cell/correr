"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Compass,
  Clock,
  Zap,
  Flame,
  Shield,
  Droplet,
  Volume2,
  Share2,
  Printer,
  ChevronRight,
  TrendingDown,
  Activity,
  Heart,
  Sliders,
  Award,
  CheckCircle2,
  Copy,
  CloudSun,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Trophy,
  Check,
  Sparkles,
  VolumeX,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ProfileId } from "@/lib/types";
import { audioCoach } from "@/lib/audio-coach";

interface RaceTacticalSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ProfileId;
  onOpenRaceManager?: () => void;
  onOpenTrophyCardGenerator?: () => void;
}

type StrategyType = "NEGATIVE_SPLIT" | "EVEN_PACE" | "CONSERVATIVE_START";

interface RacePreset {
  id: string;
  name: string;
  distanceKm: number;
  defaultTime: string; // HH:MM:SS
  location: string;
  athleteId: ProfileId;
  elevation: "FLAT" | "MODERATE" | "ROLLING";
}

const PRESET_RACES: RacePreset[] = [
  {
    id: "daniel-athenas-21k",
    name: "Athenas Mizuno Run Longer 21k (Amanhã!)",
    distanceKm: 21.097,
    defaultTime: "01:54:00",
    location: "Marginal Pinheiros, SP",
    athleteId: "DANIEL",
    elevation: "FLAT",
  },
  {
    id: "patricia-athenas-14k",
    name: "Athenas Mizuno Run Longer 14k (Amanhã!)",
    distanceKm: 14.0,
    defaultTime: "01:23:00",
    location: "Marginal Pinheiros, SP",
    athleteId: "PATRICIA",
    elevation: "FLAT",
  },
  {
    id: "patricia-venus-21k",
    name: "Meia Maratona Vênus 21k",
    distanceKm: 21.097,
    defaultTime: "02:08:00",
    location: "São Paulo, SP",
    athleteId: "PATRICIA",
    elevation: "FLAT",
  },
  {
    id: "gabriel-olga-10k",
    name: "Corrida Olga Kos 10k (Sub-45)",
    distanceKm: 10.0,
    defaultTime: "00:44:30",
    location: "Pacaembu, SP",
    athleteId: "GABRIEL",
    elevation: "MODERATE",
  },
  {
    id: "daniel-olga-10k",
    name: "Corrida Olga Kos 10k (Daniel)",
    distanceKm: 10.0,
    defaultTime: "00:49:50",
    location: "Pacaembu, SP",
    athleteId: "DANIEL",
    elevation: "MODERATE",
  },
  {
    id: "daniel-sp-inter-21k",
    name: "Meia Maratona Internacional de SP 2027",
    distanceKm: 21.097,
    defaultTime: "01:51:30",
    location: "Ibirapuera, SP",
    athleteId: "DANIEL",
    elevation: "ROLLING",
  },
];

export function RaceTacticalSimulatorModal({
  isOpen,
  onClose,
  activeProfile,
  onOpenRaceManager,
  onOpenTrophyCardGenerator,
}: RaceTacticalSimulatorModalProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>(
    activeProfile === "CLAN" ? "DANIEL" : activeProfile
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    if (activeProfile === "PATRICIA") return "patricia-athenas-14k";
    if (activeProfile === "GABRIEL") return "gabriel-olga-10k";
    return "daniel-athenas-21k";
  });

  const [strategy, setStrategy] = useState<StrategyType>("NEGATIVE_SPLIT");
  const [targetHours, setTargetHours] = useState<number>(1);
  const [targetMinutes, setTargetMinutes] = useState<number>(54);
  const [targetSeconds, setTargetSeconds] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Live Race Execution State
  const [activeTab, setActiveTab] = useState<"PLANNER" | "LIVE_RACE">("PLANNER");
  const [liveRaceStatus, setLiveRaceStatus] = useState<
    "IDLE" | "COUNTDOWN" | "RUNNING" | "PAUSED" | "FINISHED"
  >("IDLE");
  const [countdownSec, setCountdownSec] = useState<number>(3);
  const [elapsedRaceSec, setElapsedRaceSec] = useState<number>(0);
  const [currentLiveKm, setCurrentLiveKm] = useState<number>(1);
  const [completedSplits, setCompletedSplits] = useState<
    Array<{
      km: number;
      actualSplitSec: number;
      actualSplitStr: string;
      cumulativeSec: number;
      cumulativeStr: string;
      targetPaceStr: string;
      deltaSec: number;
    }>
  >([]);
  const [isMetronomeActiveInRace, setIsMetronomeActiveInRace] = useState<boolean>(false);
  const [raceCadenceSpm, setRaceCadenceSpm] = useState<number>(() => {
    if (selectedProfile === "GABRIEL") return 185;
    if (selectedProfile === "PATRICIA") return 180;
    return 178;
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync preset when user changes selectedPresetId
  const currentPreset = useMemo(() => {
    return PRESET_RACES.find((p) => p.id === selectedPresetId) || PRESET_RACES[0];
  }, [selectedPresetId]);

  // Update hours/mins when preset changes
  useEffect(() => {
    const [h, m, s] = currentPreset.defaultTime.split(":").map(Number);
    setTargetHours(h);
    setTargetMinutes(m);
    setTargetSeconds(s || 0);
  }, [currentPreset]);

  // Sync default cadence when athlete changes
  useEffect(() => {
    if (selectedProfile === "GABRIEL") setRaceCadenceSpm(185);
    else if (selectedProfile === "PATRICIA") setRaceCadenceSpm(180);
    else setRaceCadenceSpm(178);
  }, [selectedProfile]);

  // Sound effect for start gun (Synthesized Web Audio)
  const playGunShotSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {}
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (liveRaceStatus === "COUNTDOWN" && countdownSec > 0) {
      timer = setTimeout(() => {
        setCountdownSec((prev) => {
          if (prev <= 1) {
            setLiveRaceStatus("RUNNING");
            playGunShotSound();
            const athleteName =
              selectedProfile === "DANIEL"
                ? "Daniel"
                : selectedProfile === "PATRICIA"
                ? "Patrícia"
                : "Gabriel";
            audioCoach.speakCoachBriefing(
              `Tiro de largada oficial! Vai com tudo ${athleteName}! Foco no primeiro quilômetro, passada elástica e cadência travada em ${raceCadenceSpm} passos por minuto!`
            );
            if (isMetronomeActiveInRace) {
              audioCoach.startMetronome(raceCadenceSpm);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [liveRaceStatus, countdownSec, raceCadenceSpm, selectedProfile, isMetronomeActiveInRace]);

  // Chronometer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (liveRaceStatus === "RUNNING") {
      interval = setInterval(() => {
        setElapsedRaceSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [liveRaceStatus]);

  // Stop metronome on unmount
  useEffect(() => {
    return () => {
      audioCoach.stopMetronome();
    };
  }, []);

  if (!isOpen) return null;

  const totalTimeSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;
  const avgPaceSec = totalTimeSeconds / currentPreset.distanceKm;
  const avgPaceMin = Math.floor(avgPaceSec / 60);
  const avgPaceSecRem = Math.round(avgPaceSec % 60);
  const avgPaceStr = `${avgPaceMin}:${avgPaceSecRem < 10 ? "0" : ""}${avgPaceSecRem}`;

  // Generate Kilometer splits
  const kmSplits = useMemo(() => {
    const totalKm = Math.ceil(currentPreset.distanceKm);
    const splits: Array<{
      km: number;
      paceSec: number;
      paceStr: string;
      cumulativeTimeStr: string;
      hrZone: string;
      targetHrBpm: number;
      actionWater: boolean;
      actionGel: boolean;
      actionElectrolyte: boolean;
      tacticalNote: string;
    }> = [];

    let accumulatedSec = 0;

    for (let i = 1; i <= totalKm; i++) {
      const isLastFraction = i === totalKm && currentPreset.distanceKm % 1 !== 0;

      // Adjust pace based on strategy
      let paceFactor = 1.0;
      if (strategy === "NEGATIVE_SPLIT") {
        if (i <= Math.floor(totalKm * 0.3)) paceFactor = 1.025; // 2.5% slower start
        else if (i <= Math.floor(totalKm * 0.7)) paceFactor = 1.0; // Cruise
        else paceFactor = 0.975; // 2.5% faster finish
      } else if (strategy === "CONSERVATIVE_START") {
        if (i <= 3) paceFactor = 1.04; // 4% slower first 3k to warm up
        else if (i <= totalKm - 2) paceFactor = 0.995;
        else paceFactor = 0.98;
      } else {
        // Even Pace
        paceFactor = 1.0;
      }

      const kmPaceSec = Math.round(avgPaceSec * paceFactor);
      accumulatedSec += kmPaceSec;

      const pMin = Math.floor(kmPaceSec / 60);
      const pSec = kmPaceSec % 60;
      const pStr = `${pMin}:${pSec < 10 ? "0" : ""}${pSec}`;

      const accH = Math.floor(accumulatedSec / 3600);
      const accM = Math.floor((accumulatedSec % 3600) / 60);
      const accS = accumulatedSec % 60;
      const accStr = `${accH > 0 ? `${accH}:` : ""}${accM < 10 ? "0" : ""}${accM}:${
        accS < 10 ? "0" : ""
      }${accS}`;

      // Water stations at every 3 km
      const actionWater = i % 3 === 0;

      // Gel intake at Km 7 and Km 13
      const actionGel = i === 7 || (i === 13 && currentPreset.distanceKm >= 14);

      // Electrolytes
      const actionElectrolyte = i === 10 || i === 18;

      // HR Zone estimation
      let hrZone = "Z3 (Cruzeiro Rítmico)";
      let baseBpm =
        selectedProfile === "DANIEL" ? 142 : selectedProfile === "PATRICIA" ? 145 : 155;
      if (i <= 2) {
        hrZone = "Z2 (Aquecimento)";
        baseBpm -= 6;
      } else if (i <= Math.floor(totalKm * 0.75)) {
        hrZone = "Z3 (Cruzeiro Rítmico)";
        baseBpm += 4;
      } else {
        hrZone = "Z4 (Limiar de Lactato)";
        baseBpm += 12;
      }

      // Tactical note
      let tacticalNote = "Manter passada elástica e postura alinhada";
      if (i === 1) tacticalNote = "Largada contida: ignore a euforia do pelotão inicial!";
      else if (i === 3) tacticalNote = "Primeiro gole d'água: bochechar e engolir metade.";
      else if (i === 7) tacticalNote = "1º Carbogel: tome com 100ml de água mineral!";
      else if (i === 13) tacticalNote = "2º Carbogel: energia crucial para fechar a prova!";
      else if (i === 18 && currentPreset.distanceKm >= 20)
        tacticalNote = "Negative split: abra a passada com cadência 180 spm!";
      else if (i === totalKm) tacticalNote = "Reta de chegada: postura ereta, sorriso e comemoração!";

      splits.push({
        km: i,
        paceSec: kmPaceSec,
        paceStr: pStr,
        cumulativeTimeStr: accStr,
        hrZone,
        targetHrBpm: baseBpm,
        actionWater,
        actionGel,
        actionElectrolyte,
        tacticalNote,
      });
    }

    return splits;
  }, [currentPreset.distanceKm, avgPaceSec, strategy, selectedProfile]);

  const handleSpeakBriefing = () => {
    if (isSpeaking) {
      audioCoach.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const athleteName =
      selectedProfile === "DANIEL"
        ? "Daniel"
        : selectedProfile === "PATRICIA"
        ? "Patrícia"
        : "Gabriel";
    const text = `Atenção ${athleteName}! Aqui está o seu plano tático oficial para ${
      currentPreset.name
    }. Distância de ${currentPreset.distanceKm} quilômetros, meta de tempo ${targetHours} horas e ${targetMinutes} minutos, pace médio de ${avgPaceStr} por quilômetro. 
    Estratégia selecionada: ${
      strategy === "NEGATIVE_SPLIT"
        ? "Negative Split. Comece 5 segundos mais lento para poupar glicogênio e acelere nos últimos 30 por cento."
        : strategy === "CONSERVATIVE_START"
        ? "Início conservador. Proteja a mecânica nos primeiros três quilômetros."
        : "Ritmo de metrônomo rigoroso."
    }
    ${
      selectedProfile === "DANIEL"
        ? "Lembrete clínico: proteja o ombro direito, mantenha o pêndulo relaxado e trave a cadência em 178 passos por minuto."
        : selectedProfile === "PATRICIA"
        ? "Lembrete biomecânico: foco na ativação do glúteo médio e aterrissagem estável do joelho."
        : "Gabriel: motor jovem a 185 passos por minuto, aceleração progressiva!"
    }
    Hidratação a cada três quilômetros e carbogel aos quilômetros 7 e 13. Vamos com tudo rumo à glória!`;

    setIsSpeaking(true);
    audioCoach.speakCoachBriefing(text);
    setTimeout(() => setIsSpeaking(false), 20000);
  };

  const handleCopyPlan = () => {
    const textPlan = `🏁 PLANO TÁTICO BIO-TRIAD OS: ${currentPreset.name}
Atleta: ${selectedProfile}
Distância: ${currentPreset.distanceKm} km | Alvo: ${targetHours}h${targetMinutes}m${targetSeconds}s
Pace Médio: ${avgPaceStr} /km | Estratégia: ${strategy}

Setores Principais:
1. Km 1-3: Largada consciente (${strategy === "NEGATIVE_SPLIT" ? "Pace suave" : "Pace alvo"})
2. Km 4-12: Cruzeiro Z3, Gel no Km 7, Água a cada 3 km
3. Km 13-17: Foco mental, Gel no Km 13, eletrólitos
4. Km 18-21.1: Aceleração final e linha de chegada!

Gerado com precisão Haute Sports pelo Bio-Triad OS • Clã Lopes 2026`;

    navigator.clipboard.writeText(textPlan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Live Race Controls
  const handleStartRaceLive = () => {
    setActiveTab("LIVE_RACE");
    setLiveRaceStatus("COUNTDOWN");
    setCountdownSec(3);
    setElapsedRaceSec(0);
    setCurrentLiveKm(1);
    setCompletedSplits([]);
    const athleteName =
      selectedProfile === "DANIEL"
        ? "Daniel"
        : selectedProfile === "PATRICIA"
        ? "Patrícia"
        : "Gabriel";
    audioCoach.speakCoachBriefing(
      `Atenção ${athleteName}! Preparar para a largada de ${currentPreset.name}! Três, dois, um...`
    );
  };

  const handleToggleMetronomeInRace = () => {
    if (isMetronomeActiveInRace) {
      audioCoach.stopMetronome();
      setIsMetronomeActiveInRace(false);
    } else {
      audioCoach.startMetronome(raceCadenceSpm);
      setIsMetronomeActiveInRace(true);
    }
  };

  const handleAdjustRaceCadence = (delta: number) => {
    const next = raceCadenceSpm + delta;
    setRaceCadenceSpm(next);
    if (isMetronomeActiveInRace) {
      audioCoach.startMetronome(next);
    }
  };

  const handlePauseResumeRace = () => {
    if (liveRaceStatus === "RUNNING") {
      setLiveRaceStatus("PAUSED");
      if (isMetronomeActiveInRace) audioCoach.stopMetronome();
    } else if (liveRaceStatus === "PAUSED") {
      setLiveRaceStatus("RUNNING");
      if (isMetronomeActiveInRace) audioCoach.startMetronome(raceCadenceSpm);
    }
  };

  const handleResetRace = () => {
    setLiveRaceStatus("IDLE");
    setElapsedRaceSec(0);
    setCurrentLiveKm(1);
    setCompletedSplits([]);
    audioCoach.stopMetronome();
    setIsMetronomeActiveInRace(false);
  };

  const handleMarkKmCompleted = () => {
    if (liveRaceStatus !== "RUNNING") return;
    const totalKm = Math.ceil(currentPreset.distanceKm);

    const lastCumulative =
      completedSplits.length > 0
        ? completedSplits[completedSplits.length - 1].cumulativeSec
        : 0;
    const splitSec = elapsedRaceSec - lastCumulative;
    const splitMin = Math.floor(splitSec / 60);
    const splitRem = splitSec % 60;
    const actualSplitStr = `${splitMin}:${splitRem < 10 ? "0" : ""}${splitRem}`;

    const cumMin = Math.floor(elapsedRaceSec / 60);
    const cumSec = elapsedRaceSec % 60;
    const cumulativeStr = `${cumMin < 10 ? "0" : ""}${cumMin}:${
      cumSec < 10 ? "0" : ""
    }${cumSec}`;

    const targetSplit = kmSplits.find((s) => s.km === currentLiveKm) || kmSplits[0];
    const deltaSec = splitSec - targetSplit.paceSec;

    const newCompleted = [
      ...completedSplits,
      {
        km: currentLiveKm,
        actualSplitSec: splitSec,
        actualSplitStr,
        cumulativeSec: elapsedRaceSec,
        cumulativeStr,
        targetPaceStr: targetSplit.paceStr,
        deltaSec,
      },
    ];
    setCompletedSplits(newCompleted);

    const deltaText =
      deltaSec <= 0
        ? `${Math.abs(deltaSec)} segundos mais rápido que o alvo, excelente ritmo!`
        : `${deltaSec} segundos acima do alvo, respiração ritmada na próxima reta!`;

    if (currentLiveKm >= totalKm) {
      setLiveRaceStatus("FINISHED");
      audioCoach.stopMetronome();
      setIsMetronomeActiveInRace(false);
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
      });
      const finalH = Math.floor(elapsedRaceSec / 3600);
      const finalM = Math.floor((elapsedRaceSec % 3600) / 60);
      const finalS = elapsedRaceSec % 60;
      const finalTimeStr = `${finalH > 0 ? `${finalH} horas e ` : ""}${finalM} minutos e ${finalS} segundos`;
      audioCoach.speakCoachBriefing(
        `Sensacional ${
          selectedProfile === "DANIEL"
            ? "Daniel"
            : selectedProfile === "PATRICIA"
            ? "Patrícia"
            : "Gabriel"
        }! Você cruzou a linha de chegada da ${
          currentPreset.name
        } com tempo oficial de ${finalTimeStr}! Prova histórica do Clã Lopes!`
      );
    } else {
      const nextKm = currentLiveKm + 1;
      setCurrentLiveKm(nextKm);
      const nextSplit = kmSplits.find((s) => s.km === nextKm);
      const fuelAlert = nextSplit?.actionGel
        ? "Atenção: tome o carbogel com água agora!"
        : nextSplit?.actionWater
        ? "Posto de hidratação: beba água!"
        : "";
      audioCoach.speakCoachBriefing(
        `Km ${currentLiveKm} concluído em ${actualSplitStr}. ${deltaText} ${fuelAlert}`
      );
    }
  };

  const handleSaveRaceResultToSystem = () => {
    try {
      const hours = Math.floor(elapsedRaceSec / 3600);
      const mins = Math.floor((elapsedRaceSec % 3600) / 60);
      const secs = elapsedRaceSec % 60;
      const chipTimeFormatted = `${String(hours).padStart(2, "0")}:${String(
        mins
      ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

      const paceSecPerKm = Math.round(elapsedRaceSec / currentPreset.distanceKm);
      const pMin = Math.floor(paceSecPerKm / 60);
      const pSec = paceSecPerKm % 60;
      const actualPaceFormatted = `${pMin}:${pSec < 10 ? "0" : ""}${pSec}`;

      // Save calibration base for 2027
      const calibData = {
        athleteId: selectedProfile,
        date: "2026-10-18",
        race: currentPreset.name,
        distanceKm: currentPreset.distanceKm,
        finishTimeSeconds: elapsedRaceSec,
        basePace: actualPaceFormatted,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`CALIBRATION_BASE_${selectedProfile}`, JSON.stringify(calibData));

      // Update in BIO_TRIAD_RACES_V3
      const storedRacesRaw = localStorage.getItem("BIO_TRIAD_RACES_V3");
      if (storedRacesRaw) {
        const races = JSON.parse(storedRacesRaw);
        const updated = races.map((r: any) => {
          if (
            r.athleteId === selectedProfile &&
            (r.raceDate === "2026-10-18" || r.name.toLowerCase().includes("athenas"))
          ) {
            return {
              ...r,
              isCompleted: true,
              actualFinishTime: chipTimeFormatted,
              actualPaceMinKm: actualPaceFormatted,
              podiumAward: "👑 Recorde Pessoal Oficial • Athenas Mizuno 2026",
            };
          }
          return r;
        });
        localStorage.setItem("BIO_TRIAD_RACES_V3", JSON.stringify(updated));
      }

      setSaveStatus("✅ Resultado oficial e Ritmo Base salvos com sucesso! Temporada 2027 calibrada.");
      setTimeout(() => setSaveStatus(null), 5000);

      if (onOpenRaceManager) {
        setTimeout(() => {
          onClose();
          onOpenRaceManager();
        }, 1200);
      }
    } catch (e) {
      setSaveStatus("⚠️ Erro ao salvar resultado no navegador.");
    }
  };

  const formatTimeHHMMSS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(
      2,
      "0"
    )}`;
  };

  const totalKmCount = Math.ceil(currentPreset.distanceKm);
  const currentTargetSplit =
    kmSplits.find((s) => s.km === currentLiveKm) || kmSplits[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-[#0B0F19] border border-cyan-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-black">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Compass className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-white font-mono">
                  SIMULADOR TÁTICO &amp; COCKPIT DE PROVA
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {activeTab === "LIVE_RACE" ? "AO VIVO 🔴" : "Simulação 📋"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Splits Km a Km, Cronômetro Oficial, Áudio Coach e Metrônomo de Cadência
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs & Close */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setActiveTab("PLANNER")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "PLANNER"
                    ? "bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>1. Planejador</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("LIVE_RACE");
                  if (liveRaceStatus === "IDLE") {
                    handleStartRaceLive();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "LIVE_RACE"
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-md shadow-red-600/30 animate-pulse"
                    : "text-red-300 hover:text-white bg-red-950/40 border border-red-500/30"
                }`}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>2. Modo Corrida Ao Vivo</span>
                {liveRaceStatus === "RUNNING" && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status Notification Toast */}
        {saveStatus && (
          <div className="bg-emerald-600 text-black font-black text-xs font-mono px-4 py-2 text-center animate-fadeIn flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* TAB 1: TACTICAL PLANNER & SPLITS (SIMULAÇÃO) */}
        {activeTab === "PLANNER" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Controls: Athlete, Race Preset & Strategy */}
            <div className="p-4 sm:p-6 border-b border-white/10 bg-[#0C1220]/70 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Athlete Picker */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-400 mb-1.5 block">
                    Atleta do Clã Lopes
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedProfile("DANIEL");
                        setSelectedPresetId("daniel-athenas-21k");
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                        selectedProfile === "DANIEL"
                          ? "bg-red-600/30 border-red-500 text-white shadow-lg shadow-red-500/20"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <span>Daniel (52a)</span>
                      <span className="text-[9px] opacity-75 font-mono">FLA 🔴⚫</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProfile("PATRICIA");
                        setSelectedPresetId("patricia-athenas-14k");
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                        selectedProfile === "PATRICIA"
                          ? "bg-sky-600/30 border-sky-500 text-white shadow-lg shadow-sky-500/20"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <span>Patrícia (56a)</span>
                      <span className="text-[9px] opacity-75 font-mono">GRE 🔵⚪⚫</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProfile("GABRIEL");
                        setSelectedPresetId("gabriel-olga-10k");
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                        selectedProfile === "GABRIEL"
                          ? "bg-emerald-600/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <span>Gabriel (20a)</span>
                      <span className="text-[9px] opacity-75 font-mono">PAL 🟢⚪</span>
                    </button>
                  </div>
                </div>

                {/* 2. Target Race Preset */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-400 mb-1.5 block">
                    Prova Alvo / Distância
                  </label>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                    className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    {PRESET_RACES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Strategy Selector */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-gray-400 mb-1.5 block">
                    Estratégia de Ritmo (Pacing)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => setStrategy("NEGATIVE_SPLIT")}
                      className={`py-2 px-1 rounded-xl text-center border transition-all ${
                        strategy === "NEGATIVE_SPLIT"
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                      title="Negative Split: Início 2.5% mais lento e aceleração nos últimos 30%"
                    >
                      Negative Split
                    </button>
                    <button
                      onClick={() => setStrategy("EVEN_PACE")}
                      className={`py-2 px-1 rounded-xl text-center border transition-all ${
                        strategy === "EVEN_PACE"
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                      title="Even Pace: Ritmo constante do Km 1 ao fim"
                    >
                      Pace Constante
                    </button>
                    <button
                      onClick={() => setStrategy("CONSERVATIVE_START")}
                      className={`py-2 px-1 rounded-xl text-center border transition-all ${
                        strategy === "CONSERVATIVE_START"
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                      title="Início Conservador: Primeiros 3 km protegidos para articulações"
                    >
                      Início Seguro
                    </button>
                  </div>
                </div>
              </div>

              {/* Tomorrow Race Eve Weather Forecast Banner */}
              {selectedPresetId.includes("athenas") && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#18130B] to-black border border-amber-500/40 text-xs font-mono space-y-1.5 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-amber-300 font-bold">
                    <span className="flex items-center gap-2">
                      <CloudSun className="h-4 w-4 text-amber-400" />
                      <span>Previsão Meteorológica da Prova (Domingo 18/10 • Marginal Pinheiros):</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
                      Custo Térmico: +0s/km (RP Liberado)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] pt-1 border-t border-white/5">
                    <div className="bg-white/5 p-1.5 rounded-lg">
                      <span className="text-gray-400 block text-[9px]">Largada (06h30)</span>
                      <span className="font-bold text-white">16.5°C</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg">
                      <span className="text-gray-400 block text-[9px]">Chegada (~09h00)</span>
                      <span className="font-bold text-emerald-400">20.2°C</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg">
                      <span className="text-gray-400 block text-[9px]">Umidade Relativa</span>
                      <span className="font-bold text-cyan-400">82%</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg">
                      <span className="text-gray-400 block text-[9px]">Vento</span>
                      <span className="font-bold text-gray-200">9 km/h (SE)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Time & Target Pace Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">
                      Tempo Alvo
                    </span>
                    <div className="flex items-center gap-1 font-mono font-bold text-white text-base">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={targetHours}
                        onChange={(e) => setTargetHours(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-10 bg-transparent border-b border-white/30 text-center focus:border-amber-400 focus:outline-none"
                      />
                      <span>h</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={targetMinutes}
                        onChange={(e) =>
                          setTargetMinutes(
                            Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                          )
                        }
                        className="w-12 bg-transparent border-b border-white/30 text-center focus:border-amber-400 focus:outline-none"
                      />
                      <span>m</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={targetSeconds}
                        onChange={(e) =>
                          setTargetSeconds(
                            Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                          )
                        }
                        className="w-12 bg-transparent border-b border-white/30 text-center focus:border-amber-400 focus:outline-none"
                      />
                      <span>s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Pace Médio Alvo</span>
                    <span className="text-base font-bold text-cyan-400">{avgPaceStr} /km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Velocidade Média</span>
                    <span className="text-base font-bold text-emerald-400">
                      {((currentPreset.distanceKm / (totalTimeSeconds / 3600)) || 0).toFixed(1)} km/h
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Consumo de Carbogel</span>
                    <span className="text-base font-bold text-amber-400">
                      {currentPreset.distanceKm >= 20
                        ? "2 a 3 sachês"
                        : currentPreset.distanceKm >= 14
                        ? "1 a 2 sachês"
                        : "1 sachê opcional"}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeakBriefing}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                      isSpeaking
                        ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                        : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>{isSpeaking ? "Parar Áudio" : "🎙️ Ouvir Briefing"}</span>
                  </button>
                  <button
                    onClick={handleCopyPlan}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{isCopied ? "Copiado! ✅" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Safeguard Alert Pill */}
            <div className="px-6 py-2.5 bg-blue-950/20 border-b border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-300">
                <Shield className="h-4 w-4 shrink-0 text-cyan-400" />
                <span className="font-semibold">
                  {selectedProfile === "DANIEL"
                    ? "Salvaguarda Clínica Ativa: Prótese reversa de ombro direito — cadência 178 spm para amortecer oscilação vertical."
                    : selectedProfile === "PATRICIA"
                    ? "Salvaguarda Biomecânica: Estabilidade pélvica & glúteo médio — passada rítmica sem sobrecarga no joelho."
                    : "Parâmetro Motor Jovem: Cadência 185 spm — aceleração anaeróbia na reta final."}
                </span>
              </div>
              <span className="font-mono text-[10px] text-gray-400">
                {currentPreset.location} • Altimetria {currentPreset.elevation}
              </span>
            </div>

            {/* Scrollable Table of Kilometer Splits */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-gray-400 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                <div className="col-span-1">KM</div>
                <div className="col-span-2">Pace Alvo</div>
                <div className="col-span-2">Tempo Acum.</div>
                <div className="col-span-2">Zona FC Estimada</div>
                <div className="col-span-2">Abastecimento</div>
                <div className="col-span-3">Instrução Tática</div>
              </div>

              <div className="space-y-1.5">
                {kmSplits.map((split) => (
                  <div
                    key={split.km}
                    className={`grid grid-cols-12 items-center text-xs font-mono px-3 py-2.5 rounded-xl border transition-all ${
                      split.actionGel
                        ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                        : split.actionWater
                        ? "bg-blue-950/20 border-blue-500/30 text-blue-200"
                        : "bg-[#090D17] border-white/5 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <div className="col-span-1 font-bold text-white flex items-center gap-1">
                      <span>Km {split.km}</span>
                    </div>

                    <div className="col-span-2 font-bold text-cyan-300">
                      {split.paceStr} <span className="text-[10px] text-gray-400 font-normal">/km</span>
                    </div>

                    <div className="col-span-2 text-gray-300">{split.cumulativeTimeStr}</div>

                    <div className="col-span-2 flex items-center gap-1.5">
                      <Heart className="h-3 w-3 text-rose-400 shrink-0" />
                      <span className="text-[11px]">{split.hrZone}</span>
                    </div>

                    <div className="col-span-2 flex items-center gap-1.5">
                      {split.actionGel && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                          ⚡ GEL
                        </span>
                      )}
                      {split.actionWater && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold">
                          💧 ÁGUA
                        </span>
                      )}
                      {!split.actionGel && !split.actionWater && (
                        <span className="text-gray-500 text-[10px]">—</span>
                      )}
                    </div>

                    <div
                      className="col-span-3 text-[11px] text-gray-300 truncate"
                      title={split.tacticalNote}
                    >
                      {split.tacticalNote}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-[#070A11] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="text-gray-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Athenas Mizuno Run Longer 2026: Largada {selectedPresetId === "daniel-athenas-21k" ? "05:30" : "06:30"} na Marginal Pinheiros!
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPlan}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-all border border-white/10"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Exportar Plano</span>
                </button>
                <button
                  onClick={handleStartRaceLive}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30"
                >
                  <Play className="h-4 w-4 fill-black" />
                  <span>INICIAR PROVA AO VIVO (3-2-1)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE RACE EXECUTION (COCKPIT DE CORRIDA AO VIVO) */}
        {activeTab === "LIVE_RACE" && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-[#080B13] via-[#090E1A] to-[#06080F]">
            {/* Status 1: IDLE (Pre-Start Cockpit) */}
            {liveRaceStatus === "IDLE" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-xl mx-auto my-auto">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-2xl shadow-emerald-500/30 animate-pulse">
                  <div className="h-full w-full bg-[#080B12] rounded-[22px] flex items-center justify-center">
                    <Flag className="h-10 w-10 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                    MODO PROVA AO VIVO • LINHA DE LARGADA
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {currentPreset.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Atleta: {selectedProfile} • {currentPreset.distanceKm} km • Meta: {targetHours}h{targetMinutes}m • Pace {avgPaceStr}/km
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full text-center text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Cadência Alvo</span>
                    <span className="font-bold text-white text-base">{raceCadenceSpm} SPM</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Pace Alvo</span>
                    <span className="font-bold text-cyan-400 text-base">{avgPaceStr}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Estratégia</span>
                    <span className="font-bold text-amber-400 text-xs truncate">
                      {strategy === "NEGATIVE_SPLIT" ? "Negative Split" : "Even Pace"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 text-left flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Ao ouvir a buzina oficial ou ao cruzar o pórtico do chip, toque no botão abaixo. O sistema fará a contagem 3-2-1, ativará o metrônomo no ouvido e o cronômetro oficial!
                  </span>
                </div>

                <button
                  onClick={handleStartRaceLive}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-base transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 animate-pulse"
                >
                  <Play className="h-6 w-6 fill-black" />
                  <span>TIRO DE LARGADA • INICIAR CORRIDA AGORA!</span>
                </button>
              </div>
            )}

            {/* Status 2: COUNTDOWN (3... 2... 1...) */}
            {liveRaceStatus === "COUNTDOWN" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 my-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  ATENÇÃO NA LINHA DE LARGADA...
                </span>
                <div className="relative flex items-center justify-center">
                  <div className="h-44 w-44 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-500/10 flex items-center justify-center animate-ping" />
                  <span className="absolute font-mono font-black text-7xl sm:text-9xl text-white drop-shadow-[0_0_35px_rgba(16,185,129,0.8)]">
                    {countdownSec}
                  </span>
                </div>
                <p className="text-sm text-gray-300 font-mono">
                  {currentPreset.name} • Respiração ritmada, foco na passada!
                </p>
              </div>
            )}

            {/* Status 3: RUNNING or PAUSED (Active Race Cockpit) */}
            {(liveRaceStatus === "RUNNING" || liveRaceStatus === "PAUSED") && (
              <div className="space-y-5 animate-fadeIn">
                {/* Haute Horlogerie Giant Chronograph Display */}
                <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0B0F1C] to-[#060810] border border-cyan-500/40 shadow-[0_10px_40px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400">
                        CRONÔMETRO OFICIAL EM TEMPO REAL
                      </span>
                      {liveRaceStatus === "PAUSED" && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500 text-[10px] font-bold">
                          PAUSADO
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-black text-4xl sm:text-6xl text-white tracking-tight drop-shadow-md">
                      {formatTimeHHMMSS(elapsedRaceSec)}
                    </div>
                    <span className="text-xs text-gray-400 font-mono block">
                      Prova: {currentPreset.name} ({currentPreset.distanceKm} km)
                    </span>
                  </div>

                  {/* Top Race Controls: Pause, Metronome & Reset */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={handleToggleMetronomeInRace}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                        isMetronomeActiveInRace
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse shadow-md"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                      title="Ativar/desativar metrônomo sonoro no fone de ouvido"
                    >
                      {isMetronomeActiveInRace ? (
                        <Volume2 className="h-4 w-4 text-cyan-300" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      <span>{raceCadenceSpm} SPM</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustRaceCadence(-2)}
                        className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white"
                        title="Diminuir cadência em 2 SPM"
                      >
                        -2
                      </button>
                      <button
                        onClick={() => handleAdjustRaceCadence(2)}
                        className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white"
                        title="Aumentar cadência em 2 SPM"
                      >
                        +2
                      </button>
                    </div>

                    <button
                      onClick={handlePauseResumeRace}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      {liveRaceStatus === "RUNNING" ? (
                        <>
                          <Pause className="h-4 w-4" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-current" />
                          <span>Retomar</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleResetRace}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-300 transition-all"
                      title="Reiniciar cronômetro"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Current KM Card */}
                <div className="p-5 rounded-3xl bg-[#090D18] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                        PROGRESSO DA PROVA
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                        <span>KM {currentLiveKm} de {totalKmCount} km</span>
                        <span className="text-xs font-normal text-gray-400">
                          ({((currentLiveKm / currentPreset.distanceKm) * 100).toFixed(0)}% concluído)
                        </span>
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-mono block">Distância Restante:</span>
                      <span className="text-base font-bold text-cyan-400 font-mono">
                        {Math.max(0, currentPreset.distanceKm - currentLiveKm + 1).toFixed(1)} km
                      </span>
                    </div>
                  </div>

                  {/* Progress Neon Bar */}
                  <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                      style={{
                        width: `${Math.min(100, ((currentLiveKm - 1) / currentPreset.distanceKm) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Current KM Tactical Targets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-gray-400 block">Pace Alvo deste Km</span>
                      <span className="text-lg font-black text-cyan-400">{currentTargetSplit.paceStr}</span>
                      <span className="text-[9px] text-gray-500 block">/km planejado</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-gray-400 block">Tempo Acumulado Alvo</span>
                      <span className="text-lg font-black text-white">{currentTargetSplit.cumulativeTimeStr}</span>
                      <span className="text-[9px] text-gray-500 block">Meta na passagem</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-gray-400 block">Zona de Frequência</span>
                      <span className="text-sm font-bold text-rose-300 block mt-1">{currentTargetSplit.hrZone}</span>
                      <span className="text-[9px] text-gray-500 block">~{currentTargetSplit.targetHrBpm} bpm</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-gray-400 block">Cadência Recomendada</span>
                      <span className="text-lg font-black text-emerald-400">{raceCadenceSpm} SPM</span>
                      <span className="text-[9px] text-gray-500 block">Passada protegida</span>
                    </div>
                  </div>

                  {/* Active Nutrition & Hydration Checkpoint Banner */}
                  {(currentTargetSplit.actionGel || currentTargetSplit.actionWater) && (
                    <div
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-mono shadow-md ${
                        currentTargetSplit.actionGel
                          ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                          : "bg-blue-950/40 border-blue-500/50 text-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {currentTargetSplit.actionGel ? (
                          <Zap className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />
                        ) : (
                          <Droplet className="h-5 w-5 text-blue-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold block">
                            {currentTargetSplit.actionGel
                              ? "⚡ ABASTECIMENTO: HORA DO CARBOGEL!"
                              : "💧 POSTO DE HIDRATAÇÃO NESTE QUILÔMETRO"}
                          </span>
                          <span className="text-[11px] text-gray-300 font-sans">
                            {currentTargetSplit.actionGel
                              ? "Consuma 1 sachê com 100ml de água mineral para absorção rápida."
                              : "Bocheche e beba pequenos goles para manter a temperatura do core estável."}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          audioCoach.speakCoachBriefing(
                            currentTargetSplit.actionGel
                              ? "Atenção: tome o carbogel com água agora para repor glicogênio!"
                              : "Posto de hidratação: beba água!"
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 shrink-0"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Ouvir</span>
                      </button>
                    </div>
                  )}

                  {/* Big Primary Action: Mark KM Completed */}
                  <div className="pt-2">
                    <button
                      onClick={handleMarkKmCompleted}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black text-sm sm:text-base transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 font-mono"
                    >
                      <Flag className="h-5 w-5 fill-black" />
                      <span>
                        🏁 MARCAR KM {currentLiveKm} CONCLUÍDO (PASSAGEM OFICIAL)
                      </span>
                    </button>
                    <p className="text-[10px] text-gray-400 text-center font-mono mt-1.5">
                      Toque ao cruzar cada placa de quilômetro na prova para calibrar o pace e o delta em tempo real.
                    </p>
                  </div>
                </div>

                {/* Completed Splits History Table */}
                {completedSplits.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-[#090D18] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Splits Registrados na Prova ({completedSplits.length} km):
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        Último Km: {completedSplits[completedSplits.length - 1].actualSplitStr}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono max-h-48 overflow-y-auto pr-1">
                      {completedSplits.map((s) => (
                        <div
                          key={s.km}
                          className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Km {s.km}</span>
                            <span className="text-gray-400">em</span>
                            <span className="font-bold text-cyan-300">{s.actualSplitStr}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-gray-400">Total: {s.cumulativeStr}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.deltaSec <= 0
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : "bg-amber-950 text-amber-300 border border-amber-800"
                              }`}
                            >
                              {s.deltaSec <= 0
                                ? `🟢 ${Math.abs(s.deltaSec)}s abaixo (Adiantado)`
                                : `🔴 +${s.deltaSec}s acima`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status 4: FINISHED (Victory & Trophy Celebration) */}
            {liveRaceStatus === "FINISHED" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-xl mx-auto my-auto animate-fadeIn">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 p-[2px] shadow-2xl shadow-yellow-500/40 animate-bounce">
                  <div className="h-full w-full bg-[#080B12] rounded-[22px] flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-amber-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                    👑 LINHA DE CHEGADA CRUZADA COM SUCESSO!
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Parabéns, {selectedProfile}!
                  </h3>
                  <p className="text-xs text-gray-300 font-mono">
                    Você completou a {currentPreset.name} ({currentPreset.distanceKm} km)!
                  </p>
                </div>

                {/* Final Official Metrics */}
                <div className="grid grid-cols-2 gap-3 w-full font-mono">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-gray-400 block uppercase">Tempo Oficial (Chip Time)</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">
                      {formatTimeHHMMSS(elapsedRaceSec)}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-gray-400 block uppercase">Pace Médio Real</span>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                      {(() => {
                        const secPerKm = Math.round(elapsedRaceSec / currentPreset.distanceKm);
                        const m = Math.floor(secPerKm / 60);
                        const s = secPerKm % 60;
                        return `${m}:${s < 10 ? "0" : ""}${s}`;
                      })()}{" "}
                      <span className="text-xs font-normal text-gray-400">/km</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 w-full">
                  <button
                    onClick={handleSaveRaceResultToSystem}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>SALVAR RESULTADO NO CALIBRADOR &amp; ATUALIZAR ZONAS 2027</span>
                  </button>

                  {onOpenTrophyCardGenerator && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTrophyCardGenerator();
                      }}
                      className="w-full py-3 px-5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all"
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>Gerar Trophy Card HD para Instagram &amp; WhatsApp</span>
                    </button>
                  )}

                  <button
                    onClick={handleResetRace}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono transition-all"
                  >
                    Reiniciar Cronômetro
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
