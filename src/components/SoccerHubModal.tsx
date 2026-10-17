"use client";

import React, { useState } from "react";
import {
  X,
  Trophy,
  Flame,
  Shield,
  Zap,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Tv,
} from "lucide-react";
import { FootballTeamData, SoccerTeam } from "@/lib/types";

interface SoccerHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  footballData: {
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
    palmeiras?: FootballTeamData | null;
  };
  onTriggerTuyaScene: (scene: string, label: string) => void;
}

export function SoccerHubModal({
  isOpen,
  onClose,
  footballData,
  onTriggerTuyaScene,
}: SoccerHubModalProps) {
  const [selectedClub, setSelectedClub] = useState<SoccerTeam>("Flamengo");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSceneDispatch = (scene: string, label: string) => {
    onTriggerTuyaScene(scene, label);
    setActionFeedback(`⚡ Cena Tuya Ativada: ${label}!`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const clubsConfig = [
    {
      team: "Flamengo" as const,
      athlete: "Daniel Souto Lopes",
      nickname: "Mengão Rubro-Negro",
      crest: "🔴⚫",
      accentColor: "red",
      bgClass: "bg-red-950/30 border-red-500/40 text-red-300",
      activeTabClass: "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30",
      nextOpponent: "Bahia",
      nextDate: "18/10/2026 (Domingo)",
      nextTime: "18:30 (Horário de Brasília)",
      stadium: "Arena Fonte Nova (Salvador, BA)",
      broadcast: "Premiere • SporTV • Globoplay",
      broadcastChannels: ["Premiere", "SporTV", "Globoplay"],
      broadcastType: "TV Fechada (Pay-Per-View) & Streaming Ao Vivo",
      standing: footballData.flamengo?.standingPosition || 4,
      points: footballData.flamengo?.points || 51,
      games: footballData.flamengo?.gamesPlayed || 29,
      data: footballData.flamengo,
      sceneMatch: "FLAMENGO_MATCH",
      sceneGoal: "FLAMENGO_GOAL",
    },
    {
      team: "Grêmio" as const,
      athlete: "Patrícia Lopes",
      nickname: "Imortal Tricolor",
      crest: "🔵⚪⚫",
      accentColor: "sky",
      bgClass: "bg-sky-950/30 border-sky-500/40 text-sky-300",
      activeTabClass: "bg-gradient-to-r from-sky-600 to-cyan-700 text-white shadow-lg shadow-sky-600/30",
      nextOpponent: "Internacional (Gre-Nal 443)",
      nextDate: "19/10/2026 (Segunda)",
      nextTime: "16:00 (Horário de Brasília)",
      stadium: "Beira-Rio (Porto Alegre, RS)",
      broadcast: "Premiere • RBS TV (Globo) • SporTV • Globoplay",
      broadcastChannels: ["Premiere", "RBS TV (Globo)", "SporTV", "Globoplay"],
      broadcastType: "TV Aberta (RS), TV Fechada & Streaming",
      standing: footballData.gremio?.standingPosition || 11,
      points: footballData.gremio?.points || 35,
      games: footballData.gremio?.gamesPlayed || 29,
      data: footballData.gremio,
      sceneMatch: "GREMIO_MATCH",
      sceneGoal: "GREMIO_GOAL",
    },
    {
      team: "Palmeiras" as const,
      athlete: "Gabriel Souto Maior",
      nickname: "Alviverde Imponente",
      crest: "🟢⚪",
      accentColor: "emerald",
      bgClass: "bg-emerald-950/30 border-emerald-500/40 text-emerald-300",
      activeTabClass: "bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-600/30",
      nextOpponent: "Juventude",
      nextDate: "20/10/2026 (Terça)",
      nextTime: "20:00 (Horário de Brasília)",
      stadium: "Alfredo Jaconi (Caxias do Sul, RS)",
      broadcast: "Premiere • SporTV • Globoplay",
      broadcastChannels: ["Premiere", "SporTV", "Globoplay"],
      broadcastType: "TV Fechada & Streaming Ao Vivo",
      standing: footballData.palmeiras?.standingPosition || 2,
      points: footballData.palmeiras?.points || 57,
      games: footballData.palmeiras?.gamesPlayed || 29,
      data: footballData.palmeiras,
      sceneMatch: "PALMEIRAS_MATCH",
      sceneGoal: "PALMEIRAS_GOAL",
    },
  ];

  const currentClubConfig = clubsConfig.find((c) => c.team === selectedClub) || clubsConfig[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#0D121F] via-[#080B12] to-[#05070B] border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0A0E18]/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-red-600 via-sky-400 to-emerald-400 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-[#070A11] rounded-[14px] flex items-center justify-center">
                <Trophy className="h-5 w-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Hub de Times • Clã Lopes
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30">
                  Triad Soccer Sync
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Flamengo (Daniel) • Grêmio (Patrícia) • Palmeiras (Gabriel Souto Maior)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Club Selector Tabs */}
        <div className="p-4 bg-[#0A0E18] border-b border-white/5 flex gap-2">
          {clubsConfig.map((c) => (
            <button
              key={c.team}
              onClick={() => setSelectedClub(c.team)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
                selectedClub === c.team
                  ? c.activeTabClass
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{c.crest}</span>
              <span className="truncate">{c.team}</span>
              <span className="text-[10px] opacity-75 font-mono hidden sm:inline">
                ({c.athlete.split(" ")[0]})
              </span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Next Match Highlight Card */}
          <div className={`p-5 rounded-3xl border ${currentClubConfig.bgClass} relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80 block mb-1">
                  PRÓXIMO CONFRONTO CONFIRMADO
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>{currentClubConfig.team}</span>
                  <span className="text-gray-400 font-normal text-sm sm:text-base">vs</span>
                  <span className="text-amber-300">{currentClubConfig.nextOpponent}</span>
                </h3>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono font-bold text-white">
                  <Clock className="h-3.5 w-3.5 text-amber-300" />
                  {currentClubConfig.nextTime}
                </span>
                <span className="text-[11px] text-gray-400 font-mono block mt-1">
                  {currentClubConfig.nextDate}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{currentClubConfig.stadium}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-300">
                  <Tv className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="font-bold text-white">Onde Assistir (TV & Streaming):</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pl-6">
                  {currentClubConfig.broadcastChannels.map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-sm"
                    >
                      📺 {ch}
                    </span>
                  ))}
                  <span className="text-[10px] text-gray-400 block w-full mt-0.5">
                    {currentClubConfig.broadcastType}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Home Integration Controls */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-400 font-mono">
                💡 Automação Tuya • Lâmpada Sala/TV (L_Futebol):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleSceneDispatch(
                      currentClubConfig.sceneMatch,
                      `Match Day ${currentClubConfig.team}`
                    )
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  Ativar Luzes do Jogo
                </button>
                <button
                  onClick={() =>
                    handleSceneDispatch(
                      currentClubConfig.sceneGoal,
                      `Gol do ${currentClubConfig.team}`
                    )
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Pulso de Gol!
                </button>
              </div>
            </div>
          </div>

          {/* Standings & Performance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                Classificação Brasileirão
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {currentClubConfig.standing}º Lugar
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                Pontos Conquistados
              </span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {currentClubConfig.points} pts
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                Partidas Disputadas
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {currentClubConfig.games} jogos
              </span>
            </div>
          </div>

          {/* Smart Lock: 1 Hour Before Kickoff & TACO Snacks Buffer */}
          {(() => {
            const matchTimeStr = currentClubConfig.nextTime.split(" ")[0]; // "18:30", "16:00", "20:00"
            const [mH, mM] = matchTimeStr.split(":").map(Number);
            const cutoffHour = (mH - 1 + 24) % 24;
            const smartCutoffTime = `${cutoffHour.toString().padStart(2, "0")}:${(mM || 0).toString().padStart(2, "0")}`;

            return (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#161109] to-black border border-amber-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-mono">
                    <span className="text-base">🔒</span>
                    <span>TRAVA INTELIGENTE DE CORTE VESPERTINO (1H ANTES DO JOGO):</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-red-600/30 border border-red-500 text-red-300 font-black text-xs font-mono">
                    Corte Limite: {smartCutoffTime}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Horário do Jogo</span>
                    <span className="text-white font-bold">{matchTimeStr} (Brasília)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30">
                    <span className="text-[10px] text-amber-400 block">Trava Obrigatória</span>
                    <span className="text-amber-300 font-black text-sm">{smartCutoffTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Janela de Transição</span>
                    <span className="text-emerald-400 font-bold">60 min Protegidos</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  Para estabilizar a frequência cardíaca e a pressão arterial antes da emoção da partida,
                  a trava automática encerra qualquer atividade física exatamente <strong>1 hora antes</strong> do pontapé inicial.
                  No confronto do {currentClubConfig.team} contra o {currentClubConfig.nextOpponent} ({matchTimeStr}),
                  o treino deve estar finalizado impreterivelmente às <strong>{smartCutoffTime}</strong>.
                </p>
                <div className="pt-2 text-[11px] font-mono text-gray-400 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <span>🍟 <strong>Buffer de Petiscos TACO (+350 kcal):</strong> Espetinho grelhado (P1), chips de batata doce na airfryer (C1), água com gás e limão.</span>
                  <span className="text-amber-400 font-bold">Sincronização Ativa 🟢</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0A0E18] flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-400">
            Sincronizado com API Oficial • Horários Oficiais de Brasília
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
