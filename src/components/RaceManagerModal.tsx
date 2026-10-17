"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Shield,
  Zap,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Gauge,
  Send,
  Trash2,
  ArrowRight,
  Award,
  Medal,
  Timer,
  Share2,
  Edit3,
  Check,
  Star,
  Users,
  CloudSun,
} from "lucide-react";
import { TargetRaceItem, RacePriority, ProfileId } from "@/lib/types";
import { calculateBasePaceRecalibration } from "@/lib/physiology";

interface RaceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ProfileId;
}

const DEFAULT_RACES: TargetRaceItem[] = [
  // DANIEL
  {
    id: "daniel-meia-sp-2026",
    athleteId: "DANIEL",
    name: "Meia Maratona Internacional de SP 2026 (21k) • OFICIAL CONCLUÍDA",
    raceDate: "2026-04-12",
    distanceKm: 21.097,
    location: "São Paulo, SP - Ibirapuera",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:30",
    targetFinishTime: "01:56:00",
    taperingWeeksCount: 3,
    carbLoadingDaysBefore: 3,
    isCompleted: true,
    actualFinishTime: "01:54:12",
    actualGunTime: "01:56:45",
    actualPaceMinKm: "5:25",
    overallRank: "389º / 4.250",
    categoryRank: "24º / 512",
    genderRank: "330º / 2.820",
    ageGroupCategory: "M50-54",
    podiumAward: "🥈 Top 5% Categoria (M50-54) • Recorde Pessoal (RP)",
    percentileRankPct: 95,
    raceNotes: "Excelente cadência 178 spm, ombro direito protegido sem balanço lesivo, Z3 mantida na subida da 23 de Maio.",
  },
  {
    id: "daniel-athenas-2026",
    athleteId: "DANIEL",
    name: "Athenas Mizuno Run Longer 21k • AMANHÃ!",
    raceDate: "2026-10-18",
    distanceKm: 21.097,
    location: "São Paulo, SP - Marginal Pinheiros",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:26",
    targetFinishTime: "01:54:40",
    taperingWeeksCount: 2,
    carbLoadingDaysBefore: 3,
    isCalibrationBase: true,
  },
  {
    id: "daniel-olga-kos-2026",
    athleteId: "DANIEL",
    name: "Corrida Olga Kos 2026 (10k)",
    raceDate: "2026-12-20",
    distanceKm: 10.0,
    location: "São Paulo, SP - Pacaembu",
    priority: "P2_PREP",
    targetPaceMinKm: "5:00",
    targetFinishTime: "00:50:00",
    taperingWeeksCount: 1,
    carbLoadingDaysBefore: 2,
  },
  {
    id: "daniel-sp-inter-2027",
    athleteId: "DANIEL",
    name: "Maratona Internacional de SP 2027 (Meia 21k)",
    raceDate: "2027-04-11",
    distanceKm: 21.097,
    location: "São Paulo, SP - Ibirapuera",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:20",
    targetFinishTime: "01:52:30",
    taperingWeeksCount: 3,
    carbLoadingDaysBefore: 3,
  },
  {
    id: "daniel-nike-sp-city-2027",
    athleteId: "DANIEL",
    name: "Nike SP City Marathon 2027 (Meia 21k)",
    raceDate: "2027-07-25",
    distanceKm: 21.097,
    location: "São Paulo, SP - Pacaembu / Jockey",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:15",
    targetFinishTime: "01:50:45",
    taperingWeeksCount: 3,
    carbLoadingDaysBefore: 3,
  },

  // PATRICIA
  {
    id: "patricia-circuito-athenas-2026",
    athleteId: "PATRICIA",
    name: "Circuito Athenas SP 2026 - Etapa 1 (10k) • OFICIAL CONCLUÍDA",
    raceDate: "2026-05-17",
    distanceKm: 10.0,
    location: "São Paulo, SP - Marginal Pinheiros",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:50",
    targetFinishTime: "00:58:20",
    taperingWeeksCount: 2,
    carbLoadingDaysBefore: 3,
    isCompleted: true,
    actualFinishTime: "00:57:40",
    actualGunTime: "00:59:15",
    actualPaceMinKm: "5:46",
    overallRank: "198ª / 3.400",
    categoryRank: "12ª / 380",
    genderRank: "84ª / 1.650",
    ageGroupCategory: "F55-59",
    podiumAward: "👑 Top 3% Faixa Etária (F55-59) • Recorde Pessoal (RP)",
    percentileRankPct: 97,
    raceNotes: "Estabilidade glútea exemplar, sem valgo dinâmico de joelho, hidratação tática perfeita.",
  },
  {
    id: "patricia-athenas-2026",
    athleteId: "PATRICIA",
    name: "Athenas Mizuno Run Longer 14k • AMANHÃ!",
    raceDate: "2026-10-18",
    distanceKm: 14.0,
    location: "São Paulo, SP - Marginal Pinheiros",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:55",
    targetFinishTime: "01:22:50",
    taperingWeeksCount: 1,
    carbLoadingDaysBefore: 3,
    isCalibrationBase: true,
  },
  {
    id: "patricia-venus-2026",
    athleteId: "PATRICIA",
    name: "Meia Maratona Vênus 2026 (21k)",
    raceDate: "2026-11-22",
    distanceKm: 21.097,
    location: "São Paulo, SP - Jockey Club",
    priority: "P1_TARGET",
    targetPaceMinKm: "6:05",
    targetFinishTime: "02:08:20",
    taperingWeeksCount: 2,
    carbLoadingDaysBefore: 3,
  },
  {
    id: "patricia-olga-kos-2026",
    athleteId: "PATRICIA",
    name: "Corrida Olga Kos 2026 (10k)",
    raceDate: "2026-12-20",
    distanceKm: 10.0,
    location: "São Paulo, SP - Pacaembu",
    priority: "P2_PREP",
    targetPaceMinKm: "5:50",
    targetFinishTime: "00:58:20",
    taperingWeeksCount: 1,
    carbLoadingDaysBefore: 2,
  },
  {
    id: "patricia-athenas-2027",
    athleteId: "PATRICIA",
    name: "Athenas Mizuno Run Longer 2027 (14k) • INSCRITA",
    raceDate: "2027-10-17",
    distanceKm: 14.0,
    location: "São Paulo, SP",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:45",
    targetFinishTime: "01:20:30",
    taperingWeeksCount: 2,
    carbLoadingDaysBefore: 3,
  },
  {
    id: "patricia-venus-2027",
    athleteId: "PATRICIA",
    name: "Meia Maratona Vênus 2027 (21k) • INSCRITA",
    raceDate: "2027-11-21",
    distanceKm: 21.097,
    location: "São Paulo, SP - Jockey Club",
    priority: "P1_TARGET",
    targetPaceMinKm: "5:55",
    targetFinishTime: "02:04:50",
    taperingWeeksCount: 3,
    carbLoadingDaysBefore: 3,
  },
  {
    id: "patricia-olga-kos-2027",
    athleteId: "PATRICIA",
    name: "Corrida Olga Kos 2027 (10k) • INSCRITA",
    raceDate: "2027-12-19",
    distanceKm: 10.0,
    location: "São Paulo, SP - Ibirapuera",
    priority: "P2_PREP",
    targetPaceMinKm: "5:40",
    targetFinishTime: "00:56:40",
    taperingWeeksCount: 1,
    carbLoadingDaysBefore: 2,
  },

  // GABRIEL
  {
    id: "gabriel-gonzaguinha-2026",
    athleteId: "GABRIEL",
    name: "Corrida Sargento Gonzaguinha 2026 (5k) • OFICIAL CONCLUÍDA",
    raceDate: "2026-06-21",
    distanceKm: 5.0,
    location: "São Paulo, SP - Zona Norte",
    priority: "P1_TARGET",
    targetPaceMinKm: "4:20",
    targetFinishTime: "00:21:40",
    taperingWeeksCount: 2,
    carbLoadingDaysBefore: 2,
    isCompleted: true,
    actualFinishTime: "00:21:15",
    actualGunTime: "00:21:40",
    actualPaceMinKm: "4:15",
    overallRank: "78º / 1.850",
    categoryRank: "6º / 220",
    genderRank: "65º / 1.250",
    ageGroupCategory: "M20-24",
    podiumAward: "⚡ Top 3% Categoria (M20-24) • Arrancada Alviverde",
    percentileRankPct: 97,
    raceNotes: "Potência pura anaeróbia, ritmo sustentado na subida da ponte, sprint final a 3:30/km.",
  },
  {
    id: "gabriel-olga-kos-2026",
    athleteId: "GABRIEL",
    name: "Corrida Olga Kos 2026 (10k)",
    raceDate: "2026-12-20",
    distanceKm: 10.0,
    location: "São Paulo, SP - Ibirapuera",
    priority: "P2_PREP",
    targetPaceMinKm: "4:40",
    targetFinishTime: "00:46:40",
    taperingWeeksCount: 1,
    carbLoadingDaysBefore: 2,
  },
  {
    id: "gabriel-athenas-2027",
    athleteId: "GABRIEL",
    name: "Circuito Athenas SP 2027 (10k)",
    raceDate: "2027-05-23",
    distanceKm: 10.0,
    location: "São Paulo, SP - Pacaembu",
    priority: "P1_TARGET",
    targetPaceMinKm: "4:25",
    targetFinishTime: "00:44:10",
    taperingWeeksCount: 2,
    carbLoadingDaysBefore: 2,
  },
];

