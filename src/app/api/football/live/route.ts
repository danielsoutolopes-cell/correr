import { NextResponse } from "next/server";
import { footballLiveService } from "@/lib/football-service";
import { SoccerTeam } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const team = (searchParams.get("team") || "Flamengo") as SoccerTeam;

    if (team !== "Flamengo" && team !== "Grêmio") {
      return NextResponse.json(
        { error: "Time inválido. Escolha 'Flamengo' ou 'Grêmio'." },
        { status: 400 }
      );
    }

    const data = await footballLiveService.getTeamLiveTelemetry(team);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    console.error("[API Football Live] Error:", err);
    return NextResponse.json(
      { error: "Falha ao obter telemetria de futebol em tempo real." },
      { status: 500 }
    );
  }
}
