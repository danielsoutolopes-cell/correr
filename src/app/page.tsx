"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Activity,
  Utensils,
  Brain,
  Users,
  Flame,
  Shield,
  Zap,
} from "lucide-react";
import { TopBarGlobal } from "@/components/TopBarGlobal";
import { CockpitTab } from "@/components/tabs/CockpitTab";
import { CoachTab } from "@/components/tabs/CoachTab";
import { NutritionTab } from "@/components/tabs/NutritionTab";
import { MentalHealthTab } from "@/components/tabs/MentalHealthTab";
import { ClanTab } from "@/components/tabs/ClanTab";
import { BodyMetrics, FootballTeamData, GalaxyWatchTelemetry } from "@/lib/types";
import { calculateBodyMetrics } from "@/lib/physiology";

export default function BioTriadApp() {
  const [activeTab, setActiveTab] = useState<
    "COCKPIT" | "COACH" | "NUTRITION" | "MENTAL" | "CLAN"
  >("COCKPIT");

  const [currentProfile, setCurrentProfile] = useState<"DANIEL" | "PATRICIA" | "CLAN">(
    "DANIEL"
  );

  // Real-time football telemetry state
  const [footballData, setFootballData] = useState<{
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
  }>({
    flamengo: null,
    gremio: null,
  });

  // Galaxy Watch Ultra Telemetry State
  const [telemetry, setTelemetry] = useState<GalaxyWatchTelemetry>({
    date: new Date().toISOString().split("T")[0],
    restingHeartRate: 52,
    hrvRmssd: 69,
    sleepDurationMinutes: 440,
    sleepScore: 88,
    steps: 12150,
    recoveryReadinessPct: 90,
    activities: [],
  });

  // Deterministic body metrics for Daniel vs Patrícia
  const metrics: BodyMetrics =
    currentProfile === "PATRICIA"
      ? calculateBodyMetrics({
          weightKg: 58.0,
          waistCm: 68,
          neckCm: 32,
          hipCm: 96,
          heightCm: 162,
          sex: "FEMALE",
          targetWeightKg: 55.0,
        })
      : calculateBodyMetrics({
          weightKg: 80.0,
          waistCm: 86,
          neckCm: 38,
          hipCm: 98,
          heightCm: 170,
          sex: "MALE",
          targetWeightKg: 75.0,
        });

  // Fetch football and Intervals data on load with Eco-Green on-demand fetching
  const refreshLiveDataForProfile = async (profile: "DANIEL" | "PATRICIA" | "CLAN", force = false) => {
    try {
      const activeTeam = profile === "PATRICIA" ? "Grêmio" : "Flamengo";
      const requests: Promise<any>[] = [
        fetch(`/api/football/live?team=${activeTeam}${force ? "&refresh=true" : ""}`)
          .then((r) => r.json())
          .catch(() => null),
        fetch(`/api/sync/galaxy-watch${force ? "?refresh=true" : ""}`)
          .then((r) => r.json())
          .catch(() => null),
      ];

      const [teamRes, watchRes] = await Promise.all(requests);

      if (teamRes && !teamRes.error) {
        if (activeTeam === "Flamengo") {
          setFootballData((prev) => ({ ...prev, flamengo: teamRes }));
        } else {
          setFootballData((prev) => ({ ...prev, gremio: teamRes }));
        }
      }
      if (watchRes?.telemetry) {
        setTelemetry(watchRes.telemetry);
      }
    } catch (e) {
      console.error("Failed to refresh live telemetry:", e);
    }
  };

  useEffect(() => {
    refreshLiveDataForProfile(currentProfile);
  }, [currentProfile]);


  // Trigger Tuya Smart Home Scene
  const handleTriggerTuyaScene = async (scene: string) => {
    try {
      await fetch("/api/tuya/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene }),
      });
    } catch (err) {
      console.error("Tuya scene dispatch error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F3F4F6] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. Global Top Bar */}
      <TopBarGlobal
        currentProfile={currentProfile}
        onSelectProfile={setCurrentProfile}
        footballData={footballData}
        onRefreshData={() => refreshLiveDataForProfile(currentProfile, true)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === "COCKPIT" && (
          <CockpitTab
            currentProfile={currentProfile}
            metrics={metrics}
            telemetry={telemetry}
            footballData={footballData}
            onTriggerTuyaScene={handleTriggerTuyaScene}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === "COACH" && (
          <CoachTab
            currentProfile={currentProfile}
            onTriggerTuyaScene={handleTriggerTuyaScene}
          />
        )}

        {activeTab === "NUTRITION" && (
          <NutritionTab
            currentProfile={currentProfile}
            hasMatchDaySnackMode={
              currentProfile === "PATRICIA"
                ? footballData.gremio?.isMatchDay ?? true
                : footballData.flamengo?.isMatchDay ?? true
            }
          />
        )}

        {activeTab === "MENTAL" && (
          <MentalHealthTab
            currentProfile={currentProfile}
            onTriggerTuyaScene={handleTriggerTuyaScene}
          />
        )}

        {activeTab === "CLAN" && (
          <ClanTab
            currentProfile={currentProfile}
            onSelectProfile={setCurrentProfile}
            onRefreshData={() => refreshLiveDataForProfile(currentProfile, true)}
          />
        )}
      </main>

      {/* 3. Sticky Bottom Navigation Bar */}
      <nav className="sticky bottom-0 z-50 w-full border-t border-[#1F2937] bg-[#090D16]/95 backdrop-blur-md px-3 sm:px-6 py-2 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab("COCKPIT")}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === "COCKPIT"
                ? "text-blue-400 font-bold bg-blue-950/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Activity className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab("COACH")}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === "COACH"
                ? "text-blue-400 font-bold bg-blue-950/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Compass className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Treinador</span>
          </button>

          <button
            onClick={() => setActiveTab("NUTRITION")}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === "NUTRITION"
                ? "text-emerald-400 font-bold bg-emerald-950/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Utensils className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Nutrição</span>
          </button>

          <button
            onClick={() => setActiveTab("MENTAL")}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === "MENTAL"
                ? "text-purple-400 font-bold bg-purple-950/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Brain className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Mental</span>
          </button>

          <button
            onClick={() => setActiveTab("CLAN")}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === "CLAN"
                ? "text-amber-400 font-bold bg-amber-950/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Clã</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
