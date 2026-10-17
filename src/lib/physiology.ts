import {
  BiologicalSex,
  BodyMetrics,
  WeekendLayoutMode,
  WeekPhase,
  StrengthPrescription,
  RunPrescriptionTreadmill,
  RunPrescriptionOutdoor,
  BikePrescription,
} from "./types";

/**
 * Deterministic Physiological Calculations (US Navy, Jack Daniels VDOT, Costill Incline)
 */

export function calculateBodyMetrics(params: {
  weightKg: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number;
  heightCm: number;
  sex: BiologicalSex;
  targetWeightKg?: number;
}): BodyMetrics {
  const { weightKg, waistCm, neckCm, hipCm = 95, heightCm, sex, targetWeightKg = 75 } = params;

  // BMI
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(2));

  // WHtR (Waist to Height Ratio)
  const whtr = Number((waistCm / heightCm).toFixed(2));

  // US Navy Body Fat % Formula
  let bodyFatPct = 0;
  if (sex === "MALE") {
    // 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
    const diff = Math.max(1, waistCm - neckCm);
    bodyFatPct = 86.01 * Math.log10(diff) - 70.041 * Math.log10(heightCm) + 36.76;
  } else {
    // 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
    const sum = Math.max(1, waistCm + hipCm - neckCm);
    bodyFatPct = 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightCm) - 78.387;
  }

  // Sanity bounding
  bodyFatPct = Math.max(5, Math.min(50, Number(bodyFatPct.toFixed(1))));

  const fatMassKg = Number(((weightKg * bodyFatPct) / 100).toFixed(1));
  const leanMassKg = Number((weightKg - fatMassKg).toFixed(1));

  // Running Pace Gain: every 1kg of excess body mass lost yields ~2.4 to 3.0 sec/km pace improvement
  const weightDelta = Math.max(0, weightKg - targetWeightKg);
  const runningPaceGainSec = Math.round(weightDelta * 2.5);

  return {
    weightKg,
    waistCm,
    neckCm,
    hipCm,
    heightCm,
    sex,
    bmi,
    whtr,
    bodyFatPct,
    leanMassKg,
    fatMassKg,
    runningPaceGainSec,
  };
}

/**
 * Converts outdoor pace (min/km, e.g. "5:30") to treadmill speed (km/h) with gradient.
 * 1% incline on treadmill typically compensates for lack of wind resistance.
 */
export function convertPaceToTreadmill(
  paceMinKm: string,
  inclinePct: number = 1.0
): {
  speedKmh: number;
  paceDec: number;
  equivalentOutdoorPace: string;
  vo2CostKmh: number;
} {
  const [minStr, secStr] = paceMinKm.split(":");
  const mins = parseInt(minStr || "5", 10);
  const secs = parseInt(secStr || "30", 10);
  const paceDec = mins + secs / 60;

  // Outdoor flat speed
  const baseSpeedKmh = Number((60 / paceDec).toFixed(1));

  // Incline metabolic cost formula (Costill & Fox treadmill oxygen cost)
  // Each 1% incline at same speed increases VO2 cost by ~4-5%
  const vo2CostFactor = 1 + (inclinePct - 1.0) * 0.04;
  const speedKmh = Number((baseSpeedKmh / (inclinePct > 1 ? vo2CostFactor : 1)).toFixed(1));

  return {
    speedKmh,
    paceDec,
    equivalentOutdoorPace: paceMinKm,
    vo2CostKmh: Number((speedKmh * vo2CostFactor).toFixed(1)),
  };
}

/**
 * Generates Structured Strength Workout (Fichas A, B, C)
 * Special Clinical Adaptation: Daniel has a Reverse Right Shoulder Prosthesis!
 * - Strictly NO overhead shoulder presses (Desenvolvimento barra/halteres)
 * - Strictly NO extreme external rotation or deep behind-the-neck movements
 * - Replaced with scapular-neutral chest press, cable neutral rows, and controlled lateral raises
 */
