import { ProfileId, RaceLogisticsPlan, RaceMorningScheduleStep, RaceVenuePreset, TargetRaceItem } from "./types";

export const MARACA_HOME_ADDRESS = "Rua Maracá, 132, São Paulo, SP, CEP 04313-210";

export const DEFAULT_RACE_VENUE_PRESETS: RaceVenuePreset[] = [
  {
    id: "athenas_marginal",
    name: "Athenas Mizuno Run Longer (21k / 14k / 7k)",
    locationLabel: "Marginal Pinheiros (Parque do Povo / Estação Cidade Jardim)",
    distanceKmFromMaraca: 14.2,
    estimatedDriveMinutesSundayMorning: 22,
    parkingBufferMinutes: 10,
    notes: "Trajeto rápido via Av. dos Bandeirantes ou Av. Eng. Luís Carlos Berrini. Vagas no Parque do Povo / Shopping JK.",
    defaultRaceStartTime: "06:30",
  },
  {
    id: "ibirapuera_obelisco",
    name: "Meia Maratona Internacional de SP / Circuito das Estações",
    locationLabel: "Parque Ibirapuera (Monumento às Bandeiras / Obelisco)",
    distanceKmFromMaraca: 7.8,
    estimatedDriveMinutesSundayMorning: 14,
    parkingBufferMinutes: 10,
    notes: "Trajeto via Av. Jabaquara e Corredor Norte-Sul / Rubem Berta. Acesso pelo portão 3 do Ibirapuera.",
    defaultRaceStartTime: "06:30",
  },
  {
    id: "usp_relogio",
    name: "Maratona de SP / Provas USP Run",
    locationLabel: "Cidade Universitária - USP (Praça do Relógio Solar)",
    distanceKmFromMaraca: 18.5,
    estimatedDriveMinutesSundayMorning: 26,
    parkingBufferMinutes: 12,
    notes: "Trajeto via Av. dos Bandeirantes e Marginal Pinheiros sentido Castelo Branco. Portão 1 ou Portão 3.",
    defaultRaceStartTime: "06:30",
  },
  {
    id: "pacaembu_miller",
    name: "Troféu Cidade de SP / Meia do Pacaembu",
    locationLabel: "Estádio do Pacaembu (Praça Charles Miller)",
    distanceKmFromMaraca: 12.8,
    estimatedDriveMinutesSundayMorning: 20,
    parkingBufferMinutes: 10,
    notes: "Trajeto via Corredor 23 de Maio e Av. Pacaembu. Chegar cedo para vagas na Praça Charles Miller.",
    defaultRaceStartTime: "07:00",
  },
  {
    id: "jockey_club",
    name: "Meia Maratona Vênus / Provas Jockey Club",
    locationLabel: "Jockey Club de São Paulo (Av. Lineu de Paula Machado)",
    distanceKmFromMaraca: 13.5,
    estimatedDriveMinutesSundayMorning: 20,
    parkingBufferMinutes: 10,
    notes: "Trajeto via Av. dos Bandeirantes / Ponte Cidade Jardim. Estacionamento dentro do Jockey ou transversais.",
    defaultRaceStartTime: "06:30",
  },
  {
    id: "minhocao_elevado",
    name: "Corrida do Centro Histórico / Elevado Minhocão",
    locationLabel: "Elevado Presidente João Goulart (Minhocão)",
    distanceKmFromMaraca: 13.9,
    estimatedDriveMinutesSundayMorning: 21,
    parkingBufferMinutes: 11,
    notes: "Trajeto via Corredor Norte-Sul. Acesso pela rampa da Rua Amaral Gurgel / Consolação.",
    defaultRaceStartTime: "07:00",
  },
  {
    id: "sao_silvestre_paulista",
    name: "Corrida Internacional de São Silvestre (31/Dezembro)",
    locationLabel: "Avenida Paulista (Masp / Trianon)",
    distanceKmFromMaraca: 11.4,
    estimatedDriveMinutesSundayMorning: 18,
    parkingBufferMinutes: 15,
    notes: "Trajeto via Av. 23 de Maio / Rua Tutóia / Paulista. Estacionamentos nas transversais da Paulista.",
    defaultRaceStartTime: "07:30",
  },
];

