"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Sparkles,
  HeartPulse,
  CheckCircle2,
  Shield,
  Zap,
  RotateCcw,
} from "lucide-react";

interface PatriciaMorningCheckinProps {
  onUpdateReadiness?: (score: number) => void;
}

export function PatriciaMorningCheckin({ onUpdateReadiness }: PatriciaMorningCheckinProps) {
  const [sleepScore, setSleepScore] = useState<number>(4); // 1-5
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [muscleSoreness, setMuscleSoreness] = useState<"NONE" | "MILD" | "HEAVY">("MILD");
  const [energyLevel, setEnergyLevel] = useState<"HIGH" | "MODERATE" | "LOW">("HIGH");
  const [savedToday, setSavedToday] = useState<boolean>(false);
  const [computedScore, setComputedScore] = useState<number>(88);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`patricia_checkin_${todayStr}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSleepScore(parsed.sleepScore || 4);
          setSleepHours(parsed.sleepHours || 7.5);
          setMuscleSoreness(parsed.muscleSoreness || "MILD");
          setEnergyLevel(parsed.energyLevel || "HIGH");
          setComputedScore(parsed.computedScore || 88);
          setSavedToday(true);
        }
      } catch {}
    }
  }, [todayStr]);

  const calculateReadiness = () => {
    let base = 70;
    // Sleep factor (up to +15)
    base += (sleepScore - 3) * 5;
    // Hours factor
    if (sleepHours >= 7.5) base += 5;
    else if (sleepHours < 6) base -= 8;

    // Muscle soreness
    if (muscleSoreness === "NONE") base += 8;
    else if (muscleSoreness === "HEAVY") base -= 12;

    // Energy level
    if (energyLevel === "HIGH") base += 7;
    else if (energyLevel === "LOW") base -= 10;

    const bounded = Math.max(50, Math.min(98, base));
    return bounded;
  };

  const handleSave = () => {
    const score = calculateReadiness();
    setComputedScore(score);
    setSavedToday(true);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `patricia_checkin_${todayStr}`,
          JSON.stringify({
            sleepScore,
            sleepHours,
            muscleSoreness,
            energyLevel,
            computedScore: score,
            date: todayStr,
          })
        );
      } catch {}
    }

    if (onUpdateReadiness) {
      onUpdateReadiness(score);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1524] via-[#0E1A2C] to-[#0A0D15] border border-sky-500/30 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Sun className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-sky-400">
                CHECK-IN MATINAL DA PATRÍCIA
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                10 Segundos
              </span>
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide mt-0.5">
              Prontidão &amp; Zonas FC Sem Galaxy Watch
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-400">Score de Prontidão:</span>
          <span className="text-base font-black font-mono text-cyan-400 px-2.5 py-0.5 rounded-xl bg-[#07090E] border border-sky-500/40 shadow-inner">
            {computedScore}%
          </span>
        </div>
      </div>

      {/* 3 Micro-Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3.5 relative z-10 font-mono text-xs">
        {/* 1. Sono */}
        <div className="p-3 rounded-2xl bg-[#07090E]/80 border border-white/5 space-y-1.5 shadow-inner">
          <span className="text-[10px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Moon className="h-3 w-3 text-purple-400" />
            1. Sono da Noite
          </span>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-[11px]">Qualidade:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSleepScore(star)}
                  className={`text-sm transition-transform hover:scale-110 ${
                    sleepScore >= star ? "text-amber-400" : "text-gray-600"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-gray-300 text-[11px]">Horas:</span>
            <select
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="bg-[#111827] text-white text-[11px] rounded-lg px-2 py-0.5 border border-white/10"
            >
              <option value={6}>6h ou menos</option>
              <option value={7}>7.0 horas</option>
              <option value={7.5}>7.5 horas</option>
              <option value={8}>8.0 horas</option>
              <option value={9}>9.0h ou mais</option>
            </select>
          </div>
        </div>

        {/* 2. Fadiga Muscular */}
        <div className="p-3 rounded-2xl bg-[#07090E]/80 border border-white/5 space-y-1.5 shadow-inner">
          <span className="text-[10px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <HeartPulse className="h-3 w-3 text-red-400" />
            2. Pernas / Glúteos
          </span>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {[
              { id: "NONE", label: "Descansada" },
              { id: "MILD", label: "Leve Dor" },
              { id: "HEAVY", label: "Pesadas" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMuscleSoreness(opt.id as any)}
                className={`py-1.5 rounded-xl text-[10px] font-bold transition-all text-center ${
                  muscleSoreness === opt.id
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-[#111827] text-gray-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Disposição Geral */}
        <div className="p-3 rounded-2xl bg-[#07090E]/80 border border-white/5 space-y-1.5 shadow-inner">
          <span className="text-[10px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Zap className="h-3 w-3 text-amber-400" />
            3. Disposição
          </span>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {[
              { id: "HIGH", label: "100% Gás" },
              { id: "MODERATE", label: "Normal" },
              { id: "LOW", label: "Cansada" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEnergyLevel(opt.id as any)}
                className={`py-1.5 rounded-xl text-[10px] font-bold transition-all text-center ${
                  energyLevel === opt.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-[#111827] text-gray-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Directive & Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10 relative z-10 text-xs font-mono">
        <p className="text-[11px] text-sky-200">
          💡 Diretriz do Dia:{" "}
          <strong className="text-white">
            {computedScore >= 85
              ? "Prontidão excelente! Liberada para ritmo progressivo aos 9.2 km/h na esteira (10K foco)."
              : computedScore >= 70
              ? "Prontidão moderada. Foco estrito em Z2 lipolítica pura (8.8 km/h ou 6:45 min/km)."
              : "Fadiga acumulada. Reduza para 8.3 km/h ou corrida regenerativa leve a 7:15 min/km."}
          </strong>
        </p>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all flex items-center gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{savedToday ? "Check-in Atualizado!" : "Salvar Check-in"}</span>
        </button>
      </div>
    </div>
  );
}
