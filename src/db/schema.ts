import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. Households
export const households = pgTable("households", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  householdId: uuid("household_id")
    .references(() => households.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["ADMIN", "MEMBER"] }).default("MEMBER").notNull(),
  biologicalSex: text("biological_sex", { enum: ["MALE", "FEMALE"] }).notNull(),
  birthDate: text("birth_date").notNull(),
  heightCm: numeric("height_cm").notNull(),
  primaryGoal: text("primary_goal", {
    enum: ["WEIGHT_LOSS", "RECOMPOSITION", "MAINTENANCE", "PERFORMANCE"],
  }).default("PERFORMANCE").notNull(),
  currentWeightKg: numeric("current_weight_kg").notNull(),
  targetWeightKg: numeric("target_weight_kg").notNull(),
  activityFactor: numeric("activity_factor").default("1.55").notNull(),
  favoriteSoccerTeam: text("favorite_soccer_team", {
    enum: ["Flamengo", "Grêmio"],
  }).notNull(),
  intervalsAthleteId: text("intervals_athlete_id"),
  intervalsApiKey: text("intervals_api_key"),
  tuyaConfig: jsonb("tuya_config").default({}).notNull(),
  hrZones: jsonb("hr_zones").default({}).notNull(),
  clinicalRestrictions: jsonb("clinical_restrictions").default({}).notNull(),
  trainingPreferences: jsonb("training_preferences").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Body Metrics Logs
export const bodyMetricsLogs = pgTable("body_metrics_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow().notNull(),
  weightKg: numeric("weight_kg").notNull(),
  waistCm: numeric("waist_cm").notNull(),
  neckCm: numeric("neck_cm").notNull(),
  hipCm: numeric("hip_cm"),
  chestCm: numeric("chest_cm"),
  armCm: numeric("arm_cm"),
  thighCm: numeric("thigh_cm"),
  calfCm: numeric("calf_cm"),
  bmi: numeric("bmi").notNull(),
  whtr: numeric("whtr").notNull(),
  bodyFatPct: numeric("body_fat_pct").notNull(),
  leanMassKg: numeric("lean_mass_kg").notNull(),
  fatMassKg: numeric("fat_mass_kg").notNull(),
  runningPaceGainSec: numeric("running_pace_gain_sec").notNull(),
});

// 4. Target Races
export const targetRaces = pgTable("target_races", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  raceDate: text("race_date"), // YYYY-MM-DD or null if TBD
  isDateTbd: boolean("is_date_tbd").default(false).notNull(),
  estimatedWindowMonth: text("estimated_window_month"), // e.g. "Set/Out 2027"
  distanceKm: numeric("distance_km").notNull(),
  location: text("location").notNull(),
  priority: text("priority", {
    enum: ["P1_TARGET", "P2_PREP", "P3_FUN_PARTY"],
  }).notNull(),
  targetPaceMinKm: text("target_pace_min_km").notNull(),
  targetFinishTime: text("target_finish_time").notNull(),
  taperingWeeksCount: integer("tapering_weeks_count").default(3).notNull(),
  carbLoadingDaysBefore: integer("carb_loading_days_before").default(3).notNull(),
  triggersRecoveryWeek: boolean("triggers_recovery_week").default(true).notNull(),
  sharedWithProfileIds: jsonb("shared_with_profile_ids").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. Football Live Cache
export const footballLiveCache = pgTable("football_live_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamName: text("team_name", { enum: ["Flamengo", "Grêmio"] }).notNull().unique(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  standings: jsonb("standings").default({}).notNull(),
  pastMatches: jsonb("past_matches").default([]).notNull(),
  nextMatches: jsonb("next_matches").default([]).notNull(),
  matchDayLogistics: jsonb("match_day_logistics").default({}).notNull(),
});

