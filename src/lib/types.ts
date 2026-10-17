export type BiologicalSex = "MALE" | "FEMALE";
export type PrimaryGoal = "WEIGHT_LOSS" | "RECOMPOSITION" | "MAINTENANCE" | "PERFORMANCE";
export type ProfileId = "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN";
export type SoccerTeam = "Flamengo" | "Grêmio" | "Palmeiras";
export type RacePriority = "P1_TARGET" | "P2_PREP" | "P3_FUN_PARTY";
export type WeekPhase = "BASE" | "SPECIFIC" | "TAPER_P1" | "POST_21K_RECOVERY";
export type WeekendLayoutMode = "CLASSIC_SUNDAY_LONG" | "SATURDAY_LONG_SUNDAY_FAMILY_BIKE";
export type Modality = "RUN" | "BIKE" | "STRENGTH" | "REST" | "DECOMPRESSION";
export type WorkoutStatus = "PLANNED" | "COMPLETED" | "SKIPPED";
export type AllowedEnvironment = "DUAL_OUTDOOR_TREADMILL" | "OUTDOOR_STREET_ONLY" | "GYM" | "INDOOR_OUTDOOR_BIKE";

export interface TargetRaceItem {
  id: string;
  athleteId: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN";
  name: string;
  raceDate: string; // YYYY-MM-DD
  distanceKm: number;
  location: string;
  priority: RacePriority;
  targetPaceMinKm: string;
  targetFinishTime: string;
  taperingWeeksCount: number;
  carbLoadingDaysBefore: number;
  isCompleted?: boolean;
  actualFinishTime?: string; // Tempo líquido oficial (Chip Time)
  actualGunTime?: string; // Tempo bruto (Gun Time)
  actualPaceMinKm?: string; // Pace oficial médio (min/km)
  overallRank?: string; // Ex: "412 / 4.850" ou "412º Geral"
  categoryRank?: string; // Ex: "28 / 620" ou "28º na Faixa Etária"
  genderRank?: string; // Ex: "340 / 3.100" ou "340º Masculino"
  ageGroupCategory?: string; // Ex: "M50-54", "F55-59", "M20-24"
  podiumAward?: string; // Ex: "🥈 Top 5% Categoria", "Recorde Pessoal (RP)", "Medalha Conquistada"
  percentileRankPct?: number; // Ex: 92 (melhor que 92% do pelotão)
  raceNotes?: string; // Observações da prova (clima, hidratação, tênis usado)
  certificateUrl?: string; // Comprovante / Link oficial de resultados
  isCalibrationBase?: boolean;
  raceStartTime?: string; // Hora da largada oficial (ex: "06:30", "06:15", "07:00")
}

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
  broadcastChannels?: string[];
  broadcastPlatform?: string;
}

export type StreamingPlatform = "NETFLIX" | "DISNEY_PLUS" | "PRIME_VIDEO" | "MAX" | "APPLE_TV";

export interface StreamingRecommendation {
  id: string;
  title: string;
  originalTitle?: string;
  type: "FILME" | "SERIE" | "DORAMA" | "DOCUMENTARIO";
  platform: StreamingPlatform;
  platformName: string;
  genre: string;
  releaseYear: number;
  durationOrSeasons: string;
  synopsis: string;
  ratingScore: string;
  recommendedFor: ProfileId;
  dopamineTheme: "RELAX_CALMANTE" | "SUPERAÇÃO_ESPORTIVA" | "EMOCIONANTE_DORAMA" | "DIVERSÃO_FAMÍLIA";
  coverGradient: string;
  tags: string[];
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
    recommendedEndTime: string; // e.g. "17:30" (1h before 18:30 kickoff)
    caloricBufferKcal: number; // e.g. 350
    recommendedSnacks: string[];
    targetKickoffTime?: string; // e.g. "18:30"
    targetOpponent?: string; // e.g. "Bahia"
    targetMatchDate?: string; // e.g. "18/10/2026"
    isMatchToday?: boolean;
    lockReason?: string;
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

export interface RaceMorningScheduleStep {
  id: string;
  timestamp: string; // Ex: "04:05"
  relativeMinutesToGun: number; // Ex: -145
  relativeMinutesToDeparture: number; // Ex: -53
  category: "CIRCADIAN" | "NUTRITION" | "GEAR" | "LOGISTICS" | "VENUE" | "GUN";
  title: string;
  description: string;
  tuyaAction?: string;
  tuyaDeviceLabel?: string;
  badgeLabel?: string;
  isCompleted?: boolean;
}

export interface RaceVenuePreset {
  id: string;
  name: string;
  locationLabel: string;
  distanceKmFromMaraca: number;
  estimatedDriveMinutesSundayMorning: number;
  parkingBufferMinutes: number;
  notes: string;
  defaultRaceStartTime: string;
}

export interface RaceLogisticsPlan {
  originAddress: string;
  destinationVenue: string;
  raceStartTime: string;
  distanceKm: number;
  estimatedDriveMinutes: number;
  parkingBufferMinutes: number;
  totalTransitMinutes: number;
  venueArrivalTarget: string; // Exact 1 hour before gun
  departureFromHomeTime: string;
  alarmWakeupTime: string;
  circadianSunriseTime: string;
  hotDrinksBrewTime: string;
  closetIlluminationTime: string;
  breakfastTime: string;
  departureAllOffTime: string;
  wazeUrl: string;
  googleMapsUrl: string;
  steps: RaceMorningScheduleStep[];
  raceName?: string;
  raceDate?: string;
  recommendedBedtime?: string; // Horário ideal para dormir na véspera (8h de sono)
  athleteId?: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN";
  hotBeveragePreference?: "CAFEZINHO" | "MATE" | "BOTH";
}
