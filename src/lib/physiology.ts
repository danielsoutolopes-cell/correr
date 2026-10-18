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
/**
 * Generates Structured Strength Workout (Fichas A, B, C)
 * INDIVIDUALIZADO POR ATLETA (Anti-Mock & Alta Precisão):
 * - DANIEL: Prótese Reversa de Ombro Direito (Reverse Shoulder Prosthesis).
 *   Zero overhead presses, zero supino reto barra, foco em empurrar neutro 45°, elevação no plano escapular e tríceps.
 * - PATRÍCIA: Biomecânica feminina completa.
 *   Foco em hipertrofia de glúteos e posteriores, postura torácica, deltoides desenhados e core funcional.
 */
export function getStrengthFicha(
  ficha: "A" | "B" | "C",
  profileOrRestriction: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN" | boolean = "DANIEL"
): StrengthPrescription {
  const isPatricia = profileOrRestriction === "PATRICIA";
  const isGabriel = profileOrRestriction === "GABRIEL";
  const hasShoulderRestriction =
    typeof profileOrRestriction === "boolean"
      ? profileOrRestriction
      : profileOrRestriction === "DANIEL";

  // === FICHAS PATRÍCIA (Alta Performance Feminina, Glúteos & Postura) ===
  if (isPatricia) {
    if (ficha === "A") {
      return {
        ficha: "A",
        focus: "Membros Inferiores: Glúteos, Posteriores & Força de Passada",
        warmupMinutes: 8,
        recoveryProtocolMinutes: 5,
        exercises: [
          {
            name: "Elevação Pélvica com Barra (Pausa 2s no Topo)",
            targetMuscle: "Glúteo Maior & Core",
            sets: 4,
            reps: "10-12",
            rpe: 8.5,
            shoulderSafe: true,
            instructions: "Pico de contração de 2 segundos no ponto mais alto. Essencial para estabilidade pélvica.",
          },
          {
            name: "Agachamento Búlgaro com Halteres",
            targetMuscle: "Glúteos & Quadríceps Unilateral",
            sets: 3,
            reps: "10 cada perna",
            rpe: 8,
            shoulderSafe: true,
            instructions: "Tronco levemente inclinado à frente para máxima ativação de glúteo.",
          },
          {
            name: "Stiff com Halteres (Pés na Largura do Quadril)",
            targetMuscle: "Isquiotibiais & Glúteo",
            sets: 4,
            reps: "12",
            rpe: 8,
            shoulderSafe: true,
            instructions: "Coluna neutra e joelhos semiflexionados. Sinta o alongamento dos posteriores.",
          },
          {
            name: "Cadeira Flexora (Drop-Set na Última Série)",
            targetMuscle: "Isquiotibiais",
            sets: 3,
            reps: "12-15",
            rpe: 8.5,
            shoulderSafe: true,
            instructions: "Controle da fase excêntrica da passada.",
          },
          {
            name: "Panturrilha em Pé na Máquina",
            targetMuscle: "Gastrocnêmio & Sóleo",
            sets: 4,
            reps: "15-20",
            rpe: 8,
            shoulderSafe: true,
            instructions: "Alongamento completo na descida para proteção do tendão de Aquiles.",
          },
        ],
      };
    }

    if (ficha === "B") {
      return {
        ficha: "B",
        focus: "Membros Superiores: Costas Posturais, Deltoides & Braços Firmes",
        warmupMinutes: 8,
        recoveryProtocolMinutes: 5,
        exercises: [
          {
            name: "Puxada Frontal Aberta na Polia",
            targetMuscle: "Grande Dorsal & Romboides",
            sets: 4,
            reps: "12",
            rpe: 7.5,
            shoulderSafe: true,
            instructions: "Foco em abrir o peito e retrair as escápulas, corrigindo postura de corrida.",
          },
          {
            name: "Remada Unilateral com Halter (Serrote)",
            targetMuscle: "Dorsais & Core",
            sets: 3,
            reps: "12 cada lado",
            rpe: 8,
            shoulderSafe: true,
            instructions: "Puxar o halter em direção ao quadril mantendo o tronco estável.",
          },
          {
            name: "Elevação Lateral com Halteres (Controle)",
            targetMuscle: "Deltoide Lateral",
            sets: 3,
            reps: "15",
            rpe: 7.5,
            shoulderSafe: true,
            instructions: "Elevar até a linha do ombro sem impulsos com o tronco.",
          },
          {
            name: "Tríceps Corda na Polia Alta",
            targetMuscle: "Tríceps Braquial",
            sets: 3,
            reps: "12-15",
            rpe: 8,
            shoulderSafe: true,
            instructions: "Abrir a corda no final do movimento para contração máxima.",
          },
          {
            name: "Prancha Abdominal com Toque no Ombro",
            targetMuscle: "Core & Anti-Rotação",
            sets: 3,
            reps: "45 segundos",
            rpe: 8,
            shoulderSafe: true,
            instructions: "Evite balançar os quadris durante a transição dos braços.",
          },
        ],
      };
    }

    // Ficha C Patrícia
    return {
      ficha: "C",
      focus: "Inferiores & Core: Quadríceps, Glúteo Médio & Recomposição",
      warmupMinutes: 8,
      recoveryProtocolMinutes: 5,
      exercises: [
        {
          name: "Leg Press 45° com Pés Afastados",
          targetMuscle: "Quadríceps & Glúteos",
          sets: 4,
          reps: "12",
          rpe: 8,
          shoulderSafe: true,
          instructions: "Descer até 90 graus mantendo a pelve colada no encosto.",
        },
        {
          name: "Agachamento Sumô com Kettlebell",
          targetMuscle: "Adutores & Glúteos",
          sets: 3,
          reps: "12-15",
          rpe: 8,
          shoulderSafe: true,
          instructions: "Joelhos apontados na mesma direção das pontas dos pés.",
        },
        {
          name: "Cadeira Extensora com Isometria de 2s",
          targetMuscle: "Quadríceps (Vasto Medial)",
          sets: 3,
          reps: "12",
          rpe: 8,
          shoulderSafe: true,
          instructions: "Fortalecimento do tendão patelar para suporte aos impactos do asfalto.",
        },
        {
          name: "Cadeira Abdutora 45°",
          targetMuscle: "Glúteo Médio & Mínimo",
          sets: 4,
          reps: "15-20",
          rpe: 8.5,
          shoulderSafe: true,
          instructions: "Estabilizador primordial para o alinhamento de quadril e joelhos na corrida.",
        },
        {
          name: "Abdominal Infra no Solo ou Banco Declinado",
          targetMuscle: "Reto Abdominal Inferior",
          sets: 3,
          reps: "15",
          rpe: 7.5,
          shoulderSafe: true,
          instructions: "Subida lenta e descida controlada sem arquear a lombar.",
        },
      ],
    };
  }

  // === FICHAS DANIEL (Prótese Reversa de Ombro Direito / Meia Maratona 2027) ===
  if (ficha === "A") {
    return {
      ficha: "A",
      focus: "Membros Superiores: Empurrar Seguro & Estabilidade Escapular",
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
            "Cotovelos a 45 graus do tronco para descompressão subacromial da prótese reversa.",
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

  // Ficha C Daniel
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
  profile?: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN";
}) {
  const {
    weekendMode = "CLASSIC_SUNDAY_LONG",
    weekPhase = "BASE",
    hasShoulderRestriction = true,
    profile = "DANIEL",
  } = params;

  const isPatricia = profile === "PATRICIA";
  const isGabriel = profile === "GABRIEL";

  // Individualized running and treadmill targets
  const tuesSpeed = isGabriel ? 11.5 : isPatricia ? 8.5 : 9.5;
  const tuesOutdoorDist = isGabriel ? 10.0 : isPatricia ? 6.0 : 8.5;
  const tuesOutdoorPace = isGabriel ? "5:10" : isPatricia ? "6:45" : "6:15";

  const thursSpeed = isPatricia ? 8.8 : 9.8;
  const thursOutdoorDist = isPatricia ? 5.5 : 8.0;
  const thursOutdoorPace = isPatricia ? "6:20" : "5:50";

  const longDist = isPatricia ? 11.0 : 16.0;
  const longPace = isPatricia ? "6:50" : "6:10";
  const satShortDist = isPatricia ? 5.0 : 8.0;
  const satShortPace = isPatricia ? "6:40" : "6:00";

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
      title: isPatricia
        ? "Corrida Contínua Z2 Patrícia (6.0 km | Dual-Mode)"
        : "Corrida Contínua Z2 Daniel (8.5 km | Dual-Mode)",
      allowedEnvironments: "DUAL_OUTDOOR_TREADMILL",
      durationMin: 55, // <= 60 min cap
      runPrescriptionTreadmill: buildTreadmillSession("Z2_BASE", tuesSpeed),
      runPrescriptionOutdoor: {
        totalDistanceKm: tuesOutdoorDist,
        targetPaceMinKm: tuesOutdoorPace,
        warmupKm: 1.0,
        mainSetDescription: isPatricia
          ? "Bloco estável em Zona 2 Feminina (131 a 148 bpm)"
          : "Bloco estável em Zona 2 Masculina (126 a 142 bpm)",
        cooldownKm: 1.0,
        targetZones: ["Z2"],
      },
      strengthPrescription: getStrengthFicha("A", profile),
    },
    {
      dayOfWeek: "WEDNESDAY",
      dayNamePt: "Quarta-feira",
      isWeekday: true,
      modality: "STRENGTH",
      title: isPatricia
        ? "Musculação Ficha B (Costas Posturais & Deltoides) + Bike Regenerativa"
        : "Musculação Ficha B (Costas & Core Neutro) + Bike Regenerativa",
      allowedEnvironments: "GYM",
      durationMin: 60,
      strengthPrescription: getStrengthFicha("B", profile),
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
      title: isPatricia
        ? "Treino de Ritmo Progressivo Patrícia (5.5 km | Dual-Mode)"
        : "Treino de Ritmo Progressivo Daniel (8.0 km | Dual-Mode)",
      allowedEnvironments: "DUAL_OUTDOOR_TREADMILL",
      durationMin: 50, // <= 60 min cap
      runPrescriptionTreadmill: buildTreadmillSession("PROGRESSION", thursSpeed),
      runPrescriptionOutdoor: {
        totalDistanceKm: thursOutdoorDist,
        targetPaceMinKm: thursOutdoorPace,
        warmupKm: 1.0,
        mainSetDescription: isPatricia
          ? "Progresso gradual de Z2 para Z3 (149 a 162 bpm - Ritmo 10K)"
          : "Progresso gradual de Z2 para Z3 (ritmo meia-maratona 2027)",
        cooldownKm: 1.0,
        targetZones: ["Z2", "Z3"],
      },
      strengthPrescription: getStrengthFicha("C", profile),
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
          ? `LONGÃO DE SÁBADO (${longDist} km Asfalto - ${profile})`
          : `Corrida de Manutenção (${satShortDist} km Asfalto) + Musculação`,
      allowedEnvironments: "OUTDOOR_STREET_ONLY",
      durationMin: weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE" ? 90 : 45,
      runPrescriptionOutdoor:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? {
              totalDistanceKm: longDist,
              targetPaceMinKm: longPace,
              warmupKm: 1.5,
              mainSetDescription: isPatricia
                ? "Longão aeróbio de rua com hidratação a cada 2.5km e cadência leve e constante."
                : "Longão de resistência aeróbia na rua com hidratação a cada 3km e carbogel nos km 7 e 12.",
              cooldownKm: 1.0,
              targetZones: ["Z2"],
            }
          : {
              totalDistanceKm: satShortDist,
              targetPaceMinKm: satShortPace,
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
          : `LONGÃO DE DOMINGO (${longDist} km Asfalto - ${profile})`,
      allowedEnvironments:
        weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
          ? "INDOOR_OUTDOOR_BIKE"
          : "OUTDOOR_STREET_ONLY",
      durationMin: weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE" ? 75 : 95,
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
              totalDistanceKm: longDist,
              targetPaceMinKm: longPace,
              warmupKm: 1.5,
              mainSetDescription: isPatricia
                ? "Longão feminino de base aeróbia na rua com hidratação a cada 2.5km."
                : "Longão de resistência para Meia Maratona 2027 com hidratação e carbogel.",
              cooldownKm: 1.0,
              targetZones: ["Z2"],
            }
          : undefined,
    },
  ];
}