// 6. Workouts Plan
export const workoutsPlan = pgTable("workouts_plan", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  scheduledDate: text("scheduled_date").notNull(), // YYYY-MM-DD
  dayOfWeek: text("day_of_week").notNull(), // "MONDAY", etc.
  isWeekday: boolean("is_weekday").notNull(),
  weekPhase: text("week_phase", {
    enum: ["BASE", "SPECIFIC", "TAPER_P1", "POST_21K_RECOVERY"],
  }).default("BASE").notNull(),
  weekendLayoutMode: text("weekend_layout_mode", {
    enum: ["CLASSIC_SUNDAY_LONG", "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"],
  }).default("CLASSIC_SUNDAY_LONG").notNull(),
  sessionOrder: integer("session_order").default(1).notNull(),
  modality: text("modality", {
    enum: ["RUN", "BIKE", "STRENGTH", "REST", "DECOMPRESSION"],
  }).notNull(),
  title: text("title").notNull(),
  status: text("status", {
    enum: ["PLANNED", "COMPLETED", "SKIPPED"],
  }).default("PLANNED").notNull(),
  allowedEnvironments: text("allowed_environments", {
    enum: [
      "DUAL_OUTDOOR_TREADMILL",
      "OUTDOOR_STREET_ONLY",
      "GYM",
      "INDOOR_OUTDOOR_BIKE",
    ],
  }).notNull(),
  runPrescriptionOutdoor: jsonb("run_prescription_outdoor"),
  runPrescriptionTreadmill: jsonb("run_prescription_treadmill"),
  strengthPrescription: jsonb("strength_prescription"),
  bikePrescription: jsonb("bike_prescription"),
  isFamilyBuddyWorkout: boolean("is_family_buddy_workout").default(false).notNull(),
  executionTelemetry: jsonb("execution_telemetry"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. Taco Foods
export const tacoFoods = pgTable("taco_foods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  tacticalClass: text("tactical_class", {
    enum: ["P1", "P2", "P3", "C1", "C2", "C3", "V1", "V2", "V3"],
  }).notNull(),
  caloriesKcal: numeric("calories_kcal").notNull(),
  proteinG: numeric("protein_g").notNull(),
  carbsG: numeric("carbs_g").notNull(),
  fatsG: numeric("fats_g").notNull(),
  fiberG: numeric("fiber_g").notNull(),
  sodiumMg: numeric("sodium_mg").default("0").notNull(),
  potassiumMg: numeric("potassium_mg").default("0").notNull(),
  ironMg: numeric("iron_mg").default("0").notNull(),
  portionGrams: numeric("portion_grams").notNull(),
  portionName: text("portion_name").notNull(),
  danielPortionG: numeric("daniel_portion_g").notNull(),
  patriciaPortionG: numeric("patricia_portion_g").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Nutrition Logs
export const nutritionLogs = pgTable("nutrition_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow().notNull(),
  mealType: text("meal_type", {
    enum: [
      "BREAKFAST",
      "LUNCH",
      "DINNER",
      "SNACK",
      "MATCH_DAY_SNACK",
      "CARB_LOADING",
    ],
  }).notNull(),
  foodItems: jsonb("food_items").default([]).notNull(),
  totalCalories: numeric("total_calories").notNull(),
  totalProtein: numeric("total_protein").notNull(),
  totalCarbs: numeric("total_carbs").notNull(),
  totalFats: numeric("total_fats").notNull(),
  photoUrl: text("photo_url"),
  aiAnalysis: jsonb("ai_analysis"),
});

// 9. Mental Decompression Logs
export const mentalDecompressionLogs = pgTable("mental_decompression_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow().notNull(),
  station: text("station", {
    enum: [
      "AIRLOCK_1830",
      "THERMAL_BRAKE_2030",
      "POST_GAME",
      "OFF_DAY_RESET",
      "SOS_BREATHING",
    ],
  }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  preStressLevel: integer("pre_stress_level").notNull(), // 1 to 10
  postStressLevel: integer("post_stress_level").notNull(), // 1 to 10
  brainDumpText: text("brain_dump_text"),
  tuyaSceneTriggered: text("tuya_scene_triggered"),
});

// 10. Tuya Automation Logs
export const tuyaAutomationLogs = pgTable("tuya_automation_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  deviceId: text("device_id").notNull(),
  sceneName: text("scene_name").notNull(),
  commandPayload: jsonb("command_payload").notNull(),
  executedAt: timestamp("executed_at", { withTimezone: true }).defaultNow().notNull(),
  status: text("status", { enum: ["SUCCESS", "FAILED"] }).notNull(),
  errorMessage: text("error_message"),
});
