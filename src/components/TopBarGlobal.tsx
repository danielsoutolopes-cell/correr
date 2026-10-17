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
} from "lucide-react";
import { FootballTeamData } from "@/lib/types";

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

  useEffect(() => {
    // Current date logic: calculate days to SP 2027 (April 11, 2027) and Nike SP City (July 25, 2027)
    const now = new Date();
    const d1 = new Date("2027-04-11T07:00:00");
    const d2 = new Date("2027-07-25T06:30:00");
    const diff1 = Math.max(0, Math.ceil((d1.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const diff2 = Math.max(0, Math.ceil((d2.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysToSpInter(diff1);
    setDaysToNike(diff2);
  }, []);

  const activeTeamData =
    currentProfile === "PATRICIA"
      ? footballData.gremio
      : footballData.flamengo;

  const isFlamengo = currentProfile !== "PATRICIA";
  const teamColorClass = isFlamengo
    ? "border-red-500/40 bg-red-950/20 text-red-400"
    : "border-sky-500/40 bg-sky-950/20 text-sky-400";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F2937] bg-[#090D16]/90 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Clan Profile Switcher */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-amber-500 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <Activity className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wider uppercase text-white">
                  Bio-Triad <span className="text-blue-500">OS</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  V10.0
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Performance • TACO • Neuro-Reset
              </p>
            </div>
          </div>

          {/* Quick Profile Segment Switcher */}
          <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-[#1F2937]">
            <button
              onClick={() => onSelectProfile("DANIEL")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentProfile === "DANIEL"
                  ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>Daniel</span>
              <span className="text-[9px] opacity-80">(FLA)</span>
            </button>

            <button
              onClick={() => onSelectProfile("PATRICIA")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentProfile === "PATRICIA"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Shield className="h-3 w-3" />
              <span>Patrícia</span>
              <span className="text-[9px] opacity-80">(GRE)</span>
            </button>

            <button
              onClick={() => onSelectProfile("CLAN")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentProfile === "CLAN"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Clã Lopes</span>
            </button>
          </div>
        </div>

        {/* Live Football & Season Badges */}
        <div className="flex items-center flex-wrap justify-end gap-2.5 w-full md:w-auto">
          {/* Live Football Dynamic Badge */}
          {activeTeamData && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${teamColorClass} text-xs font-medium transition-all shadow-sm`}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isFlamengo ? "bg-red-400" : "bg-sky-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isFlamengo ? "bg-red-500" : "bg-sky-500"
                    }`}
                  ></span>
                </span>
                <span className="font-bold">{activeTeamData.teamName}:</span>
                <span>{activeTeamData.standingPosition}º Lugar</span>
                <span className="text-gray-400">({activeTeamData.points} pts)</span>
              </div>

              {activeTeamData.nextMatches && activeTeamData.nextMatches[0] && (
                <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-gray-700/60 text-[11px] text-gray-300">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span>
                    Próx: vs {activeTeamData.nextMatches[0].opponent} (
                    {activeTeamData.nextMatches[0].date})
                  </span>
                </div>
              )}

              {activeTeamData.tensionIndex >= 4 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  Tensão {activeTeamData.tensionIndex}/5
                </span>
              )}
            </div>
          )}

          {/* 2027 Season Countdown Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-semibold">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Meias 2027:</span>
            <span className="text-white font-bold">SP 21k</span>
            <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded text-[11px]">
              {daysToSpInter}d
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-white font-bold">Nike 21k</span>
            <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded text-[11px]">
              {daysToNike}d
            </span>
          </div>

          {/* Galaxy Watch Live Sync Badge */}
          <button
            onClick={onRefreshData}
            title="Sincronizar Galaxy Watch Ultra & Intervals.icu"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-950/20 text-blue-400 hover:bg-blue-900/30 text-xs font-medium transition-all"
          >
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span className="hidden sm:inline">Intervals.icu</span>
            <span className="text-[10px] text-gray-400">I753639</span>
          </button>
        </div>
      </div>
    </header>
  );
}
