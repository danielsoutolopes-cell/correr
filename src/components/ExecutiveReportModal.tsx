"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Printer,
  Send,
  Download,
  Flame,
  Shield,
  Zap,
  Users,
  Trophy,
  Activity,
  Heart,
  Scale,
  Calendar,
  CheckCircle2,
  Copy,
  Sparkles,
  ExternalLink,
  Medal,
  Award,
  Timer,
  Clock,
  Gauge,
  Check,
  Star,
} from "lucide-react";
import { ProfileId, TargetRaceItem } from "@/lib/types";
import { getProfileSpecs, getStrengthFicha } from "@/lib/physiology";

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: ProfileId;
}

export function ExecutiveReportModal({
  isOpen,
  onClose,
  initialProfile = "DANIEL",
}: ExecutiveReportModalProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>(initialProfile);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsappResult, setWhatsappResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [races, setRaces] = useState<TargetRaceItem[]>([]);
  const [showSecretSealEasterEgg, setShowSecretSealEasterEgg] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_RACES_V3");
      if (stored) {
        setRaces(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const danielSpecs = getProfileSpecs("DANIEL");
  const patriciaSpecs = getProfileSpecs("PATRICIA");
  const gabrielSpecs = getProfileSpecs("GABRIEL");

  const currentSpecs =
    selectedProfile === "PATRICIA"
      ? patriciaSpecs
      : selectedProfile === "GABRIEL"
      ? gabrielSpecs
      : danielSpecs;

  const fichaA = getStrengthFicha("A", selectedProfile);
  const fichaB = getStrengthFicha("B", selectedProfile);

  // Filter completed and target races for this profile
  const profileRaces = races.filter((r) => r.athleteId === selectedProfile);
  const completedRaces = profileRaces.filter((r) => r.isCompleted);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `📊 RELATÓRIO EXECUTIVO BIO-TRIAD OS • CLÃ LOPES
Atleta: ${currentSpecs.name} (${currentSpecs.ageYears} anos - ${currentSpecs.birthDate})
Clube: ${currentSpecs.club} ${currentSpecs.clubBadge}
Meta P1: ${currentSpecs.primaryRace.name} (${currentSpecs.primaryRace.targetPace} - ${currentSpecs.primaryRace.targetFinish})
Z2 Aeróbio: ${currentSpecs.paces.z2Base} (Esteira: ${currentSpecs.paces.treadmillZ2Speed})
Nutrição TACO: ${currentSpecs.nutritionTaco.caloricTargetKcal} kcal | ${currentSpecs.nutritionTaco.proteinG}g Proteína
Telemetria & WhatsApp: ${currentSpecs.phone}
${completedRaces.length > 0 ? `Palmarés: ${completedRaces.map((r) => `${r.name}: ${r.actualFinishTime} (${r.categoryRank || "Faixa Etária"})`).join(" | ")}` : ""}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    setWhatsappResult(null);
    try {
      let racesText = "";
      if (completedRaces.length > 0) {
        racesText = `\n🏅 *Resultados Oficiais Homologados:*\n` +
          completedRaces
            .map(
              (r) =>
                `• *${r.name.split("•")[0].trim()}:* Chip Time: ${r.actualFinishTime} (Pace: ${r.actualPaceMinKm}/km) • Cat: ${r.categoryRank || "--"}`
            )
            .join("\n");
      }

      const summary =
        `📊 *Dossiê Executivo Bio-Triad OS • Clã Lopes*\n\n` +
        `👤 *Atleta:* ${currentSpecs.name} (${currentSpecs.ageYears} anos • Nasc: ${currentSpecs.birthDate})\n` +
        `⚽ *Clube do Coração:* ${currentSpecs.clubName}\n` +
        `🏆 *Prova Alvo P1:* ${currentSpecs.primaryRace.name} (${currentSpecs.primaryRace.targetPace})\n` +
        `🏃 *Pace Z2 Esteira/Rua:* ${currentSpecs.paces.z2Base} • ${currentSpecs.paces.treadmillZ2Speed}\n` +
        `🥗 *Plano Nutricional TACO:* ${currentSpecs.nutritionTaco.caloricTargetKcal} kcal (${currentSpecs.nutritionTaco.proteinG}g proteína)\n` +
        racesText +
        `\n\n💡 *Relatório emitido pelo Bio-Triad OS • Certificado Haute Horlogerie.*`;

      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EXECUTIVE_REPORT",
          profile: selectedProfile,
          workoutSummary: summary,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappResult(`✅ Relatório executivo enviado com sucesso para ${currentSpecs.phone}!`);
      } else {
        setWhatsappResult(`⚠️ ${data.error || "Aviso: WhatsApp em modo simulação/conectando."}`);
      }
    } catch (e: any) {
      setWhatsappResult(`❌ Falha no envio: ${e.message}`);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:fixed-none">
      <div className="bg-[#0C101A] border border-amber-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black">
        {/* Header - Not printed */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-[#141A29] via-[#101726] to-[#0A0D15] print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Central de Relatórios Executivos & Dossiê de Alta Performance
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  HAUTE HORLOGERIE PRECISION
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Resultados Oficiais Homologados • Classificações de Faixa Etária • Fisiologia Riegel • TACO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all shadow"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              title="Copiar resumo textual"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copiado!" : "Copiar"}</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              disabled={isSendingWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
              title="Despachar para o WhatsApp cadastrado"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSendingWhatsApp ? "Enviando..." : "WhatsApp"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Profile Switcher Ribbon - Hidden when printing */}
        <div className="p-3.5 bg-[#080B12] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Selecione o Dossiê:</span>
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setSelectedProfile("DANIEL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedProfile === "DANIEL"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Daniel (52a • FLA 🔴⚫)</span>
              </button>
              <button
                onClick={() => setSelectedProfile("PATRICIA")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedProfile === "PATRICIA"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Patrícia (56a • GRE 🔵⚪⚫)</span>
              </button>
              <button
                onClick={() => setSelectedProfile("GABRIEL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedProfile === "GABRIEL"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Gabriel (20a • PAL 🟢⚪)</span>
              </button>
              <button
                onClick={() => setSelectedProfile("CLAN")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedProfile === "CLAN"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Visão Geral Clã</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-mono">
            Destinatário WhatsApp: <span className="text-emerald-400 font-bold">{currentSpecs.phone}</span>
          </div>
        </div>

        {whatsappResult && (
          <div className="px-5 py-2.5 bg-emerald-950/60 border-b border-emerald-800 text-emerald-300 text-xs font-mono animate-fadeIn flex items-center justify-between print:hidden">
            <span>{whatsappResult}</span>
            <button onClick={() => setWhatsappResult(null)} className="text-emerald-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Printable & Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print:overflow-visible print:p-0 print:space-y-4 print:text-black">
          {/* Haute Horlogerie Printable Header with Authenticity Seal */}
          <div className="border-b border-amber-500/30 pb-5 print:border-black print:pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold print:text-gray-700">
                  BIO-TRIAD OS • CLÃ LOPES HAUTE HORLOGERIE PRECISION
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-gray-400 border border-white/10 print:border-black print:text-black">
                  DOC: LPS-2026-CHRONO-894
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1 print:text-2xl print:text-black">
                Dossiê Executivo de Performance: {selectedProfile === "CLAN" ? "Visão Geral do Clã Lopes" : currentSpecs.name}
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-1 print:text-gray-700">
                Data de Emissão: {new Date().toLocaleDateString("pt-BR")} • Ciclo Olímpico 2026/2027 • São Paulo, SP
              </p>
            </div>

            {/* Haute Horlogerie Authenticity Seal (Clickable Easter Egg!) */}
            <div
              onClick={() => setShowSecretSealEasterEgg(!showSecretSealEasterEgg)}
              className="cursor-pointer group flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-black to-amber-950/20 border border-amber-500/40 hover:border-amber-400 transition-all shadow-lg print:border-black print:bg-white"
              title="Selo de Autenticidade Bio-Triad OS (Clique para o manifesto secreto!)"
            >
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                <Medal className="h-5 w-5" />
              </div>
              <div className="text-left font-mono">
                <span className="text-[9px] text-amber-300 font-black block uppercase print:text-black">
                  CERTIFICADO OFICIAL
                </span>
                <span className="text-[11px] font-black text-white block leading-tight print:text-black">
                  HAUTE HORLOGERIE
                </span>
                <span className="text-[8px] text-gray-400 block print:text-gray-600">MOTOR RIEGEL • TACO</span>
              </div>
            </div>
          </div>

          {/* Secret Easter Egg Revealed */}
          {showSecretSealEasterEgg && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-black font-mono text-xs shadow-2xl animate-fadeIn space-y-1">
              <div className="flex items-center justify-between font-black text-sm">
                <span>🌟 MANIFESTO DO CLÃ LOPES: A DINASTIA DA SUPERAÇÃO</span>
                <button onClick={() => setShowSecretSealEasterEgg(false)} className="text-black hover:text-white font-black">✕</button>
              </div>
              <p className="font-medium">
                "Não corremos apenas por medalhas. Corremos pela honra da família, pela saúde que nos sustenta e pela alegria de celebrar cada quilômetro juntos. Da prótese reversa à garra gaúcha e à juventude alviverde: o Clã Lopes é imparável!"
              </p>
            </div>
          )}

          {/* Section 1: Biometric & Identity Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#101726]/80 border border-white/10 print:bg-gray-50 print:border-gray-300 print:text-black">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Data Nasc. & Idade</span>
              <span className="text-base font-black text-white block mt-1 print:text-black">
                {currentSpecs.birthDate}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold print:text-emerald-700">
                {currentSpecs.ageYears} anos • Cat. {selectedProfile === "DANIEL" ? "M50-54" : selectedProfile === "PATRICIA" ? "F55-59" : "M20-24"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#101726]/80 border border-white/10 print:bg-gray-50 print:border-gray-300 print:text-black">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Composição Corporal</span>
              <span className="text-base font-black text-white block mt-1 print:text-black">
                {currentSpecs.weightKg} kg • {currentSpecs.heightCm} cm
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold print:text-amber-700">
                {currentSpecs.bodyFatPct}% Gordura Estimada
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#101726]/80 border border-white/10 print:bg-gray-50 print:border-gray-300 print:text-black">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Clube do Coração</span>
              <span className="text-base font-black text-white block mt-1 print:text-black">
                {currentSpecs.clubName}
              </span>
              <span className="text-xs text-sky-400 font-mono print:text-sky-700">
                {currentSpecs.clubStadium}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#101726]/80 border border-white/10 print:bg-gray-50 print:border-gray-300 print:text-black">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Comunicação WhatsApp</span>
              <span className="text-base font-black text-white block mt-1 font-mono print:text-black">
                {currentSpecs.phone}
              </span>
              <span className="text-xs text-emerald-400 font-mono print:text-emerald-700">
                Evolution API Habilitada
              </span>
            </div>
          </div>

          {/* Clinical Safeguard Alert */}
          {currentSpecs.clinicalSafe && (
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/40 text-red-300 text-xs space-y-1 print:bg-red-50 print:text-red-900 print:border-red-300">
              <div className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span>🛡️ Protocolo Clínico & Preservação Articular:</span>
              </div>
              <p>{currentSpecs.clinicalSafe.notes}</p>
            </div>
          )}

          {/* NOVO: Section 2: Palmarés Oficial, Resultados Homologados & Classificações */}
          <div className="p-5 rounded-2xl bg-[#101726]/90 border border-amber-500/40 space-y-4 print:bg-white print:border-gray-300 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 print:text-black">
                <Medal className="h-4 w-4 text-amber-400 print:text-amber-600" />
                <span>Palmarés Oficial & Classificações Homologadas</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 print:border-black print:text-black">
                Ranking Faixa Etária
              </span>
            </div>

            {completedRaces.length === 0 ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-400 font-mono text-center">
                Aguardando a conclusão da Athenas Mizuno amanhã para registrar o primeiro tempo oficial do ciclo.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {completedRaces.map((race) => (
                  <div
                    key={race.id}
                    className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono print:bg-gray-50 print:border-gray-200"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-white print:text-black">{race.name}</span>
                        {race.podiumAward && (
                          <span className="text-[10px] px-2 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800 print:border-black print:text-black">
                            {race.podiumAward}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-3 print:text-gray-700">
                        <span>Data: {race.raceDate}</span>
                        <span>•</span>
                        <span>Distância: {race.distanceKm} km</span>
                        <span>•</span>
                        <span>Local: {race.location}</span>
                      </div>
                      {race.raceNotes && (
                        <p className="text-[10px] text-gray-400 italic mt-1 print:text-gray-600">
                          "{race.raceNotes}"
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center w-full sm:w-auto">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 print:bg-white print:border-gray-200">
                        <span className="text-[9px] text-gray-400 uppercase block">Tempo Chip</span>
                        <span className="text-xs font-black text-emerald-400 print:text-emerald-700 block">
                          {race.actualFinishTime}
                        </span>
                        <span className="text-[9px] text-gray-400 block">{race.actualPaceMinKm}/km</span>
                      </div>

                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 print:bg-white print:border-gray-200">
                        <span className="text-[9px] text-gray-400 uppercase block">Gun Time</span>
                        <span className="text-xs font-bold text-gray-300 print:text-black block">
                          {race.actualGunTime || "--"}
                        </span>
                        <span className="text-[9px] text-gray-500 block">Bruto</span>
                      </div>

                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 print:bg-white print:border-gray-200">
                        <span className="text-[9px] text-gray-400 uppercase block">Faixa Etária</span>
                        <span className="text-xs font-black text-amber-400 print:text-black block">
                          {race.categoryRank || "--"}
                        </span>
                        <span className="text-[9px] text-amber-300/80 block">{race.ageGroupCategory}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 print:bg-white print:border-gray-200">
                        <span className="text-[9px] text-gray-400 uppercase block">Geral</span>
                        <span className="text-xs font-bold text-white print:text-black block">
                          {race.overallRank || "--"}
                        </span>
                        <span className="text-[9px] text-cyan-400 block">{race.genderRank || "--"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: 2026/2027 Target Races Matrix */}
          <div className="p-5 rounded-2xl bg-[#101726]/80 border border-white/10 space-y-3 print:bg-white print:border-gray-300">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 print:text-black">
              <Trophy className="h-4 w-4 text-amber-400 print:text-amber-600" />
              <span>Metas Futuras & Próximas Provas (2026 - 2027)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase print:text-amber-800">
                  Prova Alvo Principal (P1 Target)
                </span>
                <h4 className="text-base font-black text-white mt-0.5 print:text-black">
                  {currentSpecs.primaryRace.name}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-gray-300 print:text-gray-800">
                  <span>Distância: <strong>{currentSpecs.primaryRace.distance}</strong></span>
                  <span>•</span>
                  <span>Pace Alvo: <strong className="text-amber-400 print:text-black">{currentSpecs.primaryRace.targetPace}</strong></span>
                  <span>•</span>
                  <span>Meta: <strong>{currentSpecs.primaryRace.targetFinish}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase print:text-sky-800">
                  Prova de Ciclo Imediato / Preparatória
                </span>
                <h4 className="text-base font-black text-white mt-0.5 print:text-black">
                  {currentSpecs.secondaryRace.name}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-gray-300 print:text-gray-800">
                  <span>Data: <strong>{currentSpecs.secondaryRace.date}</strong></span>
                  <span>•</span>
                  <span>Distância: <strong>{currentSpecs.secondaryRace.distance}</strong></span>
                  <span>•</span>
                  <span>Pace: <strong className="text-sky-400 print:text-black">{currentSpecs.secondaryRace.targetPace}</strong></span>
                </div>
              </div>
            </div>

            {selectedProfile === "PATRICIA" && (
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-300 print:bg-sky-50 print:text-sky-900">
                ✨ <strong>Inscrições 2027 já asseguradas para Patrícia:</strong> Athenas Mizuno Run Longer 14k, Meia Maratona Vênus 21k, e Corrida Olga Kos 10k!
              </div>
            )}
            {selectedProfile === "DANIEL" && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 print:bg-amber-50 print:text-amber-900">
                🏃 <strong>Amanhã (18/10/2026):</strong> Athenas Mizuno Run Longer 21k (Tempo Base Oficial) • 2027: Maratona Internacional de SP 21k & Nike SP City 21k!
              </div>
            )}
          </div>

          {/* Section 4: Training Paces & Heart Rate Zones (Rua & Esteira) */}
          <div className="p-5 rounded-2xl bg-[#101726]/80 border border-white/10 space-y-4 print:bg-white print:border-gray-300">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 print:text-black">
              <Activity className="h-4 w-4 text-emerald-400 print:text-emerald-600" />
              <span>Zonas Cardíacas & Tabela de Paces (Rua & Esteira)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(currentSpecs.hrZones).map(([key, zone]) => (
                <div key={key} className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono print:bg-gray-50 print:border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">{zone.label}</span>
                  <span className="text-sm font-black text-white block mt-1 print:text-black">
                    {zone.min} - {zone.max} bpm
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Pace Z2 (Base Aeróbia):</span>
                <span className="text-sm font-black text-emerald-400 print:text-emerald-700">{currentSpecs.paces.z2Base}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Pace Z3 (Tempo / Prova):</span>
                <span className="text-sm font-black text-amber-400 print:text-amber-700">{currentSpecs.paces.z3Tempo}</span>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Velocidade Esteira Z2 (1.0% inc):</span>
                <span className="text-sm font-black text-cyan-400 print:text-cyan-700">{currentSpecs.paces.treadmillZ2Speed}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Nutrition TACO & Macro Balance */}
          <div className="p-5 rounded-2xl bg-[#101726]/80 border border-white/10 space-y-3 print:bg-white print:border-gray-300">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 print:text-black">
              <Scale className="h-4 w-4 text-cyan-400 print:text-cyan-600" />
              <span>Plano Nutricional Tabela TACO & Balança Panela Familiar</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Meta Calórica Diária</span>
                <span className="text-base font-black text-white mt-1 block print:text-black">
                  {currentSpecs.nutritionTaco.caloricTargetKcal} kcal
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Proteínas (G/dia)</span>
                <span className="text-base font-black text-cyan-400 mt-1 block print:text-cyan-700">
                  {currentSpecs.nutritionTaco.proteinG}g
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Carboidratos Táticos</span>
                <span className="text-base font-black text-amber-400 mt-1 block print:text-amber-700">
                  {currentSpecs.nutritionTaco.carbsG}g
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-[10px] text-gray-400 block">Gorduras Lipídicas</span>
                <span className="text-base font-black text-purple-400 mt-1 block print:text-purple-700">
                  {currentSpecs.nutritionTaco.fatsG}g
                </span>
              </div>
            </div>
          </div>

          {/* Section 6: Prescrição de Força & Musculação */}
          <div className="p-5 rounded-2xl bg-[#101726]/80 border border-white/10 space-y-3 print:bg-white print:border-gray-300">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider print:text-black">
              Prescrição de Força Funcional ({fichaA.focus})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {fichaA.exercises.slice(0, 4).map((ex, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center print:bg-gray-50 print:border-gray-200">
                  <div>
                    <span className="font-bold text-white block print:text-black">{ex.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{ex.targetMuscle}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold print:text-emerald-700">
                    {ex.sets}x {ex.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Haute Horlogerie Footer Stamp */}
          <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-gray-500 print:text-gray-600 print:border-black">
            <span>BIO-TRIAD OS • CLÃ LOPES MOTOR FISIOLÓGICO</span>
            <span className="text-amber-400/80 font-bold">HAUTE HORLOGERIE PRECISION • SWISS CALIBRATION V3</span>
            <span>AUTENTICADO VIA EVOLUTION API & TUYA SMART CLOUD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