/**
 * Intelligent geocoding and transit heuristics based on the venue location string
 */
export function resolveVenueMetrics(locationString: string): {
  distanceKm: number;
  driveMinutes: number;
  parkingMinutes: number;
  matchedPresetId: string;
  cleanedLabel: string;
} {
  const loc = (locationString || "").toLowerCase();

  if (loc.includes("marginal") || loc.includes("pinheiros") || loc.includes("povo") || loc.includes("jk") || loc.includes("athenas")) {
    return {
      distanceKm: 14.2,
      driveMinutes: 22,
      parkingMinutes: 10,
      matchedPresetId: "athenas_marginal",
      cleanedLabel: "Marginal Pinheiros (Parque do Povo / Estação Cidade Jardim)",
    };
  }

  if (loc.includes("ibirapuera") || loc.includes("obelisco") || loc.includes("bandeiras") || loc.includes("estacoes")) {
    return {
      distanceKm: 7.8,
      driveMinutes: 14,
      parkingMinutes: 10,
      matchedPresetId: "ibirapuera_obelisco",
      cleanedLabel: "Parque Ibirapuera (Monumento às Bandeiras / Obelisco)",
    };
  }

  if (loc.includes("pacaembu") || loc.includes("charles miller") || loc.includes("olga kos")) {
    return {
      distanceKm: 12.8,
      driveMinutes: 20,
      parkingMinutes: 10,
      matchedPresetId: "pacaembu_miller",
      cleanedLabel: "Estádio do Pacaembu (Praça Charles Miller)",
    };
  }

  if (loc.includes("usp") || loc.includes("universitária") || loc.includes("relogio") || loc.includes("relógio")) {
    return {
      distanceKm: 18.5,
      driveMinutes: 26,
      parkingMinutes: 12,
      matchedPresetId: "usp_relogio",
      cleanedLabel: "Cidade Universitária - USP (Praça do Relógio Solar)",
    };
  }

  if (loc.includes("jockey") || loc.includes("venus") || loc.includes("vênus") || loc.includes("lineu")) {
    return {
      distanceKm: 13.5,
      driveMinutes: 20,
      parkingMinutes: 10,
      matchedPresetId: "jockey_club",
      cleanedLabel: "Jockey Club de São Paulo (Av. Lineu de Paula Machado)",
    };
  }

  if (loc.includes("minhocao") || loc.includes("minhocão") || loc.includes("elevado")) {
    return {
      distanceKm: 13.9,
      driveMinutes: 21,
      parkingMinutes: 11,
      matchedPresetId: "minhocao_elevado",
      cleanedLabel: "Elevado Presidente João Goulart (Minhocão)",
    };
  }

  if (loc.includes("paulista") || loc.includes("silvestre") || loc.includes("masp")) {
    return {
      distanceKm: 11.4,
      driveMinutes: 18,
      parkingMinutes: 15,
      matchedPresetId: "sao_silvestre_paulista",
      cleanedLabel: "Avenida Paulista (Masp / Trianon)",
    };
  }

  // Default fallback for any generic São Paulo street race
  return {
    distanceKm: 14.0,
    driveMinutes: 22,
    parkingMinutes: 10,
    matchedPresetId: "custom",
    cleanedLabel: locationString || "Arena de Prova em São Paulo",
  };
}

/**
 * Intelligent default start time heuristic based on distance and race type
 */
export function resolveRaceDefaultStartTime(distanceKm: number, raceName: string): string {
  const name = (raceName || "").toLowerCase();
  if (name.includes("silvestre")) return "07:30";
  if (name.includes("noturna") || name.includes("night")) return "19:00";
  if (distanceKm >= 42) return "06:00"; // Marathon early morning
  if (distanceKm >= 21) return "06:30"; // Half marathon standard
  if (distanceKm <= 10) return "07:00"; // 5k/10k races typically start at 07h00
  return "06:30";
}

/**
 * Format minutes offset to HH:MM string from a base Date
 */
