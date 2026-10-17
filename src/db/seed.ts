import { getDb } from "./index";
import {
  households,
  profiles,
  targetRaces,
  tacoFoods,
  footballLiveCache,
} from "./schema";
import { OFFICIAL_TACO_FOODS } from "../lib/taco-data";

export async function runSeed() {
  const db = getDb();
  if (!db) {
    console.log(
      "[Seed] No PostgreSQL connection string (DATABASE_URL) detected. Skipping remote DB seed, in-memory baseline will be used."
    );
    return;
  }

  console.log("[Seed] Starting Bio-Triad OS database seeding...");

  try {
    // 1. Household
    const [household] = await db
      .insert(households)
      .values({
        name: "Família Lopes",
        inviteCode: "LOPES-TRIAD-2027",
      })
      .returning();

    console.log(`[Seed] Household created: ${household.name} (${household.id})`);

    // 2. Profiles (Daniel & Patrícia)
    const [daniel] = await db
      .insert(profiles)
      .values({
        householdId: household.id,
        name: "Daniel Souto Lopes",
        role: "ADMIN",
        biologicalSex: "MALE",
        birthDate: "1983-05-14",
        heightCm: "170",
        primaryGoal: "PERFORMANCE",
        currentWeightKg: "80.0",
        targetWeightKg: "75.0",
        activityFactor: "1.6",
        favoriteSoccerTeam: "Flamengo",
        intervalsAthleteId: "I753639",
        intervalsApiKey: process.env.INTERVALS_API_KEY || "",
        tuyaConfig: {
          livingRoomLightId: process.env.TUYA_DEVICE_LIVING_ROOM_LIGHT || "eb52fdf73913d81cf5ruqt",
          balconyLedId: process.env.TUYA_DEVICE_BALCONY_LED || "tuya_led_02",
        },
        hrZones: {
          z1: { min: 73, max: 109, label: "Recuperação Ativa & Caminhada" },
          z2: { min: 110, max: 127, label: "Base Aeróbia Z2 (Lipólise & Resistência)" },
          z3: { min: 128, max: 145, label: "Ritmo Meia-Maratona / Tempo Run" },
          z4: { min: 146, max: 163, label: "Limiar de Lactato (Tiros Longos)" },
          z5: { min: 164, max: 182, label: "VO2 Máximo / Potência Anaeróbia" },
        },
        clinicalRestrictions: {
          hasReverseShoulderProsthesis: true,
          shoulderSide: "RIGHT",
          blockedExercises: [
            "Desenvolvimento Militar com Barra ou Halter Overhead",
            "Supino Reto com Barra Reta Tradicional",
            "Puxada Atrás da Nuca",
            "Elevação Lateral acima de 90 graus",
            "Mergulho em Paralelas com Amplitude Profunda",
          ],
          safeAlternatives: {
            "Desenvolvimento Overhead": "Elevação no Plano Escapular (30°) até o queixo",
            "Supino com Barra": "Supino Reto com Halteres e Pegada Neutra 45°",
            "Puxada Costas": "Puxada Frontal com Triângulo Fechado",
            "Tríceps Testa": "Tríceps Corda na Polia Alta",
          },
          notes:
            "Prótese reversa no ombro direito. Priorizar estabilização escapular, proteção da cavidade glenoumeral e pegada neutra.",
        },
        trainingPreferences: {
          restDays: ["MONDAY", "FRIDAY"],
          weekdayTimeCapMin: 60,
          weekdayPreferredTime: "19:00",
          weekendPreferredTime: "07:00",
        },
      })
      .returning();

    const [patricia] = await db
      .insert(profiles)
      .values({
        householdId: household.id,
        name: "Patrícia Lopes",
        role: "MEMBER",
        biologicalSex: "FEMALE",
        birthDate: "1986-09-22",
        heightCm: "162",
        primaryGoal: "RECOMPOSITION",
        currentWeightKg: "58.0",
        targetWeightKg: "55.0",
        activityFactor: "1.5",
        favoriteSoccerTeam: "Grêmio",
        tuyaConfig: {},
        hrZones: {
          z1: { min: 80, max: 115, label: "Regenerativo" },
          z2: { min: 116, max: 135, label: "Zona 2 Aeróbia" },
          z3: { min: 136, max: 153, label: "Ritmo Meia-Maratona" },
          z4: { min: 154, max: 171, label: "Limiar de Lactato" },
          z5: { min: 172, max: 188, label: "VO2 Max" },
        },
        clinicalRestrictions: {
          hasReverseShoulderProsthesis: false,
          blockedExercises: [],
          safeAlternatives: {},
        },
        trainingPreferences: {
          restDays: ["MONDAY", "FRIDAY"],
          weekdayTimeCapMin: 60,
          weekdayPreferredTime: "19:00",
          weekendPreferredTime: "07:00",
        },
      })
      .returning();

    console.log(`[Seed] Profiles created: Daniel (${daniel.id}), Patrícia (${patricia.id})`);

    // 3. 2027 Season Target Races
    await db.insert(targetRaces).values([
      {
        profileId: daniel.id,
        name: "Maratona Internacional de São Paulo 2027 (Meia 21k)",
        raceDate: "2027-04-11",
        isDateTbd: false,
        distanceKm: "21.097",
        location: "São Paulo, SP - Ibirapuera",
        priority: "P1_TARGET",
        targetPaceMinKm: "5:30",
        targetFinishTime: "01:55:59",
        taperingWeeksCount: 3,
        carbLoadingDaysBefore: 3,
        triggersRecoveryWeek: true,
        sharedWithProfileIds: [patricia.id],
      },
      {
        profileId: daniel.id,
        name: "Nike SP City Marathon 2027 (Meia 21k)",
        raceDate: "2027-07-25",
        isDateTbd: false,
        distanceKm: "21.097",
        location: "São Paulo, SP - Pacaembu / Jockey",
        priority: "P1_TARGET",
        targetPaceMinKm: "5:25",
        targetFinishTime: "01:54:15",
        taperingWeeksCount: 3,
        carbLoadingDaysBefore: 3,
        triggersRecoveryWeek: true,
        sharedWithProfileIds: [patricia.id],
      },
      {
        profileId: daniel.id,
        name: "Meia Maratona de Praia Grande 2027 (21k Rascunho)",
        raceDate: null,
        isDateTbd: true,
        estimatedWindowMonth: "Set/Out 2027",
        distanceKm: "21.097",
        location: "Praia Grande, SP - Litoral",
        priority: "P2_PREP",
        targetPaceMinKm: "5:35",
        targetFinishTime: "01:57:45",
        taperingWeeksCount: 2,
        carbLoadingDaysBefore: 2,
        triggersRecoveryWeek: true,
        sharedWithProfileIds: [patricia.id],
      },
    ]);

    console.log("[Seed] 2027 Target races seeded.");

    // 4. Official TACO Database
    for (const item of OFFICIAL_TACO_FOODS) {
      await db.insert(tacoFoods).values({
        name: item.name,
        category: item.category,
        tacticalClass: item.tacticalClass,
        caloriesKcal: String(item.caloriesKcal),
        proteinG: String(item.proteinG),
        carbsG: String(item.carbsG),
        fatsG: String(item.fatsG),
        fiberG: String(item.fiberG),
        sodiumMg: String(item.sodiumMg),
        potassiumMg: String(item.potassiumMg),
        ironMg: String(item.ironMg),
        portionGrams: String(item.portionGrams),
        portionName: item.portionName,
        danielPortionG: String(item.familyRecommendedPortionDanielG),
        patriciaPortionG: String(item.familyRecommendedPortionPatriciaG),
      });
    }

    console.log(`[Seed] ${OFFICIAL_TACO_FOODS.length} official TACO food items seeded.`);

    console.log("[Seed] Seeding completed successfully!");
  } catch (err) {
    console.error("[Seed] Error during seeding:", err);
  }
}
