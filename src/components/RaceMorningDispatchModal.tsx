"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sunrise,
  Coffee,
  Navigation,
  MapPin,
  Car,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Volume2,
  VolumeX,
  ShieldCheck,
  Power,
  ExternalLink,
  Shirt,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square,
  Moon,
  MessageSquare,
  Send,
  Calendar,
  Check,
} from "lucide-react";
import {
  calculateRaceMorningSchedule,
  DEFAULT_RACE_VENUE_PRESETS,
  generateRaceMorningVoiceBriefing,
  MARACA_HOME_ADDRESS,
  resolveVenueMetrics,
  resolveRaceDefaultStartTime,
} from "@/lib/race-logistics";
import { ProfileId, RaceLogisticsPlan, TargetRaceItem } from "@/lib/types";
import { audioCoach } from "@/lib/audio-coach";
import { evaluateRaceCalendar } from "@/lib/physiology";

interface RaceMorningDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileId;
  defaultRaceStartTime?: string;
  initialRaceId?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: "chip",
    label: "Chip de Cronometragem no Tênis",
    detail: "Preso firmemente no cadarço do tênis de placa de carbono para leitura nos tapetes oficiais.",
    checked: true,
  },
  {
    id: "bib",
    label: "Número de Peito Fixado",
    detail: "4 alfinetes de segurança no abdômen/peito da regata oficial, sem cobrir o código de barras.",
    checked: true,
  },
  {
    id: "shoes",
    label: "Tênis com Placa de Carbono & Meia Técnica",
    detail: "Meia anti-bolha sem costura + tênis de alto retorno elástico já laceado.",
    checked: true,
  },
  {
    id: "gels",
    label: "Carbogéis Estratégicos nos Bolsos",
    detail: "Géis de 30g de carboidrato no bolso ou cinto de hidratação (1 gel a cada 40-45 min de prova).",
    checked: false,
  },
  {
    id: "chafing",
    label: "Vaselina Anti-Atrito Aplicada",
    detail: "Aplicação preventiva nas axilas, mamilos, virilhas e dedos dos pés.",
    checked: false,
  },
  {
    id: "watch",
    label: "Galaxy Watch Ultra 100% Carregado",
    detail: "Bateria cheia, tela configurada para Pace Médio, Distância e FC Z2/Z3, GPS sincronizado.",
    checked: false,
  },
  {
    id: "car_keys",
    label: "Chave do Carro & Documento com Foto",
    detail: "Chave da garagem da Rua Maracá, CNH ou e-Título no celular e comprovante de inscrição.",
    checked: false,
  },
  {
    id: "water_bottle",
    label: "Garrafa de Água para o Curral de Largada",
    detail: "Pequenos goles de 50ml até 15 min antes da largada para manter os lábios hidratados.",
    checked: false,
  },
];