export function RaceManagerModal({
  isOpen,
  onClose,
  activeProfile,
}: RaceManagerModalProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<"DANIEL" | "PATRICIA" | "GABRIEL">(
    activeProfile === "PATRICIA" ? "PATRICIA" : activeProfile === "GABRIEL" ? "GABRIEL" : "DANIEL"
  );
  const [races, setRaces] = useState<TargetRaceItem[]>(DEFAULT_RACES);
  const [activeTab, setActiveTab] = useState<"RESULTS" | "CALIBRATOR" | "CALENDAR" | "NEW_RACE">("RESULTS");

  // Calibrator Input State
  const [calibHours, setCalibHours] = useState<number>(1);
  const [calibMinutes, setCalibMinutes] = useState<number>(54);
  const [calibSeconds, setCalibSeconds] = useState<number>(40);
  const [calibDistanceKm, setCalibDistanceKm] = useState<number>(21.097);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form State for New Race
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("2027-06-15");
  const [newDistance, setNewDistance] = useState("21.097");
  const [newLocation, setNewLocation] = useState("São Paulo, SP");
  const [newPriority, setNewPriority] = useState<RacePriority>("P1_TARGET");
  const [newTargetPace, setNewTargetPace] = useState("5:20");
  const [newTargetTime, setNewTargetTime] = useState("01:52:30");
  const [newTaperingWeeks, setNewTaperingWeeks] = useState(2);
  const [newCarbDays, setNewCarbDays] = useState(3);
  const [newRaceStartTime, setNewRaceStartTime] = useState("06:30");

  // Editing/Registering Official Result Modal State
  const [editingRace, setEditingRace] = useState<TargetRaceItem | null>(null);
  const [resChipHours, setResChipHours] = useState(1);
  const [resChipMinutes, setResChipMinutes] = useState(54);
  const [resChipSeconds, setResChipSeconds] = useState(0);
  const [resGunTime, setResGunTime] = useState("01:56:00");
  const [resOverallRank, setResOverallRank] = useState("389º / 4.250");
  const [resCategoryRank, setResCategoryRank] = useState("24º / 512");
  const [resGenderRank, setResGenderRank] = useState("330º / 2.820");
  const [resAgeGroup, setResAgeGroup] = useState(
    selectedAthlete === "DANIEL" ? "M50-54" : selectedAthlete === "PATRICIA" ? "F55-59" : "M20-24"
  );
  const [resAward, setResAward] = useState("🥈 Top 5% Categoria • Recorde Pessoal (RP)");
  const [resNotes, setResNotes] = useState("");
  const [resSyncCalibrator, setResSyncCalibrator] = useState(true);

  // Easter Egg State
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_RACES_V3");
      if (stored) {
        setRaces(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read races from localStorage", e);
    }
  }, []);

  // Update calibrator defaults when athlete changes
  useEffect(() => {
    if (selectedAthlete === "PATRICIA") {
      setCalibDistanceKm(14.0);
      setCalibHours(1);
      setCalibMinutes(22);
      setCalibSeconds(50);
      setResAgeGroup("F55-59");
    } else if (selectedAthlete === "GABRIEL") {
      setCalibDistanceKm(10.0);
      setCalibHours(0);
      setCalibMinutes(45);
      setCalibSeconds(0);
      setResAgeGroup("M20-24");
    } else {
      setCalibDistanceKm(21.097);
      setCalibHours(1);
      setCalibMinutes(54);
      setCalibSeconds(40);
      setResAgeGroup("M50-54");
    }
  }, [selectedAthlete]);

  if (!isOpen) return null;

  const totalCalibSeconds = calibHours * 3600 + calibMinutes * 60 + calibSeconds;
  const calibrationResults = calculateBasePaceRecalibration(calibDistanceKm, totalCalibSeconds);

  const saveRacesToStorage = (updated: TargetRaceItem[]) => {
    setRaces(updated);
    try {
      localStorage.setItem("BIO_TRIAD_RACES_V3", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  const handleSaveCalibration = () => {
    try {
      const calibData = {
        athleteId: selectedAthlete,
        date: "2026-10-18",
        race: selectedAthlete === "PATRICIA" ? "Athenas Mizuno 14k" : "Athenas Mizuno 21k",
        distanceKm: calibDistanceKm,
        finishTimeSeconds: totalCalibSeconds,
        basePace: calibrationResults.basePaceFormatted,
        zones: calibrationResults.recalibratedZones,
        projections: calibrationResults.projections,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`CALIBRATION_BASE_${selectedAthlete}`, JSON.stringify(calibData));
      setSaveStatus("✅ Ritmo Base & Zonas Z1-Z5 salvos com sucesso! Planilhas de treino atualizadas.");
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (e) {
      setSaveStatus("⚠️ Erro ao salvar no navegador.");
    }
  };

  const handleOpenResultEditor = (race: TargetRaceItem) => {
    setEditingRace(race);
    if (race.actualFinishTime) {
      const parts = race.actualFinishTime.split(":").map((p) => parseInt(p) || 0);
      if (parts.length === 3) {
        setResChipHours(parts[0]);
        setResChipMinutes(parts[1]);
        setResChipSeconds(parts[2]);
      }
    } else {
      const parts = race.targetFinishTime.split(":").map((p) => parseInt(p) || 0);
      if (parts.length === 3) {
        setResChipHours(parts[0]);
        setResChipMinutes(parts[1]);
        setResChipSeconds(parts[2]);
      }
    }
    setResGunTime(race.actualGunTime || race.targetFinishTime);
    setResOverallRank(race.overallRank || "412º / 4.850");
    setResCategoryRank(race.categoryRank || (selectedAthlete === "DANIEL" ? "24º / 512" : selectedAthlete === "PATRICIA" ? "12ª / 380" : "6º / 220"));
    setResGenderRank(race.genderRank || (selectedAthlete === "PATRICIA" ? "84ª / 1.650" : "330º / 2.820"));
    setResAgeGroup(race.ageGroupCategory || (selectedAthlete === "DANIEL" ? "M50-54" : selectedAthlete === "PATRICIA" ? "F55-59" : "M20-24"));
    setResAward(race.podiumAward || "🥈 Top 5% Categoria • Recorde Pessoal (RP)");
    setResNotes(race.raceNotes || "");
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRace) return;

    const totalSecs = resChipHours * 3600 + resChipMinutes * 60 + resChipSeconds;
    const paceSecPerKm = Math.round(totalSecs / editingRace.distanceKm);
    const paceMin = Math.floor(paceSecPerKm / 60);
    const paceSec = paceSecPerKm % 60;
    const calcPace = `${paceMin}:${paceSec < 10 ? "0" : ""}${paceSec}`;
    const calcChipTime = `${String(resChipHours).padStart(2, "0")}:${String(resChipMinutes).padStart(2, "0")}:${String(resChipSeconds).padStart(2, "0")}`;

    const updatedRace: TargetRaceItem = {
      ...editingRace,
      isCompleted: true,
      actualFinishTime: calcChipTime,
      actualGunTime: resGunTime,
      actualPaceMinKm: calcPace,
      overallRank: resOverallRank,
      categoryRank: resCategoryRank,
      genderRank: resGenderRank,
      ageGroupCategory: resAgeGroup,
      podiumAward: resAward,
      raceNotes: resNotes,
      percentileRankPct: 95,
    };

    const updated = races.map((r) => (r.id === editingRace.id ? updatedRace : r));
    saveRacesToStorage(updated);

    // If sync calibrator was checked and this is a base race
    if (resSyncCalibrator) {
      setCalibDistanceKm(editingRace.distanceKm);
      setCalibHours(resChipHours);
      setCalibMinutes(resChipMinutes);
      setCalibSeconds(resChipSeconds);
      const calibResults = calculateBasePaceRecalibration(editingRace.distanceKm, totalSecs);
      try {
        const calibData = {
          athleteId: selectedAthlete,
          date: editingRace.raceDate,
          race: editingRace.name,
          distanceKm: editingRace.distanceKm,
          finishTimeSeconds: totalSecs,
          basePace: calibResults.basePaceFormatted,
          zones: calibResults.recalibratedZones,
          projections: calibResults.projections,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(`CALIBRATION_BASE_${selectedAthlete}`, JSON.stringify(calibData));
      } catch (err) {}
    }

    setEditingRace(null);
    setActiveTab("RESULTS");
  };

  const handleCreateRace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newRace: TargetRaceItem = {
      id: `race-${Date.now()}`,
      athleteId: selectedAthlete,
      name: newName,
      raceDate: newDate,
      distanceKm: parseFloat(newDistance) || 10,
      location: newLocation,
      priority: newPriority,
      targetPaceMinKm: newTargetPace,
      targetFinishTime: newTargetTime,
      taperingWeeksCount: newTaperingWeeks,
      carbLoadingDaysBefore: newCarbDays,
      raceStartTime: newRaceStartTime || "06:30",
      ageGroupCategory: selectedAthlete === "DANIEL" ? "M50-54" : selectedAthlete === "PATRICIA" ? "F55-59" : "M20-24",
    };

    const updated = [...races, newRace];
    saveRacesToStorage(updated);
    setNewName("");
    setActiveTab("CALENDAR");
  };

  const handleDeleteRace = (id: string) => {
    const updated = races.filter((r) => r.id !== id);
    saveRacesToStorage(updated);
  };

  const handleEasterEggTrigger = () => {
    const next = easterEggClicks + 1;
    setEasterEggClicks(next);
    if (next >= 3) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 8000);
      setEasterEggClicks(0);
    }
  };

  const filteredRaces = races.filter((r) => r.athleteId === selectedAthlete);
  const completedRaces = filteredRaces.filter((r) => r.isCompleted);
  const upcomingRaces = filteredRaces.filter((r) => !r.isCompleted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0C101A] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header - Haute Horlogerie Gold Accent */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-[#141A29] via-[#101726] to-[#0A0D15]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleEasterEggTrigger}
              className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/30 border border-amber-500/50 flex items-center justify-center text-amber-300 hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
              title="Clique 3x para o Segredo do Clã!"
            >
              <Trophy className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Hub de Provas, Resultados Oficiais & Classificações</span>
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  HAUTE HORLOGERIE BIO-TRIAD
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Chip Times • Classificação Faixa Etária • Pódios • Fórmula Riegel de Calibração
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

        {/* Easter Egg Banner */}
        {showEasterEgg && (
          <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-3 text-black font-black text-xs text-center flex items-center justify-center gap-2 shadow-2xl animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>
              🏆 EASTER EGG DO CLÃ LOPES DESBLOQUEADO: A união de Mengão 🔴⚫, Imortal 🔵⚪ e Verdão 🟢⚪! Três gerações com coração de aço e pernas velozes!
            </span>
            <Sparkles className="h-4 w-4" />
          </div>
        )}

        {/* Athlete Switcher Bar */}
        <div className="p-4 bg-[#080B12] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Atleta:</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setSelectedAthlete("DANIEL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAthlete === "DANIEL"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Daniel (52a • M50-54)</span>
              </button>
              <button
                onClick={() => setSelectedAthlete("PATRICIA")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAthlete === "PATRICIA"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Patrícia (56a • F55-59)</span>
              </button>
              <button
                onClick={() => setSelectedAthlete("GABRIEL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAthlete === "GABRIEL"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Gabriel (20a • M20-24)</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center bg-[#101726] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("RESULTS")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "RESULTS"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Medal className="h-3.5 w-3.5 text-amber-300" />
              <span>Resultados & Pódios ({completedRaces.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("CALIBRATOR")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "CALIBRATOR"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Gauge className="h-3.5 w-3.5" />
              <span>Calibrador (Athenas Amanhã)</span>
            </button>
            <button
              onClick={() => setActiveTab("CALENDAR")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "CALENDAR"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Calendário ({filteredRaces.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("NEW_RACE")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "NEW_RACE"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Prova 2027</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: RESULTADOS OFICIAIS & PÓDIOS (NOVO) */}
          {activeTab === "RESULTS" && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141A29] via-[#101726] to-[#0A0D15] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>Palmarés Oficial & Classificações por Faixa Etária</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {selectedAthlete === "DANIEL" ? "Categoria M50-54" : selectedAthlete === "PATRICIA" ? "Categoria F55-59" : "Categoria M20-24"}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-300">
                      Registro de Chip Time líquido, Gun Time bruto, classificação geral, faixa etária e recordes pessoais.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Find tomorrow's race or create one
                      const tomorrow = filteredRaces.find((r) => r.raceDate === "2026-10-18");
                      if (tomorrow) handleOpenResultEditor(tomorrow);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Registrar Resultado da Athenas (Amanhã)</span>
                  </button>
                </div>
              </div>

              {/* Completed Races Trophy Case */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Medal className="h-4 w-4 text-amber-400" />
                  <span>Provas Oficiais Concluídas & Medalhas ({completedRaces.length})</span>
                </h4>

                {completedRaces.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center text-gray-400 space-y-2">
                    <Trophy className="h-8 w-8 text-gray-600 mx-auto" />
                    <p className="text-xs">Nenhum resultado oficial registrado ainda para este atleta.</p>
                    <p className="text-[11px] text-gray-500">
                      Assim que cruzar o pórtico da Athenas Mizuno amanhã, insira seu tempo aqui!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {completedRaces.map((race) => (
                      <div
                        key={race.id}
                        className="p-5 rounded-2xl bg-gradient-to-r from-[#101726]/90 via-[#0F1420] to-[#0A0D15] border border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-400/70 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                CONCLUÍDA & HOMOLOGADA
                              </span>
                              {race.podiumAward && (
                                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700 flex items-center gap-1">
                                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                  {race.podiumAward}
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-black text-white">{race.name}</h4>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-amber-400" />
                                {race.raceDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-emerald-400" />
                                {race.location}
                              </span>
                              <span className="text-white font-bold">{race.distanceKm} km</span>
                            </div>

                            {race.raceNotes && (
                              <p className="text-xs text-gray-300 italic bg-black/40 p-2.5 rounded-xl border border-white/5">
                                "{race.raceNotes}"
                              </p>
                            )}
                          </div>

                          {/* Stats Matrix */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/50 p-3 rounded-2xl border border-white/10 font-mono w-full lg:w-auto">
                            <div className="p-2 rounded-xl bg-white/5 text-center">
                              <span className="text-[9px] text-gray-400 uppercase block">Tempo Líquido (Chip)</span>
                              <span className="text-base font-black text-emerald-400 block mt-0.5">
                                {race.actualFinishTime}
                              </span>
                              <span className="text-[10px] text-gray-400 block">Pace: {race.actualPaceMinKm}/km</span>
                            </div>

                            <div className="p-2 rounded-xl bg-white/5 text-center">
                              <span className="text-[9px] text-gray-400 uppercase block">Tempo Bruto (Gun)</span>
                              <span className="text-sm font-bold text-gray-300 block mt-0.5">
                                {race.actualGunTime || "--:--:--"}
                              </span>
                              <span className="text-[9px] text-gray-500 block">Largada Geral</span>
                            </div>

                            <div className="p-2 rounded-xl bg-white/5 text-center">
                              <span className="text-[9px] text-gray-400 uppercase block">Faixa Etária</span>
                              <span className="text-sm font-black text-amber-400 block mt-0.5">
                                {race.categoryRank || "--"}
                              </span>
                              <span className="text-[9px] text-amber-300/80 block">{race.ageGroupCategory}</span>
                            </div>

                            <div className="p-2 rounded-xl bg-white/5 text-center">
                              <span className="text-[9px] text-gray-400 uppercase block">Geral / Sexo</span>
                              <span className="text-xs font-bold text-white block mt-0.5">
                                {race.overallRank || "--"}
                              </span>
                              <span className="text-[9px] text-cyan-400 block">{race.genderRank || "--"}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenResultEditor(race)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                              title="Editar ou atualizar classificações"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tomorrow's Race Quick Action Card */}
              {upcomingRaces.some((r) => r.raceDate === "2026-10-18") && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#19150E] to-[#0A0D15] border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <span>Athenas Mizuno Run Longer (Amanhã - 18/10/2026)</span>
                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                          Amanhã!
                        </span>
                      </h4>
                      <p className="text-xs text-gray-300">
                        {selectedAthlete === "DANIEL"
                          ? "Daniel corre os 21.097 km. Assim que completar a prova, registre o tempo oficial do chip e posições."
                          : selectedAthlete === "PATRICIA"
                          ? "Patrícia corre os 14.0 km. O tempo oficial balizará toda a temporada 2027!"
                          : "Gabriel foca em velocidade nos 10k."}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const tomorrow = upcomingRaces.find((r) => r.raceDate === "2026-10-18");
                      if (tomorrow) handleOpenResultEditor(tomorrow);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all shrink-0"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Lançar Tempo Oficial da Prova</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CALIBRADOR DE RITMO BASE */}
          {activeTab === "CALIBRATOR" && (
            <div className="space-y-6">
              {/* Tomorrow's Race Context Alert */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#19150E] to-[#0A0D15] border border-amber-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Prova Base de Calibração: Athenas Mizuno Run Longer (18/10/2026)</span>
                      <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                        Amanhã!
                      </span>
                    </h4>
                    <p className="text-xs text-gray-300 mt-1">
                      {selectedAthlete === "DANIEL" &&
                        "Daniel corre os 21.097 km (Marginal Pinheiros). O tempo oficial obtido será o marco zero para recalibrar as zonas Z1-Z5 rumo à Meia de SP e SP City 2027."}
                      {selectedAthlete === "PATRICIA" &&
                        "Patrícia corre os 14.0 km (Marginal Pinheiros). Este tempo balizará seus treinos para a Meia Vênus 21k (Nov/26) e a temporada completa 2027 na qual já está inscrita!"}
                      {selectedAthlete === "GABRIEL" &&
                        "Gabriel foca em velocidade nos 5k/10k. Insira seu melhor tempo recente para calibrar os treinos de alta potência e hipertrofia."}
                    </p>

                    <div className="mt-2.5 p-2 rounded-xl bg-black/50 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <CloudSun className="h-3.5 w-3.5 text-amber-400" />
                        <span>Previsão Amanhã 06h30:</span>
                        <span className="text-white font-normal">16.5°C • 82% umidade • Vento 9km/h</span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        Ajuste Térmico: +0s/km (Condições ideais de RP)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tempo Input Grid */}
              <div className="bg-[#101726]/80 p-5 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>Insira o Tempo Oficial Obtido na Prova</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-mono block mb-1">Distância (km)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={calibDistanceKm}
                      onChange={(e) => setCalibDistanceKm(parseFloat(e.target.value) || 1)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-mono block mb-1">Horas</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={calibHours}
                      onChange={(e) => setCalibHours(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-mono block mb-1">Minutos</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={calibMinutes}
                      onChange={(e) => setCalibMinutes(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-mono block mb-1">Segundos</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={calibSeconds}
                      onChange={(e) => setCalibSeconds(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono">Pace Médio Calculado:</span>
                    <span className="text-base font-black text-amber-400 font-mono px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-800">
                      {calibrationResults.basePaceFormatted}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveCalibration}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Salvar Como Novo Ritmo Base Oficial</span>
                  </button>
                </div>

                {saveStatus && (
                  <p className="text-xs text-emerald-300 font-mono bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800 animate-fadeIn">
                    {saveStatus}
                  </p>
                )}
              </div>

              {/* Recalibrated Zones (Street Pace & Treadmill Speed) */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Zonas de Treino Recalibradas (Rua & Esteira)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {Object.entries(calibrationResults.recalibratedZones).map(([key, zone], idx) => {
                    const colors = [
                      "border-sky-500/40 bg-sky-950/20 text-sky-300",
                      "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
                      "border-amber-500/40 bg-amber-950/20 text-amber-300",
                      "border-orange-500/40 bg-orange-950/20 text-orange-300",
                      "border-red-500/40 bg-red-950/20 text-red-300",
                    ];
                    return (
                      <div
                        key={key}
                        className={`p-3.5 rounded-2xl border ${colors[idx]} flex flex-col justify-between`}
                      >
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase opacity-80 block mb-1">
                            {zone.label.split(" ")[0]}
                          </span>
                          <span className="text-xs font-bold text-white block leading-tight">
                            {zone.label.split(" ").slice(1).join(" ")}
                          </span>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/10 space-y-1 font-mono">
                          <div>
                            <span className="text-[9px] text-gray-400 block">Pace Rua:</span>
                            <span className="text-xs font-black text-white">{zone.paceRange}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block">Vel. Esteira:</span>
                            <span className="text-[11px] font-bold text-cyan-300">{zone.treadmillSpeedKmh}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projections via Riegel Formula */}
              <div className="p-4 rounded-2xl bg-[#090D16] border border-white/10 space-y-3">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Projeção Fisiológica de Futuras Provas (Fórmula Riegel T₂ = T₁ · (D₂/D₁)¹·⁰⁶)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(calibrationResults.projections).map(([key, proj]) => (
                    <div key={key} className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">
                        {proj.distanceKm} km
                      </span>
                      <span className="text-sm font-black text-white block mt-0.5">
                        {proj.timeFormatted}
                      </span>
                      <span className="text-[11px] text-purple-300 block">
                        Pace: {proj.paceFormatted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDÁRIO GERAL DE PROVAS */}
          {activeTab === "CALENDAR" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Todas as Provas para {selectedAthlete === "DANIEL" ? "Daniel" : selectedAthlete === "PATRICIA" ? "Patrícia" : "Gabriel"}
                </h3>
                <button
                  onClick={() => setActiveTab("NEW_RACE")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Prova</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredRaces.map((race) => {
                  const isTomorrow = race.raceDate === "2026-10-18";
                  return (
                    <div
                      key={race.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        race.isCompleted
                          ? "bg-[#101726]/60 border-amber-500/30"
                          : isTomorrow
                          ? "bg-gradient-to-r from-red-950/40 to-[#101726] border-red-500/50 shadow-lg shadow-red-500/10"
                          : "bg-[#101726]/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                              race.priority === "P1_TARGET"
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : race.priority === "P2_PREP"
                                ? "bg-blue-950 text-blue-300 border border-blue-800"
                                : "bg-purple-950 text-purple-300 border border-purple-800"
                            }`}
                          >
                            {race.priority === "P1_TARGET" ? "P1 ALVO" : race.priority === "P2_PREP" ? "P2 PREP" : "P3 FESTIVA"}
                          </span>

                          {race.isCompleted ? (
                            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              HOMOLOGADA 🏅
                            </span>
                          ) : isTomorrow ? (
                            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded bg-red-600 text-white uppercase animate-pulse">
                              AMANHÃ
                            </span>
                          ) : null}

                          <h4 className="text-sm font-bold text-white">{race.name}</h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-amber-400" />
                            {race.raceDate}
                          </span>
                          <span className="flex items-center gap-1 text-amber-300 font-bold">
                            <Clock className="h-3 w-3 text-amber-400" />
                            Largada: {race.raceStartTime || "06:30"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-emerald-400" />
                            {race.location}
                          </span>
                          <span className="text-white font-bold">{race.distanceKm} km</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right font-mono">
                          {race.isCompleted ? (
                            <>
                              <span className="text-[10px] text-emerald-400 block font-bold">Oficial Chip Time</span>
                              <span className="text-sm font-black text-white">{race.actualFinishTime}</span>
                              <span className="text-xs text-emerald-300 ml-1.5 font-bold">({race.actualPaceMinKm}/km)</span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] text-gray-400 block">Tempo & Pace Alvo</span>
                              <span className="text-sm font-black text-amber-400">{race.targetFinishTime}</span>
                              <span className="text-xs text-gray-300 ml-1.5 font-bold">({race.targetPaceMinKm}/km)</span>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenResultEditor(race)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all border border-amber-500/40"
                          title="Registrar / Editar Resultado Oficial"
                        >
                          {race.isCompleted ? "Ver/Editar" : "Registrar"}
                        </button>

                        <button
                          onClick={() => handleDeleteRace(race.id)}
                          className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
                          title="Remover prova"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CADASTRO DE NOVA PROVA */}
          {activeTab === "NEW_RACE" && (
            <form onSubmit={handleCreateRace} className="space-y-4 bg-[#101726]/70 p-5 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-amber-400" />
                <span>Cadastrar Prova para {selectedAthlete} (Temporada 2027)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Nome da Prova</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Meia Maratona de Florianópolis 2027"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Data da Prova</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Distância (km)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Localização</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ex: Florianópolis, SC - Beira-Mar"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Prioridade</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as RacePriority)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="P1_TARGET">P1 - Prova Alvo Principal (Tapering rígido & Carbo)</option>
                    <option value="P2_PREP">P2 - Prova Preparatória (Ritmo de treino)</option>
                    <option value="P3_FUN_PARTY">P3 - Festiva / Diversão com Amigos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Pace Alvo (min/km)</label>
                  <input
                    type="text"
                    placeholder="5:20"
                    value={newTargetPace}
                    onChange={(e) => setNewTargetPace(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Tempo Alvo Final (hh:mm:ss)</label>
                  <input
                    type="text"
                    placeholder="01:52:30"
                    value={newTargetTime}
                    onChange={(e) => setNewTargetTime(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Semanas de Polimento (Tapering)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={newTaperingWeeks}
                    onChange={(e) => setNewTaperingWeeks(parseInt(e.target.value) || 2)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-amber-300 font-mono block mb-1">Hora da Largada Oficial (T-Gun)</label>
                  <input
                    type="time"
                    value={newRaceStartTime}
                    onChange={(e) => setNewRaceStartTime(e.target.value)}
                    className="w-full bg-black/60 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-mono text-xs font-bold focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 font-sans block mt-0.5">
                    Base p/ cálculo reverso da Alvorada Tuya (-1h chegada, Waze e café)
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("CALENDAR")}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cadastrar Prova Oficial</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* SUB-MODAL: REGISTRAR / EDITAR RESULTADO OFICIAL & CLASSIFICAÇÃO */}
        {editingRace && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-fadeIn">
            <div className="bg-[#0E1322] border border-amber-500/50 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-amber-950/60 to-[#101726]">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Trophy className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      Registrar Resultado Oficial & Classificações
                    </h3>
                    <p className="text-[11px] text-amber-300/80 font-mono">
                      {editingRace.name} ({editingRace.distanceKm} km)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingRace(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveResult} className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
                {/* Chip Time Input */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <label className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                    ⏱️ Tempo Oficial Líquido (Chip Time)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-0.5">Horas</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={resChipHours}
                        onChange={(e) => setResChipHours(parseInt(e.target.value) || 0)}
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-0.5">Minutos</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={resChipMinutes}
                        onChange={(e) => setResChipMinutes(parseInt(e.target.value) || 0)}
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-0.5">Segundos</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={resChipSeconds}
                        onChange={(e) => setResChipSeconds(parseInt(e.target.value) || 0)}
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Gun Time & Rankings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Tempo Bruto (Gun Time hh:mm:ss)</label>
                    <input
                      type="text"
                      placeholder="01:56:00"
                      value={resGunTime}
                      onChange={(e) => setResGunTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Faixa Etária / Categoria</label>
                    <input
                      type="text"
                      placeholder="Ex: M50-54, F55-59, M20-24"
                      value={resAgeGroup}
                      onChange={(e) => setResAgeGroup(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Classificação Faixa Etária</label>
                    <input
                      type="text"
                      placeholder="Ex: 24º / 512 atletas"
                      value={resCategoryRank}
                      onChange={(e) => setResCategoryRank(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Classificação Geral da Prova</label>
                    <input
                      type="text"
                      placeholder="Ex: 389º / 4.250 atletas"
                      value={resOverallRank}
                      onChange={(e) => setResOverallRank(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Classificação por Sexo</label>
                    <input
                      type="text"
                      placeholder="Ex: 330º Masculino / 84ª Feminino"
                      value={resGenderRank}
                      onChange={(e) => setResGenderRank(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Distinção / Pódio / Conquista</label>
                    <input
                      type="text"
                      placeholder="Ex: 🥈 Top 5% Categoria • Recorde Pessoal (RP)"
                      value={resAward}
                      onChange={(e) => setResAward(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Anotações da Prova (Clima, Tênis, Estratégia)</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Tênis Mizuno Wave Rebellion Pro 2, hidratação a cada 3k, Z3 sustentada até o km 18."
                    value={resNotes}
                    onChange={(e) => setResNotes(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none text-xs"
                  />
                </div>

                {/* Calibrator Sync Checkbox */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                  <input
                    type="checkbox"
                    id="syncCalib"
                    checked={resSyncCalibrator}
                    onChange={(e) => setResSyncCalibrator(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="syncCalib" className="text-[11px] cursor-pointer">
                    ⚡ <strong>Recalibrar Fisiologia & Zonas Z1-Z5 Automaticamente:</strong> Usar este tempo oficial como o novo marco zero no motor Riegel.
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingRace(null)}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Salvar Resultado Oficial & Homologar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
