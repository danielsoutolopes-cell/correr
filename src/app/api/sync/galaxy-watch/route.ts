import { NextResponse } from "next/server";
import { intervalsGalaxyBridge } from "@/lib/intervals-bridge";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const forceRefresh = searchParams.get("refresh") === "true";

    const telemetry = await intervalsGalaxyBridge.getLatestTelemetry(date, forceRefresh);
    return NextResponse.json(
      {
        success: true,
        syncedAt: new Date().toISOString(),
        athleteId: process.env.INTERVALS_ATHLETE_ID || "I753639",
        telemetry,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (err) {
    console.error("[API Galaxy Watch Sync] Error:", err);
    return NextResponse.json(
      { error: "Falha ao sincronizar dados do Intervals.icu / Galaxy Watch Ultra." },
      { status: 500 }
    );
  }
}
