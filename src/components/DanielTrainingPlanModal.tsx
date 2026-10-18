"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Compass,
  Zap,
  TrendingUp,
  Award,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Gauge,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  DANIEL_TRAINING_PLAN,
  DanielTrainingWeek,
  DayOfWeek,
  getDanielPlanWeekByDate,
} from "@/lib/daniel-training-plan";

interface DanielTrainingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAY_ORDER: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "MONDAY", label: "Segunda-feira", short: "Seg" },
  { key: "TUESDAY", label: "Terça-feira", short: "Ter" },
  { key: "WEDNESDAY", label: "Quarta-feira", short: "Qua" },
  { key: "THURSDAY", label: "Quinta-feira", short: "Qui" },
  { key: "FRIDAY", label: "Sexta-feira", short: "Sex" },
  { key: "SATURDAY", label: "Sábado", short: "Sáb" },
  { key: "SUNDAY", label: "Domingo", short: "Dom" },
];

export function DanielTrainingPlanModal({
  isOpen,
  onClose,
}: DanielTrainingPlanModalProps) {
  const [selectedPhase, setSelectedPhase] = useState<"FASE_1" | "FASE_2">("FASE_1");
  const [viewMode, setViewMode] = useState<"RUA" | "ESTEIRA">("RUA");
  const [selectedWeekId, setSelectedWeekId] = useState<string>("f1-sem-01");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const phaseWeeks = DANIEL_TRAINING_PLAN.filter((w) => w.phase === selectedPhase);
  const currentWeek =
    phaseWeeks.find((w) => w.id === selectedWeekId) || phaseWeeks[0];

  const handlePhaseChange = (phase: "FASE_1" | "FASE_2") => {
    setSelectedPhase(phase);
    const firstOfPhase = DANIEL_TRAINING_PLAN.find((w) => w.phase === phase);
    if (firstOfPhase) {
      setSelectedWeekId(firstOfPhase.id);
    }
  };

  const handleCopyWeekPlan = () => {
    const lines = [
      `🏃 *BIO-TRIAD OS • PLANILHA OFICIAL DANIEL*`,
      `📅 *${currentWeek.weekLabel} (${currentWeek.period})* - Volume: ${currentWeek.totalVolumeKm} km`,
      `🎯 *Foco:* ${currentWeek.targetGoal}`,
      `📌 *Modo:* ${viewMode === "RUA" ? "👟 Versão Rua (Paces & Asfalto)" : "🏃 Versão Esteira (Km/h & Inclinação)"}`,
      "",
    ];

    DAY_ORDER.forEach(({ key, label }) => {
      const d = currentWeek.days[key];
      if (viewMode === "RUA") {
        lines.push(`*${label}:* ${d.street.description}`);
      } else {
        if (d.treadmill.isOff) {
          lines.push(`*${label}:* OFF`);
        } else {
          lines.push(
            `*${label} [${d.treadmill.sessionType}]:* ${d.treadmill.mainSet} (${d.treadmill.estimatedDurationMin} min • ${d.treadmill.estimatedDistanceKm} km)`
          );
        }
      }
    });

    lines.push("\n_Planejado no Bio-Triad OS • Clã Lopes_");

    navigator.clipboard.writeText(lines.join("\n"));
    setCopyFeedback("✅ Semana copiada para a área de transferência!");
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0B0F17] border border-red-500/30 shadow-[0_20px_70px_rgba(239,68,68,0.25)] text-gray-100 overflow-hidden font-sans">
        
        {/* Glow Ambient Highlights */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-gradient-to-r from-red-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-32 bg-red-600/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0E1422]/95 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/25">
              <div className="h-full w-full bg-[#0B0F17] rounded-2xl flex items-center justify-center">
                <Flame className="h-6 w-6 text-red-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-mono uppercase">
                  Planilha Oficial de Treinos Futuros • Daniel
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-300">
                  23 SEMANAS COMPLETAS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-2 mt-0.5">
                <span className="text-red-400 font-bold">Daniel Souto Lopes</span>
                <span>•</span>
                <span>Fase 1 (Olga Kos 9k) + Fase 2 (Meia de SP Sub-2h)</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Dual-Mode: Rua & Esteira</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWeekPlan}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 transition-all"
              title="Copiar programação da semana para WhatsApp"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Copiar Semana</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Copy Toast Feedback */}
        {copyFeedback && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-4 py-2 text-xs font-mono font-bold text-center animate-in slide-in-from-top-2">
            {copyFeedback}
          </div>
        )}

        {/* Phase Selector & Rua/Esteira Toggle Bar */}
        <div className="p-4 bg-[#090D15] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Phase Switcher Tabs */}
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => handlePhaseChange("FASE_1")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedPhase === "FASE_1"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Award className="h-4 w-4 text-amber-300" />
              <span>FASE 1: Olga Kos 9K (7 Semanas • 19/10 a 06/12)</span>
            </button>

            <button
              onClick={() => handlePhaseChange("FASE_2")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedPhase === "FASE_2"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Trophy className="h-4 w-4 text-amber-300" />
              <span>FASE 2: Meia de SP 21.1K Sub-2h (16 Semanas • 14/12 a 04/04)</span>
            </button>
          </div>

          {/* Dual-Mode Selector: Rua vs Esteira */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold">Modo:</span>
            <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setViewMode("RUA")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  viewMode === "RUA"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>👟 Versão Rua (Paces & Asfalto)</span>
              </button>

              <button
                onClick={() => setViewMode("ESTEIRA")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  viewMode === "ESTEIRA"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>🏃 Versão Esteira (Km/h & Tempos)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Week Navigator Carousel */}
        <div className="px-4 py-3 bg-[#080B12] border-b border-white/5 overflow-x-auto scrollbar-thin flex items-center gap-2">
          {phaseWeeks.map((week) => {
            const isSelected = week.id === currentWeek.id;
            return (
              <button
                key={week.id}
                onClick={() => setSelectedWeekId(week.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-red-950/60 border-red-500 text-white shadow-md shadow-red-600/20"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    Sem. {week.weekNumber < 10 ? `0${week.weekNumber}` : week.weekNumber}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-bold">
                    {week.totalVolumeKm} km
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                  {week.period}
                </div>
                {week.isRaceWeek && (
                  <span className="text-[9px] font-mono font-black text-amber-400 block mt-0.5">
                    🏆 PROVA OFICIAL
                  </span>
                )}
                {week.isDeload && !week.isRaceWeek && (
                  <span className="text-[9px] font-mono text-cyan-400 block mt-0.5">
                    🔄 DELOAD
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Week Context Banner */}
        <div className="p-4 bg-[#0F1424] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[11px]">
                {currentWeek.weekLabel}
              </span>
              <span className="text-gray-400">({currentWeek.period})</span>
              <span className="text-gray-500">•</span>
              <span className="text-amber-300 font-bold">
                Volume Semanal: {currentWeek.totalVolumeKm} km
              </span>
            </div>
            <p className="text-gray-300 text-[11px]">
              🎯 <strong>Foco:</strong> {currentWeek.targetGoal}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-gray-400">Visualizando:</span>
            <span
              className={`px-2.5 py-1 rounded-lg font-bold ${
                viewMode === "RUA"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              }`}
            >
              {viewMode === "RUA" ? "👟 Rua (Asfalto)" : "🏃 Esteira & Bike"}
            </span>
          </div>
        </div>

        {/* Day-by-Day Workout Grid (7 Days) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {DAY_ORDER.map(({ key, label, short }) => {
              const day = currentWeek.days[key];
              const isOff = day.modality === "REST" || day.street.isOff;
              const isRace = day.modality === "RACE" || day.street.isRace;
              const isBike = day.modality === "BIKE";

              return (
                <div
                  key={key}
                  className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all ${
                    isRace
                      ? "bg-gradient-to-b from-amber-950/40 to-black/80 border-amber-500/60 shadow-lg shadow-amber-500/20"
                      : isOff
                      ? "bg-[#090C14]/80 border-white/5 opacity-80"
                      : isBike
                      ? "bg-[#0D1522] border-cyan-500/30"
                      : "bg-[#111625] border-white/10 hover:border-red-500/40"
                  }`}
                >
                  {/* Card Header: Day Name & Badge */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        {short}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          isRace
                            ? "bg-amber-500 text-black font-black"
                            : isOff
                            ? "bg-gray-800 text-gray-400"
                            : isBike
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : "bg-red-950 text-red-300 border border-red-800"
                        }`}
                      >
                        {isRace ? "PROVA" : isOff ? "OFF" : isBike ? "BIKE" : "CORRIDA"}
                      </span>
                    </div>

                    {/* Content Section: Switch based on ViewMode */}
                    <div className="mt-2.5 space-y-2">
                      {viewMode === "RUA" ? (
                        // RUA MODE
                        <div className="space-y-1.5 font-mono">
                          <p className={`text-xs ${isOff ? "text-gray-500 italic" : "text-gray-200 font-semibold leading-snug"}`}>
                            {day.street.description}
                          </p>
                          {day.street.targetPace && (
                            <div className="pt-1 flex items-center justify-between text-[11px] text-amber-300">
                              <span className="text-gray-400 text-[10px]">Pace:</span>
                              <span className="font-bold">{day.street.targetPace}</span>
                            </div>
                          )}
                          {day.street.distanceKm !== undefined && day.street.distanceKm > 0 && (
                            <div className="flex items-center justify-between text-[11px] text-gray-300">
                              <span className="text-gray-400 text-[10px]">Distância:</span>
                              <span className="font-bold">{day.street.distanceKm} km</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        // ESTEIRA MODE
                        <div className="space-y-2 font-mono text-xs">
                          {isOff ? (
                            <p className="text-gray-500 italic text-[11px]">Descanso passivo</p>
                          ) : (
                            <>
                              <div className="text-[11px] text-cyan-300 font-bold border-b border-white/5 pb-1">
                                {day.treadmill.sessionType}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                <strong>Prog:</strong> {day.treadmill.program}
                              </div>
                              <div className="text-[10px] text-gray-300">
                                <strong>AQ:</strong> {day.treadmill.warmup}
                              </div>
                              <div className="text-[11px] text-white bg-black/40 p-2 rounded-xl border border-white/5 leading-snug">
                                <span className="text-amber-400 text-[10px] block font-bold">BLOCO:</span>
                                {day.treadmill.mainSet}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                <strong>Desaq:</strong> {day.treadmill.cooldown}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Estimated Duration / Distance */}
                  {!isOff && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-400" />
                        {day.treadmill.estimatedDurationMin > 0
                          ? `${day.treadmill.estimatedDurationMin} min`
                          : "30-50 min"}
                      </span>
                      {day.treadmill.estimatedDistanceKm > 0 && (
                        <span className="text-white font-bold">
                          {day.treadmill.estimatedDistanceKm} km
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0E1422] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-gray-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Planilha Oficial Integrada: 7 semanas (Olga Kos) + 16 semanas (Sub-2h Meia de SP).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWeekPlan}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Exportar Semana</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black transition-all shadow-lg shadow-red-600/30"
            >
              FECHAR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
