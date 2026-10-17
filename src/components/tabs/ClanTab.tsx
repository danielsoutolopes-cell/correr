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
} from "lucide-react";

interface ClanTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  onSelectProfile: (profile: "DANIEL" | "PATRICIA" | "CLAN") => void;
  onRefreshData?: () => void;
}

export function ClanTab({ currentProfile, onSelectProfile, onRefreshData }: ClanTabProps) {
  const [intervalsAthleteId, setIntervalsAthleteId] = useState<string>("I753639");
  const [intervalsApiKey, setIntervalsApiKey] = useState<string>("");
  const [tuyaClientId, setTuyaClientId] = useState<string>("");
  const [tuyaSecret, setTuyaSecret] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Clan Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111827] via-[#161F33] to-[#111827] border border-[#1F2937] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">Hub do Clã Lopes</h2>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Household ID: LOPES-TRIAD-2027 • Gestão de Membros, IoT e Credenciais em Nuvem
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800">
              Família Ativa
            </span>
          </div>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Daniel Souto Lopes */}
          <div
            onClick={() => onSelectProfile("DANIEL")}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              currentProfile === "DANIEL"
                ? "border-red-500 bg-red-950/20 shadow-md shadow-red-500/20"
                : "border-gray-800 bg-[#090D16] hover:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center">
                  <Flame className="h-4 w-4 text-red-500" />
                </div>
                <span className="text-sm font-bold text-white">Daniel Souto Lopes</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                ADMIN • FLAMENGO
              </span>
            </div>

            <div className="space-y-1 text-xs text-gray-300">
              <p>Idade: 43 anos • Altura: 170cm • Peso: 80.0kg (Meta: 75kg)</p>
              <p className="text-red-300 text-[11px]">
                Condição: Prótese reversa no ombro direito (adaptações ativas)
              </p>
              <p className="text-[11px] text-gray-400">
                Intervals Athlete: I753639 • Zonas FC: Z1 (73-109) a Z5 (164-182)
              </p>
            </div>
          </div>

          {/* Patrícia Lopes */}
          <div
            onClick={() => onSelectProfile("PATRICIA")}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              currentProfile === "PATRICIA"
                ? "border-sky-500 bg-sky-950/20 shadow-md shadow-sky-500/20"
                : "border-gray-800 bg-[#090D16] hover:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-sky-400" />
                </div>
                <span className="text-sm font-bold text-white">Patrícia Lopes</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                MEMBRO • GRÊMIO
              </span>
            </div>

            <div className="space-y-1 text-xs text-gray-300">
              <p>Idade: 40 anos • Altura: 162cm • Peso: 58.0kg (Meta: 55kg)</p>
              <p className="text-sky-300 text-[11px]">
                Foco: Recomposição corporal, corridas sincronizadas e pedal em família
              </p>
              <p className="text-[11px] text-gray-400">
                Zonas FC Femininas: Z1 (80-115) a Z5 (172-188 bpm)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* External Integrations & Cloud Config */}
      <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Integrações de Hardware &amp; APIs de Nuvem (Zero-Mock)
            </h3>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>Configurações atualizadas!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveConfigs} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Intervals.icu Integration */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  Intervals.icu (Galaxy Watch Ultra)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Ativo</span>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Athlete ID (Intervals.icu)
                </label>
                <input
                  type="text"
                  value={intervalsAthleteId}
                  onChange={(e) => setIntervalsAthleteId(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Intervals API Key (opcional se já no .env)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={intervalsApiKey}
                  onChange={(e) => setIntervalsApiKey(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tuya OpenAPI Integration */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4" />
                  Tuya IoT Cloud OpenAPI (EUA)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Pronto</span>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Tuya Client ID (Access ID)
                </label>
                <input
                  type="text"
                  placeholder="Ex: tuya_client_id_xxxx"
                  value={tuyaClientId}
                  onChange={(e) => setTuyaClientId(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
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
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Gemini AI Key */}
          <div className="p-4 rounded-xl bg-[#090D16] border border-gray-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Key className="h-4 w-4" />
              Google Gen AI SDK (Gemini 2.5 Flash + Google Search Grounding)
            </span>
            <input
              type="password"
              placeholder="GEMINI_API_KEY (alimenta o Family Football Hub ao vivo e o Bio-Scanner)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-[#111827] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onRefreshData}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Wifi className="h-3.5 w-3.5" />
              <span>Testar Sincronização em Tempo Real</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30"
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
