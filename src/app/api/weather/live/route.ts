import { NextResponse } from "next/server";
import { weatherPacingService } from "@/lib/weather-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Sao Paulo,BR";

    const data = await weatherPacingService.getCurrentWeather(city);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[API Weather Live] Error:", err);
    return NextResponse.json(
      { error: "Erro ao obter telemetria climática de weather-pacing." },
      { status: 500 }
    );
  }
}
