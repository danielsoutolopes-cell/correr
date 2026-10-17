"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Shield,
  Users,
  Activity,
  Trophy,
  Zap,
  Clock,
  Sparkles,
  Wifi,
  ChevronDown,
  Compass,
} from "lucide-react";
import { FootballTeamData } from "@/lib/types";
import { getProfileSpecs } from "@/lib/physiology";

interface TopBarGlobalProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  onSelectProfile: (profile: "DANIEL" | "PATRICIA" | "CLAN") => void;
  footballData: {
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
  };
  onRefreshData?: () => void;
}

export function TopBarGlobal({
  currentProfile,
  onSelectProfile,
  footballData,
  onRefreshData,
}: TopBarGlobalProps) {
  const [daysToSpInter, setDaysToSpInter] = useState<number>(176);
  const [daysToNike, setDaysToNike] = useState<number>(281);
  const [daysToEstacoes, setDaysToEstacoes] = useState<number>(218);

  const spec = getProfileSpecs(currentProfile);

  useEffect(() => {
    const now = new Date();
    const d1 = new Date("2027-04-11T07:00:00");
    const d2 = new Date("2027-07-25T06:30:00");
    const d3 = new Date("2027-05-23T07:00:00");

    setDaysToSpInter(Math.max(0, Math.ceil((d1.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
    setDaysToNike(Math.max(0, Math.ceil((d2.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
    setDaysToEstacoes(Math.max(0, Math.ceil((d3.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
  }, []);

  const activeTeamData =
    currentProfile === "PATRICIA"
      ? footballData.gremio
      : footballData.flamengo;

  const isDaniel = currentProfile === "DANIEL";
  const isPatricia = currentProfile === "PATRICIA";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070A11]/90 backdrop-blur-xl px-3 sm:px-6 py-2.5 transition-all shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Clan Profile Switcher */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-400 to-amber-400 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-[#070A11] rounded-[10px] flex items-center justify-center">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-widest uppercase text-white font-mono">
                  BIO-TRIAD <span className="text-emerald-400">OS</span>
                </span>
                <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase">
                  HAUTE SPORTS
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                Lopes Clan Precision • TACO • 2027
              </p>
            </div>
          </div>

          {/* Luxury Haute Horlogerie Segmented Switcher */}
          <div className="flex items-center bg-[#0C101A] p-1 rounded-2xl border border-white/10 shadow-inner">
            {/* Daniel Profile Pill */}
            <button
              onClick={() => onSelectProfile("DANIEL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isDaniel
                  ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              <Flame className="h-3.5 w-3.5 text-white" />
              <span>Daniel</span>
              <span className="text-[10px] opacity-90 px-1 py-0.2 rounded bg-black/40 font-mono">
                FLA 🔴⚫
              </span>
            </button>

            {/* Patrícia Profile Pill */}
            <button
              onClick={() => onSelectProfile("PATRICIA")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPatricia
                  ? "bg-gradient-to-r from-sky-600 to-cyan-700 text-white shadow-lg shadow-sky-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-sky-300"></span>
              <Shield className="h-3.5 w-3.5 text-white" />
              <span>Patrícia</span>
              <span className="text-[10px] opacity-90 px-1 py-0.2 rounded bg-black/40 font-mono">
                GRE 🔵⚪⚫
              </span>
            </button>

            {/* Clan Lopes Profile Pill */}
            <button
              onClick={() => onSelectProfile("CLAN")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentProfile === "CLAN"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-white/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Users className="h-3.5 w-3.5 text-white" />
              <span className="hidden sm:inline">Clã Lopes</span>
              <span className="text-[9px] opacity-80 font-mono">Duo</span>
            </button>
          </div>
        </div>

        {/* Dynamic Football & Target Races Badges */}
        <div className="flex items-center flex-wrap justify-end gap-2.5 w-full md:w-auto">
          {/* Live Football Crest & Match Badge */}
          {activeTeamData && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-md ${
                isPatricia
                  ? "border-sky-500/40 bg-sky-950/30 text-sky-300"
                  : "border-red-500/40 bg-red-950/30 text-red-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isPatricia ? "bg-sky-400" : "bg-red-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isPatricia ? "bg-sky-500" : "bg-red-500"
                    }`}
                  ></span>
                </span>
                <span className="font-black tracking-wide">
                  {isPatricia ? "Grêmio (Imortal):" : "Flamengo (Mengão):"}
                </span>
                <span className="font-mono text-white">{activeTeamData.standingPosition}º Lugar</span>
                <span className="text-gray-400 text-[11px]">({activeTeamData.points} pts)</span>
              </div>

              {activeTeamData.nextMatches && activeTeamData.nextMatches[0] && (
                <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/10 text-[11px] text-gray-300">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span>
                    vs {activeTeamData.nextMatches[0].opponent} ({activeTeamData.nextMatches[0].timeBrasilia || "21:30"})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Individualized 2027 Season Countdown Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-semibold shadow-md">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            {isPatricia ? (
              <>
                <span className="hidden sm:inline text-gray-300">Meta Patrícia:</span>
                <span className="text-white font-bold">Estações 10k</span>
                <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded text-[11px] font-mono">
                  {daysToEstacoes}d
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-300 font-bold">Casal 10.5k</span>
                <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded text-[11px] font-mono">
                  {daysToNike}d
                </span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline text-gray-300">Meias 2027:</span>
                <span className="text-white font-bold">SP 21k</span>
                <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded text-[11px] font-mono">
                  {daysToSpInter}d
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-white font-bold">Nike 21k</span>
                <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded text-[11px] font-mono">
                  {daysToNike}d
                </span>
              </>
            )}
          </div>

          {/* Athlete Hardware Sync Badge */}
          <button
            onClick={onRefreshData}
            title="Sincronizar telemetria real do atleta"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0C101A] text-gray-300 hover:text-white hover:border-emerald-500/40 text-xs font-medium transition-all shadow-sm"
          >
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span className="hidden sm:inline font-mono">
              {isPatricia ? "Patrícia Watch" : "Galaxy Ultra"}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {isPatricia ? "Strava Pro" : "I753639"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
