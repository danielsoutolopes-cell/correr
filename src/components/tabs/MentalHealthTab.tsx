"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Moon,
  Flame,
  Coffee,
  HeartPulse,
  Send,
  CheckCircle2,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { getProfileSpecs } from "@/lib/physiology";

interface MentalHealthTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  onTriggerTuyaScene: (scene: string) => void;
}

export function MentalHealthTab({ currentProfile, onTriggerTuyaScene }: MentalHealthTabProps) {
  const isDaniel = currentProfile !== "PATRICIA";
  const specs = getProfileSpecs(currentProfile);

  const [activeStation, setActiveStation] = useState<
    "AIRLOCK_1830" | "THERMAL_BRAKE_2030" | "POST_GAME" | "OFF_DAY_RESET" | "SOS_BREATHING"
  >("AIRLOCK_1830");

  const [brainDumpText, setBrainDumpText] = useState<string>("");
  const [brainDumpSaved, setBrainDumpSaved] = useState<boolean>(false);

  // SOS 4-7-8 Breathing Timer State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<"INHALE" | "HOLD" | "EXHALE">("INHALE");
  const [breathCount, setBreathCount] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            if (breathPhase === "INHALE") {
              setBreathPhase("HOLD");
              return 7;
            } else if (breathPhase === "HOLD") {
              setBreathPhase("EXHALE");
              return 8;
            } else {
              setBreathPhase("INHALE");
              setCyclesCompleted((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const handleSaveBrainDump = async () => {
    if (!brainDumpText.trim()) return;
    setBrainDumpSaved(true);

    try {
      await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ECLUSA_1830",
          message: `Eclusa 18h30 Travada • Atleta: ${specs.name}!\nBrain Dump arquivado: "${brainDumpText.substring(0, 100)}..."\nMente descompressa para a corrida das 19h.`,
        }),
      });
    } catch (err) {
      console.warn("Failed to notify telegram:", err);
    }

    setTimeout(() => setBrainDumpSaved(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Station Selector Bar - Haute Horlogerie Style */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C101A] via-[#101726] to-[#0C101A] border border-white/10 p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            {
              id: "AIRLOCK_1830",
              title: "1. Eclusa 18h30",
              sub: "Brain Dump & Transição",
              icon: Brain,
              color: "text-blue-400",
              activeBorder: "border-blue-500/70",
            },
            {
              id: "THERMAL_BRAKE_2030",
              title: "2. Freio Térmico",
              sub: "Resfriamento 20h30",
              icon: Moon,
              color: "text-purple-400",
              activeBorder: "border-purple-500/70",
            },
            {
              id: "POST_GAME",
              title: isDaniel ? "3. Pós-Mengão" : "3. Pós-Grêmio",
              sub: "Desescalada Cardíaca",
              icon: Flame,
              color: isDaniel ? "text-red-400" : "text-sky-400",
              activeBorder: isDaniel ? "border-red-500/70" : "border-sky-500/70",
            },
            {
              id: "OFF_DAY_RESET",
              title: "4. Reset Dias OFF",
              sub: "Seg/Sex Descompressão",
              icon: Coffee,
              color: "text-emerald-400",
              activeBorder: "border-emerald-500/70",
            },
            {
              id: "SOS_BREATHING",
              title: "5. Botão SOS 4-7-8",
              sub: "Vago & Relaxamento",
              icon: HeartPulse,
              color: "text-amber-400",
              activeBorder: "border-amber-500/70",
            },
          ].map((station) => {
            const Icon = station.icon;
            const isCurrent = activeStation === station.id;

            return (
              <button
                key={station.id}
                onClick={() => setActiveStation(station.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? `${station.activeBorder} bg-gradient-to-br from-[#161F33] to-[#0A0D15] shadow-lg ring-1 ring-white/10`
                    : "border-white/5 bg-[#07090E] hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${station.color}`} />
                  <span className="text-xs font-bold text-white font-mono">{station.title}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-sans">{station.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Station Active Content */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-6 shadow-2xl">
        {/* Station 1: Eclusa de Transição às 18h30 */}
        {activeStation === "AIRLOCK_1830" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                  Estação 1 • Horário Oficial: 18h30 • {specs.name}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Eclusa de Descompressão &amp; Brain Dump
                </h3>
                <p className="text-xs text-gray-400">
                  Transição psicológica do trabalho para a rotina familiar e foco no treino das 19h.
                </p>
              </div>

              <button
                onClick={() => onTriggerTuyaScene("PRE_WORKOUT_FOCUS")}
                className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all font-mono"
              >
                <Zap className="h-4 w-4" />
                <span>Acionar Foco 6500K</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-200 block">
                Brain Dump Mental (Esvazie tudo o que ficou pendente no trabalho):
              </label>
              <textarea
                rows={4}
                value={brainDumpText}
                onChange={(e) => setBrainDumpText(e.target.value)}
                placeholder="Ex: Enviar e-mail para o time amanhã às 9h, alinhar relatório na quarta... Uma vez anotado aqui, seu cérebro não precisa se preocupar durante a corrida."
                className="w-full bg-[#07090E] border border-white/10 rounded-2xl p-3.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono">
                  Registro local criptografado no Bio-Triad OS.
                </span>
                <button
                  onClick={handleSaveBrainDump}
                  disabled={!brainDumpText.trim() || brainDumpSaved}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{brainDumpSaved ? "Eclusa Travada!" : "Descarregar Mente"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Station 2: Freio Térmico às 20h30 */}
        {activeStation === "THERMAL_BRAKE_2030" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                  Estação 2 • Horário Oficial: 20h30 • {specs.name}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Freio Térmico &amp; Ativação da Melatonina
                </h3>
                <p className="text-xs text-gray-400">
                  Redução da temperatura central pós-treino para garantir sono profundo de 8h.
                </p>
              </div>

              <button
                onClick={() => onTriggerTuyaScene("PARASYMPATHETIC_NIGHT")}
                className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all font-mono"
              >
                <Moon className="h-4 w-4" />
                <span>Acionar Luz Âmbar 2200K</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#07090E] border border-white/5 space-y-1">
                <span className="text-xs font-bold text-purple-300 block">
                  1. Ducha Térmica Morna/Fria
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  A água morna vasodilata as extremidades e expulsa o calor do núcleo corporal,
                  induzindo sonolência fisiológica.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#07090E] border border-white/5 space-y-1">
                <span className="text-xs font-bold text-purple-300 block">
                  2. Hidratação com Magnésio
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  300ml de água com limão e magnésio quelato/glicina para relaxamento da fibra
                  muscular esquelética.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#07090E] border border-white/5 space-y-1">
                <span className="text-xs font-bold text-purple-300 block">
                  3. Bloqueio de Telas Azuis
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Celular em modo não perturbe. Ativação do freio parassimpático pós-esforço.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Station 3: Protocolo Pós-Jogo Customizado para Flamengo vs Grêmio */}
        {activeStation === "POST_GAME" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDaniel ? "text-red-400" : "text-sky-400"}`}>
                  Estação 3 • Pós-Partidas de Alta Tensão • {specs.clubBadge}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Protocolo Pós-Jogo: {isDaniel ? "Flamengo (Maracanã)" : "Grêmio (Arena do Grêmio)"}
                </h3>
                <p className="text-xs text-gray-400">
                  Manejo de picos de adrenalina induzidos por emoção e rivalidade para não sabotar a recuperação.
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isDaniel
                  ? "bg-red-950/20 border-red-500/40 text-red-200"
                  : "bg-sky-950/20 border-sky-500/40 text-sky-200"
              }`}
            >
              <span className="font-bold text-base block">
                {isDaniel ? "🔴⚫ Desativação Rubro-Negra" : "🔵⚪ Desativação Tricolor"}
              </span>
              <p className="text-gray-300 leading-relaxed">
                Jogos decisivos elevam a FC média para mais de 110 bpm sentados no sofá. Para que o
                sono das 23h não seja prejudicado:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-gray-300">
                <li>
                  Zero cafeína ou energéticos nas 4 horas seguintes ao apito final.
                </li>
                <li>
                  Caminhada leve de 5 minutos descalço pela casa para descarregar o tônus simpático.
                </li>
                <li>
                  Consumir chá de camomila ou melissa quente com uma fatia de kiwi (fonte natural de serotonina).
                </li>
                <li>
                  Evitar debates tóxicos em redes sociais após o apito final.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Station 4: Reset de Dias OFF (Seg/Sex) */}
        {activeStation === "OFF_DAY_RESET" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Estação 4 • Segunda e Sexta-Feira • {specs.name}
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Reset de Dias OFF (Recuperação Sistêmica)
              </h3>
              <p className="text-xs text-gray-400">
                Descanso passivo completo para supercompensação muscular e adaptação aeróbia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#07090E] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 block mb-1">
                  Regras de Ouro do Dia OFF:
                </span>
                <p className="text-gray-300 leading-relaxed">
                  Proibido corridas leves ou caminhadas exaustivas extras. O corpo não evolui durante o treino, mas sim durante a recuperação celular.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#07090E] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 block mb-1">
                  {isDaniel ? "Proteção da Prótese (Daniel):" : "Recuperação Pélvica & Glúteos (Patrícia):"}
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {isDaniel
                    ? "Alongamento suave das fáscias peitorais e mobilidade escapular com gravidade zero (sem cargas externas)."
                    : "Liberação miofascial com rolinho na banda iliotibial e glúteo médio para manter a passada alinhada nos 10k."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Station 5: SOS Breathing 4-7-8 */}
        {activeStation === "SOS_BREATHING" && (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Estação 5 • Protocolo Vagal do Dr. Andrew Weil
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Respiração Anti-Ansiedade 4-7-8
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Inspire pelo nariz por 4s, segure o ar por 7s e expire suavemente pela boca por 8s.
              </p>
            </div>

            {/* Visual Breathing Bubble */}
            <div className="relative flex items-center justify-center my-8">
              <div
                className={`h-48 w-48 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase === "INHALE"
                    ? "border-blue-400 bg-blue-950/40 scale-125 shadow-2xl shadow-blue-500/40"
                    : breathPhase === "HOLD"
                    ? "border-amber-400 bg-amber-950/40 scale-125 shadow-2xl shadow-amber-500/40"
                    : "border-purple-400 bg-purple-950/40 scale-95 shadow-lg shadow-purple-500/30"
                }`}
              >
                <span className="text-xs font-mono font-black uppercase tracking-widest text-gray-300">
                  {breathPhase === "INHALE"
                    ? "INSPIRAR"
                    : breathPhase === "HOLD"
                    ? "SEGURAR"
                    : "EXPIRAR"}
                </span>
                <span className="text-4xl font-mono font-extrabold text-white mt-1">
                  {breathCount}s
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xl transition-all ${
                  isBreathingActive
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                }`}
              >
                {isBreathingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isBreathingActive ? "Pausar Respiração" : "Iniciar Sessão SOS"}</span>
              </button>

              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase("INHALE");
                  setBreathCount(4);
                  setCyclesCompleted(0);
                }}
                className="px-3 py-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 font-mono">
              Ciclos completos nesta sessão:{" "}
              <strong className="text-amber-300">{cyclesCompleted}</strong> (Recomenda-se 4 a 8
              ciclos)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
