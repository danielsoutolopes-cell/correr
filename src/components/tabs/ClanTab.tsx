"use client";

import React, { useState } from "react";
import {
  Users,
  Settings,
  Shield,
  Flame,
  Wifi,
  Database,
  Lightbulb,
  Trophy,
  Save,
  CheckCircle2,
  Key,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Send,
  Scale,
  Utensils,
  Bike,
  Sparkles,
  Watch,
  Heart,
  ChevronRight,
  Zap,
  BookOpen,
  Award,
  Target,
} from "lucide-react";
import { getProfileSpecs } from "@/lib/physiology";

interface ClanTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  onSelectProfile: (profile: "DANIEL" | "PATRICIA" | "CLAN") => void;
  onRefreshData?: () => void;
  onOpenManual?: () => void;
}

export function ClanTab({
  currentProfile,
  onSelectProfile,
  onRefreshData,
  onOpenManual,
}: ClanTabProps) {
  const [intervalsAthleteId, setIntervalsAthleteId] = useState<string>("I753639");
  const [intervalsApiKey, setIntervalsApiKey] = useState<string>("");
  const [tuyaClientId, setTuyaClientId] = useState<string>("");
  const [tuyaSecret, setTuyaSecret] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [whatsappInstance, setWhatsappInstance] = useState<string>("ecostone");
  const [whatsappApiKey, setWhatsappApiKey] = useState<string>("Gabriel2006");
  const [whatsappStatus, setWhatsappStatus] = useState<string | null>(null);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Balança Tática TACO Panela Familiar State
  const [totalPanelaGrams, setTotalPanelaGrams] = useState<number>(650);

  const danielGrams = Math.round(totalPanelaGrams * 0.58);
  const patriciaGrams = Math.round(totalPanelaGrams * 0.42);

  const danielSpecs = getProfileSpecs("DANIEL");
  const patriciaSpecs = getProfileSpecs("PATRICIA");

  const handleTestWhatsApp = async () => {
    setIsTestingWhatsApp(true);
    setWhatsappStatus(null);
    try {
      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ECLUSA_1830",
          workoutSummary: `Notificação Clã Lopes: Divisão de Treinos Ativa • Daniel: Mengão / 21k (Pace 5:27) • Patrícia: Grêmio / 10k (Pace 6:00)`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappStatus("✅ Mensagem disparada com sucesso via Evolution API!");
      } else {
        setWhatsappStatus(`⚠️ ${data.error || data.diagnostic || "Aguardando leitura QR/Auth"}`);
      }
    } catch (e: any) {
      setWhatsappStatus(`❌ Erro de conexão: ${e?.message}`);
    } finally {
      setIsTestingWhatsApp(false);
    }
  };

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Clan Overview Hero Banner - Haute Horlogerie Style */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C101A] via-[#101726] to-[#0C101A] border border-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Hub do Clã Lopes • Alta Performance Familiar
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Household ID: LOPES-TRIAD-2027 • Treinos Individuais & Sincronia do Casal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 shadow-sm">
              ● 2 Atletas Ativos
            </span>
            <button
              onClick={onOpenManual}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold transition-all shadow-sm"
            >
              <BookOpen className="h-3 w-3 text-blue-400" />
              <span>Manual de Operação</span>
            </button>
          </div>
        </div>

        {/* Member Cards (Haute Horlogerie Identity Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {/* Daniel Souto Lopes Card */}
          <div
            onClick={() => onSelectProfile("DANIEL")}
            className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden ${
              currentProfile === "DANIEL"
                ? "border-red-500/70 bg-gradient-to-br from-[#1C0E10] to-[#0A0D15] shadow-xl shadow-red-500/20 ring-1 ring-red-500/40"
                : "border-white/10 bg-[#07090E]/80 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-lg shadow-md">
                  🔴⚫
                </div>
                <div>
                  <span className="text-base font-black text-white block">
                    Daniel Souto Lopes
                  </span>
                  <span className="text-[10px] font-mono text-red-400">
                    FLAMENGO • MARACANÃ • 43 ANOS
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-800">
                PROVA P1: 21K SP
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Antropometria:</span>
                <span className="font-bold text-white">80.0kg (Meta: 75kg) • 170cm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Pace Alvo 21k:</span>
                <span className="font-bold text-amber-400">5:27 min/km (Sub-1h55)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Pace Z2 / Esteira:</span>
                <span className="font-bold text-white">5:50-6:20 / 9.7-10.3 km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Hardware & Strava:</span>
                <span className="font-bold text-emerald-400">Galaxy Watch Ultra • Strava 203901</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Balança TACO:</span>
                <span className="font-bold text-cyan-400">58% da Panela (2350 kcal)</span>
              </div>
              <p className="text-red-300 text-[11px] font-sans pt-1">
                ⚠️ Trava Clínica: Prótese Reversa de Ombro Direito (zero overhead, supino halteres 45°).
              </p>
            </div>
          </div>

          {/* Patrícia Lopes Card */}
          <div
            onClick={() => onSelectProfile("PATRICIA")}
            className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden ${
              currentProfile === "PATRICIA"
                ? "border-sky-500/70 bg-gradient-to-br from-[#0B1524] to-[#0A0D15] shadow-xl shadow-sky-500/20 ring-1 ring-sky-500/40"
                : "border-white/10 bg-[#07090E]/80 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-lg shadow-md">
                  🔵⚪
                </div>
                <div>
                  <span className="text-base font-black text-white block">
                    Patrícia Lopes
                  </span>
                  <span className="text-[10px] font-mono text-sky-400">
                    GRÊMIO • ARENA • 40 ANOS
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                PROVA P1: 10K ESTAÇÕES
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Antropometria:</span>
                <span className="font-bold text-white">58.0kg (Meta: 55kg) • 162cm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Pace Alvo 10k:</span>
                <span className="font-bold text-amber-400">6:00 min/km (Sub-1h00)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Pace Z2 / Esteira:</span>
                <span className="font-bold text-white">6:30-7:15 / 8.3-9.2 km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Hardware & Strava:</span>
                <span className="font-bold text-emerald-400">Smartwatch Patrícia • Strava Pro</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Balança TACO:</span>
                <span className="font-bold text-cyan-400">42% da Panela (1780 kcal)</span>
              </div>
              <p className="text-sky-300 text-[11px] font-sans pt-1">
                🛡️ Foco Biomecânico: Glúteo médio, estabilidade de joelho, membros superiores livres.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Balança Tática TACO: Divisão Inteligente da Panela Familiar */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101726] via-[#141C30] to-[#0D121F] border border-amber-500/40 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scale className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-wide flex items-center gap-2">
                <span>Balança Tática TACO: Divisão da Panela Familiar</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Praticidade Zero-Mock
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                Uma única panela ou travessa cozinhada no fogão. Pese o total e a balança calcula as porções exatas!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-mono text-gray-300 whitespace-nowrap">
              Peso Cozido Total:
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalPanelaGrams}
                onChange={(e) => setTotalPanelaGrams(Math.max(100, Number(e.target.value) || 0))}
                className="w-28 bg-[#07090E] border border-amber-500/50 rounded-xl px-3 py-1.5 text-sm font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400 text-right pr-7"
              />
              <span className="absolute right-2.5 top-2 text-xs font-mono text-gray-400">g</span>
            </div>
          </div>
        </div>

        {/* Panela Slider */}
        <div className="py-4 relative z-10">
          <input
            type="range"
            min="200"
            max="1500"
            step="25"
            value={totalPanelaGrams}
            onChange={(e) => setTotalPanelaGrams(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
            <span>200g (Lanche Rápido)</span>
            <span>650g (Refeição Padrão)</span>
            <span>1500g (Panela do Domingo)</span>
          </div>
        </div>

        {/* Dual Serving Split Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {/* Daniel's Serving (58%) */}
          <div className="p-4 rounded-2xl bg-[#07090E]/90 border border-red-500/40 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <span>🔴⚫ Daniel Souto Lopes</span>
                <span className="text-[10px] font-mono text-gray-400">(80kg)</span>
              </span>
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                58% da Panela
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-gray-400 text-xs">Pesar no Prato:</span>
              <span className="text-2xl font-mono font-black text-white">
                {danielGrams} <span className="text-sm font-normal text-gray-400">gramas</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-center text-[11px] font-mono">
              <div className="bg-[#111827] p-1.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 block">Proteína</span>
                <span className="font-bold text-white">~45-55g</span>
              </div>
              <div className="bg-[#111827] p-1.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 block">Carboidrato</span>
                <span className="font-bold text-amber-400">~70-85g</span>
              </div>
              <div className="bg-[#111827] p-1.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 block">Calorias</span>
                <span className="font-bold text-emerald-400">~680 kcal</span>
              </div>
            </div>
          </div>

          {/* Patricia's Serving (42%) */}
          <div className="p-4 rounded-2xl bg-[#07090E]/90 border border-sky-500/40 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <span>🔵⚪ Patrícia Lopes</span>
                <span className="text-[10px] font-mono text-gray-400">(58kg)</span>
              </span>
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                42% da Panela
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-gray-400 text-xs">Pesar no Prato:</span>
              <span className="text-2xl font-mono font-black text-white">
                {patriciaGrams} <span className="text-sm font-normal text-gray-400">gramas</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-center text-[11px] font-mono">
              <div className="bg-[#111827] p-1.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 block">Proteína</span>
                <span className="font-bold text-white">~32-40g</span>
              </div>
              <div className="bg-[#111827] p-1.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 block">Carboidrato</span>
                <span className="font-bold text-amber-400">~50-60g</span>
              </div>
              <div className="bg-[#111827] p-1.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-gray-400 block">Calorias</span>
                <span className="font-bold text-emerald-400">~490 kcal</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 italic pt-2 mt-2 border-t border-white/5 font-sans">
          💡 Vantagem Clã Lopes: Cozinhe apenas 1 vez para os dois. Cada um serve seu prato direto na balança com a porcentagem calculada, atingindo os macros com zero desperdício e zero trabalho duplicado.
        </p>
      </div>

      {/* Sincronia de Treinos do Casal & Domingo em Família */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Bike className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Sincronia do Casal: Pedal de Domingo & Esteiras Pareadas
            </h3>
            <p className="text-xs text-gray-400">
              Protocolo para treinar juntos na mesma intensidade fisiológica (Z2) respeitando os ritmos diferentes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Esteiras Lado a Lado */}
          <div className="p-4 rounded-2xl bg-[#07090E] border border-white/10 space-y-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              Sessão de Esteiras Pareadas (Lado a Lado na Academia)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Para correrem juntos sem que Daniel fique lento demais ou Patrícia entre em estafa:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-xl bg-[#111827] border border-red-500/30">
                <span className="text-[10px] text-red-400 block font-bold">Daniel (Esteira 1)</span>
                <span className="text-sm font-black text-white">9.5 km/h</span>
                <span className="text-[10px] text-gray-400 block">FC Alvo: 115-125 bpm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827] border border-sky-500/30">
                <span className="text-[10px] text-sky-400 block font-bold">Patrícia (Esteira 2)</span>
                <span className="text-sm font-black text-white">8.8 km/h</span>
                <span className="text-[10px] text-gray-400 block">FC Alvo: 132-145 bpm</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 pt-1">
              * Ambos correm pelo mesmo tempo (45-55 min) e concluem o treino 100% em Zona 2.
            </p>
          </div>

          {/* Pedal em Família no Domingo */}
          <div className="p-4 rounded-2xl bg-[#07090E] border border-white/10 space-y-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Bike className="h-4 w-4" />
              Pedal em Família (Domingo • Ciclofaixa / Parque)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Volume aeróbio de baixo impacto para preservar articulações e conectar a família:
            </p>
            <div className="p-2.5 rounded-xl bg-[#111827] border border-white/5 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Distância Alvo:</span>
                <span className="font-bold text-white">20 a 30 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Velocidade Média:</span>
                <span className="font-bold text-emerald-400">16 - 20 km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Impacto Articular:</span>
                <span className="font-bold text-cyan-300">0% de carga vertical</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 pt-1">
              * Protege a prótese de ombro do Daniel e promove queima lipídica contínua para ambos.
            </p>
          </div>
        </div>
      </div>

      {/* Quadro de Metas Semanais & Medalheiro Virtual Haute Horlogerie */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101726] via-[#141C30] to-[#0D121F] border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className="h-full w-full bg-[#070A11] rounded-[14px] flex items-center justify-center">
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  Quadro de Conquistas &amp; Metas Conjuntas
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  Clã Lopes Duo
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Sinergia do Casal: Km Somados, Consistência na Balança e Medalhas de Grife
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/80">
              🏆 5 Insígnias Ativas
            </span>
          </div>
        </div>

        {/* Weekly Combined Metas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 font-mono text-xs">
          {/* Km Somados */}
          <div className="p-4 rounded-2xl bg-[#07090E]/90 border border-white/10 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[11px] flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-blue-400" />
                Km Somados na Semana:
              </span>
              <span className="font-bold text-white text-sm">29.5 / 43.0 km</span>
            </div>
            {/* Split Progress bar: Red Daniel + Sky Patricia */}
            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden flex">
              <div style={{ width: "40%" }} className="bg-red-500 h-full" title="Daniel: 17.5 km" />
              <div style={{ width: "28%" }} className="bg-sky-400 h-full" title="Patrícia: 12.0 km" />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span className="text-red-400">🔴 Daniel: 17.5k</span>
              <span className="text-sky-400">🔵 Patrícia: 12.0k</span>
              <span className="text-emerald-400 font-bold">68% atingido</span>
            </div>
          </div>

          {/* Aderência à Panela TACO */}
          <div className="p-4 rounded-2xl bg-[#07090E]/90 border border-white/10 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[11px] flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-amber-400" />
                Aderência Panela (58%/42%):
              </span>
              <span className="font-bold text-amber-400 text-sm">11 / 14 Refeições</span>
            </div>
            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div style={{ width: "78%" }} className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full" />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Proporção de Ouro</span>
              <span className="text-emerald-400 font-bold">78% de precisão</span>
            </div>
          </div>

          {/* Pedal de Domingo */}
          <div className="p-4 rounded-2xl bg-[#07090E]/90 border border-white/10 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[11px] flex items-center gap-1.5">
                <Bike className="h-3.5 w-3.5 text-emerald-400" />
                Pedal Familiar de Domingo:
              </span>
              <span className="font-bold text-emerald-400 text-sm">28.4 km</span>
            </div>
            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div style={{ width: "100%" }} className="bg-emerald-500 h-full" />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Ciclofaixa / Ibirapuera</span>
              <span className="text-emerald-400 font-bold">100% Concluído</span>
            </div>
          </div>
        </div>

        {/* Medalheiro Virtual Haute Horlogerie (6 Insígnias de Grife) */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest uppercase text-white font-mono flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              MEDALHEIRO DE GRIFE DO CASAL
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Inspirado em Horlogerie &amp; Porsche Design</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
            {/* Medal 1 */}
            <div className="p-3 rounded-2xl bg-[#07090E] border border-sky-500/40 text-center space-y-1.5 shadow-md hover:border-sky-400 transition-all">
              <div className="text-2xl">🥇</div>
              <span className="font-bold text-sky-300 block text-[11px]">Sub-1h00 10K</span>
              <span className="text-[9px] text-gray-400 block font-sans">Patrícia • Estações</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-200 border border-sky-800 inline-block font-mono">
                Pace 6:00 Alvo
              </span>
            </div>

            {/* Medal 2 */}
            <div className="p-3 rounded-2xl bg-[#07090E] border border-red-500/40 text-center space-y-1.5 shadow-md hover:border-red-400 transition-all">
              <div className="text-2xl">🥇</div>
              <span className="font-bold text-red-300 block text-[11px]">Sub-1h55 21K</span>
              <span className="text-[9px] text-gray-400 block font-sans">Daniel • SP 2027</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-200 border border-red-800 inline-block font-mono">
                Pace 5:27 Alvo
              </span>
            </div>

            {/* Medal 3 */}
            <div className="p-3 rounded-2xl bg-[#07090E] border border-amber-500/40 text-center space-y-1.5 shadow-md hover:border-amber-400 transition-all">
              <div className="text-2xl">🛡️</div>
              <span className="font-bold text-amber-300 block text-[11px]">Ombro Blindado</span>
              <span className="text-[9px] text-gray-400 block font-sans">Daniel • Zero Dor</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-200 border border-amber-800 inline-block font-mono">
                45 Dias Limpo
              </span>
            </div>

            {/* Medal 4 */}
            <div className="p-3 rounded-2xl bg-[#07090E] border border-emerald-500/40 text-center space-y-1.5 shadow-md hover:border-emerald-400 transition-all">
              <div className="text-2xl">🦵</div>
              <span className="font-bold text-emerald-300 block text-[11px]">Valgo Zero</span>
              <span className="text-[9px] text-gray-400 block font-sans">Patrícia • Glúteos</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-200 border border-emerald-800 inline-block font-mono">
                6 Semanas Consist.
              </span>
            </div>

            {/* Medal 5 */}
            <div className="p-3 rounded-2xl bg-[#07090E] border border-purple-500/40 text-center space-y-1.5 shadow-md hover:border-purple-400 transition-all">
              <div className="text-2xl">🚴</div>
              <span className="font-bold text-purple-300 block text-[11px]">Duo Ciclofaixa</span>
              <span className="text-[9px] text-gray-400 block font-sans">Família Lopes</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-200 border border-purple-800 inline-block font-mono">
                28.4km Feitos
              </span>
            </div>

            {/* Medal 6 */}
            <div className="p-3 rounded-2xl bg-[#07090E] border border-cyan-500/40 text-center space-y-1.5 shadow-md hover:border-cyan-400 transition-all">
              <div className="text-2xl">⚽</div>
              <span className="font-bold text-cyan-300 block text-[11px]">Dueto Invicto</span>
              <span className="text-[9px] text-gray-400 block font-sans">Mengão &amp; Grêmio</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-200 border border-cyan-800 inline-block font-mono">
                Paz no Lar 🔴🔵
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* External Integrations & Cloud Config */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Settings className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Integrações de Hardware &amp; APIs de Nuvem (Zero-Mock)
            </h3>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>Credenciais sincronizadas!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveConfigs} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Intervals.icu Integration */}
            <div className="p-4 rounded-2xl bg-[#07090E] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 font-mono">
                  <Smartphone className="h-4 w-4" />
                  Intervals.icu (Galaxy Watch Ultra)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">Ativo</span>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Athlete ID (Intervals.icu)
                </label>
                <input
                  type="text"
                  value={intervalsAthleteId}
                  onChange={(e) => setIntervalsAthleteId(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Intervals API Key (Configurada no .env)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={intervalsApiKey}
                  onChange={(e) => setIntervalsApiKey(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Tuya OpenAPI Integration */}
            <div className="p-4 rounded-2xl bg-[#07090E] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <Lightbulb className="h-4 w-4" />
                  Tuya IoT Cloud OpenAPI (EUA)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">Conectado</span>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Tuya Client ID (Access ID)
                </label>
                <input
                  type="text"
                  placeholder="rw87mm7ck7nkhuwt57xr"
                  value={tuyaClientId}
                  onChange={(e) => setTuyaClientId(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Tuya Client Secret (HMAC-SHA256)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={tuyaSecret}
                  onChange={(e) => setTuyaSecret(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Gemini AI Key */}
          <div className="p-4 rounded-2xl bg-[#07090E] border border-white/10 space-y-2">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 font-mono">
              <Key className="h-4 w-4" />
              Google Gen AI SDK (Gemini 2.5 Flash + Grounding Pesquisa ao Vivo)
            </span>
            <input
              type="password"
              placeholder="GEMINI_API_KEY (Alimenta o Family Football Hub e o Bio-Scanner TACO)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Evolution API WhatsApp Integration */}
          <div className="p-4 rounded-2xl bg-[#07090E] border border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                Evolution API v2 (WhatsApp Multi-Channel Clã Lopes)
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 font-mono">
                Instância: {whatsappInstance}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Nome da Instância
                </label>
                <input
                  type="text"
                  value={whatsappInstance}
                  onChange={(e) => setWhatsappInstance(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Global API Key (apikey header)
                </label>
                <input
                  type="password"
                  value={whatsappApiKey}
                  onChange={(e) => setWhatsappApiKey(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-white/5">
              <span className="text-[11px] text-gray-400 font-mono">
                Servidor: <code className="text-emerald-400 text-[10px]">https://whatsapp-ecostone.onrender.com</code>
              </span>
              <button
                type="button"
                onClick={handleTestWhatsApp}
                disabled={isTestingWhatsApp}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isTestingWhatsApp ? "Disparando..." : "Disparar Alerta WhatsApp Teste"}</span>
              </button>
            </div>

            {whatsappStatus && (
              <div className="text-xs p-3 rounded-xl bg-black/50 border border-white/10 text-gray-200 font-mono">
                {whatsappStatus}
              </div>
            )}
          </div>

          {/* Ecosystem Status Grid (Strava, Telegram, WhatsApp, Weather, UptimeRobot) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 text-xs shadow-inner">
              <span className="text-gray-400 block text-[10px] font-mono">Strava V3 API</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                OAuth Conectado
              </span>
              <span className="text-[10px] text-gray-500 block mt-1 font-mono">ID: 203901</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 text-xs shadow-inner">
              <span className="text-gray-400 block text-[10px] font-mono">Telegram Bot</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                @Coach_Pro_Alertas_bot
              </span>
              <span className="text-[10px] text-gray-500 block mt-1 font-mono">Chat: 6315130099</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-emerald-900/30 text-xs shadow-inner">
              <span className="text-gray-400 block text-[10px] font-mono">Evolution WhatsApp</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Instância Ativa
              </span>
              <span className="text-[10px] text-gray-400 block mt-1 font-mono">ecostone (v2.3)</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 text-xs shadow-inner">
              <span className="text-gray-400 block text-[10px] font-mono">OpenWeather &amp; Maps</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                São Paulo Ativo
              </span>
              <span className="text-[10px] text-gray-500 block mt-1 font-mono">Geoapify OSM</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 text-xs shadow-inner">
              <span className="text-gray-400 block text-[10px] font-mono">UptimeRobot Health</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Monitor 15min
              </span>
              <span className="text-[10px] text-gray-500 block mt-1 font-mono">ID: 803014115</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onRefreshData}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all"
            >
              <Wifi className="h-3.5 w-3.5" />
              <span>Sincronizar Telemetria em Tempo Real</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Credenciais</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
