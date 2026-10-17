import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const uptimeSeconds = process.uptime();
  const timestamp = new Date().toISOString();

  return NextResponse.json({
    status: "HEALTHY",
    service: "Bio-Triad OS",
    version: "10.0.0",
    environment: process.env.NODE_ENV || "development",
    uptimeSeconds: Math.floor(uptimeSeconds),
    timestamp,
    integrations: {
      geminiAi: Boolean(process.env.GEMINI_API_KEY),
      intervalsIcu: Boolean(process.env.INTERVALS_API_KEY),
      tuyaIot: Boolean(process.env.TUYA_CLIENT_ID),
      openWeather: Boolean(process.env.OPENWEATHER_API_KEY),
      stravaV3: Boolean(process.env.STRAVA_CLIENT_ID),
      telegramBot: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      uptimeRobotMonitorId: process.env.UPTIMEROBOT_MONITOR_ID || "803014115",
    },
  });
}