export function getStrengthFicha(
  ficha: "A" | "B" | "C",
  hasShoulderRestriction: boolean = true
): StrengthPrescription {
  if (ficha === "A") {
    return {
      ficha: "A",
      focus: "Membros Superiores: Empurrar & Estabilidade Escapular",
      warmupMinutes: 8,
      recoveryProtocolMinutes: 5,
      exercises: [
        {
          name: hasShoulderRestriction
            ? "Supino Reto com Halteres (Pegada Neutra 45°)"
            : "Supino Reto com Barra",
          targetMuscle: "Peitoral Maior / Tríceps",
          sets: 4,
          reps: "10-12",
          rpe: 7.5,
          shoulderSafe: true,
          substituteFor: hasShoulderRestriction ? "Supino com Barra Reta" : undefined,
          instructions:
            "Cotovelos a 45 graus do tronco para descompressão subacromial da prótese.",
        },
        {
          name: hasShoulderRestriction
            ? "Elevação Lateral na Polia Baixa (Plano Escapular 30°)"
            : "Desenvolvimento Militar com Barra",
          targetMuscle: "Deltoide Lateral & Anterior",
          sets: 3,
          reps: "12-15",
          rpe: 7,
          shoulderSafe: true,
          substituteFor: hasShoulderRestriction ? "Desenvolvimento Overhead" : undefined,
          instructions:
            "Executar no plano da escápula (30° à frente). Não ultrapassar a linha do queixo.",
        },
        {
          name: "Tríceps Corda na Polia Alta",
          targetMuscle: "Tríceps Braquial",
          sets: 3,
          reps: "12-15",
          rpe: 8,
          shoulderSafe: true,
          instructions: "Cotovelos travados ao lado das costelas.",
        },
        {
          name: "Flexão de Braço Inclinada na Barra Guiada (Safe Plank)",
          targetMuscle: "Serrátil Anterior & Core",
          sets: 3,
          reps: "12",
          rpe: 7,
          shoulderSafe: true,
          instructions: "Ativação do serrátil anterior para fixação escapular.",
        },
      ],
    };
  }

  if (ficha === "B") {
    return {
      ficha: "B",
      focus: "Membros Superiores: Puxar, Postura Torácica & Core",
      warmupMinutes: 8,
      recoveryProtocolMinutes: 5,
      exercises: [
        {
          name: "Puxada Alta Frontal com Triângulo (Pegada Neutra)",
          targetMuscle: "Grande Dorsal / Bíceps",
          sets: 4,
          reps: "10-12",
          rpe: 8,
          shoulderSafe: true,
          instructions:
            "Pegada neutra protege a glenoumeral. Puxar até a fúrcula esternal sem inclinar o tronco em excesso.",
        },
        {
          name: "Remada Baixa Sentado na Polia (Pegada Neutra Fechada)",
          targetMuscle: "Romboides & Trapézio Médio",
          sets: 3,
          reps: "12",
          rpe: 8,
          shoulderSafe: true,
          instructions: "Depressão e retração das escápulas antes de flexionar os cotovelos.",
        },
        {
          name: "Crucifixo Inverso no Voador (Foco Deltoide Posterior)",
          targetMuscle: "Deltoide Posterior",
          sets: 3,
          reps: "15",
          rpe: 7,
          shoulderSafe: true,
          instructions: "Crucial para o suporte postural da articulação protética.",
        },
        {
          name: "Rosca Martelo com Halteres",
          targetMuscle: "Braquiorradial & Bíceps",
          sets: 3,
          reps: "10-12",
          rpe: 8,
          shoulderSafe: true,
          instructions: "Pegada neutra que alivia tensão no tendão bicipital.",
        },
        {
          name: "Pallof Press no Cabo (Anti-Rotação de Core)",
          targetMuscle: "Core / Oblíquos",
          sets: 3,
          reps: "12 cada lado",
          rpe: 7,
          shoulderSafe: true,
        },
      ],
    };
  }

  // Ficha C - Pernas & Glúteos (Potência de Corrida)
  return {
    ficha: "C",
    focus: "Membros Inferiores: Potência Propulsiva, Glúteos & Joelhos",
    warmupMinutes: 10,
    recoveryProtocolMinutes: 5,
    exercises: [
      {
        name: "Leg Press 45° com Pés em Média Altura",
        targetMuscle: "Quadríceps & Glúteo Maior",
        sets: 4,
        reps: "10-12",
        rpe: 8.5,
        shoulderSafe: true,
        instructions: "Amplitude profunda sem descolar a lombar do apoio.",
      },
      {
        name: "Cadeira Flexora Unilateral",
        targetMuscle: "Isquiotibiais",
        sets: 3,
        reps: "12 cada perna",
        rpe: 8,
        shoulderSafe: true,
        instructions: "Prevenção de lesões na corrida (relação I:Q).",
      },
      {
        name: "Elevação Pélvica com Barra ou Halter (Glute Bridge)",
        targetMuscle: "Glúteo Maior",
        sets: 4,
        reps: "12",
        rpe: 8.5,
        shoulderSafe: true,
        instructions: "Pico de contração de 2 segundos no topo para ativação de passada.",
      },
      {
        name: "Panturrilha em Pé na Máquina ou Degrau",
        targetMuscle: "Gastrocnêmio & Sóleo",
        sets: 4,
        reps: "15",
        rpe: 8,
        shoulderSafe: true,
        instructions: "Essencial para amortecimento e retorno elástico no asfalto.",
      },
      {
        name: "Abdução no Cabo ou Caneleira (Glúteo Médio)",
        targetMuscle: "Glúteo Médio",
        sets: 3,
        reps: "15 cada lado",
        rpe: 7,
        shoulderSafe: true,
        instructions: "Estabilização da pelve na fase de apoio unipedal da corrida.",
      },
    ],
  };
}