/**
 * 2027 Target Race Season Evaluation & Tapering Engine
 * INDIVIDUALIZADO PARA DANIEL vs PATRÍCIA:
 * - Daniel: Meia Maratona SP 2027, Nike SP City 21k, Meia Praia Grande
 * - Patrícia: Circuito das Estações 10K, Meia Revezamento Casal 21k, Desafio Noturno 5K
 */
export function evaluateRaceCalendar(
  currentDateStr: string = "2026-10-17",
  profile: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN" = "DANIEL"
) {
  const isPatricia = profile === "PATRICIA";
  const isGabriel = profile === "GABRIEL";

  let races: Array<{
    id: string;
    name: string;
    priority: "P1_TARGET" | "P2_PREP" | "P3_FUN_PARTY";
    distanceKm: number;
    date: string | null;
    isTbd: boolean;
    estimatedWindowMonth?: string;
    location: string;
    targetPaceMinKm: string;
    targetFinishTime: string;
    taperingWeeks: number;
    carbLoadingDays: number;
    raceStartTime?: string;
  }> = [];

  if (isGabriel) {
    races = [
      {
        id: "race-gabriel-olga-kos-2026",
        name: "Corrida Olga Kos 2026 (10k)",
        priority: "P2_PREP" as const,
        distanceKm: 10.0,
        date: "2026-12-20",
        isTbd: false,
        location: "São Paulo, SP - Ibirapuera",
        targetPaceMinKm: "4:40",
        targetFinishTime: "00:46:40",
        taperingWeeks: 1,
        carbLoadingDays: 2,
        raceStartTime: "07:00",
      },
      {
        id: "race-gabriel-athenas-2027",
        name: "Circuito Athenas SP 2027 (10k)",
        priority: "P1_TARGET" as const,
        distanceKm: 10.0,
        date: "2027-05-23",
        isTbd: false,
        location: "São Paulo, SP - Pacaembu",
        targetPaceMinKm: "4:25",
        targetFinishTime: "00:44:10",
        taperingWeeks: 2,
        carbLoadingDays: 2,
        raceStartTime: "06:30",
      },
    ];
  } else if (isPatricia) {
    races = [
      {
        id: "race-patricia-athenas-14k-2026",
        name: "Athenas Mizuno Run Longer (14k) • AMANHÃ!",
        priority: "P1_TARGET" as const,
        distanceKm: 14.0,
        date: "2026-10-18",
        isTbd: false,
        location: "São Paulo, SP - Marginal Pinheiros",
        targetPaceMinKm: "5:55",
        targetFinishTime: "01:22:50",
        taperingWeeks: 1,
        carbLoadingDays: 3,
        raceStartTime: "06:30",
      },
      {
        id: "race-patricia-venus-21k-2026",
        name: "Meia Maratona Vênus 2026 (21k)",
        priority: "P1_TARGET" as const,
        distanceKm: 21.097,
        date: "2026-11-22",
        isTbd: false,
        location: "São Paulo, SP - Jockey Club",
        targetPaceMinKm: "6:05",
        targetFinishTime: "02:08:20",
        taperingWeeks: 2,
        carbLoadingDays: 3,
        raceStartTime: "06:30",
      },
      {
        id: "race-patricia-olga-kos-2026",
        name: "Corrida Olga Kos 2026 (10k)",
        priority: "P2_PREP" as const,
        distanceKm: 10.0,
        date: "2026-12-20",
        isTbd: false,
        location: "São Paulo, SP - Pacaembu",
        targetPaceMinKm: "5:50",
        targetFinishTime: "00:58:20",
        taperingWeeks: 1,
        carbLoadingDays: 2,
        raceStartTime: "07:00",
      },
      {
        id: "race-patricia-athenas-14k-2027",
        name: "Athenas Mizuno Run Longer 2027 (14k)",
        priority: "P1_TARGET" as const,
        distanceKm: 14.0,
        date: "2027-10-17",
        isTbd: false,
        location: "São Paulo, SP",
        targetPaceMinKm: "5:45",
        targetFinishTime: "01:20:30",
        taperingWeeks: 2,
        carbLoadingDays: 3,
        raceStartTime: "06:30",
      },
      {
        id: "race-patricia-venus-21k-2027",
        name: "Meia Maratona Vênus 2027 (21k)",
        priority: "P1_TARGET" as const,
        distanceKm: 21.097,
        date: "2027-11-21",
        isTbd: false,
        location: "São Paulo, SP - Jockey Club",
        targetPaceMinKm: "5:55",
        targetFinishTime: "02:04:50",
        taperingWeeks: 3,
        carbLoadingDays: 3,
        raceStartTime: "06:30",
      },
      {
        id: "race-patricia-olga-kos-2027",
        name: "Corrida Olga Kos 2027 (10k)",
        priority: "P2_PREP" as const,
        distanceKm: 10.0,
        date: "2027-12-19",
        isTbd: false,
        location: "São Paulo, SP - Ibirapuera",
        targetPaceMinKm: "5:40",
        targetFinishTime: "00:56:40",
        taperingWeeks: 1,
        carbLoadingDays: 2,
        raceStartTime: "07:00",
      },
    ];
  } else {
    // DANIEL
    races = [
      {
        id: "race-daniel-athenas-21k-2026",
        name: "Athenas Mizuno Run Longer (21k) • AMANHÃ!",
        priority: "P1_TARGET" as const,
        distanceKm: 21.097,
        date: "2026-10-18",
        isTbd: false,
        location: "São Paulo, SP - Marginal Pinheiros",
        targetPaceMinKm: "5:26",
        targetFinishTime: "01:54:40",
        taperingWeeks: 2,
        carbLoadingDays: 3,
        raceStartTime: "05:30",
      },
      {
        id: "race-daniel-olga-kos-2026",
        name: "Corrida Olga Kos 2026 (10k)",
        priority: "P2_PREP" as const,
        distanceKm: 10.0,
        date: "2026-12-20",
        isTbd: false,
        location: "São Paulo, SP - Pacaembu",
        targetPaceMinKm: "5:00",
        targetFinishTime: "00:50:00",
        taperingWeeks: 1,
        carbLoadingDays: 2,
        raceStartTime: "07:00",
      },
      {
        id: "race-sp-inter-2027",
        name: "Maratona Internacional de São Paulo 2027 (Meia 21k)",
        priority: "P1_TARGET" as const,
        distanceKm: 21.097,
        date: "2027-04-11",
        isTbd: false,
        location: "São Paulo, SP - Ibirapuera",
        targetPaceMinKm: "5:20",
        targetFinishTime: "01:52:30",
        taperingWeeks: 3,
        carbLoadingDays: 3,
        raceStartTime: "06:15",
      },
      {
        id: "race-nike-sp-city-2027",
        name: "Nike SP City Marathon 2027 (Meia 21k)",
        priority: "P1_TARGET" as const,
        distanceKm: 21.097,
        date: "2027-07-25",
        isTbd: false,
        location: "São Paulo, SP - Pacaembu / Jockey",
        targetPaceMinKm: "5:15",
        targetFinishTime: "01:50:45",
        taperingWeeks: 3,
        carbLoadingDays: 3,
        raceStartTime: "06:00",
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
        targetPaceMinKm: "5:25",
        targetFinishTime: "01:54:15",
        taperingWeeks: 2,
        carbLoadingDays: 2,
        raceStartTime: "06:45",
      },
    ];
  }

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

/**
 * Retorna as especificações de Grife e Telemetria para cada Atleta do Clã
 */
export function getProfileSpecs(profile: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN") {
  // GABRIEL (Palmeiras 🟢⚪, 20 anos, Jovem Atleta 5k/10k)
  if (profile === "GABRIEL") {
    return {
      id: "GABRIEL" as const,
      name: "Gabriel Souto Maior",
      tagline: "Atleta Alviverde & Velocidade 5K/10K",
      birthDate: "15/08/2006",
      ageYears: 20,
      phone: "5511988139833", // Comunicação Clã
      club: "Palmeiras" as const,
      clubName: "Sociedade Esportiva Palmeiras",
      clubBadge: "Verdão Alviverde Imponente 🟢⚪",
      clubStadium: "Allianz Parque (São Paulo)",
      clubColors: {
        accent: "emerald",
        border: "border-emerald-500/40",
        bgBadge: "bg-emerald-950/40",
        text: "text-emerald-400",
        gradient: "from-emerald-600 via-green-600 to-teal-500",
        shadow: "shadow-emerald-500/20",
        glow: "rgba(16, 185, 129, 0.25)",
      },
      weightKg: 72.0,
      heightCm: 178,
      bodyFatPct: 14.2,
      hrZones: {
        z1: { min: 120, max: 140, label: "Z1 Regenerativo" },
        z2: { min: 141, max: 160, label: "Z2 Base Aeróbia / Resistência" },
        z3: { min: 161, max: 175, label: "Z3 Ritmo de Prova 10K" },
        z4: { min: 176, max: 188, label: "Z4 Limiar Anaeróbio / Tiros" },
        z5: { min: 189, max: 202, label: "Z5 VO2 Max Máximo" },
      },
      paces: {
        z1Recovery: "5:50 - 6:30 min/km",
        z2Base: "5:00 - 5:40 min/km",
        z3Tempo: "4:30 - 4:55 min/km",
        z4Threshold: "4:00 - 4:25 min/km",
        treadmillZ2Speed: "11.0 - 12.0 km/h (1.0% inclinação)",
      },
      primaryRace: {
        name: "Circuito Athenas SP 2027 (10k)",
        date: "Maio/2027",
        distance: "10.0 km",
        targetPace: "4:30 min/km",
        targetFinish: "Sub-45min",
        location: "São Paulo, SP",
      },
      secondaryRace: {
        name: "Corrida Olga Kos 2026 (10k)",
        date: "Dezembro/2026",
        distance: "10.0 km",
        targetPace: "4:40 min/km",
      },
      hardware: {
        device: "GPS Smartwatch Gabriel",
        stravaAthlete: "Gabriel Souto Maior (Strava)",
        intervalsId: "GABRIEL_ATHLETE",
      },
      nutritionTaco: {
        caloricTargetKcal: 2750,
        proteinG: 175,
        carbsG: 340,
        fatsG: 75,
        familyPlateSharePct: 35,
        familyPlateShareText: "Energia Jovem & Hipertrofia",
      },
      clinicalSafe: {
        hasProsthesis: false,
        shoulderSafe: false,
        notes: "Jovem atleta de 20 anos, sem restrições articulares. Foco em potência e hipertrofia.",
      },
    };
  }

  // PATRÍCIA (Grêmio 🔵⚪, 56 anos, Meia Maratona & 14k)
  if (profile === "PATRICIA") {
    return {
      id: "PATRICIA" as const,
      name: "Patrícia Lopes",
      tagline: "Atleta de Alta Performance Feminina & Recomposição",
      birthDate: "04/07/1970",
      ageYears: 56,
      phone: "5511988136702",
      club: "Grêmio" as const,
      clubName: "Grêmio Foot-Ball Porto Alegrense",
      clubBadge: "Imortal Tricolor 🔵⚪⚫",
      clubStadium: "Arena do Grêmio (Porto Alegre)",
      clubColors: {
        accent: "sky",
        border: "border-sky-500/40",
        bgBadge: "bg-sky-950/40",
        text: "text-sky-400",
        gradient: "from-sky-600 via-blue-500 to-cyan-400",
        shadow: "shadow-sky-500/20",
        glow: "rgba(14, 165, 233, 0.25)",
      },
      weightKg: 58.0,
      heightCm: 162,
      bodyFatPct: 22.8,
      hrZones: {
        z1: { min: 112, max: 128, label: "Z1 Regenerativo" },
        z2: { min: 129, max: 145, label: "Z2 Base Aeróbia / Queima Lipídica" },
        z3: { min: 146, max: 158, label: "Z3 Ritmo Prova 14K / 21K" },
        z4: { min: 159, max: 169, label: "Z4 Limiar Anaeróbio / Tiros" },
        z5: { min: 170, max: 182, label: "Z5 VO2 Max Máximo" },
      },
      paces: {
        z1Recovery: "8:20 - 8:50 min/km",
        z2Base: "7:45 - 8:15 min/km",
        z3Tempo: "7:10 - 7:30 min/km",
        z4Threshold: "6:45 - 7:05 min/km",
        treadmillZ2Speed: "7.4 - 8.0 km/h (1.0% inclinação)",
      },
      primaryRace: {
        name: "Athenas Mizuno Run Longer (14k) • CONCLUÍDA HOJE!",
        date: "18/10/2026",
        distance: "14.0 km",
        targetPace: "7:21 min/km",
        targetFinish: "01:43:02",
        location: "São Paulo, SP - Marginal Pinheiros",
        isTomorrow: false,
      },
      secondaryRace: {
        name: "Meia Maratona Vênus 21k & Olga Kos (2026)",
        date: "Novembro/Dezembro 2026",
        distance: "21.097 km",
        targetPace: "6:05 min/km",
      },
      enrolledRaces2027: [
        { name: "Athenas Mizuno Run Longer 14k 2027", distance: "14.0 km", priority: "P1" },
        { name: "Meia Maratona Vênus 21k 2027", distance: "21.097 km", priority: "P1" },
        { name: "Corrida Olga Kos 2027", distance: "10.0 km", priority: "P2" },
      ],
      hardware: {
        device: "Smartwatch Patrícia",
        stravaAthlete: "Patrícia Lopes (Strava Pro)",
        intervalsId: "PATRICIA_WATCH",
      },
      nutritionTaco: {
        caloricTargetKcal: 1780,
        proteinG: 120,
        carbsG: 185,
        fatsG: 48,
        familyPlateSharePct: 42,
        familyPlateShareText: "42% da Panela Familiar",
      },
      clinicalSafe: {
        hasProsthesis: false,
        shoulderSafe: false,
        notes: "Membros superiores e ombros 100% livres para amplitude máxima.",
      },
    };
  }

  // DANIEL (Flamengo 🔴⚫, 52 anos, Prótese Reversa Ombro Direito)
  return {
    id: "DANIEL" as const,
    name: "Daniel Souto Lopes",
    tagline: "Maratonista Híbrido 21k & Prótese Reversa de Ombro",
    birthDate: "02/05/1974",
    ageYears: 52,
    phone: "5511988139833",
    club: "Flamengo" as const,
    clubName: "Clube de Regatas do Flamengo",
    clubBadge: "Mengão Rubro-Negro 🔴⚫",
    clubStadium: "Maracanã (Rio de Janeiro)",
    clubColors: {
      accent: "red",
      border: "border-red-500/40",
      bgBadge: "bg-red-950/40",
      text: "text-red-400",
      gradient: "from-red-600 via-rose-600 to-amber-600",
      shadow: "shadow-red-500/20",
      glow: "rgba(239, 68, 68, 0.25)",
    },
    weightKg: 80.0,
    heightCm: 170,
    bodyFatPct: 18.5,
    hrZones: {
      z1: { min: 108, max: 124, label: "Z1 Recuperação Ativa" },
      z2: { min: 125, max: 141, label: "Z2 Base Aeróbia / Mitocondrial" },
      z3: { min: 142, max: 154, label: "Z3 Ritmo Alvo Meia Maratona" },
      z4: { min: 155, max: 167, label: "Z4 Limiar de Lactato" },
      z5: { min: 168, max: 182, label: "Z5 Capacidade Anaeróbia" },
    },
    paces: {
      z1Recovery: "6:45 - 7:15 min/km",
      z2Base: "5:50 - 6:20 min/km",
      z3Tempo: "5:15 - 5:45 min/km",
      z4Threshold: "4:40 - 5:10 min/km",
      treadmillZ2Speed: "9.7 - 10.3 km/h (1.0% inclinação)",
    },
    primaryRace: {
      name: "Athenas Mizuno Run Longer (21k) • Amanhã!",
      date: "18/10/2026",
      distance: "21.097 km",
      targetPace: "5:26 min/km",
      targetFinish: "01:54:40",
      location: "São Paulo, SP",
      isTomorrow: true,
    },
    secondaryRace: {
      name: "Corrida Olga Kos 2026 (10k)",
      date: "Dezembro/2026",
      distance: "10.0 km",
      targetPace: "5:00 min/km",
    },
    enrolledRaces2027: [
      { name: "Maratona Internacional de SP 2027 (Meia 21k)", distance: "21.097 km", priority: "P1" },
      { name: "Nike SP City Marathon 2027 (Meia 21k)", distance: "21.097 km", priority: "P1" },
      { name: "Corrida Olga Kos 2027", distance: "10.0 km", priority: "P2" },
    ],
    hardware: {
      device: "Galaxy Watch Ultra (47mm Titanium)",
      stravaAthlete: "Daniel Souto Lopes (ID: 203901)",
      intervalsId: "I753639",
    },
    nutritionTaco: {
      caloricTargetKcal: 2350,
      proteinG: 165,
      carbsG: 260,
      fatsG: 65,
      familyPlateSharePct: 58,
      familyPlateShareText: "58% da Panela Familiar",
    },
    clinicalSafe: {
      hasProsthesis: true,
      shoulderSide: "RIGHT",
      notes: "Prótese reversa glenoumeral no ombro direito. Zero sobrecargas overhead e zero supino reto barra.",
    },
  };
}

/**
 * Calibrador de Ritmo Base (Base Pace Recalibrator):
 * Utiliza o tempo oficial da prova de amanhã (Athenas Mizuno Run Longer) para recalibrar
 * os ritmos de treino Z1-Z5 e projetar os tempos das próximas provas (Fórmula de Riegel).
 */
export function calculateBasePaceRecalibration(distanceKm: number, finishTimeSeconds: number) {
  const paceSecondsPerKm = finishTimeSeconds / distanceKm;
  const paceMin = Math.floor(paceSecondsPerKm / 60);
  const paceSec = Math.round(paceSecondsPerKm % 60);
  const basePaceFormatted = `${paceMin}:${paceSec.toString().padStart(2, "0")} min/km`;

  // Fórmula de Riegel: T2 = T1 * (D2 / D1)^1.06
  const predictTime = (targetDistKm: number) => {
    const predictedSec = finishTimeSeconds * Math.pow(targetDistKm / distanceKm, 1.06);
    const hrs = Math.floor(predictedSec / 3600);
    const mins = Math.floor((predictedSec % 3600) / 60);
    const secs = Math.round(predictedSec % 60);
    const pacePerKmSec = predictedSec / targetDistKm;
    const pM = Math.floor(pacePerKmSec / 60);
    const pS = Math.round(pacePerKmSec % 60);

    return {
      distanceKm: targetDistKm,
      timeFormatted: hrs > 0 
        ? `${hrs}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`
        : `${mins}m ${secs.toString().padStart(2, "0")}s`,
      paceFormatted: `${pM}:${pS.toString().padStart(2, "0")} min/km`,
      totalSeconds: Math.round(predictedSec),
    };
  };

  // Recalibra as 5 zonas de treino baseadas no tempo oficial
  // Z3 (Ritmo Limiar/Meia) = base pace (~100%)
  // Z2 (Base Aeróbia) = base pace + 30s a 50s
  // Z1 (Regenerativo) = base pace + 60s a 90s
  // Z4 (Limiar Lactato) = base pace - 20s a 30s
  // Z5 (VO2 Max) = base pace - 40s a 60s
  const formatPaceRange = (deltaMin: number, deltaMax: number) => {
    const s1 = paceSecondsPerKm + deltaMin;
    const s2 = paceSecondsPerKm + deltaMax;
    const m1 = Math.floor(s1 / 60);
    const sec1 = Math.round(s1 % 60);
    const m2 = Math.floor(s2 / 60);
    const sec2 = Math.round(s2 % 60);
    return `${m1}:${sec1.toString().padStart(2, "0")} - ${m2}:${sec2.toString().padStart(2, "0")} min/km`;
  };

  const speedKmhForPace = (paceSecKm: number) => (3600 / paceSecKm).toFixed(1);

  return {
    distanceKm,
    finishTimeSeconds,
    basePaceFormatted,
    recalibratedZones: {
      z1Recovery: {
        label: "Z1 Regenerativo & Recuperação Ativa",
        paceRange: formatPaceRange(60, 90),
        treadmillSpeedKmh: `${speedKmhForPace(paceSecondsPerKm + 90)} - ${speedKmhForPace(paceSecondsPerKm + 60)} km/h`,
      },
      z2Base: {
        label: "Z2 Base Aeróbia & Lipólise Mitocondrial",
        paceRange: formatPaceRange(30, 55),
        treadmillSpeedKmh: `${speedKmhForPace(paceSecondsPerKm + 55)} - ${speedKmhForPace(paceSecondsPerKm + 30)} km/h`,
      },
      z3Tempo: {
        label: "Z3 Ritmo de Prova / Tempo Run",
        paceRange: formatPaceRange(-5, 20),
        treadmillSpeedKmh: `${speedKmhForPace(paceSecondsPerKm + 20)} - ${speedKmhForPace(paceSecondsPerKm - 5)} km/h`,
      },
      z4Threshold: {
        label: "Z4 Limiar de Lactato (Tiros Longos)",
        paceRange: formatPaceRange(-35, -15),
        treadmillSpeedKmh: `${speedKmhForPace(paceSecondsPerKm - 15)} - ${speedKmhForPace(paceSecondsPerKm - 35)} km/h`,
      },
      z5Vo2Max: {
        label: "Z5 VO2 Max (Potência Anaeróbia / Tiros Curtos)",
        paceRange: formatPaceRange(-60, -40),
        treadmillSpeedKmh: `${speedKmhForPace(paceSecondsPerKm - 40)} - ${speedKmhForPace(paceSecondsPerKm - 60)} km/h`,
      },
    },
    projections: {
      race5k: predictTime(5.0),
      race10k: predictTime(10.0),
      race14k: predictTime(14.0),
      race21k: predictTime(21.097),
      race42k: predictTime(42.195),
    },
  };
}
