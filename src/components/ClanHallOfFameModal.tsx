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
}

export function ClanHallOfFameModal({
  isOpen,
  onClose,
  onSelectProfile,
}: ClanHallOfFameModalProps) {
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
                    <span className="text-amber-300">21.097 km (01:54:12)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">🥈</span>
                      Patrícia Souto Lopes
                    </span>
                    <span className="text-sky-300">14.000 km (01:23:45)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-700 text-sm">🥉</span>
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
              <span className="text-[11px] font-mono text-gray-400">5 Troféus Desbloqueados</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Trophy 1 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/20 to-black border border-amber-500/30 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Athenas Mizuno 2026
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Daniel 21k & Patrícia 14k confirmados na Marginal Pinheiros!
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    AMANHÃ • 18/10/2026
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070A11] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-gray-400">
            Clã Lopes: Três gerações conectadas pelo asfalto, ciência e paixão esportiva.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
            >
              <Share2 className="h-4 w-4" />
              <span>{isCopied ? "Copiado! ✅" : "Compartilhar no WhatsApp da Família"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
