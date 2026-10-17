"use client";

import React, { useState } from "react";
import {
  Calendar,
  Compass,
  Zap,
  Dumbbell,
  Bike,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Sliders,
  ChevronDown,
  Info,
  Trophy,
  Flame,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import {
  WeekendLayoutMode,
  StrengthPrescription,
  RunPrescriptionTreadmill,
} from "@/lib/types";
import {
  buildWeeklyScheduleTemplate,
  getStrengthFicha,
  convertPaceToTreadmill,
  getProfileSpecs,
} from "@/lib/physiology";
import { ActiveWorkoutModal } from "@/components/ActiveWorkoutModal";

interface CoachTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  onTriggerTuyaScene: (scene: string) => void;
}

export function CoachTab({ currentProfile, onTriggerTuyaScene }: CoachTabProps) {
  const [weekendMode, setWeekendMode] = useState<WeekendLayoutMode>("CLASSIC_SUNDAY_LONG");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1); // Tuesday by default
  const [activeFicha, setActiveFicha] = useState<"A" | "B" | "C">("A");
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState<boolean>(false);

  const isDaniel = currentProfile !== "PATRICIA";
  const spec = getProfileSpecs(currentProfile);
  const danielSpec = getProfileSpecs("DANIEL");
  const patriciaSpec = getProfileSpecs("PATRICIA");

  const [inputPace, setInputPace] = useState<string>(isDaniel ? "5:50" : "6:30");
  const [inputIncline, setInputIncline] = useState<number>(1.0);

  const weeklySchedule = buildWeeklyScheduleTemplate({
    weekendMode,
    hasShoulderRestriction: isDaniel,
    profile: currentProfile,
  });

  const selectedDay = weeklySchedule[selectedDayIndex] || weeklySchedule[1];
  const strengthData = getStrengthFicha(activeFicha, currentProfile);
  const conversionResult = convertPaceToTreadmill(inputPace, inputIncline);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Haute Couture Athlete Identification Banner */}
      <div
        className={`rounded-3xl border p-6 shadow-2xl relative overflow-hidden transition-all ${
          !isDaniel
            ? "bg-gradient-to-br from-[#07111F] via-[#0C1B33] to-[#070D18] border-sky-500/30"
            : "bg-gradient-to-br from-[#1A0A0E] via-[#220D12] to-[#0D0709] border-red-500/30"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border flex items-center gap-1.5 ${
                  !isDaniel
                    ? "bg-sky-950/80 text-sky-300 border-sky-500/40"
                    : "bg-red-950/80 text-red-300 border-red-500/40"
                }`}
              >
                {!isDaniel ? <Shield className="h-3.5 w-3.5 text-sky-400" /> : <Flame className="h-3.5 w-3.5 text-red-400" />}
                {spec.clubBadge}
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono">
                {spec.weightKg} kg • {spec.heightCm} cm
              </span>

              {isDaniel && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-800 text-red-300 font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                  Prótese Reversa (Ombro Seguro)
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Prescrição de Alta Performance: <span className={!isDaniel ? "text-sky-400" : "text-red-400"}>{spec.name}</span>
            </h1>
            <p className="text-xs text-gray-300 max-w-2xl">
              {spec.tagline} • Meta Principal: <strong className="text-white">{spec.primaryRace.name}</strong> ({spec.primaryRace.targetFinish} | Pace {spec.primaryRace.targetPace})
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsActiveWorkoutOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 font-mono"
            >
              <Dumbbell className="h-3.5 w-3.5 text-white animate-pulse" />
              <span>Iniciar Treino na Academia</span>
            </button>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md backdrop-blur-md"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-amber-400" />
              <span>{showComparison ? "Ocultar Comparativo" : "Duelo Tático: Daniel vs Patrícia"}</span>
            </button>
          </div>
        </div>

        {/* Tactical Comparison Drawer (Daniel vs Patrícia) */}
        {showComparison && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-black tracking-widest uppercase text-white font-mono">
                MATRIZ INDIVIDUALIZADA DO CASAL (ZERO-MOCK)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daniel Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-red-500/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-red-500" />
                    Daniel Souto Lopes (80kg)
                  </span>
                  <span className="font-mono text-gray-300">Flamengo 🔴⚫</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-gray-400">Pace Z2:</span> <strong className="text-white">5:50 - 6:20 /km</strong></div>
                  <div><span className="text-gray-400">Esteira Z2:</span> <strong className="text-white">9.7 - 10.3 km/h</strong></div>
                  <div><span className="text-gray-400">Prova P1:</span> <strong className="text-white">SP 21k (Sub-1h55)</strong></div>
                  <div><span className="text-gray-400">Panela TACO:</span> <strong className="text-amber-400">58% do Prato</strong></div>
                  <div><span className="text-gray-400">Hardware:</span> <strong className="text-white">Galaxy Watch Ultra</strong></div>
                  <div><span className="text-gray-400">Biomecânica:</span> <strong className="text-red-300">Prótese Reversa Ombro D</strong></div>
                </div>
              </div>

              {/* Patrícia Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-extrabold text-sky-400 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-sky-400" />
                    Patrícia Lopes (58kg)
                  </span>
                  <span className="font-mono text-gray-300">Grêmio 🔵⚪⚫</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-gray-400">Pace Z2:</span> <strong className="text-white">6:30 - 7:15 /km</strong></div>
                  <div><span className="text-gray-400">Esteira Z2:</span> <strong className="text-white">8.3 - 9.2 km/h</strong></div>
                  <div><span className="text-gray-400">Prova P1:</span> <strong className="text-white">Estações 10k (Sub-60m)</strong></div>
                  <div><span className="text-gray-400">Panela TACO:</span> <strong className="text-amber-400">42% do Prato</strong></div>
                  <div><span className="text-gray-400">Hardware:</span> <strong className="text-white">Smartwatch Patrícia (Strava Pro)</strong></div>
                  <div><span className="text-gray-400">Biomecânica:</span> <strong className="text-sky-300">Glúteos, Pelve &amp; Postura</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Banner: Weekend Switcher & Weekly Rules */}
      <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h2 className="text-base font-black text-white">
                Microciclo Semanal Híbrido: {spec.name}
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Seg/Sex OFF • Dias úteis max 60 min (Dual-Mode) • Fins de semana flexíveis no asfalto.
            </p>
          </div>

          {/* Weekend Layout Mode Toggle Button */}
          <div className="flex items-center gap-2 bg-[#090D16] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setWeekendMode("CLASSIC_SUNDAY_LONG")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                weekendMode === "CLASSIC_SUNDAY_LONG"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Modo Clássico (Longão Domingo)</span>
            </button>

            <button
              onClick={() => setWeekendMode("SATURDAY_LONG_SUNDAY_FAMILY_BIKE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Bike className="h-3.5 w-3.5" />
              <span>Modo Família (Longão Sáb + Pedal Dom)</span>
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-5">
          {weeklySchedule.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const isRest = day.modality === "REST";
            const isLong = day.title.includes("LONGÃO");

            return (
              <button
                key={day.dayOfWeek}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? isDaniel
                      ? "border-red-500 bg-red-950/40 shadow-lg shadow-red-500/20"
                      : "border-sky-500 bg-sky-950/40 shadow-lg shadow-sky-500/20"
                    : isRest
                    ? "border-gray-800 bg-[#090D16]/60 hover:border-gray-700"
                    : isLong
                    ? "border-amber-500/40 bg-amber-950/20 hover:border-amber-500/60"
                    : "border-gray-800 bg-[#111827] hover:border-gray-700"
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${
                      isDaniel ? "bg-red-500" : "bg-sky-500"
                    }`}
                  ></div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400">
                    {day.dayNamePt.split("-")[0]}
                  </span>
                  {isRest ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-bold">
                      OFF
                    </span>
                  ) : isLong ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold">
                      LONGÃO
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 font-bold">
                      &lt;= 60m
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-white mt-1.5 truncate">{day.title}</p>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  {day.durationMin > 0 ? `${day.durationMin} min` : "Descanso Total"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Workout Blueprint (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Day Detail & Cardio Prescriptions (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Sessão do Dia: {selectedDay.dayNamePt} ({spec.name})
              </span>
              <h3 className="text-base font-black text-white">{selectedDay.title}</h3>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800 font-semibold">
              Duração: {selectedDay.durationMin} min
            </span>
          </div>

          {/* Outdoor Street Run Prescription */}
          {selectedDay.runPrescriptionOutdoor && (
            <div className="p-4 rounded-xl bg-[#090D16] border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Compass className="h-4 w-4" />
                  Prescrição de Rua (GPS / Pace de {spec.name})
                </span>
                <span className="text-xs font-black text-white">
                  {selectedDay.runPrescriptionOutdoor.totalDistanceKm} km
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#111827] p-2 rounded-lg">
                  <span className="text-gray-400 block text-[10px]">Pace Alvo:</span>
                  <span className="font-bold text-white">
                    {selectedDay.runPrescriptionOutdoor.targetPaceMinKm} min/km
                  </span>
                </div>
                <div className="bg-[#111827] p-2 rounded-lg">
                  <span className="text-gray-400 block text-[10px]">Zonas FC Alvo:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedDay.runPrescriptionOutdoor.targetZones.join(", ")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-300">
                {selectedDay.runPrescriptionOutdoor.mainSetDescription}
              </p>
            </div>
          )}

          {/* Treadmill Prescription with Blocks */}
          {selectedDay.runPrescriptionTreadmill && (
            <div className="p-4 rounded-xl bg-[#090D16] border border-cyan-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  Programa de Esteira para {spec.name} (Km/h &amp; % Inclinação)
                </span>
                <span className="text-xs font-black text-cyan-300">
                  {selectedDay.runPrescriptionTreadmill.totalDurationMin} min
                </span>
              </div>

              {/* Step by step treadmill blocks */}
              <div className="space-y-1.5">
                {selectedDay.runPrescriptionTreadmill.steps.map((step) => (
                  <div
                    key={step.stepIndex}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#111827] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded bg-cyan-950 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                        {step.stepIndex}
                      </span>
                      <span className="font-semibold text-gray-200">{step.title}</span>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-gray-400">{step.durationMin} min</span>
                      <span className="font-bold text-white">{step.speedKmh} km/h</span>
                      <span className="font-bold text-cyan-300">{step.inclinePct}% inc</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">
                        {step.targetHrZone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bike Prescription */}
          {selectedDay.bikePrescription && (
            <div className="p-4 rounded-xl bg-[#090D16] border border-amber-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Bike className="h-4 w-4" />
                  Prescrição Ciclismo / Pedal em Família (Daniel &amp; Patrícia)
                </span>
                <span className="text-xs font-black text-white">
                  {selectedDay.bikePrescription.durationMin} min
                </span>
              </div>
              <p className="text-xs text-gray-300">{selectedDay.bikePrescription.notes}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>Cadência: {selectedDay.bikePrescription.targetCadenceRpm} rpm</span>
                <span>Zona: {selectedDay.bikePrescription.targetHrZone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: IronLog A/B/C & Treadmill Converter (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* IronLog A/B/C with Profile Customization */}
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">
                  IronLog: Musculação ({spec.name})
                </h3>
              </div>

              {/* Ficha Selector A/B/C */}
              <div className="flex bg-[#090D16] p-1 rounded-lg border border-gray-800">
                {(["A", "B", "C"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFicha(f)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeFicha === f
                        ? "bg-orange-600 text-white shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Ficha {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-gray-800 space-y-1">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                Foco Principal
              </span>
              <p className="text-xs font-bold text-white">{strengthData.focus}</p>
            </div>

            {/* Exercise List */}
            <div className="space-y-2">
              {strengthData.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#090D16] border border-gray-800/80 hover:border-gray-700 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ex.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">
                      {ex.sets}x {ex.reps}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{ex.targetMuscle}</span>
                    <span>RPE: {ex.rpe}/10</span>
                  </div>
                  {ex.instructions && (
                    <p className="text-[10px] text-gray-400 italic pt-1 border-t border-gray-800/60">
                      💡 {ex.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Physiological Costill Pace-to-Treadmill Converter */}
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Calculadora Fisiológica de Esteira (Costill)
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Calcule a velocidade exata (km/h) na esteira mantendo o custo metabólico do asfalto para {spec.name}.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Pace no Asfalto (min/km)
                </label>
                <input
                  type="text"
                  value={inputPace}
                  onChange={(e) => setInputPace(e.target.value)}
                  placeholder="5:30"
                  className="w-full bg-[#090D16] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Inclinação na Esteira (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inputIncline}
                  onChange={(e) => setInputIncline(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-[#090D16] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-cyan-500/30 flex items-center justify-between text-xs mt-2">
              <span className="text-gray-300">Velocidade Prescrita:</span>
              <span className="text-base font-black text-cyan-400 font-mono">
                {conversionResult.speedKmh} km/h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Workout Modal */}
      <ActiveWorkoutModal
        isOpen={isActiveWorkoutOpen}
        onClose={() => setIsActiveWorkoutOpen(false)}
        currentProfile={currentProfile}
        initialFicha={activeFicha}
      />
    </div>
  );
}
