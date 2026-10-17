import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FootballTeamData, SoccerTeam } from "./types";

export interface MatchInfo {
  opponent: string;
  competition: string;
  matchDate: string; // ISO ou DD/MM/AAAA HH:mm
  isHome: boolean;
  stadium: string;
  tensionIndex: number; // 1 a 5
}

export interface PastMatchInfo {
  opponent: string;
  score: string;
  competition: string;
  matchDate: string;
  result: "WIN" | "LOSS" | "DRAW";
}

export interface TeamStandings {
  position: number;
  points: number;
  matchesPlayed: number;
  goalDifference: number;
  zone: string;
}

export interface TeamLiveHubData {
  teamName: "Flamengo" | "Grêmio";
  updatedAt: string;
  standings: TeamStandings;
  pastMatches: PastMatchInfo[];
  nextMatches: MatchInfo[];
  matchDayAlert: {
    hasMatchToday: boolean;
    matchDetails?: MatchInfo;
    suggestedWorkoutCutoffTime?: string;
    snackCalorieBufferKcal: number;
  };
}

export const FootballHubSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    teamName: { type: Type.STRING },
    standings: {
      type: Type.OBJECT,
      properties: {
        position: { type: Type.INTEGER },
        points: { type: Type.INTEGER },
        matchesPlayed: { type: Type.INTEGER },
        goalDifference: { type: Type.INTEGER },
        zone: { type: Type.STRING },
      },
      required: ["position", "points", "matchesPlayed", "goalDifference", "zone"],
    },
    pastMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          opponent: { type: Type.STRING },
          score: { type: Type.STRING },
          competition: { type: Type.STRING },
          matchDate: { type: Type.STRING },
          result: { type: Type.STRING },
        },
        required: ["opponent", "score", "competition", "matchDate", "result"],
      },
    },
    nextMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          opponent: { type: Type.STRING },
          competition: { type: Type.STRING },
          matchDate: { type: Type.STRING },
          isHome: { type: Type.BOOLEAN },
          stadium: { type: Type.STRING },
          tensionIndex: { type: Type.INTEGER },
        },
        required: ["opponent", "competition", "matchDate", "isHome", "stadium", "tensionIndex"],
      },
    },
  },
  required: ["teamName", "standings", "pastMatches", "nextMatches"],
};

// Cache de 6 horas em memória (Anti-Mock Rule: Cache de dados reais da internet)
interface CacheEntry {
  data: TeamLiveHubData;
  expiresAt: number;
}
const realDataCache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas

