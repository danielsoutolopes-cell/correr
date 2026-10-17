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
} from "@/lib/physiology";

interface CoachTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  onTriggerTuyaScene: (scene: string) => void;
}

export function CoachTab({ currentProfile, onTriggerTuyaScene }: CoachTabProps) {
  const [weekendMode, setWeekendMode] = useState<WeekendLayoutMode>("CLASSIC_SUNDAY_LONG");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1); // Tuesday by default
  const [activeFicha, setActiveFicha] = useState<"A" | "B" | "C">("A");
  const [inputPace, setInputPace] = useState<string>("5:30");
  const [inputIncline, setInputIncline] = useState<number>(1.5);

  const isDaniel = currentProfile !== "PATRICIA";
  const weeklySchedule = buildWeeklyScheduleTemplate({
    weekendMode,
    hasShoulderRestriction: isDaniel,
  });

  const selectedDay = weeklySchedule[selectedDayIndex] || weeklySchedule[1];
  const strengthData = getStrengthFicha(activeFicha, isDaniel);
  const conversionResult = convertPaceToTreadmill(inputPace, inputIncline);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: Weekend Switcher & Weekly Rules */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111827] via-[#161F33] to-[#111827] border border-[#1F2937] p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-black text-white">
                O Treinador: Microciclo Semanal Híbrido
              </h2>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Seg/Sex OFF • Dias úteis max 60 min (Dual-Mode) • Fins de semana flexíveis no asfalto.
            </p>
          </div>

          {/* Weekend Layout Mode Toggle Button */}
          <div className="flex items-center gap-2 bg-[#090D16] p-1.5 rounded-xl border border-blue-500/30">
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
                    ? "border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/20"
                    : isRest
                    ? "border-gray-800 bg-[#090D16]/60 hover:border-gray-700"
                    : isLong
                    ? "border-amber-500/40 bg-amber-950/20 hover:border-amber-500/60"
                    : "border-gray-800 bg-[#111827] hover:border-gray-700"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
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

                <p className="text-xs font-bold text-white mt-1 truncate">{day.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {day.durationMin > 0 ? `${day.durationMin} min` : "Descompressão"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Prescription Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Selected Workout Details (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                {selectedDay.dayNamePt} • {selectedDay.modality}
              </span>
              <h3 className="text-base font-black text-white">{selectedDay.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 justify-end">
                <Clock className="h-3.5 w-3.5" />
                {selectedDay.durationMin > 0 ? `${selectedDay.durationMin} min total` : "OFF"}
              </span>
              <span className="text-[10px] text-gray-400">
                {selectedDay.isWeekday ? "Limite de dia útil respeitado" : "Final de semana"}
              </span>
            </div>
          </div>

          {/* If Day is REST */}
          {selectedDay.modality === "REST" && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
              <p className="text-xs font-bold text-purple-300">
                Protocolo de Reset do Dia OFF (Neuro-Descompressão)
              </p>
              <p className="text-xs text-gray-300">
                Dias de descanso (Segunda e Sexta) são sagrados para supercompensação
                neuromuscular, reparo do tecido conjuntivo e drenagem de cortisol.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onTriggerTuyaScene("PARASYMPATHETIC_NIGHT")}
                  className="px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 text-xs font-bold"
                >
                  Acionar Modo Luz Âmbar Noturno
                </button>
              </div>
            </div>
          )}

          {/* Outdoor Running Prescription */}
          {selectedDay.runPrescriptionOutdoor && (
            <div className="p-4 rounded-xl bg-[#090D16] border border-blue-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Compass className="h-4 w-4" />
                  Prescrição de Rua (GPS / Pace)
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
                  <span className="text-gray-400 block text-[10px]">Zonas FC:</span>
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
                  Visualizador de Programa de Esteira (Km/h &amp; % Inclinação)
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
                  Prescrição Ciclismo / Pedal em Família
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
          {/* IronLog A/B/C with Shoulder Adaptations */}
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">IronLog: Musculação</h3>
              </div>

              {/* Ficha Selector A/B/C */}
              <div className="flex bg-[#090D16] p-1 rounded-lg border border-gray-800">
                {(["A", "B", "C"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFicha(f)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      activeFicha === f
                        ? "bg-orange-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Ficha {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Shoulder Warning Banner if Daniel */}
            {isDaniel && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-[11px] text-red-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span>
                  <strong>Prótese Reversa no Ombro:</strong> Exercícios overhead bloqueados e
                  substituídos por variantes neutras no plano escapular.
                </span>
              </div>
            )}

            <div className="text-xs font-semibold text-gray-300">
              {strengthData.focus}
            </div>

            {/* Exercise List */}
            <div className="space-y-2">
              {strengthData.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-[#090D16] border border-gray-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{ex.name}</span>
                    <span className="text-[11px] font-semibold text-orange-400">
                      {ex.sets}x {ex.reps} (RPE {ex.rpe})
                    </span>
                  </div>

                  {ex.substituteFor && (
                    <span className="text-[10px] text-red-400 block">
                      Substitui com segurança: {ex.substituteFor}
                    </span>
                  )}

                  {ex.instructions && (
                    <p className="text-[11px] text-gray-400">{ex.instructions}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Pace to Treadmill Converter */}
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Calculadora de Esteira (Costill Formula)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Pace Outdoor (min/km)
                </label>
                <input
                  type="text"
                  value={inputPace}
                  onChange={(e) => setInputPace(e.target.value)}
                  placeholder="5:30"
                  className="w-full bg-[#090D16] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Inclinação da Esteira (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={inputIncline}
                  onChange={(e) => setInputIncline(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-[#090D16] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-cyan-800/40 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Velocidade exata na esteira:</span>
                <span className="text-base font-extrabold text-cyan-400">
                  {conversionResult.speedKmh} km/h
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400">Custo metabólico VO2 equivalente:</span>
                <span className="text-white font-bold">{conversionResult.vo2CostKmh} km/h plano</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Inclinação de 1.0% a 1.5% neutraliza a ausência de resistência do vento indoor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
