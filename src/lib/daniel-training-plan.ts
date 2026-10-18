export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface StreetWorkoutPrescription {
  description: string;
  distanceKm?: number;
  targetPace?: string;
  isOff?: boolean;
  isRace?: boolean;
  typeBadge?: string;
}

export interface TreadmillWorkoutPrescription {
  sessionType: string;
  program: string;
  inclinePct: number;
  warmup: string;
  mainSet: string;
  cooldown: string;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  isOff?: boolean;
  isRace?: boolean;
}

export interface DanielDailyWorkout {
  dayOfWeek: DayOfWeek;
  dayNamePt: string;
  modality: "REST" | "RUN" | "BIKE" | "STRENGTH" | "RACE";
  street: StreetWorkoutPrescription;
  treadmill: TreadmillWorkoutPrescription;
}

export interface DanielTrainingWeek {
  id: string;
  phase: "FASE_1" | "FASE_2";
  phaseTitle: string;
  weekNumber: number;
  weekLabel: string;
  period: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
  totalVolumeKm: number;
  targetGoal: string;
  isDeload?: boolean;
  isRaceWeek?: boolean;
  days: Record<DayOfWeek, DanielDailyWorkout>;
}

export const DANIEL_TRAINING_PLAN: DanielTrainingWeek[] = [
  // =========================================================================
  // FASE 1: RUMO À CORRIDA OLGA KOS 9K (19/10/2026 A 06/12/2026)
  // =========================================================================
  {
    id: "f1-sem-01",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • Recuperação Pós-Meia Athenas & Reativação (Olga Kos)",
    weekNumber: 1,
    weekLabel: "Fase 1 - Sem. 01",
    period: "19/10 a 25/10",
    startDate: "2026-10-19",
    endDate: "2026-10-25",
    totalVolumeKm: 3,
    targetGoal: "Regeneração ativa pós-21k Athenas Mizuno, zero impacto até domingo.",
    isDeload: true,
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF Total • Recuperação muscular passiva pós-21k", isOff: true },
        treadmill: {
          sessionType: "Descanso Total",
          program: "OFF",
          inclinePct: 0,
          warmup: "-",
          mainSet: "Descanso passivo, hidratação e sono profundo",
          cooldown: "-",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 0,
          isOff: true,
        },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "BIKE",
        street: { description: "Bike horizontal 30 min (Z1) • Giro regenerativo sem impacto", distanceKm: 0 },
        treadmill: {
          sessionType: "Regeneração",
          program: "Manual Livre (Bike Recumbent)",
          inclinePct: 0,
          warmup: "05 min @ Nível 1",
          mainSet: "20 min giro constante (70 rpm / carga mínima)",
          cooldown: "05 min desaceleração",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 30,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike horizontal 30 min (Z1) + Mobilidade ombro direito", distanceKm: 0 },
        treadmill: {
          sessionType: "Regeneração",
          program: "Manual Livre (Bike Recumbent)",
          inclinePct: 0,
          warmup: "05 min @ Nível 1",
          mainSet: "20 min giro constante (70 rpm / carga mínima)",
          cooldown: "05 min desaceleração",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 30,
        },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "BIKE",
        street: { description: "Bike horizontal 30 min (Z1) • Aumento da circulação", distanceKm: 0 },
        treadmill: {
          sessionType: "Regeneração",
          program: "Manual Livre (Bike Recumbent)",
          inclinePct: 0,
          warmup: "05 min @ Nível 1",
          mainSet: "20 min giro constante (70 rpm / carga mínima)",
          cooldown: "05 min desaceleração",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 30,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF Total • Eclusa de descanso", isOff: true },
        treadmill: {
          sessionType: "Descanso",
          program: "OFF",
          inclinePct: 0,
          warmup: "-",
          mainSet: "Recuperação total",
          cooldown: "-",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 0,
          isOff: true,
        },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "REST",
        street: { description: "OFF Total • Alongamentos leves", isOff: true },
        treadmill: {
          sessionType: "Descanso",
          program: "OFF",
          inclinePct: 0,
          warmup: "-",
          mainSet: "Descanso ativo / alongamento solo",
          cooldown: "-",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 0,
          isOff: true,
        },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RUN",
        street: { description: "Caminhada / Trote de teste 3 km • Teste mecânico pós-prova", distanceKm: 3, targetPace: "07:30/km" },
        treadmill: {
          sessionType: "Teste Funcional",
          program: "Manual Contínuo",
          inclinePct: 0,
          warmup: "05 min caminhada @ 5.5 km/h",
          mainSet: "15 min trote @ 8.0 km/h (07:30/km)",
          cooldown: "05 min caminhada @ 5.0 km/h",
          estimatedDistanceKm: 3.0,
          estimatedDurationMin: 25,
        },
      },
    },
  },

  {
    id: "f1-sem-02",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • Construção Aeróbia Base (Olga Kos)",
    weekNumber: 2,
    weekLabel: "Fase 1 - Sem. 02",
    period: "26/10 a 01/11",
    startDate: "2026-10-26",
    endDate: "2026-11-01",
    totalVolumeKm: 15,
    targetGoal: "Retomada da corrida contínua e introdução de acelerações curtas (strides).",
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "RUN",
        street: { description: "4.0 km Easy + 4x 80m progressões", distanceKm: 4.0 },
        treadmill: {
          sessionType: "Fluidez / Strides",
          program: "Intervalado Manual",
          inclinePct: 0,
          warmup: "08 min @ 8.0 km/h",
          mainSet: "4x (30s @ 11.0 km/h + 90s @ 7.5 km/h)",
          cooldown: "06 min @ 7.5 km/h",
          estimatedDistanceKm: 4.0,
          estimatedDurationMin: 28,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike / Core Z1 (30 min)", distanceKm: 0 },
        treadmill: {
          sessionType: "Cross-Training",
          program: "Bike Recumbent + Core",
          inclinePct: 0,
          warmup: "5 min giro leve",
          mainSet: "20 min Z1 giro fluido + 10 min core neutro",
          cooldown: "5 min soltura",
          estimatedDistanceKm: 0,
          estimatedDurationMin: 35,
        },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "RUN",
        street: { description: "5.0 km Z2 (06:40/km)", distanceKm: 5.0, targetPace: "06:40/km" },
        treadmill: {
          sessionType: "Rodagem Easy",
          program: "Contínuo / Fat Burn",
          inclinePct: 0,
          warmup: "05 min @ 7.5 km/h",
          mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)",
          cooldown: "05 min @ 6.5 km/h",
          estimatedDistanceKm: 5.0,
          estimatedDurationMin: 40,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "BIKE",
        street: { description: "Bike / Core Z1 (30 min)", distanceKm: 0 },
        treadmill: { sessionType: "Ativação Leve", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RUN",
        street: { description: "6.0 km contínuos (06:30/km)", distanceKm: 6.0, targetPace: "06:30/km" },
        treadmill: {
          sessionType: "Longão Base",
          program: "Contínuo / Endurance",
          inclinePct: 0,
          warmup: "05 min @ 8.0 km/h",
          mainSet: "35 min contínuo @ 9.2 km/h (06:31/km)",
          cooldown: "05 min @ 6.5 km/h",
          estimatedDistanceKm: 6.0,
          estimatedDurationMin: 45,
        },
      },
    },
  },

  {
    id: "f1-sem-03",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • Introdução ao Limiar & Intervalos (Olga Kos)",
    weekNumber: 3,
    weekLabel: "Fase 1 - Sem. 03",
    period: "02/11 a 08/11",
    startDate: "2026-11-02",
    endDate: "2026-11-08",
    totalVolumeKm: 18,
    targetGoal: "Primeira sessão de tiros curtos de 500m @ 05:30/km e longão progressivo.",
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "RUN",
        street: { description: "1.5k AQ + 5x 500m @ 05:30 + 1k DQ", distanceKm: 5.5, targetPace: "05:30/km nos tiros" },
        treadmill: {
          sessionType: "Intervalado Curto",
          program: "HIIT / Interval Training",
          inclinePct: 0,
          warmup: "1.5 km @ 8.5 km/h",
          mainSet: "5x (500m @ 10.9 km/h + 90s caminhada @ 5.5 km/h)",
          cooldown: "1.0 km @ 7.5 km/h",
          estimatedDistanceKm: 5.5,
          estimatedDurationMin: 35,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Cross-Training", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "RUN",
        street: { description: "5.0 km Z2 (06:40/km)", distanceKm: 5.0, targetPace: "06:40/km" },
        treadmill: {
          sessionType: "Rodagem Easy",
          program: "Contínuo / Fat Burn",
          inclinePct: 0,
          warmup: "05 min @ 7.5 km/h",
          mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)",
          cooldown: "05 min @ 6.5 km/h",
          estimatedDistanceKm: 5.0,
          estimatedDurationMin: 40,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Regenerativo", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RUN",
        street: { description: "7.0 km Progressivo (06:30 -> 06:00)", distanceKm: 7.0 },
        treadmill: {
          sessionType: "Progressivo",
          program: "Speed Interval / Pirâmide",
          inclinePct: 0,
          warmup: "1.0 km @ 8.5 km/h",
          mainSet: "2k @ 9.2 km/h + 2k @ 9.6 km/h + 2k @ 10.0 km/h",
          cooldown: "1.0 km @ 7.0 km/h",
          estimatedDistanceKm: 7.0,
          estimatedDurationMin: 46,
        },
      },
    },
  },

  {
    id: "f1-sem-04",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • Ritmo Alvo 10k/9k (Olga Kos)",
    weekNumber: 4,
    weekLabel: "Fase 1 - Sem. 04",
    period: "09/11 a 15/11",
    startDate: "2026-11-09",
    endDate: "2026-11-15",
    totalVolumeKm: 20,
    targetGoal: "Tiros de 1.000m @ 05:25/km e longão de 8 km em ritmo estável.",
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "RUN",
        street: { description: "1.5k AQ + 3x 1000m @ 05:25 + 1k DQ", distanceKm: 6.0, targetPace: "05:25/km" },
        treadmill: {
          sessionType: "Intervalado Médio",
          program: "HIIT / Interval Training",
          inclinePct: 0,
          warmup: "1.5 km @ 8.5 km/h",
          mainSet: "3x (1.000m @ 11.1 km/h + 2 min trote @ 7.0 km/h)",
          cooldown: "1.0 km @ 7.5 km/h",
          estimatedDistanceKm: 6.0,
          estimatedDurationMin: 38,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Cross-Training", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "RUN",
        street: { description: "6.0 km Z2 (06:35/km)", distanceKm: 6.0, targetPace: "06:35/km" },
        treadmill: {
          sessionType: "Rodagem Easy",
          program: "Contínuo / Endurance",
          inclinePct: 0,
          warmup: "05 min @ 8.0 km/h",
          mainSet: "35 min contínuo @ 9.0 km/h (06:40/km)",
          cooldown: "05 min @ 6.5 km/h",
          estimatedDistanceKm: 6.0,
          estimatedDurationMin: 45,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Regenerativo", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RUN",
        street: { description: "8.0 km Ritmo Estável (06:15/km)", distanceKm: 8.0, targetPace: "06:15/km" },
        treadmill: {
          sessionType: "Ritmo Estável",
          program: "Tempo Run Manual",
          inclinePct: 0,
          warmup: "1.0 km @ 8.5 km/h",
          mainSet: "6.0 km contínuo @ 9.7 km/h (06:11/km)",
          cooldown: "1.0 km @ 7.0 km/h",
          estimatedDistanceKm: 8.0,
          estimatedDurationMin: 52,
        },
      },
    },
  },

  {
    id: "f1-sem-05",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • Pico de Volume & Simulado Olga Kos",
    weekNumber: 5,
    weekLabel: "Fase 1 - Sem. 05",
    period: "16/11 a 22/11",
    startDate: "2026-11-16",
    endDate: "2026-11-22",
    totalVolumeKm: 22,
    targetGoal: "Pico de 22 km com simulado de 9 km (6k @ 06:15 + 3k @ 05:40) e Tempo Run cravado.",
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "RUN",
        street: { description: "2.0k AQ + 4.0 km Tempo @ 05:35 + 1k DQ", distanceKm: 7.0, targetPace: "05:35/km" },
        treadmill: {
          sessionType: "Limiar Anaeróbico",
          program: "Tempo Run / Limiar",
          inclinePct: 0,
          warmup: "2.0 km @ 8.5 km/h",
          mainSet: "4.0 km contínuo cravado @ 10.7 km/h (05:36/km)",
          cooldown: "1.0 km @ 7.0 km/h",
          estimatedDistanceKm: 7.0,
          estimatedDurationMin: 43,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Cross-Training", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "RUN",
        street: { description: "5.0 km Regenerativo (06:45/km)", distanceKm: 5.0, targetPace: "06:45/km" },
        treadmill: {
          sessionType: "Regenerativo",
          program: "Contínuo / Recovery",
          inclinePct: 0,
          warmup: "05 min @ 7.5 km/h",
          mainSet: "30 min contínuo @ 8.5 km/h (07:03/km)",
          cooldown: "05 min @ 6.0 km/h",
          estimatedDistanceKm: 5.0,
          estimatedDurationMin: 40,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Regenerativo", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RUN",
        street: { description: "9.0 km Simulado (6k @ 06:15 + 3k @ 05:40)", distanceKm: 9.0 },
        treadmill: {
          sessionType: "Simulado 9K",
          program: "Progressivo / Target",
          inclinePct: 0,
          warmup: "1.0 km @ 8.5 km/h",
          mainSet: "5.0 km @ 9.7 km/h + 3.0 km @ 10.6 km/h",
          cooldown: "0.0 km (corte direto)",
          estimatedDistanceKm: 9.0,
          estimatedDurationMin: 55,
        },
      },
    },
  },

  {
    id: "f1-sem-06",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • Polimento & Redução de Volume (Olga Kos)",
    weekNumber: 6,
    weekLabel: "Fase 1 - Sem. 06",
    period: "23/11 a 29/11",
    startDate: "2026-11-23",
    endDate: "2026-11-29",
    totalVolumeKm: 16,
    targetGoal: "Redução de volume para 16 km (tapering) mantendo tiros rápidos e pernas leves.",
    isDeload: true,
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "RUN",
        street: { description: "1.5k AQ + 4x 400m @ 05:20 + 1k DQ", distanceKm: 4.5, targetPace: "05:20/km" },
        treadmill: {
          sessionType: "Potência Neuromuscular",
          program: "HIIT / Interval Training",
          inclinePct: 0,
          warmup: "1.5 km @ 8.5 km/h",
          mainSet: "4x (400m @ 11.3 km/h + 90s trote @ 7.0 km/h)",
          cooldown: "1.0 km @ 7.5 km/h",
          estimatedDistanceKm: 4.5,
          estimatedDurationMin: 30,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Cross-Training", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "RUN",
        street: { description: "4.0 km Z2 (06:40/km)", distanceKm: 4.0, targetPace: "06:40/km" },
        treadmill: {
          sessionType: "Rodagem Easy",
          program: "Contínuo / Fat Burn",
          inclinePct: 0,
          warmup: "05 min @ 7.5 km/h",
          mainSet: "25 min contínuo @ 8.8 km/h (06:49/km)",
          cooldown: "05 min @ 6.5 km/h",
          estimatedDistanceKm: 4.0,
          estimatedDurationMin: 35,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "BIKE",
        street: { description: "Bike / Core Z1", distanceKm: 0 },
        treadmill: { sessionType: "Regenerativo", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "20 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 30 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RUN",
        street: { description: "6.0 km Rodagem Confortável", distanceKm: 6.0, targetPace: "06:30/km" },
        treadmill: {
          sessionType: "Polimento",
          program: "Contínuo / Endurance",
          inclinePct: 0,
          warmup: "05 min @ 8.0 km/h",
          mainSet: "35 min contínuo @ 9.2 km/h (06:31/km)",
          cooldown: "05 min @ 6.5 km/h",
          estimatedDistanceKm: 6.0,
          estimatedDurationMin: 45,
        },
      },
    },
  },

  {
    id: "f1-sem-07",
    phase: "FASE_1",
    phaseTitle: "Fase 1 • SEMANA DA PROVA OLGA KOS 9K (Meta Sub-52 min)",
    weekNumber: 7,
    weekLabel: "Fase 1 - Sem. 07",
    period: "30/11 a 06/12",
    startDate: "2026-11-30",
    endDate: "2026-12-06",
    totalVolumeKm: 14,
    targetGoal: "Semana de Prova Oficial Olga Kos 9 km! Tapering fino e ataque ao recorde sub-52 min.",
    isRaceWeek: true,
    days: {
      MONDAY: {
        dayOfWeek: "MONDAY",
        dayNamePt: "Segunda-feira",
        modality: "REST",
        street: { description: "OFF", isOff: true },
        treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      TUESDAY: {
        dayOfWeek: "TUESDAY",
        dayNamePt: "Terça-feira",
        modality: "RUN",
        street: { description: "3.0 km Ativação (3x 60m passadas)", distanceKm: 3.0 },
        treadmill: {
          sessionType: "Ativação",
          program: "Manual / Speed Strides",
          inclinePct: 0,
          warmup: "1.5 km @ 8.0 km/h",
          mainSet: "3x (60s @ 11.0 km/h + 90s caminhada @ 5.5 km/h)",
          cooldown: "0.5 km @ 7.0 km/h",
          estimatedDistanceKm: 3.0,
          estimatedDurationMin: 22,
        },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY",
        dayNamePt: "Quarta-feira",
        modality: "BIKE",
        street: { description: "Bike / Core Z1 (leve)", distanceKm: 0 },
        treadmill: { sessionType: "Giro Solto", program: "Bike Recumbent", inclinePct: 0, warmup: "5 min", mainSet: "15 min Z1", cooldown: "5 min", estimatedDistanceKm: 0, estimatedDurationMin: 25 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY",
        dayNamePt: "Quinta-feira",
        modality: "RUN",
        street: { description: "2.0 km Trote solto + 15 min bike Z1", distanceKm: 2.0 },
        treadmill: {
          sessionType: "Ativação Final",
          program: "Manual / Recovery",
          inclinePct: 0,
          warmup: "05 min @ 6.0 km/h",
          mainSet: "10 min @ 8.2 km/h + 15 min Bike horizontal Z1",
          cooldown: "05 min alongamento solo",
          estimatedDistanceKm: 2.0,
          estimatedDurationMin: 20,
        },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY",
        dayNamePt: "Sexta-feira",
        modality: "REST",
        street: { description: "OFF Total • Carbo-loading & Hidratação", isOff: true },
        treadmill: { sessionType: "Carbo-Loading", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso e hidratação pré-prova", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY",
        dayNamePt: "Sábado",
        modality: "REST",
        street: { description: "OFF Total • Véspera da Corrida Olga Kos", isOff: true },
        treadmill: { sessionType: "Véspera de Prova", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso, alvorada Tuya armada, chip no tênis", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY",
        dayNamePt: "Domingo",
        modality: "RACE",
        street: {
          description: "🏆 PROVA OLGA KOS 9 KM (Sub-52 min) • Pacaembu",
          distanceKm: 9.0,
          targetPace: "05:39/km",
          isRace: true,
          typeBadge: "PROVA OFICIAL",
        },
        treadmill: {
          sessionType: "PROVA OLGA KOS 9K",
          program: "RUA / COMPETIÇÃO",
          inclinePct: 0,
          warmup: "Aquecimento dinâmico solo",
          mainSet: "Ritmo de prova @ 10.6 km/h (05:39/km alvo)",
          cooldown: "Caminhada livre",
          estimatedDistanceKm: 9.0,
          estimatedDurationMin: 51,
          isRace: true,
        },
      },
    },
  },

  // =========================================================================
  // FASE 2: MACROCICLO SUB-2H MEIA DE SP 21.1K (14/12/2026 A 04/04/2027)
  // =========================================================================
  {
    id: "f2-sem-01",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h (Volume Base)",
    weekNumber: 1,
    weekLabel: "Fase 2 - Sem. 01",
    period: "14/12 a 20/12",
    startDate: "2026-12-14",
    endDate: "2026-12-20",
    totalVolumeKm: 28,
    targetGoal: "Início do macrociclo de 16 semanas para quebrar as 2h na Meia Maratona de SP.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "5.0 km (AQ 1k + 3x 500m @ 05:30 + DQ)", distanceKm: 5.0, targetPace: "05:30/km" },
        treadmill: { sessionType: "Tiros Curtos", program: "HIIT / Interval Training", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "3x (500m @ 10.9 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 8.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 33 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0, targetPace: "06:40/km" },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "5.0 km Estável @ 06:15/km", distanceKm: 5.0, targetPace: "06:15/km" },
        treadmill: { sessionType: "Ritmo Estável", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "3.5 km contínuo @ 9.7 km/h (06:11/km)", cooldown: "0.5 km @ 7.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 33 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:50/km (Soltura)", distanceKm: 4.0, targetPace: "06:50/km" },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.5 km/h (07:03/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "9.0 km Z2/Z3 @ 06:30/km", distanceKm: 9.0, targetPace: "06:30/km" },
        treadmill: { sessionType: "Longão Base", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.0 km/h", mainSet: "7.0 km contínuo @ 9.2 km/h (06:31/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 9.0, estimatedDurationMin: 60 },
      },
    },
  },

  {
    id: "f2-sem-02",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h",
    weekNumber: 2,
    weekLabel: "Fase 2 - Sem. 02",
    period: "21/12 a 27/12",
    startDate: "2026-12-21",
    endDate: "2026-12-27",
    totalVolumeKm: 31,
    targetGoal: "Volume de 31 km e longão de 10 km com os 2 últimos km em ritmo forte.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "6.0 km (AQ 1k + 4x 500m @ 05:25 + DQ)", distanceKm: 6.0 },
        treadmill: { sessionType: "Tiros Curtos", program: "HIIT / Interval Training", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "4x (500m @ 11.1 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 8.0 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 38 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "6.0 km (4k @ 06:05/km)", distanceKm: 6.0 },
        treadmill: { sessionType: "Tempo Run", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "4.0 km contínuo @ 9.9 km/h (06:03/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 38 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:45/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.6 km/h (06:58/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "10.0 km (fin. 2k @ 06:10)", distanceKm: 10.0 },
        treadmill: { sessionType: "Longão Progressivo", program: "Progressivo / Target", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "7.0 km @ 9.2 km/h + 2.0 km @ 9.8 km/h", cooldown: "0.0 km (corte direto)", estimatedDistanceKm: 10.0, estimatedDurationMin: 65 },
      },
    },
  },

  {
    id: "f2-sem-03",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h",
    weekNumber: 3,
    weekLabel: "Fase 2 - Sem. 03",
    period: "28/12 a 03/01",
    startDate: "2026-12-28",
    endDate: "2027-01-03",
    totalVolumeKm: 33,
    targetGoal: "Virada do ano com longão de 12 km e ritmo sustentado @ 05:55/km.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "6.0 km (AQ 1.5k + 3x 1000m @ 05:30 + DQ)", distanceKm: 6.0 },
        treadmill: { sessionType: "Tiros de 1.000m", program: "HIIT / Interval Training", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "3x (1.000m @ 10.9 km/h + 2 min trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 39 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "6.0 km Estável @ 05:55/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Ritmo Sustentado", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "4.0 km contínuo @ 10.1 km/h (05:56/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 37 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:45/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.6 km/h (06:58/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "12.0 km Z2/Z3 @ 06:20/km", distanceKm: 12.0 },
        treadmill: { sessionType: "Longão Contínuo", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "10.0 km contínuo @ 9.5 km/h (06:19/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 12.0, estimatedDurationMin: 78 },
      },
    },
  },

  {
    id: "f2-sem-04",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Deload Regenerativo (Semana 4)",
    weekNumber: 4,
    weekLabel: "Fase 2 - Sem. 04",
    period: "04/01 a 10/01",
    startDate: "2027-01-04",
    endDate: "2027-01-10",
    totalVolumeKm: 26,
    targetGoal: "Semana de absorção e deload (26 km) para regenerar tendões e ligamentos.",
    isDeload: true,
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "5.0 km Soltos + 4 retas cadência alta", distanceKm: 5.0 },
        treadmill: { sessionType: "Deload / Cadência", program: "Manual / Speed Strides", inclinePct: 0, warmup: "1.5 km @ 8.0 km/h", mainSet: "4x (30s @ 11.5 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 33 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "4.0 km Regenerativo", distanceKm: 4.0 },
        treadmill: { sessionType: "Regenerativo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.2 km/h (07:19/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "5.0 km Easy @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:50/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Soltura", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.5 km/h (07:03/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "8.0 km Deload @ 06:30/km", distanceKm: 8.0 },
        treadmill: { sessionType: "Longão Deload", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.0 km/h", mainSet: "6.0 km contínuo @ 9.2 km/h (06:31/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 54 },
      },
    },
  },

  {
    id: "f2-sem-05",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h",
    weekNumber: 5,
    weekLabel: "Fase 2 - Sem. 05",
    period: "11/01 a 17/01",
    startDate: "2027-01-11",
    endDate: "2027-01-17",
    totalVolumeKm: 36,
    targetGoal: "Crescimento de carga (36 km), tiros de 800m e bloco de ritmo sub-2h.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "7.0 km (AQ 1.5k + 4x 800m @ 05:20 + DQ)", distanceKm: 7.0 },
        treadmill: { sessionType: "Intervalado Médio", program: "HIIT / Interval Training", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "4x (800m @ 11.3 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 7.0, estimatedDurationMin: 43 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "6.0 km @ 06:35/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 9.0 km/h (06:40/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "6.0 km (3k @ 05:40/km)", distanceKm: 6.0 },
        treadmill: { sessionType: "Bloco Ritmo Sub-2h", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "3.0 km contínuo @ 10.6 km/h (05:40/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 38 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "12.0 km (fin. 3k @ 05:50)", distanceKm: 12.0 },
        treadmill: { sessionType: "Longão Progressivo", program: "Progressivo / Target", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "8.0 km @ 9.5 km/h + 3.0 km @ 10.3 km/h", cooldown: "0.0 km (corte direto)", estimatedDistanceKm: 12.0, estimatedDurationMin: 76 },
      },
    },
  },

  {
    id: "f2-sem-06",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Rompendo os 40K Semanais",
    weekNumber: 6,
    weekLabel: "Fase 2 - Sem. 06",
    period: "18/01 a 24/01",
    startDate: "2027-01-18",
    endDate: "2027-01-24",
    totalVolumeKm: 40,
    targetGoal: "Marco de 40 km semanais e longão de 14 km com ritmo de cruzeiro.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "8.0 km (AQ 1.5k + 4x 1000m @ 05:25 + DQ)", distanceKm: 8.0 },
        treadmill: { sessionType: "Tiros de 1.000m", program: "HIIT / Interval Training", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "4x (1.000m @ 11.1 km/h + 2 min trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 50 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "6.0 km @ 06:35/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 9.0 km/h (06:40/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "7.0 km (4k @ 05:40/km)", distanceKm: 7.0 },
        treadmill: { sessionType: "Bloco Ritmo Sub-2h", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "4.0 km contínuo @ 10.6 km/h (05:40/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 7.0, estimatedDurationMin: 43 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "14.0 km Estável @ 06:15/km", distanceKm: 14.0 },
        treadmill: { sessionType: "Longão Específico", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "12.0 km contínuo @ 9.7 km/h (06:11/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 14.0, estimatedDurationMin: 89 },
      },
    },
  },

  {
    id: "f2-sem-07",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h",
    weekNumber: 7,
    weekLabel: "Fase 2 - Sem. 07",
    period: "25/01 a 31/01",
    startDate: "2027-01-25",
    endDate: "2027-01-31",
    totalVolumeKm: 43,
    targetGoal: "Pico de 43 km com longão de 16 km contendo 6 km no ritmo alvo de prova.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "8.0 km (AQ 2k + 5x 800m @ 05:15 + DQ)", distanceKm: 8.0 },
        treadmill: { sessionType: "Intervalado Curto/Forte", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "5x (800m @ 11.4 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 49 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "6.0 km @ 06:30/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 9.2 km/h (06:31/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "8.0 km (5k @ 05:38/km)", distanceKm: 8.0 },
        treadmill: { sessionType: "Limiar Sub-2h Expandido", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "5.0 km contínuo @ 10.6 km/h (05:38/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 49 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "16.0 km (bloco 6k @ 05:50)", distanceKm: 16.0 },
        treadmill: { sessionType: "Longão com Bloco", program: "Progressivo / Target", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "8.0 km @ 9.5 km/h + 6.0 km @ 10.3 km/h + 1k @ 7k", cooldown: "0.0 km", estimatedDistanceKm: 16.0, estimatedDurationMin: 100 },
      },
    },
  },

  {
    id: "f2-sem-08",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Deload Regenerativo (Semana 8)",
    weekNumber: 8,
    weekLabel: "Fase 2 - Sem. 08",
    period: "01/02 a 07/02",
    startDate: "2027-02-01",
    endDate: "2027-02-07",
    totalVolumeKm: 30,
    targetGoal: "Deload estratégico de 30 km para recuperação mitocondrial e neuromuscular.",
    isDeload: true,
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "6.0 km Soltos com 5 acelerações 100m", distanceKm: 6.0 },
        treadmill: { sessionType: "Deload / Strides", program: "Manual / Speed Strides", inclinePct: 0, warmup: "1.5 km @ 8.0 km/h", mainSet: "5x (30s @ 11.5 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 40 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "5.0 km Regenerativo", distanceKm: 5.0 },
        treadmill: { sessionType: "Regenerativo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.2 km/h (07:19/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "6.0 km Easy @ 06:40/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:50/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Soltura", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.5 km/h (07:03/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "9.0 km Deload @ 06:30/km", distanceKm: 9.0 },
        treadmill: { sessionType: "Longão Deload", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.0 km/h", mainSet: "7.0 km contínuo @ 9.2 km/h (06:31/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 9.0, estimatedDurationMin: 60 },
      },
    },
  },

  {
    id: "f2-sem-09",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h",
    weekNumber: 9,
    weekLabel: "Fase 2 - Sem. 09",
    period: "08/02 a 14/02",
    startDate: "2027-02-08",
    endDate: "2027-02-14",
    totalVolumeKm: 42,
    targetGoal: "Tiros longos de 1.500m @ 05:25 e 5k cravados @ 05:35/km.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "8.0 km (AQ 2k + 3x 1500m @ 05:25 + DQ)", distanceKm: 8.0 },
        treadmill: { sessionType: "Tiros Longos", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "3x (1.500m @ 11.1 km/h + 2 min trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 49 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "6.0 km @ 06:30/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 9.2 km/h (06:31/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "8.0 km (5k cravados @ 05:35)", distanceKm: 8.0 },
        treadmill: { sessionType: "Tempo Run Específico", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "5.0 km contínuo @ 10.7 km/h (05:35/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 48 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "15.0 km (fin. 4k @ 05:40)", distanceKm: 15.0 },
        treadmill: { sessionType: "Longão Progressivo", program: "Progressivo / Target", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "10.0 km @ 9.5 km/h + 4.0 km @ 10.6 km/h", cooldown: "0.0 km (corte direto)", estimatedDistanceKm: 15.0, estimatedDurationMin: 92 },
      },
    },
  },

  {
    id: "f2-sem-10",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Macrociclo Meia de SP Sub-2h",
    weekNumber: 10,
    weekLabel: "Fase 2 - Sem. 10",
    period: "15/02 a 21/02",
    startDate: "2027-02-15",
    endDate: "2027-02-21",
    totalVolumeKm: 45,
    targetGoal: "Longão de 17 km com simulação de hidratação e carbogel.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "9.0 km (AQ 2k + 4x 1200m @ 05:20 + DQ)", distanceKm: 9.0 },
        treadmill: { sessionType: "Intervalado de Carga", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "4x (1.200m @ 11.3 km/h + 2 min trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 9.0, estimatedDurationMin: 55 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "6.0 km @ 06:30/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 9.2 km/h (06:31/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "8.0 km (6k contínuos @ 05:35)", distanceKm: 8.0 },
        treadmill: { sessionType: "Tempo Run Alvo", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "6.0 km contínuo @ 10.7 km/h (05:35/km)", cooldown: "1.0 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 48 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "17.0 km com hidratação tática", distanceKm: 17.0 },
        treadmill: { sessionType: "Longão Estratégico", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "15.0 km contínuo @ 9.7 km/h (06:11/km) + Géis", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 17.0, estimatedDurationMin: 107 },
      },
    },
  },

  {
    id: "f2-sem-11",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • PICO MÁXIMO DO MACROCICLO (48 km)",
    weekNumber: 11,
    weekLabel: "Fase 2 - Sem. 11",
    period: "22/02 a 28/02",
    startDate: "2027-02-22",
    endDate: "2027-02-28",
    totalVolumeKm: 48,
    targetGoal: "Semana de volume máximo absoluto (48 km) e longão de 18 km com final forte.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "9.0 km (AQ 2k + 5x 1000m @ 05:15 + DQ)", distanceKm: 9.0 },
        treadmill: { sessionType: "Pico de Intervalado", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "5x (1.000m @ 11.4 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 9.0, estimatedDurationMin: 54 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "7.0 km @ 06:30/km", distanceKm: 7.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "40 min contínuo @ 9.2 km/h (06:31/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 7.0, estimatedDurationMin: 50 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "9.0 km (6k @ 05:30/km)", distanceKm: 9.0 },
        treadmill: { sessionType: "Pico de Tempo Run", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "6.0 km contínuo @ 10.9 km/h (05:30/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 9.0, estimatedDurationMin: 53 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km @ 06:40/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Soltura Pré-Longo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "18.0 km (fin. 5k @ 05:40)", distanceKm: 18.0 },
        treadmill: { sessionType: "Pico de Longão", program: "Progressivo / Target", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "12.0 km @ 9.5 km/h + 5.0 km @ 10.6 km/h", cooldown: "0.0 km (corte direto)", estimatedDistanceKm: 18.0, estimatedDurationMin: 110 },
      },
    },
  },

  {
    id: "f2-sem-12",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Deload Pós-Pico (Semana 12)",
    weekNumber: 12,
    weekLabel: "Fase 2 - Sem. 12",
    period: "01/03 a 07/03",
    startDate: "2027-03-01",
    endDate: "2027-03-07",
    totalVolumeKm: 32,
    targetGoal: "Absorção do pico de 48k com deload regenerativo para 32 km.",
    isDeload: true,
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "6.0 km Soltos com 4 tiros curtos 80m", distanceKm: 6.0 },
        treadmill: { sessionType: "Deload Pré-Pico", program: "Manual / Speed Strides", inclinePct: 0, warmup: "1.5 km @ 8.0 km/h", mainSet: "4x (60s @ 11.5 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 38 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "5.0 km Regenerativo", distanceKm: 5.0 },
        treadmill: { sessionType: "Regenerativo", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "30 min contínuo @ 8.2 km/h (07:19/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "6.0 km Easy @ 06:40/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:50/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Soltura", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.5 km/h (07:03/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "11.0 km Deload @ 06:30/km", distanceKm: 11.0 },
        treadmill: { sessionType: "Longão Deload", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.0 km/h", mainSet: "9.0 km contínuo @ 9.2 km/h (06:31/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 11.0, estimatedDurationMin: 73 },
      },
    },
  },

  {
    id: "f2-sem-13",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Simulado Geral & Combo 18K",
    weekNumber: 13,
    weekLabel: "Fase 2 - Sem. 13",
    period: "08/03 a 14/03",
    startDate: "2027-03-08",
    endDate: "2027-03-14",
    totalVolumeKm: 44,
    targetGoal: "Simulado Combo 5K no sábado + Longão 18K no domingo com teste de equipamento oficial.",
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "8.0 km (AQ 2k + 4x 1000m @ 05:20 + DQ)", distanceKm: 8.0 },
        treadmill: { sessionType: "Intervalado de Sustentação", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "4x (1.000m @ 11.3 km/h + 2 min trote @ 7.0 km/h)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 49 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "6.0 km @ 06:30/km", distanceKm: 6.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "35 min contínuo @ 9.2 km/h (06:31/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 45 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "7.0 km (4k @ 05:35/km)", distanceKm: 7.0 },
        treadmill: { sessionType: "Tempo Run Curto", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "4.0 km contínuo @ 10.7 km/h (05:35/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 7.0, estimatedDurationMin: 42 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "5.0 km Simulado @ 06:20", distanceKm: 5.0 },
        treadmill: { sessionType: "Simulado Combo 5K", program: "Contínuo / Target Test", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "25 min contínuo @ 9.5 km/h (06:19/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "18.0 km Longão com gel", distanceKm: 18.0 },
        treadmill: { sessionType: "Longão Combo 18K", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "16.0 km contínuo @ 9.7 km/h (06:11/km) + Géis", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 18.0, estimatedDurationMin: 111 },
      },
    },
  },

  {
    id: "f2-sem-14",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Início do Tapering (Semana 14)",
    weekNumber: 14,
    weekLabel: "Fase 2 - Sem. 14",
    period: "15/03 a 21/03",
    startDate: "2027-03-15",
    endDate: "2027-03-21",
    totalVolumeKm: 35,
    targetGoal: "Início do tapering progressivo (-20% de volume), preservando intensidade.",
    isDeload: true,
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "7.0 km (AQ 2k + 4x 600m @ 05:15 + DQ)", distanceKm: 7.0 },
        treadmill: { sessionType: "Tapering / Ritmo", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "4x (600m @ 11.4 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.0 km @ 7.5 km/h", estimatedDistanceKm: 7.0, estimatedDurationMin: 43 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "5.0 km @ 06:35/km", distanceKm: 5.0 },
        treadmill: { sessionType: "Rodagem Easy", program: "Contínuo / Fat Burn", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "30 min contínuo @ 9.0 km/h (06:40/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 40 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "6.0 km (3k @ 05:35/km)", distanceKm: 6.0 },
        treadmill: { sessionType: "Tempo Run Reduzido", program: "Tempo Run Manual", inclinePct: 0, warmup: "1.5 km @ 8.5 km/h", mainSet: "3.0 km contínuo @ 10.7 km/h (05:35/km)", cooldown: "1.5 km @ 7.5 km/h", estimatedDistanceKm: 6.0, estimatedDurationMin: 37 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "4.0 km @ 06:45/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Soltura", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "13.0 km Confortável @ 06:20", distanceKm: 13.0 },
        treadmill: { sessionType: "Longão Polimento", program: "Contínuo / Endurance", inclinePct: 0, warmup: "1.0 km @ 8.5 km/h", mainSet: "11.0 km contínuo @ 9.5 km/h (06:19/km)", cooldown: "1.0 km @ 7.0 km/h", estimatedDistanceKm: 13.0, estimatedDurationMin: 81 },
      },
    },
  },

  {
    id: "f2-sem-15",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • Tapering Agudo (Semana 15)",
    weekNumber: 15,
    weekLabel: "Fase 2 - Sem. 15",
    period: "22/03 a 28/03",
    startDate: "2027-03-22",
    endDate: "2027-03-28",
    totalVolumeKm: 25,
    targetGoal: "Redução aguda de volume para 25 km, estocagem de glicogênio e pernas elásticas.",
    isDeload: true,
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "5.0 km (AQ 2k + 3x 500m @ 05:25 + DQ)", distanceKm: 5.0 },
        treadmill: { sessionType: "Tapering Agudo", program: "HIIT / Interval Training", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "3x (500m @ 11.1 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.0 km @ 7.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 33 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "RUN",
        street: { description: "4.0 km @ 06:40/km", distanceKm: 4.0 },
        treadmill: { sessionType: "Rodagem Leve", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "25 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 35 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "5.0 km (1k @ 05:35/km)", distanceKm: 5.0 },
        treadmill: { sessionType: "Toque de Prova", program: "Manual / Touch Target", inclinePct: 0, warmup: "2.0 km @ 8.5 km/h", mainSet: "1.0 km cravado @ 10.7 km/h (05:35/km)", cooldown: "2.0 km @ 7.5 km/h", estimatedDistanceKm: 5.0, estimatedDurationMin: 33 },
      },
      FRIDAY: { dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RUN",
        street: { description: "3.0 km Z1 Soltura fluida", distanceKm: 3.0 },
        treadmill: { sessionType: "Soltura Curta", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.0 km/h", mainSet: "15 min contínuo @ 8.5 km/h (07:03/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 3.0, estimatedDurationMin: 25 },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RUN",
        street: { description: "8.0 km Regenerativo solto", distanceKm: 8.0 },
        treadmill: { sessionType: "Regenerativo Solto", program: "Contínuo / Recovery", inclinePct: 0, warmup: "05 min @ 7.5 km/h", mainSet: "45 min contínuo @ 8.8 km/h (06:49/km)", cooldown: "05 min @ 6.5 km/h", estimatedDistanceKm: 8.0, estimatedDurationMin: 55 },
      },
    },
  },

  {
    id: "f2-sem-16",
    phase: "FASE_2",
    phaseTitle: "Fase 2 • SEMANA DE PROVA ALVO: MEIA DE SP 21.1K (SUB-2H)",
    weekNumber: 16,
    weekLabel: "Fase 2 - Sem. 16",
    period: "29/03 a 04/04",
    startDate: "2027-03-29",
    endDate: "2027-04-04",
    totalVolumeKm: 33,
    targetGoal: "Semana da Glória! Sábado Prova 5k solta + Domingo Meia Maratona de SP Sub-2h!",
    isRaceWeek: true,
    days: {
      MONDAY: { dayOfWeek: "MONDAY", dayNamePt: "Segunda-feira", modality: "REST", street: { description: "OFF", isOff: true }, treadmill: { sessionType: "Descanso", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Descanso", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true } },
      TUESDAY: {
        dayOfWeek: "TUESDAY", dayNamePt: "Terça-feira", modality: "RUN",
        street: { description: "4.0 km Ativação (3x 80m progressivos)", distanceKm: 4.0 },
        treadmill: { sessionType: "Ativação da Prova", program: "Manual / Speed Strides", inclinePct: 0, warmup: "2.0 km @ 8.0 km/h", mainSet: "3x (60s @ 11.0 km/h + 90s trote @ 7.0 km/h)", cooldown: "1.0 km @ 7.5 km/h", estimatedDistanceKm: 4.0, estimatedDurationMin: 27 },
      },
      WEDNESDAY: {
        dayOfWeek: "WEDNESDAY", dayNamePt: "Quarta-feira", modality: "BIKE",
        street: { description: "OFF Total / Bike 20 min Z1", distanceKm: 0 },
        treadmill: { sessionType: "Soltura Opcional", program: "Bike Recumbent / Giro Z1", inclinePct: 0, warmup: "05 min @ Nível 1", mainSet: "15 min giro constante (70 rpm atrito zero)", cooldown: "05 min desaceleração", estimatedDistanceKm: 0, estimatedDurationMin: 25 },
      },
      THURSDAY: {
        dayOfWeek: "THURSDAY", dayNamePt: "Quinta-feira", modality: "RUN",
        street: { description: "3.0 km Trote solto mecânico", distanceKm: 3.0 },
        treadmill: { sessionType: "Trote Mecânico", program: "Manual / Recovery", inclinePct: 0, warmup: "05 min @ 6.5 km/h", mainSet: "15 min contínuo @ 8.2 km/h (07:19/km)", cooldown: "05 min @ 6.0 km/h", estimatedDistanceKm: 3.0, estimatedDurationMin: 25 },
      },
      FRIDAY: {
        dayOfWeek: "FRIDAY", dayNamePt: "Sexta-feira", modality: "REST",
        street: { description: "OFF (Carbo-loading 600g carboidratos)", isOff: true },
        treadmill: { sessionType: "Carbo-Loading", program: "OFF", inclinePct: 0, warmup: "-", mainSet: "Repouso absoluto, massa, hidratação salina", cooldown: "-", estimatedDistanceKm: 0, estimatedDurationMin: 0, isOff: true },
      },
      SATURDAY: {
        dayOfWeek: "SATURDAY", dayNamePt: "Sábado", modality: "RACE",
        street: {
          description: "🏃 PROVA 5 KM (03/04 - Rodagem solta preparatória)",
          distanceKm: 5.0,
          targetPace: "06:31/km",
          isRace: true,
          typeBadge: "PROVA 5K PREPARATÓRIA",
        },
        treadmill: {
          sessionType: "DESAFIO 5K SP",
          program: "RUA / COMPETIÇÃO",
          inclinePct: 0,
          warmup: "Aquecimento dinâmico solo",
          mainSet: "Ritmo de soltura @ 9.2 km/h (06:31/km) sem sprint",
          cooldown: "Caminhada livre",
          estimatedDistanceKm: 5.0,
          estimatedDurationMin: 33,
          isRace: true,
        },
      },
      SUNDAY: {
        dayOfWeek: "SUNDAY", dayNamePt: "Domingo", modality: "RACE",
        street: {
          description: "👑 MEIA DE SP 21.1 KM (04/04 - Sub-2h | Pace 05:39/km)",
          distanceKm: 21.097,
          targetPace: "05:39/km",
          isRace: true,
          typeBadge: "PROVA ALVO P1 SUB-2H",
        },
        treadmill: {
          sessionType: "MEIA DE SP 21.1K",
          program: "RUA / COMPETIÇÃO",
          inclinePct: 0,
          warmup: "Aquecimento dinâmico solo",
          mainSet: "Meta Sub-2h @ 10.6 km/h (05:39/km alvo com géis)",
          cooldown: "Caminhada / Celebração",
          estimatedDistanceKm: 21.1,
          estimatedDurationMin: 119,
          isRace: true,
        },
      },
    },
  },
];

/**
 * Returns the training week based on a given date (defaults to current date)
 */
export function getDanielPlanWeekByDate(targetDateStr: string = "2026-10-19"): DanielTrainingWeek {
  const targetTime = new Date(targetDateStr).getTime();

  for (const week of DANIEL_TRAINING_PLAN) {
    const s = new Date(week.startDate).getTime();
    const e = new Date(week.endDate).getTime() + 86400000; // inclusive end date
    if (targetTime >= s && targetTime <= e) {
      return week;
    }
  }

  // If before plan starts or between phases, find closest future or first
  if (targetTime < new Date(DANIEL_TRAINING_PLAN[0].startDate).getTime()) {
    return DANIEL_TRAINING_PLAN[0];
  }

  return DANIEL_TRAINING_PLAN[0];
}

/**
 * Converts JS Day index (0=Sunday .. 6=Saturday) to DayOfWeek
 */
export function getDayOfWeekFromIndex(dayIndex: number): DayOfWeek {
  const map: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return map[dayIndex] || "MONDAY";
}

/**
 * Gets specific day session from a week
 */
export function getDanielWorkoutForDayIndex(
  week: DanielTrainingWeek,
  dayIndex: number
): DanielDailyWorkout {
  const dayName = getDayOfWeekFromIndex(dayIndex);
  return week.days[dayName];
}