export function RaceMorningDispatchModal({
  isOpen,
  onClose,
  currentProfile,
  defaultRaceStartTime = "06:30",
  initialRaceId,
}: RaceMorningDispatchModalProps) {
  // Load custom stored races too
  const [storedCustomRaces, setStoredCustomRaces] = useState<TargetRaceItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_RACES_V3");
      if (stored) {
        setStoredCustomRaces(JSON.parse(stored));
      }
    } catch {}
  }, [isOpen]);

  // All scheduled races across the clan
  const danielRaces = evaluateRaceCalendar("2026-10-17", "DANIEL").map((r) => ({
    ...r,
    athleteId: "DANIEL" as const,
    athleteLabel: "Daniel (FLA • 21k)",
  }));
  const patriciaRaces = evaluateRaceCalendar("2026-10-17", "PATRICIA").map((r) => ({
    ...r,
    athleteId: "PATRICIA" as const,
    athleteLabel: "Patrícia (GRE • 14k)",
  }));
  const gabrielRaces = evaluateRaceCalendar("2026-10-17", "GABRIEL").map((r) => ({
    ...r,
    athleteId: "GABRIEL" as const,
    athleteLabel: "Gabriel (PAL • 10k)",
  }));

  const baseCalendarRaces = [
    ...(currentProfile === "PATRICIA"
      ? [...patriciaRaces, ...danielRaces, ...gabrielRaces]
      : currentProfile === "GABRIEL"
      ? [...gabrielRaces, ...danielRaces, ...patriciaRaces]
      : [...danielRaces, ...patriciaRaces, ...gabrielRaces]),
  ];

  // Append any custom races
  const customUpcoming = storedCustomRaces
    .filter((r) => !r.isCompleted && !baseCalendarRaces.some((cr) => cr.id === r.id))
    .map((r) => ({
      id: r.id,
      name: r.name,
      priority: r.priority,
      distanceKm: r.distanceKm,
      date: r.raceDate,
      isTbd: false,
      location: r.location,
      targetPaceMinKm: r.targetPaceMinKm,
      targetFinishTime: r.targetFinishTime,
      taperingWeeks: r.taperingWeeksCount,
      carbLoadingDays: r.carbLoadingDaysBefore,
      raceStartTime: r.raceStartTime,
      athleteId: r.athleteId,
      athleteLabel: `${r.athleteId === "PATRICIA" ? "Patrícia" : r.athleteId === "GABRIEL" ? "Gabriel" : "Daniel"} (Personalizada)`,
    }));

  const allScheduledRaces = [...baseCalendarRaces, ...customUpcoming];

  const initialRace =
    allScheduledRaces.find((r) => r.id === initialRaceId) ||
    allScheduledRaces.find((r) => r.athleteId === currentProfile) ||
    allScheduledRaces[0];

  const [selectedRaceId, setSelectedRaceId] = useState<string>(initialRace?.id || "race-daniel-athenas-21k-2026");
  const currentSelectedRace = allScheduledRaces.find((r) => r.id === selectedRaceId) || initialRace;

  const [selectedPresetId, setSelectedPresetId] = useState<string>("athenas_marginal");
  const [raceStartTime, setRaceStartTime] = useState<string>(() => {
    if (typeof window !== "undefined" && initialRace) {
      const savedTime = localStorage.getItem(`RACE_START_TIME_${initialRace.id}`);
      if (savedTime) return savedTime;
    }
    if (initialRace) {
      return (initialRace as any).raceStartTime || resolveRaceDefaultStartTime(initialRace.distanceKm, initialRace.name);
    }
    return defaultRaceStartTime;
  });
  const [customVenue, setCustomVenue] = useState<string>(currentSelectedRace?.location || "");
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState<boolean>(false);
  const [tuyaStatusFeedback, setTuyaStatusFeedback] = useState<string | null>(null);
  const [isTriggeringTuya, setIsTriggeringTuya] = useState<boolean>(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [activeTab, setActiveTab] = useState<"TIMELINE" | "CHECKLIST" | "TACO_BREAKFAST" | "HARDWARE">("TIMELINE");

  // Handle switching to a scheduled race
  const handleSelectRace = (raceId: string) => {
    setSelectedRaceId(raceId);
    if (raceId === "custom") {
      setCustomVenue("");
      return;
    }
    const found = allScheduledRaces.find((r) => r.id === raceId);
    if (found) {
      const resolved = resolveVenueMetrics(found.location);
      setSelectedPresetId(resolved.matchedPresetId);
      setCustomVenue(found.location);
      let targetTime = (found as any).raceStartTime || resolveRaceDefaultStartTime(found.distanceKm, found.name);
      if (typeof window !== "undefined") {
        const savedTime = localStorage.getItem(`RACE_START_TIME_${found.id}`);
        if (savedTime) targetTime = savedTime;
      }
      setRaceStartTime(targetTime);
    }
  };

  const handleUpdateRaceStartTime = (newTime: string) => {
    setRaceStartTime(newTime);
    if (typeof window !== "undefined" && selectedRaceId && selectedRaceId !== "custom") {
      try {
        localStorage.setItem(`RACE_START_TIME_${selectedRaceId}`, newTime);
      } catch {}
    }
  };

  // Sync when initialRaceId or currentProfile changes and modal opens
  useEffect(() => {
    if (!isOpen) return;
    const target =
      (initialRaceId ? allScheduledRaces.find((r) => r.id === initialRaceId) : null) ||
      allScheduledRaces.find((r) => r.athleteId === currentProfile) ||
      allScheduledRaces[0];
    if (target) {
      handleSelectRace(target.id);
    }
  }, [isOpen, initialRaceId, currentProfile]);

  // Load checklist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kinetix_race_morning_checklist");
      if (saved) {
        try {
          setChecklist(JSON.parse(saved));
        } catch {
          // keep default
        }
      }
    }
  }, []);

  const handleToggleChecklist = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kinetix_race_morning_checklist", JSON.stringify(updated));
    }
  };

  const handleResetChecklist = () => {
    const reset = DEFAULT_CHECKLIST.map((item) => ({ ...item, checked: false }));
    setChecklist(reset);
    if (typeof window !== "undefined") {
      localStorage.setItem("kinetix_race_morning_checklist", JSON.stringify(reset));
    }
  };

  // Calculate logistics schedule dynamically adapted to the race and start time!
  const plan: RaceLogisticsPlan = calculateRaceMorningSchedule({
    raceStartTime,
    selectedPresetId,
    customVenueName: customVenue.trim() || undefined,
    venueArrivalBufferMinutes: 60, // Exact 1 hour buffer as requested
    raceName: currentSelectedRace?.name || "Athenas Mizuno Run Longer",
    raceDate: currentSelectedRace?.date || undefined,
    athleteId: currentSelectedRace?.athleteId || (currentProfile === "PATRICIA" ? "PATRICIA" : "DANIEL"),
    hotBeveragePreference:
      currentSelectedRace?.athleteId === "PATRICIA"
        ? "MATE"
        : currentSelectedRace?.athleteId === "DANIEL"
        ? "CAFEZINHO"
        : "BOTH",
  });

  if (!isOpen) return null;

  const handleSpeakBriefing = () => {
    if (isSpeakingBriefing) {
      audioCoach.stopSpeaking();
      setIsSpeakingBriefing(false);
    } else {
      const text = generateRaceMorningVoiceBriefing(plan);
      audioCoach.speakCoachBriefing(text);
      setIsSpeakingBriefing(true);
      setTimeout(() => setIsSpeakingBriefing(false), 24000);
    }
  };

  const handleSendWhatsAppSchedule = async () => {
    setIsSendingWhatsApp(true);
    setTuyaStatusFeedback("📲 Enviando cronograma matinal via WhatsApp Evolution API...");

    try {
      const bevLabel =
        plan.hotBeveragePreference === "MATE"
          ? "Mate Gaúcho da Patrícia (switch_2)"
          : plan.hotBeveragePreference === "CAFEZINHO"
          ? "Cafezinho de Daniel (switch_1)"
          : "Cafezinho + Mate (Ambos os canais)";

      const message = `🌅 *BIO-TRIAD OS • CRONOGRAMA DE ALVORADA DE PROVA*\n\n` +
        `🏃 *Prova:* ${plan.raceName}\n` +
        `🏁 *Horário da Largada:* ${plan.raceStartTime}\n` +
        `🏟️ *Chegada à Arena (-1h):* ${plan.venueArrivalTarget}\n` +
        `🚗 *Saída da Garagem:* ${plan.departureFromHomeTime} (Rua Maracá, 132 • ${plan.distanceKm} km • ${plan.totalTransitMinutes} min com vagas)\n` +
        `☕ *Bebidas na Tomada Dupla:* ${plan.hotDrinksBrewTime} (${bevLabel})\n` +
        `☀️ *Alvorada Solar no Quarto:* ${plan.circadianSunriseTime} (Luz âmbar gradual 2700K)\n` +
        `🍞 *Café TACO:* ${plan.breakfastTime} (Sourdough + Amendoim + 400ml Água)\n` +
        `😴 *Horário Ideal para Dormir na Véspera:* ${plan.recommendedBedtime} (8h de sono N3)\n\n` +
        `🗺️ *Rota GPS Waze:* ${plan.wazeUrl}\n\n` +
        `_Boa prova, Clã Lopes! Foco na meta!_`;

      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RACE_MORNING_BRIEFING",
          workoutSummary: message,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setTuyaStatusFeedback("✅ Cronograma enviado com sucesso no WhatsApp do Clã!");
      } else {
        setTuyaStatusFeedback("⚠️ Cronograma registrado no sistema (WhatsApp em modo simulação)");
      }
    } catch {
      setTuyaStatusFeedback("⚠️ Disparo registrado localmente");
    } finally {
      setIsSendingWhatsApp(false);
      setTimeout(() => setTuyaStatusFeedback(null), 5000);
    }
  };

  const handleTriggerTuya = async (sceneCode: string, label: string) => {
    setIsTriggeringTuya(true);
    setTuyaStatusFeedback(`⚡ Despachando comando Tuya Cloud: ${label}...`);

    try {
      const res = await fetch("/api/tuya/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: sceneCode }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setTuyaStatusFeedback(`✅ Sucesso! Hardware acionado: ${label}`);
      } else {
        setTuyaStatusFeedback(`⚠️ Hardware acionado em modo simulação: ${label}`);
      }
    } catch {
      setTuyaStatusFeedback(`⚠️ Disparo registrado localmente: ${label}`);
    } finally {
      setIsTriggeringTuya(false);
      setTimeout(() => setTuyaStatusFeedback(null), 5000);
    }
  };

  const checkedCount = checklist.filter((i) => i.checked).length;
  const checklistPct = Math.round((checkedCount / checklist.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0B0F17] border border-cyan-500/30 shadow-[0_20px_70px_rgba(6,182,212,0.25)] text-gray-100 overflow-hidden font-sans">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0E1422]/90 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="h-full w-full bg-[#0B0F17] rounded-2xl flex items-center justify-center">
                <Sunrise className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-mono uppercase">
                  Alvorada de Prova & Despacho Tático
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  REGRA -1h
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                <span className="text-cyan-300 font-bold">Rua Maracá, 132</span>
                <span className="text-gray-500">•</span>
                <span>São Paulo, SP (04313-210)</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">Chegada 1h antes no local</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakBriefing}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                isSpeakingBriefing
                  ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse"
                  : "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25"
              }`}
              title="Ouvir briefing de voz em português com os horários de saída e prova"
            >
              {isSpeakingBriefing ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  <span className="hidden sm:inline">Parar Voz</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  <span className="hidden sm:inline">🎙️ Ouvir Briefing</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Real-time Hardware Notification Toast */}
        {tuyaStatusFeedback && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-cyan-950 via-blue-950 to-black border-b border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400 animate-spin" />
              <span>{tuyaStatusFeedback}</span>
            </div>
            <button
              onClick={() => setTuyaStatusFeedback(null)}
              className="text-gray-400 hover:text-white text-xs"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Quick Config Dial (Race Selector, Venue, Gun Time, Transit, Bedtime) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0E1524] via-[#101726] to-[#0D121F] border border-cyan-500/20 shadow-lg space-y-4">
            
            {/* Top Bar: Scheduled Race Auto-Sync & Eve Bedtime */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Corrida Programada no Sistema (Adaptação Inteligente)</span>
                </label>
                <select
                  value={selectedRaceId}
                  onChange={(e) => handleSelectRace(e.target.value)}
                  className="w-full bg-[#080B11] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 font-mono font-bold focus:border-amber-400 focus:outline-none"
                >
                  <optgroup label="Corridas do Clã Lopes">
                    {allScheduledRaces.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} • {r.athleteLabel} ({r.distanceKm}k) • {r.date || "Data a definir"}
                      </option>
                    ))}
                  </optgroup>
                  <option value="custom">✏️ Outra Prova / Arena Personalizada...</option>
                </select>
              </div>

              {/* Eve Bedtime Recommendation Badge */}
              <div className="sm:self-end flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-mono">
                <Moon className="h-4 w-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block">DORMIR NA VÉSPERA (8H N3):</span>
                  <span className="font-bold text-purple-300">Deitar até {plan.recommendedBedtime}</span>
                </div>
              </div>
            </div>

            {/* Grid: Venue, Gun Time, Transit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Venue Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Local de Destino da Prova</span>
                </label>
                <select
                  value={selectedPresetId}
                  onChange={(e) => {
                    setSelectedPresetId(e.target.value);
                    const preset = DEFAULT_RACE_VENUE_PRESETS.find((p) => p.id === e.target.value);
                    if (preset) {
                      handleUpdateRaceStartTime(preset.defaultRaceStartTime);
                      setCustomVenue(preset.locationLabel);
                    }
                  }}
                  className="w-full bg-[#080B11] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  {DEFAULT_RACE_VENUE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  <option value="custom">✏️ Outro Local Personalizado...</option>
                </select>
                {selectedPresetId === "custom" && (
                  <input
                    type="text"
                    value={customVenue}
                    onChange={(e) => setCustomVenue(e.target.value)}
                    placeholder="Ex: Obelisco Ibirapuera, Portão 3"
                    className="w-full mt-2 bg-[#080B11] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                )}
              </div>

              {/* Gun Time Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Hora da Largada Oficial (Adaptável)</span>
                </label>
                <div className="space-y-1.5">
                  <input
                    type="time"
                    value={raceStartTime}
                    onChange={(e) => handleUpdateRaceStartTime(e.target.value)}
                    className="w-full bg-[#080B11] border border-white/15 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-1">
                    {["05:30", "06:00", "06:15", "06:30", "07:00", "07:30", "08:00"].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleUpdateRaceStartTime(t)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          raceStartTime === t
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                            : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transit & Arrival Rule Badge */}
              <div className="flex flex-col justify-center p-3 rounded-xl bg-black/40 border border-cyan-500/30">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">DESLOCAMENTO DOMINGO:</span>
                  <span className="text-cyan-400 font-bold">{plan.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-1">
                  <span className="text-gray-400">TEMPO DE CARRO + VAGAS:</span>
                  <span className="text-white font-bold">{plan.totalTransitMinutes} min</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    CHEGADA NA ARENA (-1H):
                  </span>
                  <span className="text-sm font-mono font-black text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/40">
                    {plan.venueArrivalTarget}
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Action Buttons: Waze, Google Maps, WhatsApp, Tuya Full Alvorada */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={plan.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 text-xs font-mono font-bold transition-all shadow-sm"
                  title="Abrir navegação por GPS no Waze a partir da Rua Maracá, 132"
                >
                  <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Abrir no Waze</span>
                  <ExternalLink className="h-3 w-3 text-cyan-400" />
                </a>

                <a
                  href={plan.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 text-xs font-mono font-bold transition-all shadow-sm"
                  title="Abrir rota completa no Google Maps a partir da Rua Maracá, 132"
                >
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3 text-blue-400" />
                </a>

                <button
                  onClick={handleSendWhatsAppSchedule}
                  disabled={isSendingWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600/20 border border-green-500/40 text-green-300 hover:bg-green-600/30 text-xs font-mono font-bold transition-all shadow-sm"
                  title="Enviar o cronograma adaptado para o WhatsApp da família"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-green-400" />
                  <span>{isSendingWhatsApp ? "Enviando..." : "📲 WhatsApp"}</span>
                </button>
              </div>

              {/* Tuya One-Tap Triggers */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    handleTriggerTuya(
                      "RACE_MORNING_ALVORADA",
                      "Alvorada de Prova (Luz Quarto + Tomada Dupla Café/Mate + Closet)"
                    )
                  }
                  disabled={isTriggeringTuya}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-orange-600/30 border border-amber-500/50 text-amber-200 hover:text-white hover:bg-amber-600/40 text-xs font-mono font-bold transition-all shadow-md"
                  title="Testar agora o ciclo de alvorada nos dispositivos físicos da casa"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>⚡ Testar Alvorada Tuya</span>
                </button>

                <button
                  onClick={() =>
                    handleTriggerTuya(
                      plan.hotBeveragePreference === "MATE"
                        ? "MATE_ON"
                        : plan.hotBeveragePreference === "CAFEZINHO"
                        ? "CAFEZINHO_ON"
                        : "BEBIDAS_DUAL_ON",
                      `Tomada Dupla (${plan.hotBeveragePreference === "MATE" ? "Mate" : plan.hotBeveragePreference === "CAFEZINHO" ? "Cafezinho" : "Café & Mate"})`
                    )
                  }
                  disabled={isTriggeringTuya}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-600/30 text-xs font-mono font-bold transition-all shadow-sm"
                  title="Ligar cafeteira e/ou chaleira de acordo com o atleta da prova"
                >
                  <Coffee className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    Tomada ({plan.hotBeveragePreference === "MATE" ? "Mate" : plan.hotBeveragePreference === "CAFEZINHO" ? "Café" : "Café & Mate"})
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleTriggerTuya(
                      "ECO_ALL_OFF",
                      "Modo Fui Correr (Eco All-Off: Luzes, Standbys e Tomadas Desligadas)"
                    )
                  }
                  disabled={isTriggeringTuya}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-mono font-bold transition-all shadow-sm"
                  title="Desligar tudo na casa ao sair para a prova"
                >
                  <Power className="h-3.5 w-3.5 text-red-400" />
                  <span>Modo 'Fui Correr'</span>
                </button>
              </div>

            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("TIMELINE")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === "TIMELINE"
                    ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Cronograma Matinal ({plan.steps.length} Etapas)</span>
              </button>

              <button
                onClick={() => setActiveTab("CHECKLIST")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === "CHECKLIST"
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Checklist de Saída ({checklistPct}%)</span>
              </button>

              <button
                onClick={() => setActiveTab("TACO_BREAKFAST")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === "TACO_BREAKFAST"
                    ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Café da Manhã TACO (Nutrição)</span>
              </button>

              <button
                onClick={() => setActiveTab("HARDWARE")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === "HARDWARE"
                    ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Hardware Tuya Mapeado</span>
              </button>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Saída de Casa:{" "}
                <span className="text-white font-bold">{plan.departureFromHomeTime}</span>
              </span>
            </div>
          </div>

          {/* TAB 1: TIMELINE DE ALVORADA */}
          {activeTab === "TIMELINE" && (
            <div className="space-y-3">
              {/* Highlight Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-[#0E1524] border border-amber-500/30 text-center">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">ALVORADA SOLAR</div>
                  <div className="text-xl font-mono font-black text-amber-300 mt-0.5">
                    {plan.circadianSunriseTime}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Quarto Casal 2700K</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1524] border border-emerald-500/30 text-center">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">TOMADA DUPLA</div>
                  <div className="text-xl font-mono font-black text-emerald-300 mt-0.5">
                    {plan.hotDrinksBrewTime}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Café + Mate Gaúcho</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1524] border border-cyan-500/30 text-center">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">SAÍDA RUA MARACÁ</div>
                  <div className="text-xl font-mono font-black text-cyan-300 mt-0.5">
                    {plan.departureFromHomeTime}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Eco All-Off & Waze</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E1524] border border-purple-500/30 text-center">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">CHEGADA (-1H)</div>
                  <div className="text-xl font-mono font-black text-purple-300 mt-0.5">
                    {plan.venueArrivalTarget}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Largada às {plan.raceStartTime}</div>
                </div>
              </div>

              {/* Step by step timeline items */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/20 space-y-4 pt-2">
                {plan.steps.map((step, idx) => {
                  const isGun = step.category === "GUN";
                  const isVenue = step.category === "VENUE";
                  const isDep = step.category === "LOGISTICS";
                  const isBev = step.category === "NUTRITION";
                  const isCirc = step.category === "CIRCADIAN";

                  return (
                    <div
                      key={step.id}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        isGun
                          ? "bg-gradient-to-r from-amber-950/40 via-red-950/30 to-black border-amber-500/50 shadow-lg shadow-amber-500/10"
                          : isVenue
                          ? "bg-[#0E172A] border-purple-500/40 shadow-sm"
                          : isDep
                          ? "bg-[#0D1626] border-cyan-500/40 shadow-sm"
                          : "bg-[#0A0E18] border-white/10 hover:border-white/20"
                      }`}
                    >
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-4 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          isGun
                            ? "bg-amber-400 border-black animate-ping"
                            : isVenue
                            ? "bg-purple-500 border-[#0B0F17]"
                            : isDep
                            ? "bg-cyan-400 border-[#0B0F17]"
                            : "bg-gray-600 border-[#0B0F17]"
                        }`}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-sm sm:text-base font-black text-white bg-black/50 px-2.5 py-0.5 rounded-lg border border-white/15">
                            {step.timestamp}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                              isGun
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : isVenue
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                : isDep
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                : isBev
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-white/10 text-gray-300 border border-white/15"
                            }`}
                          >
                            {step.badgeLabel}
                          </span>
                        </div>

                        {/* Relative Offset */}
                        <div className="text-[11px] font-mono text-gray-400 flex items-center gap-2">
                          <span>
                            {step.relativeMinutesToGun < 0
                              ? `${step.relativeMinutesToGun} min da largada`
                              : step.relativeMinutesToGun === 0
                              ? "LARGADA 🏁"
                              : `+${step.relativeMinutesToGun} min`}
                          </span>
                          {step.tuyaAction && (
                            <button
                              onClick={() =>
                                handleTriggerTuya(step.tuyaAction!, step.title)
                              }
                              className="px-2 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-900/40 text-[10px] font-mono font-bold transition-all"
                            >
                              ⚡ Testar Agora
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white font-mono mt-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-300 font-sans mt-1 leading-relaxed">
                        {step.description}
                      </p>

                      {step.tuyaDeviceLabel && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-gray-400">
                          <Zap className="h-3 w-3 text-cyan-400" />
                          <span>Hardware Tuya:</span>
                          <span className="text-cyan-300 font-bold">{step.tuyaDeviceLabel}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHECKLIST DE SAÍDA */}
          {activeTab === "CHECKLIST" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0E1524] border border-amber-500/30">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white">
                    Checklist Pré-Garagem (Rua Maracá, 132)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Conferência dos itens cruciais antes de girar a chave do carro para a prova.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono text-gray-400">CONCLUÍDO:</span>
                    <div className="text-lg font-mono font-black text-amber-300">
                      {checkedCount} / {checklist.length} ({checklistPct}%)
                    </div>
                  </div>
                  <button
                    onClick={handleResetChecklist}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Resetar Checklist"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${checklistPct}%` }}
                />
              </div>

              {/* Checklist Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      item.checked
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                        : "bg-[#090D15] border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.checked ? (
                        <CheckSquare className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-mono font-bold ${
                          item.checked ? "line-through text-gray-400" : "text-white"
                        }`}
                      >
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-sans mt-0.5 leading-tight">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAFÉ DA MANHÃ TACO */}
          {activeTab === "TACO_BREAKFAST" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0E1524] to-black border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold font-mono text-white">
                    Protocolo de Nutrição Pré-Prova TACO (Dieta dos Campeões)
                  </h3>
                </div>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  O café da manhã no dia da prova tem como único objetivo encher os depósitos de
                  glicogênio hepático esvaziados no jejum noturno, sem sobrecarregar o trato gastrointestinal.
                  Horário alvo: <strong className="text-emerald-300">{plan.breakfastTime}</strong> (~2h30 a 2h antes da largada).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daniel's TACO Setup */}
                <div className="p-4 rounded-2xl bg-[#090D15] border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      Daniel • 21 km (Athenas Mizuno)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Glicogênio Máximo
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300 font-sans">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>
                        <strong>2 fatias de Pão Sourdough (Fermentação Natural):</strong> carboidrato complexo de baixo índice glicêmico e fácil digestão.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>
                        <strong>1 colher de Pasta de Amendoim Integral + 1 colher de Mel:</strong> glicose + frutose para absorção por múltiplos transportadores intestinais (SGLT1 e GLUT5).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>
                        <strong>Cafezinho Expresso (Tomada Dupla switch_1):</strong> 1 dose dupla sem açúcar às {plan.hotDrinksBrewTime} (3mg/kg de cafeína para pico plasmático na largada).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>
                        <strong>400ml Água + 350mg Sódio:</strong> hiperidratação osmolar para evitar cãibras nos km 16 a 21.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Patricia's TACO Setup */}
                <div className="p-4 rounded-2xl bg-[#090D15] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                      Patrícia • 14 km (Athenas Mizuno)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Leveza & Digestão
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300 font-sans">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        <strong>1 Tostada de Pão Branco ou Sourdough:</strong> carboidrato refinado sem fibras para trânsito intestinal acelerado e leveza total.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        <strong>1 colher de Geleia de Frutas Vermelhas ou Mel:</strong> energia rápida sem risco de desconforto gástrico.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        <strong>Mate & Chimarrão Gaúcho (Tomada Dupla switch_2):</strong> infusão quente rica em antioxidantes, ativada às {plan.hotDrinksBrewTime} com auto-off de 10 min.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        <strong>350ml de Água com Eletrólitos:</strong> manter osmolaridade plasmática perfeita para o ritmo constante de 14 km.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HARDWARE TUYA MAPEADO */}
          {activeTab === "HARDWARE" && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#0E1524] border border-purple-500/30">
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  Mapeamento de Hardware Tuya IoT (Residência do Clã Lopes)
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Dispositivos físicos integrados via OpenAPI Tuya US (OAuth 2.0).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      Tomada Dupla (Café & Mate)
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">Dual Smart Plug</span>
                  </div>
                  <code className="text-[10px] text-gray-400 block font-mono">
                    ID: ebc4a8285904c4bd43crx7
                  </code>
                  <p className="text-[11px] text-gray-300 font-sans">
                    Canal 1: switch_1 (Cafezinho Daniel) • Canal 2: switch_2 (Mate Gaúcho Patrícia)
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Led Quarto Casal & Luz Principal
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">Circadiano</span>
                  </div>
                  <code className="text-[10px] text-gray-400 block font-mono">
                    ID: eb4deff019cb6627614ic8 / eb6bb3db2a18ae84dbsio8
                  </code>
                  <p className="text-[11px] text-gray-300 font-sans">
                    Amanhecer solar gradativo em 2700K âmbar sem taquicardia sonoro.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300">
                      Leds do Armário & Closet
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">Kit Uniformes</span>
                  </div>
                  <code className="text-[10px] text-gray-400 block font-mono">
                    ID: eb7e8e6b7909ed343dfawf (Cabide) / ebb5f514f5a91f36de9ix7 (Porta)
                  </code>
                  <p className="text-[11px] text-gray-300 font-sans">
                    Luz branca 4000K neutra para vestir regata, chip e tênis com comodidade.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-300">
                      Modo Eco 'Fui Correr'
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">Desligamento Total</span>
                  </div>
                  <code className="text-[10px] text-gray-400 block font-mono">
                    Todos os 7 dispositivos da casa
                  </code>
                  <p className="text-[11px] text-gray-300 font-sans">
                    Corta standby de TVs, luzes da suíte, sala, cafeteira e ar-condicionado.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E1422] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              Origem Travada:{" "}
              <strong className="text-white">Rua Maracá, 132</strong> • Chegada Antecipada:{" "}
              <strong className="text-amber-300">{plan.venueArrivalTarget}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              Fechar Painel
            </button>
            <a
              href={plan.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Car className="h-4 w-4" />
              <span>Navegar via Waze ({plan.totalTransitMinutes} min)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
