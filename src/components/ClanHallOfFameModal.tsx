"use client";

import React, { useState } from "react";
import {
  X,
  Trophy,
  Award,
  Crown,
  Flame,
  Shield,
  Zap,
  Users,
  Activity,
  Heart,
  Calendar,
  Share2,
  Sparkles,
  TrendingUp,
  Medal,
  CheckCircle2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { ProfileId } from "@/lib/types";

interface ClanHallOfFameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile?: (profile: ProfileId) => void;
  onOpenTrophyCardGenerator?: () => void;
}

export function ClanHallOfFameModal({
  isOpen,
  onClose,
  onSelectProfile,
  onOpenTrophyCardGenerator,
}: ClanHallOfFameModalProps) {
  const [certFilter, setCertFilter] = useState<"ALL" | "DANIEL" | "PATRICIA">("ALL");
  const [activeCategory, setActiveCategory] = useState<
    "ALL" | "DISTANCE" | "SPEED" | "STREAK" | "CARDIO"
  >("ALL");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Collective Metrics
  const danielKm = 842.1;
  const patriciaKm = 524.3;
  const gabrielKm = 286.0;
  const totalClanKm = +(danielKm + patriciaKm + gabrielKm).toFixed(1);
  const clanTargetKm = 2000.0;
  const pctTarget = Math.min(100, Math.round((totalClanKm / clanTargetKm) * 100));

  const handleShareWhatsApp = () => {
    const text = `🏆 *HALL DE RECORDES DO CLÃ LOPES - BIO-TRIAD OS* 🏃‍♂️💨
*Quilometragem Coletiva 2026:* ${totalClanKm} km percorridos juntos!
🎯 Meta: 2.000 km (${pctTarget}% atingido)

*Recordes Individuais:*
🥇 Maior Distância: Daniel (21.097 km - Meia Maratona)
⚡ 5k Mais Rápido: Gabriel (22m15s - 4:27/km)
👑 Rainha da Consistência: Patrícia (18 semanas consecutivas!)
💓 Eficiência Cardíaca: RHR 52 bpm (Daniel) / 50 bpm (Gabriel)

Três corações unidos: Flamengo 🔴⚫ + Grêmio 🔵⚪⚫ + Palmeiras 🟢⚪!
_Certificado com honra pelo Bio-Triad OS_ ✨`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-[#0B0F19] border border-amber-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-purple-950/20 to-black">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-white font-mono">
                  HALL DE RECORDES DO CLÃ LOPES
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Palmarés 2026
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Quilometragem Coletiva, Pódios Amigáveis e Vitrine de Troféus da Família
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Collective Mileage Hero Banner */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-br from-[#0E1528] to-[#080B12]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Total km counter */}
            <div className="md:col-span-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                QUILOMETRAGEM COLETIVA DO CLÃ EM 2026
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {totalClanKm}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400">KM</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {totalClanKm >= 1600 ? "Equivalente a correr de São Paulo a Salvador!" : "Quilômetros compartilhados com suor e união."}
              </p>

              {/* Progress Bar to 2000 km */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-300 mb-1">
                  <span>Meta Coletiva 2026: {clanTargetKm} km</span>
                  <span className="font-bold text-amber-300">{pctTarget}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: `${pctTarget}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Individual contributions pill grid */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              {/* Daniel */}
              <div className="p-3 rounded-2xl bg-black/40 border border-red-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-red-400" />
                    Daniel
                  </span>
                  <span className="text-[9px] font-mono text-red-300">FLA 🔴⚫</span>
                </div>
                <div className="text-xl font-black font-mono text-white my-1">
                  {danielKm} <span className="text-xs text-gray-400">km</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {((danielKm / totalClanKm) * 100).toFixed(0)}% do Clã • 21k Leader
                </span>
              </div>

              {/* Patrícia */}
              <div className="p-3 rounded-2xl bg-black/40 border border-sky-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-sky-400" />
                    Patrícia
                  </span>
                  <span className="text-[9px] font-mono text-sky-300">GRE 🔵⚪⚫</span>
                </div>
                <div className="text-xl font-black font-mono text-white my-1">
                  {patriciaKm} <span className="text-xs text-gray-400">km</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {((patriciaKm / totalClanKm) * 100).toFixed(0)}% do Clã • 18w Streak
                </span>
              </div>

              {/* Gabriel */}
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    Gabriel
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300">PAL 🟢⚪</span>
                </div>
                <div className="text-xl font-black font-mono text-white my-1">
                  {gabrielKm} <span className="text-xs text-gray-400">km</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {((gabrielKm / totalClanKm) * 100).toFixed(0)}% do Clã • 4:27 Speed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Rankings & Trophy Case */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Family Record Podiums */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black font-mono uppercase text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                PÓDIOS & RECORDES DA FAMÍLIA LOPES
              </h3>
              <span className="text-[11px] font-mono text-gray-400">Atualizado para Out/2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Podium 1: Distância */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-cyan-300 uppercase">
                    🏃‍♂️ Maior Distância Homologada
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Oficial</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-white font-bold">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">🥇</span>
                      Daniel Souto Lopes
                    </span>
                    <span className="text-amber-300">21.097 km (3x Meias • 🏆 1º ACD PG)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-white font-bold">
                    <span className="flex items-center gap-2">
                      <span className="text-sky-400 text-sm">🥇</span>
                      Patrícia Grubel
                    </span>
                    <span className="text-sky-300">21.097 km (SP City) • 14k Athenas</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-700 text-sm">🥈</span>
                      Gabriel Souto Maior
                    </span>
                    <span className="text-emerald-300">10.000 km (00:44:20)</span>
                  </div>
                </div>
              </div>

              {/* Podium 2: Velocidade 5K */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-300 uppercase">
                    ⚡ Maior Velocidade 5K (Pace Explosivo)
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Melhor Marca</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-white font-bold">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">🥇</span>
                      Gabriel Souto Maior
                    </span>
                    <span className="text-emerald-300">22m15s (4:27/km)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">🥈</span>
                      Daniel Souto Lopes
                    </span>
                    <span className="text-amber-300">24m35s (4:55/km)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-700 text-sm">🥉</span>
                      Patrícia Souto Lopes
                    </span>
                    <span className="text-sky-300">28m10s (5:38/km)</span>
                  </div>
                </div>
              </div>

              {/* Podium 3: Consistência (Streak de Semanas) */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-300 uppercase">
                    👑 Rainha/Rei da Consistência (Streak Semanal)
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Sem Faltar</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-white font-bold">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">🥇</span>
                      Patrícia Souto Lopes
                    </span>
                    <span className="text-amber-300">18 Semanas Seguidas!</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">🥈</span>
                      Daniel Souto Lopes
                    </span>
                    <span className="text-cyan-300">14 Semanas Seguidas</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-700 text-sm">🥉</span>
                      Gabriel Souto Maior
                    </span>
                    <span className="text-emerald-300">8 Semanas Seguidas</span>
                  </div>
                </div>
              </div>

              {/* Podium 4: Eficiência Cardíaca */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-rose-300 uppercase">
                    💓 Eficiência Biológica (RHR / Sono)
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Galaxy Watch</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-white font-bold">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">🥇</span>
                      Gabriel & Daniel (Empate)
                    </span>
                    <span className="text-rose-300">50-52 bpm Repouso</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">🥈</span>
                      Patrícia Souto Lopes
                    </span>
                    <span className="text-sky-300">54 bpm Repouso</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">✨</span>
                      Prontidão Média do Clã
                    </span>
                    <span className="text-emerald-300">92% Prontos para Prova!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vitrine de Troféus do Clã */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black font-mono uppercase text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" />
                VITRINE DE TROFÉUS & CONQUISTAS COLETIVAS
              </h3>
              <span className="text-[11px] font-mono text-gray-400">8 Troféus Desbloqueados</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Trophy: Meia de Praia Grande 2026 - Campeão ACD DMS */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-black border border-amber-500/50 flex items-start gap-3 shadow-lg shadow-amber-500/10">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <span>14ª Meia Tribuna Praia Grande</span>
                    <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-black uppercase">
                      1º LUGAR
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">
                    Daniel Lopes • Nº 115 • CAMPEÃO ACD DMS 🏆 • Oficial 02:29:38 (Pace 07:05/km) • Vitória histórica do membro superior!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    PÓDIO & OURO • 27/09/2026
                  </span>
                </div>
              </div>

              {/* Trophy: SP City Marathon 2026 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/30 to-black border border-red-500/40 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Medal className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Nike SP City Marathon 2026 (21k)
                  </h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">
                    Dupla Conclusão 21.1k! 🏃‍♂️ Daniel #33765 (02:10:58) • 🏃‍♀️ Patrícia #34798 (02:53:00) • Pacaembu ao Jockey Club!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                    HOMOLOGADA • 26/07/2026
                  </span>
                </div>
              </div>

              {/* Trophy 1: Athenas Mizuno 14k */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/20 to-black border border-amber-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Athenas Mizuno Run Longer 2026 (14k)
                  </h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">
                    Patrícia concluiu os 14k hoje! Oficial: 01:43:02 (Gun: 01:48:44 • Pace 07:21 min/km • Nº 10967) na Marginal Pinheiros!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    CONCLUÍDA HOJE • 18/10/2026
                  </span>
                </div>
              </div>

              {/* Trophy: 40º 10 KM Tribuna Santos 2026 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-950/25 to-black border border-orange-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    40º 10 KM Tribuna Santos (10k)
                  </h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">
                    Patrícia Grubel • Nº 9773 • Oficial 01:10:12 (Pace 07:01/km) • Superou 70.36% dos competidores nos 40 Anos da prova!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 font-bold">
                    HOMOLOGADA • 17/05/2026
                  </span>
                </div>
              </div>

              {/* Trophy 2 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/20 to-black border border-purple-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Crown className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Meia Maratona Vênus 21k
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Meta feminina de ouro para Patrícia com foco biomecânico.
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                    SÃO PAULO • 2026
                  </span>
                </div>
              </div>

              {/* Trophy 3 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/20 to-black border border-blue-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Medal className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Circuito Olga Kos Inclusão
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    O Clã completo correndo junto por inclusão no Pacaembu.
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                    20/12/2026 • 10K
                  </span>
                </div>
              </div>

              {/* Trophy 4 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-black border border-emerald-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Tríplice Coroa das Torcidas
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Mengão 🔴⚫ + Grêmio 🔵⚪⚫ + Verdão 🟢⚪ correndo em sintonia!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    DESAFIO FAMÍLIA
                  </span>
                </div>
              </div>

              {/* Trophy 5 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Selo Família em Movimento
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Mais de 1.600 km acumulados com saúde, prevenção e vigor!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                    BIO-TRIAD ELITE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Official Certified Hall of Diplomas */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black font-mono uppercase text-white flex items-center gap-2">
                  <Medal className="h-4 w-4 text-amber-400" />
                  MURAL DE CERTIFICADOS OFICIAIS HOMOLOGADOS (2026)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-sans">
                  Diplomas autênticos conferidos por cronometragem eletrônica (Chiptiming, Yescom, Chronomax & RunKing).
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCertFilter("ALL")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${certFilter === "ALL" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"}`}
                >
                  Todos (6)
                </button>
                <button
                  type="button"
                  onClick={() => setCertFilter("DANIEL")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${certFilter === "DANIEL" ? "bg-red-600 text-white shadow" : "text-gray-400 hover:text-white"}`}
                >
                  Daniel (3)
                </button>
                <button
                  type="button"
                  onClick={() => setCertFilter("PATRICIA")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${certFilter === "PATRICIA" ? "bg-sky-600 text-white shadow" : "text-gray-400 hover:text-white"}`}
                >
                  Patrícia (3)
                </button>
              </div>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Cert 1: Daniel - Praia Grande 21k */}
              {(certFilter === "ALL" || certFilter === "DANIEL") && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-950/40 via-purple-950/20 to-black border border-fuchsia-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-fuchsia-500/10 hover:border-fuchsia-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 flex items-center gap-1">
                        🏆 1º LUGAR CAMPEÃO ACD DMS
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#115 🇧🇷</span>
                    </div>
                    <h4 className="text-xs font-black text-white font-mono">
                      14ª Meia Tribuna Praia Grande (21k)
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Daniel Souto Maior Lopes • 27/09/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Tempo Líquido</span>
                      <span className="text-xs font-black text-fuchsia-400 block mt-0.5">02:29:38</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Pace Médio</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">07:05/km</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Categoria</span>
                      <span className="text-xs font-black text-amber-300 block mt-0.5">1º / 1 🥇</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                    <span>Gun: 02:29:42 (Tiro +4s)</span>
                    {onOpenTrophyCardGenerator && (
                      <button
                        type="button"
                        onClick={onOpenTrophyCardGenerator}
                        className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Gerar Cartão</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cert 2: Daniel - SP City 21.1k */}
              {(certFilter === "ALL" || certFilter === "DANIEL") && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-rose-950/20 to-black border border-red-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-red-500/10 hover:border-red-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                        ⚡ RECORDE PESSOAL (RP)
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#33765 🇧🇷</span>
                    </div>
                    <h4 className="text-xs font-black text-white font-mono">
                      Nike SP City Marathon 2026 (21.1k)
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Daniel Souto Maior Lopes • 26/07/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Tempo Líquido</span>
                      <span className="text-xs font-black text-red-400 block mt-0.5">02:10:58</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Pace Médio</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">06:12/km</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Faixa M50-59</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">674º / 1174</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                    <span>Geral: 12.213º / 21.487</span>
                    {onOpenTrophyCardGenerator && (
                      <button
                        type="button"
                        onClick={onOpenTrophyCardGenerator}
                        className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Gerar Cartão</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cert 3: Daniel - 30ª Maratona Intl SP 21k */}
              {(certFilter === "ALL" || certFilter === "DANIEL") && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-black border border-amber-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-amber-500/10 hover:border-amber-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        🎖️ ABBOTT WORLD ATHLETICS
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#17503 🇧🇷</span>
                    </div>
                    <h4 className="text-xs font-black text-white font-mono">
                      30ª Maratona Intl de São Paulo (21k)
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Daniel Souto Maior Lopes • 12/04/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Tempo Líquido</span>
                      <span className="text-xs font-black text-amber-400 block mt-0.5">02:22:05</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Pace Médio</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">06:46/km</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Faixa M50-54</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">332º</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                    <span>Geral: 3.824º • Chiptiming</span>
                    {onOpenTrophyCardGenerator && (
                      <button
                        type="button"
                        onClick={onOpenTrophyCardGenerator}
                        className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Gerar Cartão</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cert 4: Patrícia - Athenas Mizuno 14k */}
              {(certFilter === "ALL" || certFilter === "PATRICIA") && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-black border border-emerald-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-emerald-500/10 hover:border-emerald-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        ✨ CONCLUÍDA HOJE (18/10)
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#10967 🇧🇷</span>
                    </div>
                    <h4 className="text-xs font-black text-white font-mono">
                      Athenas Mizuno Run Longer (14k)
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Patrícia Grubel • 18/10/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Tempo Líquido</span>
                      <span className="text-xs font-black text-emerald-400 block mt-0.5">01:43:02</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Pace Médio</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">07:21/km</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Faixa F55-59</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">26ª / 33</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                    <span>950ª Fem • Superou 33.68%</span>
                    {onOpenTrophyCardGenerator && (
                      <button
                        type="button"
                        onClick={onOpenTrophyCardGenerator}
                        className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Gerar Cartão</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cert 5: Patrícia - SP City Marathon 21.1k */}
              {(certFilter === "ALL" || certFilter === "PATRICIA") && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/40 via-blue-950/20 to-black border border-sky-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-sky-500/10 hover:border-sky-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                        👑 FINISHER 21.1K MEIA
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#34798 🇧🇷</span>
                    </div>
                    <h4 className="text-xs font-black text-white font-mono">
                      Nike SP City Marathon 2026 (21.1k)
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Patrícia Grubel • 26/07/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Tempo Líquido</span>
                      <span className="text-xs font-black text-sky-400 block mt-0.5">02:53:00</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Pace Médio</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">08:11/km</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Faixa F50-59</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">933ª / 1020</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                    <span>9.020ª Fem / 20.579ª Geral</span>
                    {onOpenTrophyCardGenerator && (
                      <button
                        type="button"
                        onClick={onOpenTrophyCardGenerator}
                        className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Gerar Cartão</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cert 6: Patrícia - 40º 10 KM Tribuna Santos */}
              {(certFilter === "ALL" || certFilter === "PATRICIA") && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 via-amber-950/20 to-black border border-orange-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-orange-500/10 hover:border-orange-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                        🌟 TOP 30% GERAL (+70.36%)
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#9773 🇧🇷</span>
                    </div>
                    <h4 className="text-xs font-black text-white font-mono">
                      40º 10 KM Tribuna Terracom Santos
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Patrícia Grubel da Rocha • 17/05/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Tempo Líquido</span>
                      <span className="text-xs font-black text-orange-400 block mt-0.5">01:10:12</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Pace Médio</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">07:01/km</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase block">Faixa F50-59</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">430ª / 1214</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                    <span>Superou 70.36% dos corredores</span>
                    {onOpenTrophyCardGenerator && (
                      <button
                        type="button"
                        onClick={onOpenTrophyCardGenerator}
                        className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Gerar Cartão</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070A11] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-gray-400">
            Clã Lopes: Três gerações conectadas pelo asfalto, ciência e paixão esportiva.
          </div>
          <div className="flex items-center gap-2">
            {onOpenTrophyCardGenerator && (
              <button
                type="button"
                onClick={onOpenTrophyCardGenerator}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Gerador de Cartões 🏆</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
            >
              <Share2 className="h-4 w-4" />
              <span>{isCopied ? "Copiado! ✅" : "Compartilhar no WhatsApp"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
