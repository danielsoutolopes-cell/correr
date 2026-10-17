import { NextResponse } from "next/server";
import { telegramNotificationService } from "@/lib/telegram-service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = "CUSTOM", message, title = "Bio-Triad OS" } = body;

    let success = false;
    if (type === "ECLUSA_1830") {
      success = await telegramNotificationService.sendEclusa1830Alert(
        message || "Corrida Contínua Z2 (55 min) • Dual-Mode: Rua vs Esteira"
      );
    } else if (type === "THERMAL_BRAKE_2030") {
      success = await telegramNotificationService.sendThermalBrake2030Alert();
    } else if (type === "MATCH_DAY") {
      success = await telegramNotificationService.sendMatchDayAlert({
        teamName: body.teamName || "Flamengo",
        opponent: body.opponent || "Palmeiras",
        kickoffTime: body.kickoffTime || "21:30",
        tensionIndex: body.tensionIndex || 5,
        recommendedEndTime: body.recommendedEndTime || "20:50",
      });
    } else {
      const fullText = `🔔 *[${title}]*\n${message || "Notificação do Bio-Triad OS."}`;
      success = await telegramNotificationService.sendMessage(fullText);
    }

    return NextResponse.json({ success });
  } catch (err) {
    console.error("[API Telegram Notify] Error:", err);
    return NextResponse.json(
      { error: "Erro ao enviar notificação via Telegram Bot." },
      { status: 500 }
    );
  }
}