/**
 * Builds standard Treadmill 60-Minute Max Workout Blocks
 */
export function buildTreadmillSession(
  type: "Z2_BASE" | "PROGRESSION" | "INTERVALS_VO2",
  targetBaseSpeedKmh: number = 9.5
): RunPrescriptionTreadmill {
  if (type === "Z2_BASE") {
    return {
      totalDurationMin: 55,
      averageSpeedKmh: targetBaseSpeedKmh,
      steps: [
        {
          stepIndex: 1,
          title: "Aquecimento Dinâmico",
          durationMin: 10,
          speedKmh: Number((targetBaseSpeedKmh - 2.0).toFixed(1)),
          inclinePct: 1.0,
          targetHrZone: "Z1",
          rpeScale1To10: 4,
        },
        {
          stepIndex: 2,
          title: "Bloco Contínuo Z2 Aeróbio Puro",
          durationMin: 35,
          speedKmh: targetBaseSpeedKmh,
          inclinePct: 1.5,
          targetHrZone: "Z2",
          rpeScale1To10: 6,
        },
        {
          stepIndex: 3,
          title: "Desaceleração & Desaquecimento",
          durationMin: 10,
          speedKmh: Number((targetBaseSpeedKmh - 2.5).toFixed(1)),
          inclinePct: 1.0,
          targetHrZone: "Z1",
          rpeScale1To10: 3,
        },
      ],
    };
  }

  if (type === "PROGRESSION") {
    return {
      totalDurationMin: 50,
      averageSpeedKmh: Number((targetBaseSpeedKmh + 0.5).toFixed(1)),
      steps: [
        {
          stepIndex: 1,
          title: "Aquecimento Gradual",
          durationMin: 10,
          speedKmh: Number((targetBaseSpeedKmh - 1.5).toFixed(1)),
          inclinePct: 1.0,
          targetHrZone: "Z1",
          rpeScale1To10: 4,
        },
        {
          stepIndex: 2,
          title: "Degrau 1: Ritmo Confortável Z2",
          durationMin: 15,
          speedKmh: targetBaseSpeedKmh,
          inclinePct: 1.0,
          targetHrZone: "Z2",
          rpeScale1To10: 6,
        },
        {
          stepIndex: 3,
          title: "Degrau 2: Ritmo de Meia-Maratona Z3",
          durationMin: 15,
          speedKmh: Number((targetBaseSpeedKmh + 1.2).toFixed(1)),
          inclinePct: 1.5,
          targetHrZone: "Z3",
          rpeScale1To10: 7.5,
        },
        {
          stepIndex: 4,
          title: "Resfriamento Ativo",
          durationMin: 10,
          speedKmh: 7.0,
          inclinePct: 1.0,
          targetHrZone: "Z1",
          rpeScale1To10: 3,
        },
      ],
    };
  }

  // INTERVALS_VO2
  return {
    totalDurationMin: 48,
    averageSpeedKmh: Number((targetBaseSpeedKmh + 1.0).toFixed(1)),
    steps: [
      {
        stepIndex: 1,
        title: "Aquecimento",
        durationMin: 10,
        speedKmh: 7.5,
        inclinePct: 1.0,
        targetHrZone: "Z1",
        rpeScale1To10: 4,
      },
      {
        stepIndex: 2,
        title: "Tiro 1 (3 min a Z4/Z5)",
        durationMin: 3,
        speedKmh: Number((targetBaseSpeedKmh + 2.5).toFixed(1)),
        inclinePct: 1.0,
        targetHrZone: "Z4",
        rpeScale1To10: 8.5,
      },
      {
        stepIndex: 3,
        title: "Recuperação Ativa",
        durationMin: 2,
        speedKmh: 6.5,
        inclinePct: 1.0,
        targetHrZone: "Z1",
        rpeScale1To10: 4,
      },
      {
        stepIndex: 4,
        title: "Tiro 2 (3 min a Z4/Z5)",
        durationMin: 3,
        speedKmh: Number((targetBaseSpeedKmh + 2.5).toFixed(1)),
        inclinePct: 1.0,
        targetHrZone: "Z4",
        rpeScale1To10: 8.5,
      },
      {
        stepIndex: 5,
        title: "Recuperação Ativa",
        durationMin: 2,
        speedKmh: 6.5,
        inclinePct: 1.0,
        targetHrZone: "Z1",
        rpeScale1To10: 4,
      },
      {
        stepIndex: 6,
        title: "Tiro 3 (3 min a Z4/Z5)",
        durationMin: 3,
        speedKmh: Number((targetBaseSpeedKmh + 2.5).toFixed(1)),
        inclinePct: 1.0,
        targetHrZone: "Z4",
        rpeScale1To10: 8.5,
      },
      {
        stepIndex: 7,
        title: "Recuperação Ativa",
        durationMin: 2,
        speedKmh: 6.5,
        inclinePct: 1.0,
        targetHrZone: "Z1",
        rpeScale1To10: 4,
      },
      {
        stepIndex: 8,
        title: "Tiro 4 (3 min a Z4/Z5)",
        durationMin: 3,
        speedKmh: Number((targetBaseSpeedKmh + 2.5).toFixed(1)),
        inclinePct: 1.0,
        targetHrZone: "Z4",
        rpeScale1To10: 9,
      },
      {
        stepIndex: 9,
        title: "Desaquecimento e Normalização",
        durationMin: 10,
        speedKmh: 6.5,
        inclinePct: 1.0,
        targetHrZone: "Z1",
        rpeScale1To10: 3,
      },
    ],
  };
}

