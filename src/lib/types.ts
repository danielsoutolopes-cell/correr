export type BiologicalSex = "MALE" | "FEMALE";
export type PrimaryGoal = "WEIGHT_LOSS" | "RECOMPOSITION" | "MAINTENANCE" | "PERFORMANCE";
export type SoccerTeam = "Flamengo" | "Grêmio";
export type RacePriority = "P1_TARGET" | "P2_PREP" | "P3_FUN_PARTY";
export type WeekPhase = "BASE" | "SPECIFIC" | "TAPER_P1" | "POST_21K_RECOVERY";
export type WeekendLayoutMode = "CLASSIC_SUNDAY_LONG" | "SATURDAY_LONG_SUNDAY_FAMILY_BIKE";
export type Modality = "RUN" | "BIKE" | "STRENGTH" | "REST" | "DECOMPRESSION";
export type WorkoutStatus = "PLANNED" | "COMPLETED" | "SKIPPED";
export type AllowedEnvironment = "DUAL_OUTDOOR_TREADMILL" | "OUTDOOR_STREET_ONLY" | "GYM" | "INDOOR_OUTDOOR_BIKE";

export type FoodTacticalClass = "P1" | "P2" | "P3" | "C1" | "C2" | "C3" | "V1" | "V2" | "V3";

export interface HrZones {
  z1: { min: number; max: number; label: string };
  z2: { min: number; max: number; label: string };
  z3: { min: number; max: number; label: string };
  z4: { min: number; max: number; label: string };
  z5: { min: number; max: number; label: string };
}

export interface ClinicalRestrictions {
  hasReverseShoulderProsthesis?: boolean;
  shoulderSide?: "RIGHT" | "LEFT";
  blockedExercises: string[];
  safeAlternatives: Record<string, string>;
  notes?: string;
}

export interface TrainingPreferences {
  restDays: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[];
  weekdayTimeCapMin: number;
  weekdayPreferredTime: string; // e.g. "19:00"
  weekendPreferredTime: string; // e.g. "07:00"
}

export interface BodyMetrics {
  weightKg: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number;
  heightCm: number;
  sex: BiologicalSex;
  bmi: number;
  whtr: number;
  bodyFatPct: number;
  leanMassKg: number;
  fatMassKg: number;
  runningPaceGainSec: number;
}

export interface TreadmillStep {
  stepIndex: number;
  title: string;
  durationMin: number;
  speedKmh: number;
  inclinePct: number;
  targetHrZone: "Z1" | "Z2" | "Z3" | "Z4" | "Z5";
  rpeScale1To10: number;
}

export interface RunPrescriptionTreadmill {
  totalDurationMin: number;
  averageSpeedKmh: number;
  steps: TreadmillStep[];
}

export interface RunPrescriptionOutdoor {
  totalDistanceKm: number;
  targetPaceMinKm: string;
  warmupKm: number;
  mainSetDescription: string;
  cooldownKm: number;
  targetZones: ("Z1" | "Z2" | "Z3" | "Z4" | "Z5")[];
}

export interface StrengthExercise {
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  rpe: number;
  shoulderSafe: boolean;
  substituteFor?: string;
  instructions?: string;
}

export interface StrengthPrescription {
  ficha: "A" | "B" | "C";
  focus: string;
  warmupMinutes: number;
  exercises: StrengthExercise[];
  recoveryProtocolMinutes: number;
}

export interface BikePrescription {
  durationMin: number;
  targetCadenceRpm: number;
  targetHrZone: "Z1" | "Z2" | "Z3";
  isFamilyPace: boolean;
  notes: string;
}

export interface MatchInfo {
  date: string;
  timeBrasilia: string;
  competition: string;
  opponent: string;
  homeOrAway: "HOME" | "AWAY";
  score?: string;
  stadium?: string;
  status: "FINISHED" | "SCHEDULED" | "LIVE";
}

export interface FootballTeamData {
  teamName: SoccerTeam;
  currentCompetition: string;
  standingPosition: number;
  points: number;
  gamesPlayed: number;
  goalDifference: number;
  recentForm: ("W" | "D" | "L")[];
  pastMatches: MatchInfo[];
  nextMatches: MatchInfo[];
  tensionIndex: number; // 1 to 5
  isMatchDay: boolean;
  nextMatchDateCountdown?: string;
  logisticalAdjustments?: {
    requiresTrainingCut: boolean;
    recommendedEndTime: string; // e.g. "20:50"
    caloricBufferKcal: number; // e.g. 350
    recommendedSnacks: string[];
  };
}

export interface GalaxyWatchTelemetry {
  date: string;
  restingHeartRate: number;
  hrvRmssd: number;
  sleepDurationMinutes: number;
  sleepScore: number;
  steps: number;
  recoveryReadinessPct: number;
  activities: {
    id: string;
    type: "RUN" | "TREADMILL" | "BIKE" | "WEIGHT_TRAINING";
    name: string;
    startTime: string;
    durationMinutes: number;
    distanceKm?: number;
    avgHr: number;
    maxHr: number;
    calories: number;
    hrZoneTimesSeconds: {
      z1: number;
      z2: number;
      z3: number;
      z4: number;
      z5: number;
    };
  }[];
}

export interface TacoFoodItem {
  id: string;
  name: string;
  category: string;
  tacticalClass: FoodTacticalClass;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG: number;
  sodiumMg: number;
  potassiumMg: number;
  ironMg: number;
  portionGrams: number;
  portionName: string;
  familyRecommendedPortionDanielG: number;
  familyRecommendedPortionPatriciaG: number;
}
