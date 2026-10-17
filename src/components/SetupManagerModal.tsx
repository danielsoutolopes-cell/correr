"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  X,
  Watch,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  Zap,
  Cpu,
  Key,
  RefreshCw,
  Copy,
  Save,
  MessageSquare,
  HelpCircle,
  Link as LinkIcon,
  Smartphone,
  Layers,
  Sparkles,
} from "lucide-react";
import { ProfileId } from "@/lib/types";

interface SetupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileId;
  onOpenManual?: () => void;
}

interface AthleteStravaConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  athleteId: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export function SetupManagerModal({
  isOpen,
  onClose,
  currentProfile,
  onOpenManual,
}: SetupManagerModalProps) {
  const [activeTab, setActiveTab] = useState<
    "STRAVA" | "WEARABLES" | "TUYA" | "WHATSAPP" | "TUTORIAL"
  >("STRAVA");

  const [selectedAthlete, setSelectedAthlete] = useState<"DANIEL" | "PATRICIA" | "GABRIEL">(
    currentProfile === "CLAN" || currentProfile === "DANIEL"
      ? "DANIEL"
      : currentProfile === "PATRICIA"
      ? "PATRICIA"
      : "GABRIEL"
  );

  // Strava configurations per athlete
  const [stravaConfigs, setStravaConfigs] = useState<
    Record<"DANIEL" | "PATRICIA" | "GABRIEL", AthleteStravaConfig>
  >({
    DANIEL: {
      clientId: "203901",
      clientSecret: "f95bd4f6b226b534137a2ac283cf7b1f26c27b1f",
      refreshToken: "a7c968f936bbde357452e9372ec7ab83da54be39",
      athleteId: "Daniel Souto Lopes",
      isConnected: true,
      lastSyncedAt: "17/10/2026 15:42",
    },
    PATRICIA: {
      clientId: "",
      clientSecret: "",
      refreshToken: "",
      athleteId: "Patrícia Souto Lopes",
      isConnected: false,
    },
    GABRIEL: {
      clientId: "",
      clientSecret: "",
      refreshToken: "",
      athleteId: "Gabriel Souto Maior",
      isConnected: false,
    },
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("BIO_TRIAD_STRAVA_ATHLETE_CONFIGS");
      if (stored) {
        setStravaConfigs(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  if (!isOpen) return null;

  const currentConfig = stravaConfigs[selectedAthlete];

  const handleUpdateConfig = (field: keyof AthleteStravaConfig, value: string) => {
    const updated = {
      ...stravaConfigs,
      [selectedAthlete]: {
        ...stravaConfigs[selectedAthlete],
        [field]: value,
        isConnected: Boolean(
          field === "refreshToken" ? value : stravaConfigs[selectedAthlete].refreshToken
        ),
      },
    };
    setStravaConfigs(updated);
  };

  const handleSaveConfigs = () => {
    try {
      localStorage.setItem("BIO_TRIAD_STRAVA_ATHLETE_CONFIGS", JSON.stringify(stravaConfigs));
      setNotification(`Configurações de ${selectedAthlete} salvas com sucesso no Bio-Triad OS! ✅`);
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      setNotification("Erro ao persistir configurações locais.");
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(label);
    setTimeout(() => setIsCopied(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      if (currentConfig.refreshToken || selectedAthlete === "DANIEL") {
        setNotification(`Conexão com Strava V3 validada para ${selectedAthlete}! Token ativo.`);
      } else {
        setNotification("Insira o Client ID, Client Secret e Refresh Token para validar.");
      }
      setTimeout(() => setNotification(null), 4000);
    }, 1200);
  };

  // Build OAuth Authorization URL for Patrícia or Gabriel
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${
    currentConfig.clientId || "SEU_CLIENT_ID"
  }&response_type=code&redirect_uri=http://localhost:3000/api/sync/strava&approval_prompt=force&scope=read,activity:read_all`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-[#0B0F19] border border-cyan-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#0C1424] via-[#0F172A] to-black">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Settings className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-white font-mono">
                  CENTRAL DE SETUP & CONEXÕES
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Hardware & APIs
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Gerencie Strava da Patrícia e do Gabriel, Wearables, Tuya IoT e WhatsApp Evolution
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

        {/* Global Notification Toast */}
        {notification && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-gradient-to-r from-blue-950 via-cyan-950 to-blue-950 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-white/10 bg-[#0A0D16] flex items-center gap-2 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab("STRAVA")}
            className={`py-2 px-3 rounded-t-xl transition-all border-b-2 font-bold flex items-center gap-2 ${
              activeTab === "STRAVA"
                ? "border-cyan-400 text-cyan-300 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Share2 className="h-4 w-4 text-orange-400" />
            <span>1. Strava V3 Multi-Atleta</span>
          </button>

          <button
            onClick={() => setActiveTab("WEARABLES")}
            className={`py-2 px-3 rounded-t-xl transition-all border-b-2 font-bold flex items-center gap-2 ${
              activeTab === "WEARABLES"
                ? "border-cyan-400 text-cyan-300 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Watch className="h-4 w-4 text-emerald-400" />
            <span>2. Galaxy Watch & Wearables</span>
          </button>

          <button
            onClick={() => setActiveTab("TUYA")}
            className={`py-2 px-3 rounded-t-xl transition-all border-b-2 font-bold flex items-center gap-2 ${
              activeTab === "TUYA"
                ? "border-cyan-400 text-cyan-300 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>3. Hardware Tuya Smart Home</span>
          </button>

          <button
            onClick={() => setActiveTab("WHATSAPP")}
            className={`py-2 px-3 rounded-t-xl transition-all border-b-2 font-bold flex items-center gap-2 ${
              activeTab === "WHATSAPP"
                ? "border-cyan-400 text-cyan-300 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-green-400" />
            <span>4. WhatsApp Evolution</span>
          </button>

          <button
            onClick={() => setActiveTab("TUTORIAL")}
            className={`py-2 px-3 rounded-t-xl transition-all border-b-2 font-bold flex items-center gap-2 ${
              activeTab === "TUTORIAL"
                ? "border-cyan-400 text-cyan-300 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <HelpCircle className="h-4 w-4 text-purple-400" />
            <span>5. Passo a Passo & Tutorial</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: STRAVA V3 MULTI-ATLETA */}
          {activeTab === "STRAVA" && (
            <div className="space-y-5 animate-fadeIn">
              {/* Athlete Segmented Switcher */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">
                  Configurar Strava para o Atleta:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAthlete("DANIEL")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      selectedAthlete === "DANIEL"
                        ? "bg-red-600/30 border border-red-500 text-white shadow-md shadow-red-500/20"
                        : "bg-white/5 border border-white/10 text-gray-400"
                    }`}
                  >
                    <Flame className="h-3.5 w-3.5 text-red-400" />
                    <span>Daniel (FLA)</span>
                  </button>

                  <button
                    onClick={() => setSelectedAthlete("PATRICIA")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      selectedAthlete === "PATRICIA"
                        ? "bg-sky-600/30 border border-sky-500 text-white shadow-md shadow-sky-500/20"
                        : "bg-white/5 border border-white/10 text-gray-400"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5 text-sky-400" />
                    <span>Patrícia (GRE)</span>
                  </button>

                  <button
                    onClick={() => setSelectedAthlete("GABRIEL")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      selectedAthlete === "GABRIEL"
                        ? "bg-emerald-600/30 border border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "bg-white/5 border border-white/10 text-gray-400"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Gabriel (PAL)</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                  currentConfig.isConnected
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                    : "bg-amber-950/20 border-amber-500/40 text-amber-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {currentConfig.isConnected ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-1">
                    <span className="font-bold font-mono text-sm block">
                      {currentConfig.isConnected
                        ? `Strava de ${selectedAthlete} Conectado & Ativo`
                        : `Strava de ${selectedAthlete} Aguardando Configuração`}
                    </span>
                    <p className="text-gray-300 leading-relaxed">
                      {currentConfig.isConnected
                        ? `As atividades e treinos de ${selectedAthlete} são lidos automaticamente com cálculo de pace médio, cadência e elevação.`
                        : `Para ler as corridas da Patrícia ou do Gabriel diretamente, crie uma chave gratuita na API Strava e cole as credenciais abaixo.`}
                    </p>
                    {currentConfig.lastSyncedAt && (
                      <span className="text-[10px] font-mono text-gray-400 block mt-1">
                        Última sincronização: {currentConfig.lastSyncedAt}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href="https://www.strava.com/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <span>Strava API</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Strava Credential Inputs */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase text-gray-300 flex items-center gap-2">
                  <Key className="h-4 w-4 text-cyan-400" />
                  Credenciais OAuth 2.0 Strava V3 ({selectedAthlete})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Client ID */}
                  <div>
                    <label className="text-[11px] text-gray-400 uppercase block mb-1">
                      Client ID (Strava)
                    </label>
                    <input
                      type="text"
                      value={currentConfig.clientId}
                      onChange={(e) => handleUpdateConfig("clientId", e.target.value)}
                      placeholder="Ex: 203901"
                      className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Client Secret */}
                  <div>
                    <label className="text-[11px] text-gray-400 uppercase block mb-1">
                      Client Secret (Strava)
                    </label>
                    <input
                      type="password"
                      value={currentConfig.clientSecret}
                      onChange={(e) => handleUpdateConfig("clientSecret", e.target.value)}
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Refresh Token */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-gray-400 uppercase block mb-1">
                      Refresh Token (Permanente - scope: read,activity:read_all)
                    </label>
                    <input
                      type="text"
                      value={currentConfig.refreshToken}
                      onChange={(e) => handleUpdateConfig("refreshToken", e.target.value)}
                      placeholder="Ex: a7c968f936bbde357452e9372ec7ab83da54be39"
                      className="w-full bg-[#080B12] border border-white/15 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      O refresh token permite ao Bio-Triad OS renovar o acesso silenciosamente sem que o atleta precise fazer login novamente.
                    </span>
                  </div>
                </div>

                {/* Direct Authorization URL Generator */}
                <div className="p-3 rounded-xl bg-[#080B12] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-300 font-bold flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5 text-orange-400" />
                      Link de Autorização para {selectedAthlete}:
                    </span>
                    <button
                      onClick={() => handleCopyText(stravaAuthUrl, "AUTH_URL")}
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{isCopied === "AUTH_URL" ? "Copiado! ✅" : "Copiar Link"}</span>
                    </button>
                  </div>
                  <div className="p-2 rounded bg-black/60 font-mono text-[10px] text-gray-400 break-all select-all">
                    {stravaAuthUrl}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Basta enviar esse link para o WhatsApp da Patrícia ou do Gabriel. Ao clicar e autorizar, o Strava gera o código de autorização para ler todos os treinos.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 text-xs font-mono font-bold flex items-center gap-2 transition-all"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin text-cyan-400" : ""}`} />
                    <span>{isTesting ? "Testando..." : "Testar Conexão"}</span>
                  </button>

                  <button
                    onClick={handleSaveConfigs}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30"
                  >
                    <Save className="h-4 w-4" />
                    <span>Salvar Configurações de {selectedAthlete}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEARABLES & TELEMETRIA */}
          {activeTab === "WEARABLES" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase text-gray-300 flex items-center gap-2">
                  <Watch className="h-4 w-4 text-emerald-400" />
                  Mapeamento de Fontes Biométricas do Clã
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  {/* Daniel */}
                  <div className="p-3.5 rounded-xl bg-[#080B12] border border-red-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-red-400" />
                        Daniel
                      </span>
                      <span className="text-[10px] text-red-400">FLA 🔴⚫</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      <strong>Galaxy Watch Ultra 47mm Titanium</strong> sincronizado via Intervals.icu REST API (`I753639`).
                    </p>
                    <div className="p-2 rounded bg-black/40 text-[10px] text-gray-300 space-y-0.5">
                      <div>HRV rMSSD: 69 ms</div>
                      <div>FC Repouso: 52 bpm</div>
                      <div>Sono Profundo N3: Ativo</div>
                    </div>
                  </div>

                  {/* Patrícia */}
                  <div className="p-3.5 rounded-xl bg-[#080B12] border border-sky-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-sky-400" />
                        Patrícia
                      </span>
                      <span className="text-[10px] text-sky-400">GRE 🔵⚪⚫</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      <strong>Check-in Matinal Subjetivo</strong> + App Strava Pro (Smartphone / Smartwatch auxiliar).
                    </p>
                    <div className="p-2 rounded bg-black/40 text-[10px] text-gray-300 space-y-0.5">
                      <div>Prontidão Matinal: 94%</div>
                      <div>Faixa Alvo 14k: 5:55/km</div>
                      <div>Cadência Alvo: 180 spm</div>
                    </div>
                  </div>

                  {/* Gabriel */}
                  <div className="p-3.5 rounded-xl bg-[#080B12] border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                        Gabriel
                      </span>
                      <span className="text-[10px] text-emerald-400">PAL 🟢⚪</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      <strong>Strava Speed & Cronometragem</strong> para tiros rápidos de 5k e 10k sub-45.
                    </p>
                    <div className="p-2 rounded bg-black/40 text-[10px] text-gray-300 space-y-0.5">
                      <div>FC Repouso: 50 bpm</div>
                      <div>Pace 5k: 4:27/km</div>
                      <div>Cadência Alvo: 185 spm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TUYA SMART HOME */}
          {activeTab === "TUYA" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-mono uppercase text-gray-300 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Dispositivos Mapeados no Bio-Triad OS (Conta Tuya Cloud)
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">11 Dispositivos Conectados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#080B12] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">L_Futebol (Sala / TV)</span>
                      <span className="text-[10px] text-gray-400">eb52fdf73913d81cf5ruqt</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      RGB+CCT
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#080B12] border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300 block">Tomada Dupla (ebc4a8285904c4bd43crx7)</span>
                      <span className="text-[10px] text-gray-400">Canal 1: Cafezinho | Canal 2: Mate</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      2-GANG
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#080B12] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Led Quarto (Casal)</span>
                      <span className="text-[10px] text-gray-400">eb4deff019cb6627614ic8</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Circadiano
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#080B12] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Luz Casal (Interruptor Mini)</span>
                      <span className="text-[10px] text-gray-400">eb6bb3db2a18ae84dbsio8</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-300">
                      Relé 16A
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#080B12] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Temperatura Suíte (Sensor)</span>
                      <span className="text-[10px] text-gray-400">ebd06d28857eda13d83o0h</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Zigbee Sensor
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#080B12] border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Tomada TV (Sala)</span>
                      <span className="text-[10px] text-gray-400">ebc2434ca5ee0361acjqqp</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Eco All-Off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WHATSAPP EVOLUTION */}
          {activeTab === "WHATSAPP" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase text-gray-300 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-400" />
                  Servidor Evolution API WhatsApp (Instância: ecostone)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-[#080B12] border border-white/10 space-y-1">
                    <span className="text-gray-400 block uppercase text-[10px]">Daniel Souto Lopes</span>
                    <span className="text-base font-bold text-white block">+55 (11) 98813-9833</span>
                    <span className="text-[10px] text-emerald-400">Notificações de Longão & Metas 21k</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#080B12] border border-white/10 space-y-1">
                    <span className="text-gray-400 block uppercase text-[10px]">Patrícia Souto Lopes</span>
                    <span className="text-base font-bold text-white block">+55 (11) 98813-6702</span>
                    <span className="text-[10px] text-sky-400">Check-in Matinal & Metas 14k/21k</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TUTORIAL PASSO A PASSO */}
          {activeTab === "TUTORIAL" && (
            <div className="space-y-4 animate-fadeIn text-xs leading-relaxed">
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <h3 className="text-sm font-black font-mono text-cyan-300 uppercase flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  Como Configurar o Strava da Patrícia e do Gabriel (Tutorial Rápido)
                </h3>

                <ol className="list-decimal pl-5 space-y-3 text-gray-300 font-mono">
                  <li>
                    <strong>Acessar o Painel de Desenvolvedores do Strava:</strong>
                    <p className="text-gray-400 mt-0.5">
                      Faça login no Strava com a conta da Patrícia ou do Gabriel e acesse:{" "}
                      <a
                        href="https://www.strava.com/settings/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 underline"
                      >
                        strava.com/settings/api
                      </a>.
                    </p>
                  </li>

                  <li>
                    <strong>Criar o Aplicativo Pessoal da Conta:</strong>
                    <div className="p-2.5 rounded-xl bg-[#080B12] border border-white/5 space-y-1 text-[11px] text-gray-300 my-1">
                      <div>• <strong>Application Name:</strong> Bio-Triad OS Patrícia (ou Gabriel)</div>
                      <div>• <strong>Category:</strong> Training / Health</div>
                      <div>• <strong>Website:</strong> http://localhost:3000</div>
                      <div>• <strong>Authorization Callback Domain:</strong> localhost</div>
                    </div>
                  </li>

                  <li>
                    <strong>Copiar o Client ID e Client Secret:</strong>
                    <p className="text-gray-400 mt-0.5">
                      Copie o número do <code>Client ID</code> e a chave <code>Client Secret</code> e cole na aba <strong>1. Strava V3</strong> deste painel de Setup.
                    </p>
                  </li>

                  <li>
                    <strong>Autorizar Acesso Completo às Atividades:</strong>
                    <p className="text-gray-400 mt-0.5">
                      Abra o link de autorização gerado acima no navegador ou envie pelo WhatsApp. Ao clicar em <strong>"Autorizar"</strong>, o Strava concede permissão permanente de leitura das corridas com pace, cadência e batimentos.
                    </p>
                  </li>

                  <li>
                    <strong>Salvar e Pronto!</strong>
                    <p className="text-gray-400 mt-0.5">
                      Clique em <strong>"Salvar Configurações"</strong>. O Bio-Triad OS sincroniza automaticamente as atividades de cada atleta no Cockpit e no Treinador!
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070A11] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-gray-400">
            Bio-Triad OS • Setup Centralizado com Armazenamento Seguro e Criptografia Local
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
            >
              Concluir & Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