/**
 * Builds Full Weekly Schedule
 * Rules:
 * 1. Monday & Friday: Strictly OFF (Rest & Neuro-Decompression Reset)
 * 2. Tue, Wed, Thu: Max 60 min weekday cap! Dual-mode (Street vs Treadmill)
 * 3. Saturday / Sunday: Controlled by weekendLayoutMode:
 *    - CLASSIC_SUNDAY_LONG: Saturday = Run 8k + Musculação B; Sunday = Longão 16-18k (Street only)
 *    - SATURDAY_LONG_SUNDAY_FAMILY_BIKE: Saturday = Longão 16-18k (Street); Sunday = Pedal em Família 20-30k + Caminhada
 */
export function buildWeeklyScheduleTemplate(params: {
  weekendMode: WeekendLayoutMode;
  weekPhase?: WeekPhase;
  hasShoulderRestriction?: boolean;
}) {
  const {
    weekendMode = "CLASSIC_SUNDAY_LONG",
    weekPhase = "BASE",
    hasShoulderRestriction = true,
  } = params;

  return [
    {
      dayOfWeek: "MONDAY",
      dayNamePt: "Segunda-feira",
      isWeekday: true,
      modality: "REST",
      title: "Dia OFF: Reset Neuro-Metabólico",
      allowedEnvironments: "OUTDOOR_STREET_ONLY",
      description: "Recuperação passiva, hidratação e descompressão neural às 18h30.",
      durationMin: 0,
    },
    {
      dayOfWeek: "TUESDAY",
      dayNamePt: "Terça-feira",
      isWeekday: true,
      modality: "RUN",
      title: "Corrida Contínua Z2 (Dual-Mode: Rua vs Esteira)",
      allowedEnvironments: "DUAL_OUTDOOR_TREADMILL",
      durationMin: 55, // <= 60 min cap
      runPrescriptionTreadmill: buildTreadmillSession("Z2_BASE", 9.5),
      runPrescriptionOutdoor: {
        totalDistanceKm: 8.5,
        targetPaceMinKm: "6:15",
        warmupKm: 1.5,
        mainSetDescription: "Bloco estável em Zona 2 (110 a 127 bpm)",
        cooldownKm: 1.0,
        targetZones: ["Z2"],
      },
      strengthPrescription: getStrengthFicha("A", hasShoulderRestriction),
    },
    {
      dayOfWeek: "WEDNESDAY",
      dayNamePt: "Quarta-feira",
      isWeekday: true,
      modality: "STRENGTH",
      title: "Musculação Ficha B (Costas & Core) + Bike Regenerativa",
      allowedEnvironments: "GYM",
      durationMin: 60,
      strengthPrescription: getStrengthFicha("B", hasShoulderRestriction),
      bikePrescription: {
        durationMin: 25,
        targetCadenceRpm: 85,
        targetHrZone: "Z1",
        isFamilyPace: false,
        notes: "Giro solto para aceleração do fluxo sanguíneo nos membros inferiores.",
      },
    },
    {
      dayOfWeek: "THURSDAY",
      dayNamePt: "Quinta-feira",
      isWeekday: true,
      modality: "RUN",
      title: "Treino de Ritmo Progressivo (Dual-Mode <= 60 min)",
      allowedEnvironments: "DUAL_OUTDOOR_TREADMILL",
      durationMin: 50, // <= 60 min cap
      runPrescriptionTreadmill: buildTreadmillSession("PROGRESSION", 9.8),
      runPrescriptionOutdoor: {
        totalDistanceKm: 8.0,
        targetPaceMinKm: "5:50",
        warmupKm: 1.5,
        mainSetDescription: "Progresso gradual de Z2 para Z3 (ritmo meia-maratona)",
        cooldownKm: 1.0,
        targetZones: ["Z2", "Z3"],
      },
      strengthPrescription: getStrengthFicha("C", hasShoulderRestriction),
    },
    {
      dayOfWeek: "FRIDAY",
      dayNamePt: "Sexta-feira",
      isWeekday: true,
      modality: "REST",
      title: "Dia OFF: Eclusa de Fim de Semana",
      allowedEnvironments: "OUTDOOR_STREET_ONLY",
      description:
        "Descanso total para absorção neuromuscular. Alongamentos leves e sono profundo.",
      durationMin: 0,
    },
    {
      dayOfWeek: "SATURDAY",
      dayNamePt: "Sábado",
      isWeekday: false,
      modality: weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE" ? "RUN" : "RUN",
      title:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? "LONGÃO DE SÁBADO (16-18 km Asfalto)"
          : "Corrida de Manutenção (8 km Asfalto) + Musculação",
      allowedEnvironments: "OUTDOOR_STREET_ONLY",
      durationMin: weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE" ? 105 : 50,
      runPrescriptionOutdoor:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? {
              totalDistanceKm: 16.0,
              targetPaceMinKm: "6:10",
              warmupKm: 2.0,
              mainSetDescription:
                "Longão de resistência aeróbia na rua com hidratação a cada 3km e carbogel nos km 7 e 12.",
              cooldownKm: 1.0,
              targetZones: ["Z2"],
            }
          : {
              totalDistanceKm: 8.0,
              targetPaceMinKm: "6:00",
              warmupKm: 1.0,
              mainSetDescription: "Rodagem leve na rua mantendo cadência acima de 170 spm.",
              cooldownKm: 1.0,
              targetZones: ["Z2"],
            },
    },
    {
      dayOfWeek: "SUNDAY",
      dayNamePt: "Domingo",
      isWeekday: false,
      modality: weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE" ? "BIKE" : "RUN",
      title:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? "Pedal em Família (Daniel & Patrícia)"
          : "LONGÃO DE DOMINGO (16-18 km Asfalto)",
      allowedEnvironments:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? "INDOOR_OUTDOOR_BIKE"
          : "OUTDOOR_STREET_ONLY",
      durationMin: weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE" ? 75 : 105,
      bikePrescription:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? {
              durationMin: 75,
              targetCadenceRpm: 80,
              targetHrZone: "Z1",
              isFamilyPace: true,
              notes:
                "Pedal recreativo em família, ritmo de conversa, zero fadiga muscular acumulada.",
            }
          : undefined,
      runPrescriptionOutdoor:
        weekendMode === "CLASSIC_SUNDAY_LONG"
          ? {
              totalDistanceKm: 16.0,
              targetPaceMinKm: "6:10",
              warmupKm: 2.0,
              mainSetDescription:
                "Longão de Domingo tradicional. Foco em sustentação de ritmo constante e teste de nutrição intra-treino.",
              cooldownKm: 1.0,
              targetZones: ["Z2"],
            }
          : undefined,
    },
  ];
}