function formatTimeFromDate(d: Date): string {
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Parses "HH:MM" into a Date anchored today
 */
function parseTimeString(timeStr: string): Date {
  const [h, m] = (timeStr || "06:30").split(":").map(Number);
  const d = new Date();
  d.setHours(isNaN(h) ? 6 : h, isNaN(m) ? 30 : m, 0, 0);
  return d;
}

export interface CalculateScheduleOptions {
  raceStartTime?: string; // "06:30", "07:00", etc.
  selectedPresetId?: string; // "athenas_marginal", etc.
  customVenueName?: string;
  customDistanceKm?: number;
  customDriveMinutes?: number;
  venueArrivalBufferMinutes?: number; // Default 60 as requested (+1 hour)
  breakfastMinutes?: number; // Default 30 min
  raceName?: string;
  raceDate?: string;
  athleteId?: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN";
  hotBeveragePreference?: "CAFEZINHO" | "MATE" | "BOTH";
}

/**
 * Core Dynamic Logistics Engine:
 * Adaptable to ANY race scheduled in the system, calculating the exact reverse countdown
 * from race gun time down to the circadian sunrise lighting ramp.
 */
export function calculateRaceMorningSchedule(
  options: CalculateScheduleOptions = {}
): RaceLogisticsPlan {
  const {
    raceStartTime = "06:30",
    selectedPresetId,
    customVenueName,
    customDistanceKm,
    customDriveMinutes,
    venueArrivalBufferMinutes = 60, // Exactly 1 hour before gun, as requested
    breakfastMinutes = 30,
    raceName = "Athenas Mizuno Run Longer (21k/14k)",
    raceDate,
    athleteId = "DANIEL",
    hotBeveragePreference,
  } = options;

  // Determine venue metrics automatically if preset or custom name is provided
  let destinationVenue = customVenueName || "";
  let distanceKm = customDistanceKm;
  let estimatedDriveMinutes = customDriveMinutes;
  let parkingBufferMinutes = 10;

  if (selectedPresetId && selectedPresetId !== "custom") {
    const preset = DEFAULT_RACE_VENUE_PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) {
      destinationVenue = customVenueName || preset.locationLabel;
      distanceKm = customDistanceKm ?? preset.distanceKmFromMaraca;
      estimatedDriveMinutes = customDriveMinutes ?? preset.estimatedDriveMinutesSundayMorning;
      parkingBufferMinutes = preset.parkingBufferMinutes;
    }
  } else if (customVenueName) {
    const resolved = resolveVenueMetrics(customVenueName);
    destinationVenue = customVenueName;
    distanceKm = customDistanceKm ?? resolved.distanceKm;
    estimatedDriveMinutes = customDriveMinutes ?? resolved.driveMinutes;
    parkingBufferMinutes = resolved.parkingMinutes;
  } else {
    // Default fallback
    const preset = DEFAULT_RACE_VENUE_PRESETS[0];
    destinationVenue = preset.locationLabel;
    distanceKm = preset.distanceKmFromMaraca;
    estimatedDriveMinutes = preset.estimatedDriveMinutesSundayMorning;
    parkingBufferMinutes = preset.parkingBufferMinutes;
  }

  const finalDistanceKm = distanceKm ?? 14.2;
  const finalDriveMinutes = estimatedDriveMinutes ?? 22;
  const totalTransitMinutes = finalDriveMinutes + parkingBufferMinutes;

  // Base Gun Time
  const gunDate = parseTimeString(raceStartTime);

  // Target Venue Arrival Time (Gun - 60 minutes) -> The Golden Rule!
  const arrivalDate = new Date(gunDate.getTime() - venueArrivalBufferMinutes * 60 * 1000);

  // Home Departure Time (Arrival - Transit)
  const departureDate = new Date(arrivalDate.getTime() - totalTransitMinutes * 60 * 1000);

  // Eco All Off & Departure
  const allOffDate = new Date(departureDate.getTime());

  // Gear & Checklist Final Review (8 min before departure)
  const gearReviewDate = new Date(departureDate.getTime() - 8 * 60 * 1000);

  // Breakfast Start (30 min duration)
  const breakfastStartDate = new Date(gearReviewDate.getTime() - breakfastMinutes * 60 * 1000);

  // Closet LEDs on (5 min before breakfast, dress uniform & carbon plate shoes)
  const closetDate = new Date(breakfastStartDate.getTime() - 5 * 60 * 1000);

  // Dual Plug Hot Beverages (10 min before breakfast)
  const hotDrinksDate = new Date(breakfastStartDate.getTime() - 10 * 60 * 1000);

  // Athlete Audio Briefing & Alarm (5 min before beverages)
  const alarmDate = new Date(hotDrinksDate.getTime() - 5 * 60 * 1000);

  // Circadian Sunrise Gradual Light Ramp-Up (10 min before alarm)
  const sunriseDate = new Date(alarmDate.getTime() - 10 * 60 * 1000);

  // Ideal Bedtime calculation (8 hours before sunrise wake-up)
  const bedtimeDate = new Date(sunriseDate.getTime() - 8 * 60 * 60 * 1000);

  // Determine beverage tailoring
  const bevChoice =
    hotBeveragePreference ||
    (athleteId === "PATRICIA" ? "MATE" : athleteId === "DANIEL" ? "CAFEZINHO" : "BOTH");

  // Build deep links
  const originEncoded = encodeURIComponent(MARACA_HOME_ADDRESS);
  const destEncoded = encodeURIComponent(`${destinationVenue}, São Paulo, SP`);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${destEncoded}&travelmode=driving`;
  const wazeUrl = `https://waze.com/ul?q=${destEncoded}&navigate=yes`;

  // Beverage description tailored to athlete
  const beverageStepDesc =
    bevChoice === "CAFEZINHO"
      ? "Tomada Dupla (ebc4a8285904c4bd43crx7) aciona o Canal 1 (switch_1) ligando a cafeteira de Daniel com auto-off de 15 min. Pico plasmático de cafeína anidra (3mg/kg) sincronizado para a largada às " +
        raceStartTime +
        "."
      : bevChoice === "MATE"
      ? "Tomada Dupla (ebc4a8285904c4bd43crx7) aciona o Canal 2 (switch_2) ligando a chaleira de Mate da Patrícia com auto-off de 10 min. Infusão quente rica em polifenóis termogênicos para a corrida."
      : "Tomada Dupla (ebc4a8285904c4bd43crx7) aciona ambos os canais simultaneamente: Canal 1 (switch_1) cafezinho de Daniel e Canal 2 (switch_2) chaleira de Mate da Patrícia para o aquecimento conjunto.";

  // Step-by-Step Chronological Plan
  const steps: RaceMorningScheduleStep[] = [
    {
      id: "step-sunrise",
      timestamp: formatTimeFromDate(sunriseDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - sunriseDate.getTime()) / 60000),
      relativeMinutesToDeparture: -Math.round(
        (departureDate.getTime() - sunriseDate.getTime()) / 60000
      ),
      category: "CIRCADIAN",
      title: "Alvorada Solar Circadiana (Quarto do Casal)",
      description:
        "Leds do Quarto (eb4deff019cb6627614ic8) e Luz Casal acendem suavemente em tom âmbar 2700K (15% subindo para 60%). O Ar-Condicionado ajusta a temperatura para elevar o metabolismo basal naturalmente sem taquicardia.",
      tuyaAction: "SUNRISE_LONG_RUN",
      tuyaDeviceLabel: "Led Quarto + Luz Casal",
      badgeLabel: "Circadiano",
    },
    {
      id: "step-alarm",
      timestamp: formatTimeFromDate(alarmDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - alarmDate.getTime()) / 60000),
      relativeMinutesToDeparture: -Math.round(
        (departureDate.getTime() - alarmDate.getTime()) / 60000
      ),
      category: "CIRCADIAN",
      title: "Despertar do Atleta & Briefing de Voz",
      description: `Alarme suave e briefing falado no app com previsão de temperatura no local (${destinationVenue}), umidade e orientações de pace para ${raceName}.`,
      badgeLabel: "Despertar",
    },
    {
      id: "step-beverages",
      timestamp: formatTimeFromDate(hotDrinksDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - hotDrinksDate.getTime()) / 60000),
      relativeMinutesToDeparture: -Math.round(
        (departureDate.getTime() - hotDrinksDate.getTime()) / 60000
      ),
      category: "NUTRITION",
      title: "Preparo Automatizado: Tomada Dupla Tuya",
      description: beverageStepDesc,
      tuyaAction: bevChoice === "MATE" ? "MATE_ON" : bevChoice === "CAFEZINHO" ? "CAFEZINHO_ON" : "BEBIDAS_DUAL_ON",
      tuyaDeviceLabel: `Tomada Dupla (${bevChoice === "MATE" ? "Mate" : bevChoice === "CAFEZINHO" ? "Cafezinho" : "Café + Mate"})`,
      badgeLabel: "Tomada Dupla Tuya",
    },
    {
      id: "step-closet",
      timestamp: formatTimeFromDate(closetDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - closetDate.getTime()) / 60000),
      relativeMinutesToDeparture: -Math.round(
        (departureDate.getTime() - closetDate.getTime()) / 60000
      ),
      category: "GEAR",
      title: "Iluminação Tática do Closet & Armário",
      description:
        "Led Cabide (eb7e8e6b7909ed343dfawf) e Led Porta acendem em luz branca neutra 4000K (70%), iluminando o kit de uniforme já separado na véspera, tênis com placa de carbono e número de peito sem precisar acender a luz geral.",
      tuyaAction: "CLOSET_ON",
      tuyaDeviceLabel: "Led Cabide + Led Porta",
      badgeLabel: "Closet Leds",
    },
    {
      id: "step-breakfast",
      timestamp: formatTimeFromDate(breakfastStartDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - breakfastStartDate.getTime()) / 60000),
      relativeMinutesToDeparture: -Math.round(
        (departureDate.getTime() - breakfastStartDate.getTime()) / 60000
      ),
      category: "NUTRITION",
      title: "Café da Manhã Estratégico TACO (Pré-Prova)",
      description:
        "Tostada de pão sourdough com pasta de amendoim integral e mel ou banana (carboidrato de fácil esvaziamento gástrico, baixo teor de gordura/fibras) + 400ml de água com eletrólitos (sódio 350mg). Degustação das bebidas quentes preparadas.",
      badgeLabel: "Nutrição TACO",
    },
    {
      id: "step-gear-check",
      timestamp: formatTimeFromDate(gearReviewDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - gearReviewDate.getTime()) / 60000),
      relativeMinutesToDeparture: -Math.round(
        (departureDate.getTime() - gearReviewDate.getTime()) / 60000
      ),
      category: "GEAR",
      title: "Checklist de Saída da Garagem (Rua Maracá, 132)",
      description:
        "Checagem expressa de 6 itens vitais: chip amarrado no tênis, número de peito preso com 4 alfinetes, carbogéis nos bolsos (1 a cada 40 min), vaselina anti-atrito nas axilas/pés, chave do carro e Galaxy Watch carregado.",
      badgeLabel: "Checklist 100%",
    },
    {
      id: "step-departure",
      timestamp: formatTimeFromDate(departureDate),
      relativeMinutesToGun: -Math.round((gunDate.getTime() - departureDate.getTime()) / 60000),
      relativeMinutesToDeparture: 0,
      category: "LOGISTICS",
      title: "Modo 'Fui Correr' & Saída de Carro",
      description:
        "Disparo do modo Eco All-Off: desliga ar-condicionado, cafeteiras e luzes da residência. Saída da garagem na Rua Maracá, 132 com navegação Waze/Google Maps iniciada.",
      tuyaAction: "ECO_ALL_OFF",
      tuyaDeviceLabel: "Casa Inteira Eco All-Off",
      badgeLabel: "Eco All-Off",
    },
    {
      id: "step-drive",
      timestamp: `${formatTimeFromDate(departureDate)} às ${formatTimeFromDate(arrivalDate)}`,
      relativeMinutesToGun: -Math.round((gunDate.getTime() - departureDate.getTime()) / 60000),
      relativeMinutesToDeparture: 0,
      category: "LOGISTICS",
      title: `Deslocamento de Carro (${finalDistanceKm} km • ~${finalDriveMinutes} min)`,
      description: `Trajeto de domingo com tráfego livre da Rua Maracá, 132 até ${destinationVenue}. Margem de manobra e estacionamento de ${parkingBufferMinutes} minutos incluída.`,
      badgeLabel: "Navegação GPS",
    },
    {
      id: "step-venue-arrival",
      timestamp: formatTimeFromDate(arrivalDate),
      relativeMinutesToGun: -venueArrivalBufferMinutes,
      relativeMinutesToDeparture: totalTransitMinutes,
      category: "VENUE",
      title: `Chegada à Arena da Prova (Exatamente 1h Antes!)`,
      description:
        "Chegada com tranquilidade garantida: carro estacionado, uso dos sanitários sem fila quilométrica, hidratação de 150ml, aquecimento articular e neuromuscular de 15 min (trote Z1 + skipping).",
      badgeLabel: "Regra de Ouro (-1h)",
    },
    {
      id: "step-gun-time",
      timestamp: formatTimeFromDate(gunDate),
      relativeMinutesToGun: 0,
      relativeMinutesToDeparture: totalTransitMinutes + venueArrivalBufferMinutes,
      category: "GUN",
      title: `Tiro de Partida Oficial • Largada ${raceStartTime}`,
      description: `Posicionamento no pelotão de pace 15 minutos antes. Ativação do cronômetro oficial Haute Horlogerie no app e disparo da largada para ${raceName}. Boa corrida, Clã Lopes!`,
      badgeLabel: "LARGADA 🏁",
    },
  ];

  return {
    originAddress: MARACA_HOME_ADDRESS,
    destinationVenue,
    raceStartTime,
    distanceKm: finalDistanceKm,
    estimatedDriveMinutes: finalDriveMinutes,
    parkingBufferMinutes,
    totalTransitMinutes,
    venueArrivalTarget: formatTimeFromDate(arrivalDate),
    departureFromHomeTime: formatTimeFromDate(departureDate),
    alarmWakeupTime: formatTimeFromDate(alarmDate),
    circadianSunriseTime: formatTimeFromDate(sunriseDate),
    hotDrinksBrewTime: formatTimeFromDate(hotDrinksDate),
    closetIlluminationTime: formatTimeFromDate(closetDate),
    breakfastTime: formatTimeFromDate(breakfastStartDate),
    departureAllOffTime: formatTimeFromDate(allOffDate),
    wazeUrl,
    googleMapsUrl,
    steps,
    raceName,
    raceDate,
    recommendedBedtime: formatTimeFromDate(bedtimeDate),
    athleteId,
    hotBeveragePreference: bevChoice,
  };
}

