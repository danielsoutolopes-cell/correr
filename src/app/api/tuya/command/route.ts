import { NextResponse } from "next/server";
import { tuyaSmartHomeService } from "@/lib/tuya-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scene, deviceId = "tuya_light_living_room", commands } = body;

    let result;
    switch (scene) {
      case "FLAMENGO_MATCH":
        result = await tuyaSmartHomeService.triggerMatchDayRubroNegro(deviceId);
        break;
      case "GREMIO_MATCH":
        result = await tuyaSmartHomeService.triggerMatchDayGremio(deviceId);
        break;
      case "PRE_WORKOUT_FOCUS":
        result = await tuyaSmartHomeService.triggerPreWorkoutFocus(deviceId);
        break;
      case "PARASYMPATHETIC_NIGHT":
        result = await tuyaSmartHomeService.triggerNightParassympatheticMode(deviceId);
        break;
      case "SUNRISE_LONG_RUN":
        result = await tuyaSmartHomeService.triggerSunriseForLongRun(deviceId);
        break;
      case "PRE_COOLING_TREADMILL":
        result = await tuyaSmartHomeService.triggerPreCoolingTreadmill(deviceId);
        break;
      case "CRYO_SLEEP":
        result = await tuyaSmartHomeService.triggerCryoSleepChamber(deviceId);
        break;
      case "COFFEE_PRE_RUN":
        result = await tuyaSmartHomeService.triggerCoffeeBaristaPreRun(deviceId);
        break;
      case "ECO_ALL_OFF":
        result = await tuyaSmartHomeService.triggerEcoAllOff(deviceId);
        break;
      case "FLAMENGO_GOAL":
        result = await tuyaSmartHomeService.triggerClubGoalCelebration(deviceId, "FLAMENGO");
        break;
      case "GREMIO_GOAL":
        result = await tuyaSmartHomeService.triggerClubGoalCelebration(deviceId, "GREMIO");
        break;
      case "CUSTOM":
        if (!commands || !Array.isArray(commands)) {
          return NextResponse.json(
            { error: "Comandos customizados ausentes ou inválidos." },
            { status: 400 }
          );
        }
        result = await tuyaSmartHomeService.sendDeviceCommands(deviceId, commands);
        break;
      default:
        return NextResponse.json(
          { error: `Cena Tuya desconhecida: ${scene}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API Tuya Command] Error:", err);
    return NextResponse.json(
      { error: "Erro ao processar comando Tuya Smart Home." },
      { status: 500 }
    );
  }
}