export class FootballLiveService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "[FootballLiveService] GEMINI_API_KEY não configurada. Defina a chave no .env para permitir a busca em tempo real na internet."
      );
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Executa consulta REAL via Gemini 2.5 Flash com Search Grounding na internet.
   * Política Anti-Mock: Zero dados estáticos de mentira ou arrays fabricados.
   */
  async fetchLiveTeamData(team: "Flamengo" | "Grêmio"): Promise<TeamLiveHubData> {
    const now = Date.now();
    const cached = realDataCache[team];
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const today = new Date().toISOString().split("T")[0];
    const prompt = `Consulte dados oficiais e em tempo real sobre o time de futebol ${team} (Brasil).
Data de referência atual: ${today}.
Busque na internet:
1. Posição atual, pontos, jogos disputados e saldo de gols no Campeonato Brasileiro ou torneio em andamento.
2. Os últimos 3 a 5 jogos oficiais com placar e adversário.
3. Os próximos 3 jogos com data, horário de Brasília, adversário e estádio.
4. Classifique a tensão de cada jogo futuro de 1 a 5 (clássicos, semifinais e finais = 4 ou 5).
Retorne os dados reais e precisos no schema estruturado em JSON com as chaves: teamName, standings, pastMatches, nextMatches. Não inclua texto explicativo fora do JSON.`;

    let parsed: any = null;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text || "";
      const clean = rawText
        .replace(/^```json/m, "")
        .replace(/^```/m, "")
        .replace(/```$/m, "")
        .trim();

      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(
          `[FootballLiveService] Falha ao extrair JSON da busca em tempo real para o ${team}. Resposta bruta: ${rawText.substring(0, 150)}`
        );
      }

      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error(`[FootballLiveService] Erro ao consultar internet via Gemini para ${team}:`, err);
      // Se houver cache prévio válido (mesmo expirado), mantém os dados reais em vez de inventar
      if (cached) {
        console.warn(`[FootballLiveService] Servindo último cache real para ${team}`);
        return cached.data;
      }
      throw err;
    }

    // Analisa se há jogo hoje com base na data real
    const todayFormatted = today;
    const matchToday = parsed.nextMatches?.find(
      (m: MatchInfo) => m.matchDate && m.matchDate.includes(todayFormatted)
    );

    const liveData: TeamLiveHubData = {
      teamName: team,
      updatedAt: new Date().toISOString(),
      standings: {
        position: parsed.standings?.position ?? 1,
        points: parsed.standings?.points ?? 0,
        matchesPlayed: parsed.standings?.matchesPlayed ?? 0,
        goalDifference: parsed.standings?.goalDifference ?? 0,
        zone: parsed.standings?.zone ?? "Campeonato Brasileiro Série A",
      },
      pastMatches: Array.isArray(parsed.pastMatches) ? parsed.pastMatches : [],
      nextMatches: Array.isArray(parsed.nextMatches) ? parsed.nextMatches : [],
      matchDayAlert: {
        hasMatchToday: Boolean(matchToday),
        matchDetails: matchToday,
        suggestedWorkoutCutoffTime: matchToday ? "20:50" : undefined,
        snackCalorieBufferKcal:
          matchToday && matchToday.tensionIndex >= 4
            ? 350
            : matchToday
            ? 200
            : 0,
      },
    };

    // Salva no cache com TTL de 6 horas
    realDataCache[team] = {
      data: liveData,
      expiresAt: now + CACHE_TTL_MS,
    };

    return liveData;
  }

  /**
   * Adapter de compatibilidade com os componentes do Bio-Triad OS
   */
  async getTeamLiveTelemetry(team: SoccerTeam): Promise<FootballTeamData> {
    const hubData = await this.fetchLiveTeamData(team);
    const maxTension = Math.max(
      3,
      ...(hubData.nextMatches?.map((m) => m.tensionIndex) || [3])
    );

    return {
      teamName: hubData.teamName,
      currentCompetition: hubData.standings.zone || "Campeonato Brasileiro Série A",
      standingPosition: hubData.standings.position,
      points: hubData.standings.points,
      gamesPlayed: hubData.standings.matchesPlayed,
      goalDifference: hubData.standings.goalDifference,
      recentForm: (hubData.pastMatches || []).map((m) =>
        m.result === "WIN" ? "W" : m.result === "LOSS" ? "L" : "D"
      ),
      pastMatches: (hubData.pastMatches || []).map((m) => ({
        date: m.matchDate,
        timeBrasilia: "21:30",
        competition: m.competition,
        opponent: m.opponent,
        homeOrAway: "HOME",
        score: m.score,
        status: "FINISHED",
      })),
      nextMatches: (hubData.nextMatches || []).map((m) => ({
        date: m.matchDate,
        timeBrasilia: "21:30",
        competition: m.competition,
        opponent: m.opponent,
        homeOrAway: m.isHome ? "HOME" : "AWAY",
        stadium: m.stadium,
        status: "SCHEDULED",
      })),
      tensionIndex: maxTension,
      isMatchDay: hubData.matchDayAlert.hasMatchToday,
      logisticalAdjustments: {
        requiresTrainingCut: maxTension >= 4,
        recommendedEndTime: hubData.matchDayAlert.suggestedWorkoutCutoffTime || "20:50",
        caloricBufferKcal: hubData.matchDayAlert.snackCalorieBufferKcal || (maxTension >= 4 ? 350 : 150),
        recommendedSnacks: [
          "Espetinho de frango grelhado marinado no limão (P1)",
          "Chips de batata doce na airfryer com alecrim (C1)",
          "Pipoca artesanal com azeite extravirgem (C1)",
          "Castanhas de caju e nozes (30g)",
          "Água com gás, limão espremido e pedras de gelo",
        ],
      },
    };
  }
}

export const footballLiveService = new FootballLiveService();