/**
 * Builds the vocal Portuguese TTS script for the audio coach to speak aloud
 */
export function generateRaceMorningVoiceBriefing(plan: RaceLogisticsPlan): string {
  const athleteGreeting =
    plan.athleteId === "PATRICIA"
      ? "Atenção Patrícia Lopes!"
      : plan.athleteId === "DANIEL"
      ? "Atenção Daniel Lopes!"
      : "Atenção Clã Lopes!";

  const bevMention =
    plan.hotBeveragePreference === "MATE"
      ? "Seu mate e chimarrão gaúcho na tomada dupla ligam às " + plan.hotDrinksBrewTime
      : plan.hotBeveragePreference === "CAFEZINHO"
      ? "Seu cafezinho expresso na tomada dupla liga às " + plan.hotDrinksBrewTime
      : "Suas bebidas na tomada dupla Tuya, cafezinho e chimarrão, ligam às " + plan.hotDrinksBrewTime;

  return `${athleteGreeting} Cronograma de alvorada inteligente sincronizado para ${plan.raceName || "sua prova"}. 
A largada em ${plan.destinationVenue} está confirmada para as ${plan.raceStartTime}. 
Aplicando a regra de chegada com uma hora de antecedência, nossa meta de chegada à arena é exatamente as ${plan.venueArrivalTarget}. 
O deslocamento da Rua Maracá cento e trinta e dois é de ${plan.distanceKm} quilômetros, estimado em ${plan.totalTransitMinutes} minutos de carro e estacionamento. 
Por isso, a saída pontual da garagem será às ${plan.departureFromHomeTime}. 
A alvorada solar circadiana no quarto começa às ${plan.circadianSunriseTime}. 
${bevMention}. 
Às ${plan.breakfastTime}, nosso café da manhã estratégico da dieta TACO. 
Para garantir oito horas de sono profundo, deite-se na véspera até as ${plan.recommendedBedtime}. 
Tudo planejado com precisão suíça. Tenham uma prova espetacular!`;
}
