import { NextResponse } from "next/server";
import { stravaService } from "@/lib/strava-service";

export const dynamic = "force-dynamic";

// Webhook subscription verification GET
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Strava Webhook Handshake
    if (mode === "subscribe" && token === process.env.STRAVA_VERIFY_TOKEN) {
      return NextResponse.json({ "hub.challenge": challenge });
    }

    // Default: Fetch activities
    const activities = await stravaService.getRecentActivities(10);
    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      activities,
    });
  } catch (err) {
    console.error("[API Strava Sync] Error:", err);
    return NextResponse.json(
      { error: "Erro ao sincronizar com Strava V3 API." },
      { status: 500 }
    );
  }
}
