import { NextResponse } from "next/server";
import {
  buildWeeklyScheduleTemplate,
  evaluateRaceCalendar,
  convertPaceToTreadmill,
} from "@/lib/physiology";
import { WeekendLayoutMode } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const weekendMode: WeekendLayoutMode =
      body.weekendMode === "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
        ? "SATURDAY_LONG_SUNDAY_FAMILY_BIKE"
        : "CLASSIC_SUNDAY_LONG";

    const hasShoulderRestriction = body.hasShoulderRestriction !== false; // default true for Daniel
    const weeklySchedule = buildWeeklyScheduleTemplate({
      weekendMode,
      hasShoulderRestriction,
    });

    const targetRaces = evaluateRaceCalendar();

    // Treadmill conversion sample for quick client check
    const paceConversion = convertPaceToTreadmill("5:30", 1.5);

    return NextResponse.json({
      success: true,
      weekendMode,
      weeklySchedule,
      targetRaces,
      paceConversion,
      guidelines: {
        weekdayCapMinutes: 60,
        restDays: ["Segunda-feira", "Sexta-feira"],
        dualMode: "Rua (GPS/Pace) ou Esteira (km/h + % inclinação)",
      },
    });
  } catch (err) {
    console.error("[API Coach Generate Plan] Error:", err);
    return NextResponse.json(
      { error: "Erro ao gerar planejamento do treinador." },
      { status: 500 }
    );
  }
}
