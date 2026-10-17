import { NextResponse } from "next/server";
import { whatsAppEvolutionService } from "@/lib/whatsapp-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { type, text, workoutSummary, params, targetNumber } = body;

    let result;

    switch (type) {
      case "ECLUSA_1830":
        result = await whatsAppEvolutionService.sendEclusa1830Alert(
          workoutSummary || "Treino Híbrido: Rodagem Z2 + Musculação Ficha A",
          targetNumber
        );
        break;

      case "THERMAL_BRAKE_2030":
        result = await whatsAppEvolutionService.sendThermalBrake2030Alert(
          targetNumber
        );
        break;

      case "MATCH_DAY":
        result = await whatsAppEvolutionService.sendMatchDayAlert(
          params || {
            teamName: "Flamengo",
            opponent: "Palmeiras",
            kickoffTime: "21:30",
            tensionIndex: 4,
            recommendedEndTime: "20:45",
          },
          targetNumber
        );
        break;

      case "TACO_NUTRITION":
        result = await whatsAppEvolutionService.sendTacoNutritionAlert(
          params || {
            mealName: "Jantar Pós-Treino",
            calories: 620,
            protein: 48,
            carbs: 75,
            fats: 14,
          },
          targetNumber
        );
        break;

      case "CUSTOM":
      default:
        if (!text) {
          return NextResponse.json(
            { success: false, error: "Parâmetro 'text' é obrigatório para notificações customizadas." },
            { status: 400 }
          );
        }
        result = await whatsAppEvolutionService.sendTextMessage(text, targetNumber);
        break;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
