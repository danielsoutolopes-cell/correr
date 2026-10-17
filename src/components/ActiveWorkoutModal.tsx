"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Shield,
  AlertTriangle,
  Award,
  ChevronRight,
  Plus,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { getStrengthFicha, getProfileSpecs } from "@/lib/physiology";
import { StrengthExercise } from "@/lib/types";

import { ProfileId } from "@/lib/types";

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileId;
  initialFicha?: "A" | "B" | "C";
}

export function ActiveWorkoutModal({
  isOpen,
  onClose,
  currentProfile,
  initialFicha = "A",
}: ActiveWorkoutModalProps) {
  const isDaniel = currentProfile !== "PATRICIA";
  const spec = getProfileSpecs(currentProfile);

  const [activeFicha, setActiveFicha] = useState<"A" | "B" | "C">(initialFicha);
  const fichaData = getStrengthFicha(activeFicha, currentProfile);

  // Completed sets tracker: key is `${exerciseIndex}-${setIndex}`
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  // Exercise weights: key is exercise name
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, string>>({});

  // Rest Timer State
  const [restDurationSec, setRestDurationSec] = useState<number>(60);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Load weights from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`bio_triad_weights_${currentProfile}_${activeFicha}`);
        if (stored) {
          setExerciseWeights(JSON.parse(stored));
        } else {
          setExerciseWeights({});
        }
      } catch {}
      setCompletedSets({});
      setTimeLeftSec(0);
      setIsTimerRunning(false);
    }
  }, [currentProfile, activeFicha]);

  // Web Audio chime function
  const playChime = () => {
    if (audioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSec]);

  const handleToggleSet = (exIndex: number, setIndex: number) => {
    const key = `${exIndex}-${setIndex}`;
    const nextState = !completedSets[key];

    setCompletedSets((prev) => ({
      ...prev,
      [key]: nextState,
    }));

    // If set was completed, trigger rest timer
    if (nextState) {
      setTimeLeftSec(restDurationSec);
      setIsTimerRunning(true);
    }
  };

  const handleWeightChange = (exName: string, val: string) => {
    const updated = { ...exerciseWeights, [exName]: val };
    setExerciseWeights(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `bio_triad_weights_${currentProfile}_${activeFicha}`,
          JSON.stringify(updated)
        );
      } catch {}
    }
  };

  // Total sets calculation
  const totalSets = fichaData.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const doneSetsCount = Object.values(completedSets).filter(Boolean).length;
  const progressPct = totalSets > 0 ? Math.round((doneSetsCount / totalSets) * 100) : 0;

  // Trigger celebration confetti when workout 100% finished
  useEffect(() => {
    if (totalSets > 0 && doneSetsCount === totalSets) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: isDaniel ? ["#EF4444", "#DC2626", "#F59E0B"] : ["#0EA5E9", "#38BDF8", "#F59E0B"],
      });
    }
  }, [doneSetsCount, totalSets, isDaniel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#0F1422] via-[#090D16] to-[#06080E] border border-white/10 rounded-3xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Header Strip */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0A0E18]/80">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-2xl flex items-center justify-center text-lg border shadow-lg ${
                isDaniel
                  ? "bg-red-950/60 border-red-500/40 text-red-400"
                  : "bg-sky-950/60 border-sky-500/40 text-sky-400"
              }`}
            >
              {isDaniel ? "🔴⚫" : "🔵⚪"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400">
                  MODO TREINO ATIVO • ACADEMIA
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isDaniel
                      ? "bg-red-950/80 text-red-300 border-red-800"
                      : "bg-sky-950/80 text-sky-300 border-sky-800"
                  }`}
                >
                  {spec.name.split(" ")[0]} ({spec.clubBadge})
                </span>
              </div>
              <h2 className="text-base font-black text-white tracking-wide mt-0.5">
                Ficha {activeFicha}: {fichaData.focus}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
              title={audioMuted ? "Desmutar bip" : "Mutar bip"}
            >
              {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
              title="Fechar Treino"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Ficha Switcher & Progress Bar */}
        <div className="p-4 border-b border-white/5 bg-[#07090E]/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-[#0C101A] p-1 rounded-2xl border border-white/10 font-mono text-xs">
              {(["A", "B", "C"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFicha(f)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeFicha === f
                      ? isDaniel
                        ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30"
                        : "bg-gradient-to-r from-sky-600 to-cyan-700 text-white shadow-md shadow-sky-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Ficha {f}
                </button>
              ))}
            </div>

            {/* Safety badge */}
            {isDaniel ? (
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-red-950/60 text-red-300 border border-red-800 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                Trava Prótese: Zero Overhead • Supino 45° Neutro
              </span>
            ) : (
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-sky-950/60 text-sky-300 border border-sky-800 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-sky-400" />
                Ombros Livres • Foco Glúteos &amp; Joelho Alinhado
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Progresso da Sessão: {doneSetsCount} de {totalSets} séries</span>
              <span className="text-emerald-400 font-bold">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isDaniel ? "bg-gradient-to-r from-red-500 to-amber-500" : "bg-gradient-to-r from-sky-500 to-emerald-400"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Rest Timer Widget (Floating when running) */}
        {timeLeftSec > 0 && (
          <div className="p-3.5 mx-4 mt-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-emerald-950/80 border border-emerald-500/50 shadow-xl flex items-center justify-between text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full border-2 border-emerald-400 flex items-center justify-center font-black text-white text-sm animate-pulse">
                {timeLeftSec}s
              </div>
              <div>
                <span className="font-bold text-emerald-300 block">Descanso em Andamento</span>
                <span className="text-[10px] text-gray-400">Recuperação de ATP/CP antes da próxima série</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeLeftSec((prev) => prev + 15)}
                className="px-2 py-1 rounded-lg bg-emerald-800/40 hover:bg-emerald-800/70 border border-emerald-500/30 text-emerald-300 text-[11px]"
              >
                +15s
              </button>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px]"
              >
                {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => {
                  setTimeLeftSec(0);
                  setIsTimerRunning(false);
                }}
                className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-[11px]"
              >
                Pular
              </button>
            </div>
          </div>
        )}

        {/* Exercises Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {fichaData.exercises.map((ex, exIndex) => {
            const currentWeight = exerciseWeights[ex.name] || "";

            return (
              <div
                key={ex.name}
                className="p-4 rounded-2xl bg-[#07090E] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-inner"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                        Ex {exIndex + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-wide">{ex.name}</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Foco: <span className="text-gray-300 font-semibold">{ex.targetMuscle}</span> • RPE Alvo: <span className="text-amber-400 font-bold">{ex.rpe}/10</span>
                    </p>
                  </div>

                  {/* Weight Input Box */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto font-mono text-xs">
                    <span className="text-gray-400 text-[11px]">Carga:</span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ex: 22"
                        value={currentWeight}
                        onChange={(e) => handleWeightChange(ex.name, e.target.value)}
                        className="w-20 bg-[#111827] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 text-right pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-[10px] text-gray-500">kg</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-[11px] text-gray-400 italic bg-[#111827]/40 p-2 rounded-xl border border-white/5">
                  💡 {ex.instructions}
                </p>

                {/* Interactive Sets Checklist */}
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-white/5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase mr-1">
                    Séries ({ex.reps} reps):
                  </span>
                  {Array.from({ length: ex.sets }).map((_, sIndex) => {
                    const isDone = completedSets[`${exIndex}-${sIndex}`];
                    return (
                      <button
                        key={sIndex}
                        onClick={() => handleToggleSet(exIndex, sIndex)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          isDone
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400"
                            : "bg-[#111827] text-gray-300 border border-white/10 hover:border-emerald-500/50"
                        }`}
                      >
                        <CheckCircle2 className={`h-3.5 w-3.5 ${isDone ? "text-white" : "text-gray-500"}`} />
                        <span>Série {sIndex + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with rest settings & completion */}
        <div className="p-4 border-t border-white/10 bg-[#0A0E18]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span className="text-gray-400">Descanso Automático:</span>
            <div className="flex items-center gap-1">
              {[45, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRestDurationSec(sec)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    restDurationSec === sec
                      ? "bg-emerald-600 text-white"
                      : "bg-[#111827] text-gray-400 hover:text-white"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
          >
            {doneSetsCount === totalSets ? "🎉 Treino Concluído • Fechar" : "Pausar / Salvar Sessão"}
          </button>
        </div>
      </div>
    </div>
  );
}
