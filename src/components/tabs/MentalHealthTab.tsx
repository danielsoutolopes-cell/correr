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
  Film,
  Tv,
  Bookmark,
  BookmarkCheck,
  Shuffle,
  Star,
  Heart,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { getProfileSpecs } from "@/lib/physiology";
import { ProfileId, StreamingPlatform } from "@/lib/types";
import { STREAMING_LIBRARY } from "@/lib/streaming-data";

interface MentalHealthTabProps {
  currentProfile: ProfileId;
  onTriggerTuyaScene: (scene: string) => void;
}

export function MentalHealthTab({ currentProfile, onTriggerTuyaScene }: MentalHealthTabProps) {
  const isDaniel = currentProfile === "DANIEL";
  const isPatricia = currentProfile === "PATRICIA";
  const isGabriel = currentProfile === "GABRIEL";
  const specs = getProfileSpecs(currentProfile);

  const [activeStation, setActiveStation] = useState<
    "AIRLOCK_1830" | "THERMAL_BRAKE_2030" | "STREAMING_CINEMA" | "POST_GAME" | "OFF_DAY_RESET" | "SOS_BREATHING"
  >("STREAMING_CINEMA");

  const [brainDumpText, setBrainDumpText] = useState<string>("");
  const [brainDumpSaved, setBrainDumpSaved] = useState<boolean>(false);

  // Streaming & Cinema Hub State
  const [streamingCategory, setStreamingCategory] = useState<
    "ALL" | "DORAMA" | "FILME" | "SERIE" | "DOCUMENTARIO"
  >("ALL");
  const [selectedPlatform, setSelectedPlatform] = useState<"ALL" | StreamingPlatform>("ALL");
  const [targetAudience, setTargetAudience] = useState<"ALL" | ProfileId>(
    currentProfile === "CLAN" ? "ALL" : currentProfile
  );
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [cinemaFeedback, setCinemaFeedback] = useState<string | null>(null);

  // SOS 4-7-8 Breathing Timer State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<"INHALE" | "HOLD" | "EXHALE">("INHALE");
  const [breathCount, setBreathCount] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // Load Watchlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_WATCHLIST");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (currentProfile !== "CLAN") {
      setTargetAudience(currentProfile);
    }
  }, [currentProfile]);

  // Breathing timer loop
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

  const handleActivateCinemaMode = () => {
    onTriggerTuyaScene("CINEMA_MODE");
    setCinemaFeedback("🎬 Modo Cinema Ativado: Tomada TV ligada e iluminação atenuada a 15% em tom âmbar!");
    setTimeout(() => setCinemaFeedback(null), 4500);
  };

  const toggleWatchlist = (id: string) => {
    const updated = watchlist.includes(id)
      ? watchlist.filter((item) => item !== id)
      : [...watchlist, id];
    setWatchlist(updated);
    try {
      localStorage.setItem("BIO_TRIAD_WATCHLIST", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSurpriseRecommendation = () => {
    const pool = filteredTitles.length > 0 ? filteredTitles : STREAMING_LIBRARY;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCinemaFeedback(`🍿 Sugestão de Hoje: "${random.title}" (${random.platformName}) • ${random.genre}!`);
    setTimeout(() => setCinemaFeedback(null), 6000);
  };

  // Filtered titles for Streaming Hub
  const filteredTitles = STREAMING_LIBRARY.filter((item) => {
    const matchCategory = streamingCategory === "ALL" || item.type === streamingCategory;
    const matchPlatform = selectedPlatform === "ALL" || item.platform === selectedPlatform;
    const matchAudience =
      targetAudience === "ALL" ||
      item.recommendedFor === targetAudience ||
      item.recommendedFor === "CLAN";
    return matchCategory && matchPlatform && matchAudience;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Station Selector Bar - Haute Horlogerie 6-Station Grid */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C101A] via-[#101726] to-[#0C101A] border border-white/10 p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
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
              id: "STREAMING_CINEMA",
              title: "3. Cine & Doramas",
              sub: "Netflix, Disney, Prime",
              icon: Film,
              color: "text-rose-400",
              activeBorder: "border-rose-500/70",
            },
            {
              id: "POST_GAME",
              title: isGabriel ? "4. Pós-Verdão" : isDaniel ? "4. Pós-Mengão" : "4. Pós-Grêmio",
              sub: "Desescalada Cardíaca",
              icon: Flame,
              color: isGabriel ? "text-emerald-400" : isDaniel ? "text-red-400" : "text-sky-400",
              activeBorder: isGabriel ? "border-emerald-500/70" : isDaniel ? "border-red-500/70" : "border-sky-500/70",
            },
            {
              id: "OFF_DAY_RESET",
              title: "5. Reset Dias OFF",
              sub: "Seg/Sex Descompressão",
              icon: Coffee,
              color: "text-emerald-400",
              activeBorder: "border-emerald-500/70",
            },
            {
              id: "SOS_BREATHING",
              title: "6. Botão SOS 4-7-8",
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
        {/* ========================================================
            STATION 3: CINE DESCOMPRESSÃO (NETFLIX, DISNEY, PRIME & DORAMAS)
           ======================================================== */}
        {activeStation === "STREAMING_CINEMA" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header with Tuya Cinema and Random Roulette */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                    Estação 3 • Cine Terapia & Descompressão
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30">
                    Dopamina Saudável
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                  <span>Hub de Streaming: Filmes, Séries & Doramas</span>
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Sugestões curadas para desligar o cortisol e elevar a melatonina (Netflix, Disney+, Prime Video, Max, Apple TV+).
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSurpriseRecommendation}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                  title="Sortear um título aleatório ideal para hoje"
                >
                  <Shuffle className="h-3.5 w-3.5 text-purple-400" />
                  <span>Roleta Anti-Indecisão</span>
                </button>

                <button
                  onClick={handleActivateCinemaMode}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all font-mono"
                  title="Atenua as lâmpadas da sala e do quarto para 15% em tom âmbar e liga a tomada da TV"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Ativar Modo Cinema Tuya</span>
                </button>
              </div>
            </div>

            {cinemaFeedback && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2 animate-fadeIn shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{cinemaFeedback}</span>
              </div>
            )}

            {/* Segmented Filter Ribbons */}
            <div className="space-y-3 bg-[#080B12]/80 p-4 rounded-2xl border border-white/5">
              {/* Filter Row 1: Content Type */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-gray-400 font-mono w-24">Formato:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "ALL", label: "Todos os Formatos" },
                    { id: "DORAMA", label: "🌸 Doramas & K-Dramas" },
                    { id: "FILME", label: "🏃 Filmes de Superação" },
                    { id: "SERIE", label: "📺 Séries Acolhedoras" },
                    { id: "DOCUMENTARIO", label: "🎥 Documentários" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setStreamingCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        streamingCategory === cat.id
                          ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                          : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Row 2: Streaming Platform */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-gray-400 font-mono w-24">Plataforma:</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setSelectedPlatform("ALL")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedPlatform === "ALL"
                        ? "bg-white/20 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedPlatform("NETFLIX")}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedPlatform === "NETFLIX"
                        ? "bg-[#E50914] text-white border-[#E50914] shadow-md shadow-red-600/30"
                        : "bg-[#E50914]/10 text-red-400 border-red-500/20 hover:bg-[#E50914]/20"
                    }`}
                  >
                    Netflix 🔴
                  </button>
                  <button
                    onClick={() => setSelectedPlatform("DISNEY_PLUS")}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedPlatform === "DISNEY_PLUS"
                        ? "bg-[#0063e5] text-white border-[#0063e5] shadow-md shadow-blue-600/30"
                        : "bg-[#0063e5]/10 text-blue-400 border-blue-500/20 hover:bg-[#0063e5]/20"
                    }`}
                  >
                    Disney+ 🔵
                  </button>
                  <button
                    onClick={() => setSelectedPlatform("PRIME_VIDEO")}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedPlatform === "PRIME_VIDEO"
                        ? "bg-[#00A8E1] text-black border-[#00A8E1] font-black shadow-md shadow-cyan-600/30"
                        : "bg-[#00A8E1]/10 text-cyan-400 border-cyan-500/20 hover:bg-[#00A8E1]/20"
                    }`}
                  >
                    Prime Video 🔷
                  </button>
                  <button
                    onClick={() => setSelectedPlatform("MAX")}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedPlatform === "MAX"
                        ? "bg-[#5822B4] text-white border-[#5822B4] shadow-md shadow-purple-600/30"
                        : "bg-[#5822B4]/10 text-purple-400 border-purple-500/20 hover:bg-[#5822B4]/20"
                    }`}
                  >
                    Max 🟣
                  </button>
                  <button
                    onClick={() => setSelectedPlatform("APPLE_TV")}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedPlatform === "APPLE_TV"
                        ? "bg-white text-black font-black"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    Apple TV+ ⚪
                  </button>
                </div>
              </div>

              {/* Filter Row 3: Audience Persona */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-gray-400 font-mono w-24">Para Quem:</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                  {[
                    { id: "ALL", label: "Todos do Clã" },
                    { id: "PATRICIA", label: "Patrícia 🔵⚪ (Doramas & Conforto)" },
                    { id: "DANIEL", label: "Daniel 🔴⚫ (Superação 21k & Épicos)" },
                    { id: "GABRIEL", label: "Gabriel 🟢⚪ (Ação & F1)" },
                    { id: "CLAN", label: "Casal / Família 💕" },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      onClick={() => setTargetAudience(aud.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                        targetAudience === aud.id
                          ? "bg-amber-500 text-black font-black shadow-md shadow-amber-500/30"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Titles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTitles.map((title) => {
                const isSaved = watchlist.includes(title.id);
                const platformBadgeStyle =
                  title.platform === "NETFLIX"
                    ? "bg-[#E50914]/20 text-red-400 border-red-500/40"
                    : title.platform === "DISNEY_PLUS"
                    ? "bg-[#0063e5]/20 text-blue-400 border-blue-500/40"
                    : title.platform === "PRIME_VIDEO"
                    ? "bg-[#00A8E1]/20 text-cyan-400 border-cyan-500/40"
                    : title.platform === "MAX"
                    ? "bg-[#5822B4]/20 text-purple-400 border-purple-500/40"
                    : "bg-white/10 text-gray-300 border-white/20";

                return (
                  <div
                    key={title.id}
                    className={`p-4 rounded-3xl border bg-gradient-to-br ${title.coverGradient} border-white/10 hover:border-white/30 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden group`}
                  >
                    <div>
                      {/* Top Ribbon */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${platformBadgeStyle}`}
                        >
                          {title.platformName}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                            ★ {title.ratingScore}
                          </span>
                          <button
                            onClick={() => toggleWatchlist(title.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isSaved
                                ? "bg-amber-500 text-black border-amber-400"
                                : "bg-black/40 text-gray-400 border-white/10 hover:text-white"
                            }`}
                            title={isSaved ? "Remover da minha lista" : "Salvar na minha lista"}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-3.5 w-3.5" />
                            ) : (
                              <Bookmark className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Main Title */}
                      <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                        {title.title}
                      </h4>
                      {title.originalTitle && (
                        <span className="text-[10px] text-gray-400 font-mono block italic">
                          {title.originalTitle}
                        </span>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-300 font-mono">
                        <span>{title.releaseYear}</span>
                        <span>•</span>
                        <span>{title.durationOrSeasons}</span>
                        <span>•</span>
                        <span className="text-amber-400">{title.genre.split("•")[0]}</span>
                      </div>

                      <p className="text-xs text-gray-300 mt-2.5 line-clamp-3 leading-relaxed">
                        {title.synopsis}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {title.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono bg-black/40 text-gray-300 px-1.5 py-0.5 rounded border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-gray-400">
                          {title.recommendedFor === "PATRICIA"
                            ? "🌸 Para Patrícia"
                            : title.recommendedFor === "DANIEL"
                            ? "🔥 Para Daniel"
                            : title.recommendedFor === "GABRIEL"
                            ? "⚡ Para Gabriel"
                            : "💕 Sessão Casal"}
                        </span>

                        <button
                          onClick={handleActivateCinemaMode}
                          className="flex items-center gap-1 text-[10px] font-mono text-rose-300 hover:text-white transition-colors"
                        >
                          <Tv className="h-3 w-3" />
                          <span>Ligar Modo TV</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                  300ml de água com limão e magnésio quelato/glicina para relaxamento da fibra muscular.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#07090E] border border-white/5 space-y-1">
                <span className="text-xs font-bold text-purple-300 block">
                  3. Quarto Fresco (18°C - 20°C)
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Celular em modo não perturbe. Ativação do freio parassimpático pós-esforço.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Station 4: Protocolo Pós-Jogo Customizado */}
        {activeStation === "POST_GAME" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isGabriel
                      ? "text-emerald-400"
                      : isDaniel
                      ? "text-red-400"
                      : "text-sky-400"
                  }`}
                >
                  Estação 4 • Pós-Partidas de Alta Tensão • {specs.clubBadge}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Protocolo Pós-Jogo:{" "}
                  {isGabriel
                    ? "Palmeiras (Allianz Parque)"
                    : isDaniel
                    ? "Flamengo (Maracanã)"
                    : "Grêmio (Arena do Grêmio)"}
                </h3>
                <p className="text-xs text-gray-400">
                  Manejo de picos de adrenalina induzidos por emoção e rivalidade para não sabotar a recuperação.
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isGabriel
                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                  : isDaniel
                  ? "bg-red-950/20 border-red-500/40 text-red-200"
                  : "bg-sky-950/20 border-sky-500/40 text-sky-200"
              }`}
            >
              <span className="font-bold text-base block">
                {isGabriel
                  ? "🟢⚪ Desativação Alviverde"
                  : isDaniel
                  ? "🔴⚫ Desativação Rubro-Negra"
                  : "🔵⚪ Desativação Tricolor"}
              </span>
              <p className="text-gray-300 leading-relaxed">
                Jogos decisivos elevam a FC média para mais de 110 bpm sentados no sofá. Para que o
                sono das 23h não seja prejudicado:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-gray-300">
                <li>Zero cafeína ou energéticos nas 4 horas seguintes ao apito final.</li>
                <li>Caminhada leve de 5 minutos descalço pela casa para descarregar o tônus simpático.</li>
                <li>Consumir chá de camomila ou melissa quente com uma fatia de kiwi (fonte natural de serotonina).</li>
                <li>Evitar debates tóxicos em redes sociais após o apito final.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Station 5: Reset de Dias OFF (Seg/Sex) */}
        {activeStation === "OFF_DAY_RESET" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Estação 5 • Segunda e Sexta-Feira • {specs.name}
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
                  {isGabriel
                    ? "Descanso Neuromuscular (Gabriel):"
                    : isDaniel
                    ? "Proteção da Prótese (Daniel):"
                    : "Recuperação Pélvica & Glúteos (Patrícia):"}
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {isGabriel
                    ? "Recuperação dos estoques de glicogênio e descanso do sistema nervoso central para manter velocidade de passada."
                    : isDaniel
                    ? "Alongamento suave das fáscias peitorais e mobilidade escapular com gravidade zero (sem cargas externas)."
                    : "Liberação miofascial com rolinho na banda iliotibial e glúteo médio para manter a passada alinhada nos 10k."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Station 6: SOS Breathing 4-7-8 */}
        {activeStation === "SOS_BREATHING" && (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Estação 6 • Protocolo Vagal do Dr. Andrew Weil
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
