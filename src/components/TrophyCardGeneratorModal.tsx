"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Download,
  Share2,
  Trophy,
  Award,
  Sparkles,
  Flame,
  Shield,
  Zap,
  CheckCircle2,
  Smartphone,
  Square,
  Clock,
  Compass,
  Heart,
  Activity,
  Layers,
} from "lucide-react";
import { ProfileId } from "@/lib/types";

interface TrophyCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ProfileId;
}

type CardFormat = "STORY_9_16" | "POST_1_1";

export function TrophyCardGeneratorModal({
  isOpen,
  onClose,
  activeProfile,
}: TrophyCardGeneratorModalProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>(
    activeProfile === "CLAN" ? "DANIEL" : activeProfile
  );
  const [format, setFormat] = useState<CardFormat>("STORY_9_16");

  // Editable Card Stats
  const [raceName, setRaceName] = useState<string>("ATHENAS MIZUNO RUN LONGER");
  const [distanceKm, setDistanceKm] = useState<string>("21.097");
  const [chipTime, setChipTime] = useState<string>("01:54:12");
  const [gunTime, setGunTime] = useState<string>("01:56:45");
  const [pace, setPace] = useState<string>("5:24");
  const [cadenceSpm, setCadenceSpm] = useState<string>("178");
  const [avgHrBpm, setAvgHrBpm] = useState<string>("158");
  const [rankingCategory, setRankingCategory] = useState<string>("Top 4.2% • 24º M50-54");
  const [calories, setCalories] = useState<string>("1.680");
  const [raceDate, setRaceDate] = useState<string>("18 OUT 2026");
  const [podiumTitle, setPodiumTitle] = useState<string>("NOVO RECORDE PESSOAL (RP)");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync profile defaults
  useEffect(() => {
    if (selectedProfile === "DANIEL") {
      setRaceName("ATHENAS MIZUNO RUN LONGER 21K");
      setDistanceKm("21.097");
      setChipTime("01:54:12");
      setPace("5:24");
      setCadenceSpm("178");
      setAvgHrBpm("158");
      setRankingCategory("Top 4.2% • 24º M50-54");
      setPodiumTitle("OFICIAL CONCLUÍDO • RECORDE PESSOAL");
    } else if (selectedProfile === "PATRICIA") {
      setRaceName("ATHENAS MIZUNO RUN LONGER 14K");
      setDistanceKm("14.000");
      setChipTime("01:43:02");
      setGunTime("01:48:44");
      setPace("7:21");
      setCadenceSpm("168");
      setAvgHrBpm("152");
      setRankingCategory("26ª F55-59 • 950ª Geral Fem • Nº 10967");
      setPodiumTitle("FINISHER OFICIAL 14K • ATHENAS MIZUNO");
      setRaceDate("18 OUT 2026");
    } else if (selectedProfile === "GABRIEL") {
      setRaceName("CORRIDA OLGA KOS 10K SPEED");
      setDistanceKm("10.000");
      setChipTime("00:44:20");
      setPace("4:26");
      setCadenceSpm("185");
      setAvgHrBpm("168");
      setRankingCategory("Top 2.5% • 8º M20-24");
      setPodiumTitle("MOTOR ALVIVERDE • SUB-45 ALCANÇADO");
    }
  }, [selectedProfile]);

  // Render high-res card to hidden Canvas for instant PNG export
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isStory = format === "STORY_9_16";
    const width = isStory ? 1080 : 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // 1. Dark Obsidian Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#080B12");
    bgGrad.addColorStop(0.5, "#0D1322");
    bgGrad.addColorStop(1, "#05070B");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Club Brand Ambient Radial Glow
    let glowColor = "rgba(220, 38, 38, 0.25)"; // Daniel Red
    if (selectedProfile === "PATRICIA") glowColor = "rgba(14, 165, 233, 0.25)"; // Patricia Blue
    if (selectedProfile === "GABRIEL") glowColor = "rgba(16, 185, 129, 0.25)"; // Gabriel Green

    const glow = ctx.createRadialGradient(width / 2, isStory ? 500 : 350, 50, width / 2, isStory ? 500 : 350, 600);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 3. Gold Metallic Border Frame
    ctx.strokeStyle = "rgba(217, 119, 6, 0.5)";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // 4. Header: Brand & Seal
    ctx.textAlign = "center";
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillText("HAUTE HORLOGERIE SPORTS • BIO-TRIAD OS", width / 2, isStory ? 120 : 100);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 48px sans-serif";
    ctx.fillText("LOPES RACING TEAM", width / 2, isStory ? 180 : 155);

    // Club Tag
    const clubText =
      selectedProfile === "DANIEL"
        ? "DANIEL SOUTO LOPES • M50-54 • FLA 🔴⚫"
        : selectedProfile === "PATRICIA"
        ? "PATRÍCIA SOUTO LOPES • F55-59 • GRE 🔵⚪⚫"
        : "GABRIEL SOUTO MAIOR • M20-24 • PAL 🟢⚪";

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(clubText, width / 2, isStory ? 230 : 195);

    // 5. Podium / Achievement Banner
    const bannerY = isStory ? 340 : 260;
    ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(140, bannerY - 45, width - 280, 75, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FCD34D";
    ctx.font = "900 28px sans-serif";
    ctx.fillText(`🏆  ${podiumTitle}`, width / 2, bannerY + 3);

    // 6. Race Title
    const titleY = isStory ? 480 : 380;
    ctx.fillStyle = "#E2E8F0";
    ctx.font = "900 52px sans-serif";
    ctx.fillText(raceName, width / 2, titleY);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 24px monospace";
    ctx.fillText(`${raceDate} • OFICIAL CHRONO SPLIT`, width / 2, titleY + 45);

    // 7. Giant Chip Time Display (The Hero Element)
    const timeY = isStory ? 750 : 540;
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(120, timeY - 140, width - 240, 220, 32);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 26px monospace";
    ctx.fillText("TEMPO LÍQUIDO OFICIAL (CHIP TIME)", width / 2, timeY - 80);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 110px monospace";
    ctx.fillText(chipTime, width / 2, timeY + 30);

    // 8. Stats Matrix (Pace, Distance, Cadence, HR)
    const matrixY = isStory ? 1040 : 720;
    const boxW = (width - 320) / 2;
    const boxH = isStory ? 160 : 120;

    const drawStatBox = (x: number, y: number, label: string, val: string, sub: string, col: string) => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 20px monospace";
      ctx.fillText(label, x + 25, y + 40);

      ctx.fillStyle = col;
      ctx.font = "900 48px monospace";
      ctx.fillText(val, x + 25, y + 90);

      ctx.fillStyle = "#64748B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(sub, x + 25, y + (isStory ? 130 : 110));
    };

    // Box 1: Distance
    drawStatBox(120, matrixY, "DISTÂNCIA", `${distanceKm} km`, "Homologado", "#34D399");
    // Box 2: Pace
    drawStatBox(160 + boxW, matrixY, "PACE MÉDIO", `${pace}/km`, "Ritmo de Cruzeiro", "#38BDF8");

    if (isStory) {
      // Box 3: Cadence
      drawStatBox(120, matrixY + boxH + 25, "CADÊNCIA MÉDIA", `${cadenceSpm} spm`, "Metrônomo Ativo", "#F59E0B");
      // Box 4: Heart Rate
      drawStatBox(160 + boxW, matrixY + boxH + 25, "FC MÉDIA", `${avgHrBpm} bpm`, "Zona 3 Estável", "#FB7185");

      // Box 5: Classification
      const classY = matrixY + (boxH + 25) * 2;
      ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(120, classY, width - 240, 110, 20);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 20px monospace";
      ctx.fillText("CLASSIFICAÇÃO OFICIAL", width / 2, classY + 38);

      ctx.fillStyle = "#FCD34D";
      ctx.font = "900 36px sans-serif";
      ctx.fillText(rankingCategory, width / 2, classY + 80);
    }

    // 9. Luxury Official Bottom Seal
    const footerY = isStory ? 1780 : 980;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "18px monospace";
    ctx.fillText("OFFICIAL CHRONO LPS-2026 • CERTIFIED BY BIO-TRIAD OS", width / 2, footerY);
    ctx.fillText("CLÃ LOPES RACING SQUAD • SÃO PAULO, BRASIL", width / 2, footerY + 28);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(renderCanvas, 100);
    }
  }, [
    isOpen,
    selectedProfile,
    format,
    raceName,
    distanceKm,
    chipTime,
    pace,
    cadenceSpm,
    avgHrBpm,
    rankingCategory,
    podiumTitle,
  ]);

  const handleDownloadImage = () => {
    renderCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const filename = `CARD_CONQUISTA_${selectedProfile}_${format}_${Date.now()}.png`;
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const handleShareWhatsApp = () => {
    const text = `🏆 *CONQUISTA CLÃ LOPES - BIO-TRIAD OS* 🏁
*Atleta:* ${selectedProfile}
*Prova:* ${raceName}
*Distância:* ${distanceKm} km
*Tempo Oficial (Chip Time):* ${chipTime}
*Pace Médio:* ${pace} /km
*Cadência:* ${cadenceSpm} spm
*Classificação:* ${rankingCategory}

_Certificado com precisão Haute Horlogerie pelo Bio-Triad OS_ ✨`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-[#0B0F19] border border-amber-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-black">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-white font-mono">
                  GERADOR DE CARD & STORY DE CONQUISTA
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Instagram & WhatsApp HD
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Gere e baixe artes oficiais em alta resolução para celebrar seus tempos e pódios
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

        {/* Content Body: Left Controls, Right Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Format Picker */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Formato da Arte:</span>
              <button
                onClick={() => setFormat("STORY_9_16")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  format === "STORY_9_16"
                    ? "bg-amber-500/30 border border-amber-400 text-amber-300 shadow-md"
                    : "bg-white/5 border border-white/10 text-gray-400"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Story (9:16)</span>
              </button>
              <button
                onClick={() => setFormat("POST_1_1")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  format === "POST_1_1"
                    ? "bg-amber-500/30 border border-amber-400 text-amber-300 shadow-md"
                    : "bg-white/5 border border-white/10 text-gray-400"
                }`}
              >
                <Square className="h-4 w-4" />
                <span>Post Quadrado (1:1)</span>
              </button>
            </div>

            {/* Profile Switcher */}
            <div>
              <label className="text-xs font-mono uppercase text-gray-400 mb-1.5 block">
                Atleta da Prova
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedProfile("DANIEL")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                    selectedProfile === "DANIEL"
                      ? "bg-red-600/30 border-red-500 text-white shadow-lg shadow-red-500/20"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-red-400" />
                    Daniel
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">FLA 🔴⚫</span>
                </button>
                <button
                  onClick={() => setSelectedProfile("PATRICIA")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                    selectedProfile === "PATRICIA"
                      ? "bg-sky-600/30 border-sky-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-sky-400" />
                    Patrícia
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">GRE 🔵⚪⚫</span>
                </button>
                <button
                  onClick={() => setSelectedProfile("GABRIEL")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                    selectedProfile === "GABRIEL"
                      ? "bg-emerald-600/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    Gabriel
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">PAL 🟢⚪</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Selector */}
            {selectedProfile === "DANIEL" && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">Predefinir:</span>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("14ª MEIA MARATONA TRIBUNA PRAIA GRANDE");
                    setDistanceKm("21.097");
                    setChipTime("02:29:38");
                    setGunTime("02:29:42");
                    setPace("7:05");
                    setCadenceSpm("170");
                    setAvgHrBpm("150");
                    setRankingCategory("1º LUGAR Categoria ACD DMS • Nº 115");
                    setPodiumTitle("🏆 CAMPEÃO 21K • 1º LUGAR NO PÓDIO");
                    setRaceDate("27 SET 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold shrink-0"
                >
                  Praia Grande 21k • 🏆 1º LUGAR ACD (02:29:38)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("SP CITY MARATHON 2026");
                    setDistanceKm("21.097");
                    setChipTime("02:10:58");
                    setGunTime("03:31:10");
                    setPace("6:12");
                    setCadenceSpm("172");
                    setAvgHrBpm("154");
                    setRankingCategory("Top 57% • 674º M50-59 • Nº 33765");
                    setPodiumTitle("FINISHER OFICIAL 21.1K • MEIA SP CITY");
                    setRaceDate("26 JUL 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold shrink-0"
                >
                  SP City Marathon 21k (02:10:58)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("30ª MARATONA INTL DE SÃO PAULO 2026");
                    setDistanceKm("21.097");
                    setChipTime("02:22:05");
                    setGunTime("02:49:28");
                    setPace("6:46");
                    setCadenceSpm("174");
                    setAvgHrBpm("154");
                    setRankingCategory("332º M50-54 • 3824º Geral • Nº 17503");
                    setPodiumTitle("FINISHER OFICIAL 21K • 30 ANOS SP");
                    setRaceDate("12 ABR 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold shrink-0"
                >
                  30ª Maratona Intl SP 21k (02:22:05)
                </button>
              </div>
            )}

            {selectedProfile === "PATRICIA" && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">Predefinir:</span>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("ATHENAS MIZUNO RUN LONGER 14K");
                    setDistanceKm("14.000");
                    setChipTime("01:43:02");
                    setGunTime("01:48:44");
                    setPace("7:21");
                    setCadenceSpm("168");
                    setAvgHrBpm("152");
                    setRankingCategory("26ª F55-59 • 950ª Geral Fem • Nº 10967");
                    setPodiumTitle("FINISHER OFICIAL 14K • ATHENAS MIZUNO");
                    setRaceDate("18 OUT 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold shrink-0"
                >
                  Athenas Mizuno 14k (01:43:02) • HOJE!
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("SP CITY MARATHON 2026");
                    setDistanceKm("21.097");
                    setChipTime("02:53:00");
                    setGunTime("04:13:12");
                    setPace("8:11");
                    setCadenceSpm("166");
                    setAvgHrBpm("148");
                    setRankingCategory("933ª F50-59 • 9020ª Geral Fem • Nº 34798");
                    setPodiumTitle("FINISHER OFICIAL 21.1K • MEIA SP CITY");
                    setRaceDate("26 JUL 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 font-bold shrink-0"
                >
                  SP City Marathon 21k (02:53:00)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("40º 10 KM TRIBUNA TERRACOM SANTOS");
                    setDistanceKm("10.000");
                    setChipTime("01:10:12");
                    setGunTime("01:12:34");
                    setPace("7:01");
                    setCadenceSpm("174");
                    setAvgHrBpm("154");
                    setRankingCategory("Top 30% Geral • 430ª F50-59 • Nº 9773");
                    setPodiumTitle("FINISHER OFICIAL 10K • 40 ANOS TRIBUNA");
                    setRaceDate("17 MAI 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-300 font-bold shrink-0"
                >
                  10 KM Tribuna Santos (01:10:12)
                </button>
              </div>
            )}

            {selectedProfile === "GABRIEL" && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">Predefinir:</span>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("CORRIDA SARGENTO GONZAGUINHA 5K");
                    setDistanceKm("5.000");
                    setChipTime("00:21:15");
                    setGunTime("00:21:40");
                    setPace("4:15");
                    setCadenceSpm("186");
                    setAvgHrBpm("168");
                    setRankingCategory("Top 3% • 6º M20-24");
                    setPodiumTitle("EXPLOSÃO ALVIVERDE • PACE 4:15");
                    setRaceDate("21 JUN 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold shrink-0"
                >
                  Gonzaguinha 5k (00:21:15 • Pace 4:15)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRaceName("CORRIDA OLGA KOS 10K SPEED");
                    setDistanceKm("10.000");
                    setChipTime("00:44:20");
                    setGunTime("00:45:00");
                    setPace("4:26");
                    setCadenceSpm("185");
                    setAvgHrBpm("166");
                    setRankingCategory("Top 2.5% • 8º M20-24");
                    setPodiumTitle("SUB-45 ALCANÇADO • 10K SPEED");
                    setRaceDate("20 DEZ 2026");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold shrink-0"
                >
                  Olga Kos 10k (00:44:20 • Sub-45)
                </button>
              </div>
            )}

            {/* Editable Stats Inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Nome da Prova
                </label>
                <input
                  type="text"
                  value={raceName}
                  onChange={(e) => setRaceName(e.target.value)}
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Título da Conquista
                </label>
                <input
                  type="text"
                  value={podiumTitle}
                  onChange={(e) => setPodiumTitle(e.target.value)}
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Tempo Líquido (Chip Time)
                </label>
                <input
                  type="text"
                  value={chipTime}
                  onChange={(e) => setChipTime(e.target.value)}
                  placeholder="01:54:12"
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Distância Homologada (km)
                </label>
                <input
                  type="text"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  placeholder="21.097"
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Pace Médio (min/km)
                </label>
                <input
                  type="text"
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  placeholder="5:24"
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Cadência (SPM)
                </label>
                <input
                  type="text"
                  value={cadenceSpm}
                  onChange={(e) => setCadenceSpm(e.target.value)}
                  placeholder="178"
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Frequência Cardíaca Média (BPM)
                </label>
                <input
                  type="text"
                  value={avgHrBpm}
                  onChange={(e) => setAvgHrBpm(e.target.value)}
                  placeholder="158"
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Classificação / Pódio
                </label>
                <input
                  type="text"
                  value={rankingCategory}
                  onChange={(e) => setRankingCategory(e.target.value)}
                  placeholder="Top 4.2% • 24º M50-54"
                  className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownloadImage}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>📥 BAIXAR CARD HD (PNG)</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>{isCopied ? "Copiado! ✅" : "WhatsApp"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Visual Card Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/60 p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 mb-2">
              Pré-visualização em Tempo Real (Canvas HD)
            </span>

            {/* Hidden HD canvas used for high-res export */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Live Interactive CSS Card Container mimicking the canvas */}
            <div
              className={`relative overflow-hidden rounded-2xl border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col justify-between p-4 bg-gradient-to-b from-[#0B0F19] via-[#0E1526] to-[#070A11] transition-all ${
                format === "STORY_9_16" ? "w-[260px] h-[460px]" : "w-[300px] h-[300px]"
              }`}
            >
              {/* Corner Watermarks */}
              <div className="absolute top-2 left-2 text-[8px] font-mono text-amber-400 font-bold tracking-widest">
                BIO-TRIAD OS
              </div>
              <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-500">
                HAUTE SPORTS
              </div>

              {/* Card Header */}
              <div className="text-center mt-4">
                <span className="text-[10px] font-black tracking-widest text-white uppercase block">
                  LOPES RACING TEAM
                </span>
                <span className="text-[8px] font-mono text-gray-400 block">
                  {selectedProfile === "DANIEL"
                    ? "DANIEL (52a) • FLA 🔴⚫"
                    : selectedProfile === "PATRICIA"
                    ? "PATRÍCIA (56a) • GRE 🔵⚪⚫"
                    : "GABRIEL (20a) • PAL 🟢⚪"}
                </span>

                {/* Achievement Pill */}
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-300">
                  🏆 {podiumTitle}
                </div>
              </div>

              {/* Race Name & Time */}
              <div className="text-center my-auto">
                <span className="text-[10px] font-bold text-gray-300 uppercase block truncate">
                  {raceName}
                </span>

                {/* Giant Time */}
                <div className="my-2 p-2 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[8px] font-mono text-cyan-400 uppercase block">
                    CHIP TIME
                  </span>
                  <span className="text-2xl font-black font-mono text-white tracking-wider">
                    {chipTime}
                  </span>
                </div>

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-left font-mono">
                  <div className="p-1 rounded bg-white/5 border border-white/5">
                    <span className="text-[7px] text-gray-400 uppercase block">Distância</span>
                    <span className="text-[11px] font-bold text-emerald-400">{distanceKm}k</span>
                  </div>
                  <div className="p-1 rounded bg-white/5 border border-white/5">
                    <span className="text-[7px] text-gray-400 uppercase block">Pace</span>
                    <span className="text-[11px] font-bold text-cyan-400">{pace}/km</span>
                  </div>
                  {format === "STORY_9_16" && (
                    <>
                      <div className="p-1 rounded bg-white/5 border border-white/5">
                        <span className="text-[7px] text-gray-400 uppercase block">Cadência</span>
                        <span className="text-[11px] font-bold text-amber-400">{cadenceSpm} spm</span>
                      </div>
                      <div className="p-1 rounded bg-white/5 border border-white/5">
                        <span className="text-[7px] text-gray-400 uppercase block">FC Média</span>
                        <span className="text-[11px] font-bold text-rose-400">{avgHrBpm} bpm</span>
                      </div>
                    </>
                  )}
                </div>

                {format === "STORY_9_16" && (
                  <div className="mt-2 p-1.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-center">
                    <span className="text-[8px] font-bold text-amber-300 block">
                      {rankingCategory}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Seal */}
              <div className="text-center border-t border-white/10 pt-1 text-[7px] font-mono text-gray-500">
                LPS-2026-CHRONO • CERTIFICADO BIO-TRIAD OS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