/**
 * 2027 Target Race Season Evaluation & Tapering Engine
 */
export function evaluateRaceCalendar(currentDateStr: string = "2026-10-17") {
  const races = [
    {
      id: "race-sp-inter-2027",
      name: "Maratona Internacional de São Paulo 2027 (21k)",
      priority: "P1_TARGET" as const,
      distanceKm: 21.097,
      date: "2027-04-11",
      isTbd: false,
      location: "São Paulo, SP - Ibirapuera",
      targetPaceMinKm: "5:30",
      targetFinishTime: "01:55:59",
      taperingWeeks: 3,
      carbLoadingDays: 3,
    },
    {
      id: "race-nike-sp-city-2027",
      name: "Nike SP City Marathon 2027 (21k)",
      priority: "P1_TARGET" as const,
      distanceKm: 21.097,
      date: "2027-07-25",
      isTbd: false,
      location: "São Paulo, SP - Pacaembu / Jockey",
      targetPaceMinKm: "5:25",
      targetFinishTime: "01:54:15",
      taperingWeeks: 3,
      carbLoadingDays: 3,
    },
    {
      id: "race-praia-grande-tbd-2027",
      name: "Meia Maratona de Praia Grande 2027 (21k)",
      priority: "P2_PREP" as const,
      distanceKm: 21.097,
      date: null,
      isTbd: true,
      estimatedWindowMonth: "Set/Out 2027",
      location: "Praia Grande, SP - Litoral",
      targetPaceMinKm: "5:35",
      targetFinishTime: "01:57:45",
      taperingWeeks: 2,
      carbLoadingDays: 2,
    },
  ];

  const now = new Date(currentDateStr);
  const evaluated = races.map((race) => {
    if (!race.date) {
      return {
        ...race,
        daysRemaining: null,
        weeksRemaining: null,
        phase: "DRAFT_TBD" as const,
        inTapering: false,
        inCarbLoading: false,
        recoveryLockActive: false,
      };
    }

    const raceDate = new Date(race.date);
    const diffMs = raceDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeksRemaining = Math.max(0, Math.floor(daysRemaining / 7));

    const inTapering = daysRemaining > 0 && daysRemaining <= race.taperingWeeks * 7;
    const inCarbLoading = daysRemaining > 0 && daysRemaining <= race.carbLoadingDays;
    // 14 days recovery lock after race date
    const recoveryLockActive = daysRemaining <= 0 && daysRemaining >= -14;

    let phase: WeekPhase = "BASE";
    if (recoveryLockActive) phase = "POST_21K_RECOVERY";
    else if (inTapering) phase = "TAPER_P1";
    else if (weeksRemaining <= 12) phase = "SPECIFIC";

    return {
      ...race,
      daysRemaining,
      weeksRemaining,
      phase,
      inTapering,
      inCarbLoading,
      recoveryLockActive,
    };
  });

  return evaluated;
}
