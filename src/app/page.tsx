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
import { HelpManualModal } from "@/components/HelpManualModal";
import { SoccerHubModal } from "@/components/SoccerHubModal";
import { RaceManagerModal } from "@/components/RaceManagerModal";
import { ExecutiveReportModal } from "@/components/ExecutiveReportModal";
import { RaceTacticalSimulatorModal } from "@/components/RaceTacticalSimulatorModal";
import { TrophyCardGeneratorModal } from "@/components/TrophyCardGeneratorModal";
import { ClanHallOfFameModal } from "@/components/ClanHallOfFameModal";
import { SetupManagerModal } from "@/components/SetupManagerModal";
import { RaceMorningDispatchModal } from "@/components/RaceMorningDispatchModal";
import { DanielTrainingPlanModal } from "@/components/DanielTrainingPlanModal";
import { BodyMetrics, FootballTeamData, GalaxyWatchTelemetry, ProfileId } from "@/lib/types";
import { calculateBodyMetrics } from "@/lib/physiology";

export default function BioTriadApp() {
  const [activeTab, setActiveTab] = useState<
    "COCKPIT" | "COACH" | "NUTRITION" | "MENTAL" | "CLAN"
  >("COCKPIT");

  const [currentProfile, setCurrentProfile] = useState<ProfileId>("DANIEL");
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [isSoccerHubOpen, setIsSoccerHubOpen] = useState<boolean>(false);
  const [isRaceManagerOpen, setIsRaceManagerOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTacticalSimulatorOpen, setIsTacticalSimulatorOpen] = useState<boolean>(false);
  const [isTrophyCardGeneratorOpen, setIsTrophyCardGeneratorOpen] = useState<boolean>(false);
  const [isClanHallOfFameOpen, setIsClanHallOfFameOpen] = useState<boolean>(false);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isRaceMorningOpen, setIsRaceMorningOpen] = useState<boolean>(false);
  const [isDanielTrainingPlanOpen, setIsDanielTrainingPlanOpen] = useState<boolean>(false);
  const [selectedRaceForMorning, setSelectedRaceForMorning] = useState<string | undefined>(undefined);

  const handleOpenRaceMorning = (raceId?: string) => {
    setSelectedRaceForMorning(raceId);
    setIsRaceMorningOpen(true);
  };

  // Real-time football telemetry state
  const [footballData, setFootballData] = useState<{
    flamengo: FootballTeamData | null;
    gremio: FootballTeamData | null;
    palmeiras?: FootballTeamData | null;
  }>({
    flamengo: null,
    gremio: null,
    palmeiras: null,
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

  // Deterministic body metrics for Daniel vs Patrícia vs Gabriel
  const metrics: BodyMetrics =
    currentProfile === "GABRIEL"
      ? calculateBodyMetrics({
          weightKg: 72.0,
          waistCm: 78,
          neckCm: 37,
          hipCm: 94,
          heightCm: 178,
          sex: "MALE",
          targetWeightKg: 70.0,
        })
      : currentProfile === "PATRICIA"
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
  const refreshLiveDataForProfile = async (profile: ProfileId, force = false) => {
    try {
      const activeTeam =
        profile === "GABRIEL" ? "Palmeiras" : profile === "PATRICIA" ? "Grêmio" : "Flamengo";
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
        } else if (activeTeam === "Grêmio") {
          setFootballData((prev) => ({ ...prev, gremio: teamRes }));
        } else {
          setFootballData((prev) => ({ ...prev, palmeiras: teamRes }));
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
  const handleTriggerTuyaScene = async (scene: string, label?: string) => {
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
    <div className="min-h-screen bg-[#07090E] text-[#F3F4F6] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. Global Top Bar */}
      <TopBarGlobal
        currentProfile={currentProfile}
        onSelectProfile={setCurrentProfile}
        footballData={footballData}
        onRefreshData={() => refreshLiveDataForProfile(currentProfile, true)}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenSoccerHub={() => setIsSoccerHubOpen(true)}
        onOpenRaceManager={() => setIsRaceManagerOpen(true)}
        onOpenReports={() => setIsReportModalOpen(true)}
        onOpenTacticalSimulator={() => setIsTacticalSimulatorOpen(true)}
        onOpenTrophyCardGenerator={() => setIsTrophyCardGeneratorOpen(true)}
        onOpenClanHallOfFame={() => setIsClanHallOfFameOpen(true)}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenRaceMorning={handleOpenRaceMorning}
        onOpenDanielTrainingPlan={() => setIsDanielTrainingPlanOpen(true)}
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
            onOpenRaceManager={() => setIsRaceManagerOpen(true)}
            onOpenTacticalSimulator={() => setIsTacticalSimulatorOpen(true)}
            onOpenTrophyCardGenerator={() => setIsTrophyCardGeneratorOpen(true)}
            onOpenClanHallOfFame={() => setIsClanHallOfFameOpen(true)}
            onOpenRaceMorning={handleOpenRaceMorning}
            onOpenDanielTrainingPlan={() => setIsDanielTrainingPlanOpen(true)}
          />
        )}

        {activeTab === "COACH" && (
          <CoachTab
            currentProfile={currentProfile}
            onTriggerTuyaScene={handleTriggerTuyaScene}
            onOpenDanielTrainingPlan={() => setIsDanielTrainingPlanOpen(true)}
          />
        )}

        {activeTab === "NUTRITION" && (
          <NutritionTab
            currentProfile={currentProfile}
            hasMatchDaySnackMode={
              currentProfile === "GABRIEL"
                ? footballData.palmeiras?.isMatchDay ?? true
                : currentProfile === "PATRICIA"
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
            onOpenManual={() => setIsManualOpen(true)}
            onOpenRaceMorning={handleOpenRaceMorning}
            onOpenTacticalSimulator={() => setIsTacticalSimulatorOpen(true)}
          />
        )}
      </main>

      {/* 3. Sticky Bottom Navigation Bar - Haute Horlogerie Luxury Design */}
      <nav className="sticky bottom-0 z-50 w-full border-t border-white/10 bg-[#07090E]/90 backdrop-blur-2xl px-3 sm:px-6 py-2 shadow-[0_-8px_32px_rgba(0,0,0,0.7)]">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1.5 font-mono">
          <button
            onClick={() => setActiveTab("COCKPIT")}
            className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all relative ${
              activeTab === "COCKPIT"
                ? "text-blue-400 font-bold bg-blue-950/60 border border-blue-500/40 shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="h-4.5 w-4.5 mb-1" />
            <span className="text-[10px] tracking-wider uppercase font-semibold">Cockpit</span>
            {activeTab === "COCKPIT" && (
              <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-blue-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("COACH")}
            className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all relative ${
              activeTab === "COACH"
                ? "text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Compass className="h-4.5 w-4.5 mb-1" />
            <span className="text-[10px] tracking-wider uppercase font-semibold">Treinador</span>
            {activeTab === "COACH" && (
              <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-cyan-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("NUTRITION")}
            className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all relative ${
              activeTab === "NUTRITION"
                ? "text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Utensils className="h-4.5 w-4.5 mb-1" />
            <span className="text-[10px] tracking-wider uppercase font-semibold">Nutrição</span>
            {activeTab === "NUTRITION" && (
              <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("MENTAL")}
            className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all relative ${
              activeTab === "MENTAL"
                ? "text-purple-400 font-bold bg-purple-950/60 border border-purple-500/40 shadow-lg shadow-purple-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Brain className="h-4.5 w-4.5 mb-1" />
            <span className="text-[10px] tracking-wider uppercase font-semibold">Mental</span>
            {activeTab === "MENTAL" && (
              <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-purple-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("CLAN")}
            className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all relative ${
              activeTab === "CLAN"
                ? "text-amber-400 font-bold bg-amber-950/60 border border-amber-500/40 shadow-lg shadow-amber-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4.5 w-4.5 mb-1" />
            <span className="text-[10px] tracking-wider uppercase font-semibold">Clã</span>
            {activeTab === "CLAN" && (
              <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>
      </nav>

      {/* 4. Modals */}
      <HelpManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        currentProfile={currentProfile}
        onOpenSetup={() => {
          setIsManualOpen(false);
          setIsSetupOpen(true);
        }}
      />

      <SoccerHubModal
        isOpen={isSoccerHubOpen}
        onClose={() => setIsSoccerHubOpen(false)}
        footballData={footballData}
        onTriggerTuyaScene={handleTriggerTuyaScene}
      />

      <RaceManagerModal
        isOpen={isRaceManagerOpen}
        onClose={() => setIsRaceManagerOpen(false)}
        activeProfile={currentProfile}
        onOpenTrophyCardGenerator={() => {
          setIsRaceManagerOpen(false);
          setIsTrophyCardGeneratorOpen(true);
        }}
      />

      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialProfile={currentProfile}
      />

      <RaceTacticalSimulatorModal
        isOpen={isTacticalSimulatorOpen}
        onClose={() => setIsTacticalSimulatorOpen(false)}
        activeProfile={currentProfile}
        onOpenRaceManager={() => setIsRaceManagerOpen(true)}
        onOpenTrophyCardGenerator={() => setIsTrophyCardGeneratorOpen(true)}
      />

      <TrophyCardGeneratorModal
        isOpen={isTrophyCardGeneratorOpen}
        onClose={() => setIsTrophyCardGeneratorOpen(false)}
        activeProfile={currentProfile}
      />

      <ClanHallOfFameModal
        isOpen={isClanHallOfFameOpen}
        onClose={() => setIsClanHallOfFameOpen(false)}
        onSelectProfile={(p) => setCurrentProfile(p)}
        onOpenTrophyCardGenerator={() => {
          setIsClanHallOfFameOpen(false);
          setIsTrophyCardGeneratorOpen(true);
        }}
      />

      <SetupManagerModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        currentProfile={currentProfile}
        onOpenManual={() => {
          setIsSetupOpen(false);
          setIsManualOpen(true);
        }}
      />

      <RaceMorningDispatchModal
        isOpen={isRaceMorningOpen}
        onClose={() => setIsRaceMorningOpen(false)}
        currentProfile={currentProfile}
        initialRaceId={selectedRaceForMorning}
      />

      <DanielTrainingPlanModal
        isOpen={isDanielTrainingPlanOpen}
        onClose={() => setIsDanielTrainingPlanOpen(false)}
      />
    </div>
  );
}
