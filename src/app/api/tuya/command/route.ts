import { NextResponse } from "next/server";
import { tuyaSmartHomeService } from "@/lib/tuya-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scene, deviceId, commands } = body;
    const defaultLivingRoomLight =
      process.env.TUYA_DEVICE_LIVING_ROOM_LIGHT || "eb52fdf73913d81cf5ruqt";
    const defaultLaundry =
      process.env.TUYA_DEVICE_LAUNDRY || "eb6ba84adf6c0806d7awk3";
    const bedroomLed =
      process.env.TUYA_DEVICE_BEDROOM_LED || "eb4deff019cb6627614ic8";
    const bedroomMainLight =
      process.env.TUYA_DEVICE_BEDROOM_MAIN_LIGHT || "eb6bb3db2a18ae84dbsio8";
    const tvPlug =
      process.env.TUYA_DEVICE_TV_PLUG || "ebc2434ca5ee0361acjqqp";
    const dualPlug =
      process.env.TUYA_DEVICE_DUAL_PLUG || "ebc4a8285904c4bd43crx7";
    const closetHanger =
      process.env.TUYA_DEVICE_CLOSET_HANGER_LED || "eb7e8e6b7909ed343dfawf";
    const closetDoor =
      process.env.TUYA_DEVICE_CLOSET_DOOR_LED || "ebb5f514f5a91f36de9ix7";

    const targetDeviceId = deviceId || defaultLivingRoomLight;

    let result;
    switch (scene) {
      case "FLAMENGO_MATCH":
        result = await tuyaSmartHomeService.triggerMatchDayRubroNegro(targetDeviceId);
        break;
      case "GREMIO_MATCH":
        result = await tuyaSmartHomeService.triggerMatchDayGremio(targetDeviceId);
        break;
      case "PALMEIRAS_MATCH":
        result = await tuyaSmartHomeService.triggerMatchDayPalmeiras(targetDeviceId);
        break;
      case "PRE_WORKOUT_FOCUS":
        result = await tuyaSmartHomeService.triggerPreWorkoutFocus(targetDeviceId);
        break;
      case "PARASYMPATHETIC_NIGHT":
        // Ativa luz âmbar quente na sala e no quarto do casal + desliga lâmpada principal do quarto
        result = await tuyaSmartHomeService.triggerNightParassympatheticMode(targetDeviceId);
        if (bedroomLed && bedroomLed !== targetDeviceId) {
          await tuyaSmartHomeService.triggerNightParassympatheticMode(bedroomLed).catch(() => {});
        }
        if (bedroomMainLight) {
          await tuyaSmartHomeService.sendDeviceCommands(bedroomMainLight, [
            { code: "switch_1", value: false },
            { code: "switch", value: false },
          ]).catch(() => {});
        }
        break;
      case "CINEMA_MODE":
        // Ativa modo cinema suave (15% luz âmbar) na TV/Sala e no LED do quarto + liga tomada da TV
        result = await tuyaSmartHomeService.triggerCinemaMode(targetDeviceId);
        if (tvPlug) {
          await tuyaSmartHomeService.sendDeviceCommands(tvPlug, [
            { code: "switch_1", value: true },
            { code: "switch", value: true },
          ]).catch(() => {});
        }
        if (bedroomLed && bedroomLed !== targetDeviceId) {
          await tuyaSmartHomeService.triggerCinemaMode(bedroomLed).catch(() => {});
        }
        if (bedroomMainLight) {
          await tuyaSmartHomeService.sendDeviceCommands(bedroomMainLight, [
            { code: "switch_1", value: false },
            { code: "switch", value: false },
          ]).catch(() => {});
        }
        break;
      case "SUNRISE_LONG_RUN":
        // Aurora solar no LED do Quarto do Casal e na Sala
        result = await tuyaSmartHomeService.triggerSunriseForLongRun(bedroomLed || targetDeviceId);
        if (targetDeviceId && targetDeviceId !== bedroomLed) {
          await tuyaSmartHomeService.triggerSunriseForLongRun(targetDeviceId).catch(() => {});
        }
        break;
      case "CLOSET_ON":
        // Iluminação tática do armário / closet para kit de corrida e placa de carbono
        result = await tuyaSmartHomeService.triggerClosetKitLights(closetHanger);
        if (closetDoor && closetDoor !== closetHanger) {
          await tuyaSmartHomeService.triggerClosetKitLights(closetDoor).catch(() => {});
        }
        break;
      case "RACE_MORNING_ALVORADA":
        // Orquestração completa de alvorada de prova: Luz Quarto + Tomada Dupla (Café e Mate) + Closet
        result = await tuyaSmartHomeService.triggerRaceMorningAlvorada({
          bedroomLedId: bedroomLed || targetDeviceId,
          bedroomMainLightId: bedroomMainLight,
          dualPlugId: dualPlug,
          closetHangerId: closetHanger,
          closetDoorId: closetDoor,
        });
        break;
      case "PRE_COOLING_TREADMILL":
        result = await tuyaSmartHomeService.triggerPreCoolingTreadmill(
          deviceId || process.env.TUYA_DEVICE_AC_TREADMILL || targetDeviceId
        );
        break;
      case "CRYO_SLEEP":
        result = await tuyaSmartHomeService.triggerCryoSleepChamber(
          deviceId || process.env.TUYA_DEVICE_BEDROOM_AC || targetDeviceId
        );
        // Desliga iluminação do quarto para sono N3
        if (bedroomMainLight) {
          await tuyaSmartHomeService.sendDeviceCommands(bedroomMainLight, [
            { code: "switch_1", value: false },
            { code: "switch", value: false },
          ]).catch(() => {});
        }
        if (bedroomLed) {
          await tuyaSmartHomeService.triggerEcoAllOff(bedroomLed).catch(() => {});
        }
        break;
      case "COFFEE_PRE_RUN":
        result = await tuyaSmartHomeService.triggerCafezinho(deviceId || dualPlug, true, 15);
        break;
      case "CAFEZINHO_ON":
        result = await tuyaSmartHomeService.triggerCafezinho(deviceId || dualPlug, true, 15);
        break;
      case "CAFEZINHO_OFF":
        result = await tuyaSmartHomeService.triggerCafezinho(deviceId || dualPlug, false, 0);
        break;
      case "MATE_ON":
        result = await tuyaSmartHomeService.triggerMateGaucho(deviceId || dualPlug, true, 10);
        break;
      case "MATE_OFF":
        result = await tuyaSmartHomeService.triggerMateGaucho(deviceId || dualPlug, false, 0);
        break;
      case "BEBIDAS_DUAL_ON":
        result = await tuyaSmartHomeService.triggerDualPlugBoth(deviceId || dualPlug, true);
        break;
      case "BEBIDAS_DUAL_OFF":
        result = await tuyaSmartHomeService.triggerDualPlugBoth(deviceId || dualPlug, false);
        break;
      case "ECO_ALL_OFF":
        // Desliga L_Futebol (sala/TV), Lavanderia, Tomada TV, Luz Quarto, LED Quarto, Closet e Tomada Dupla (Cafezinho + Mate)
        result = await tuyaSmartHomeService.triggerEcoAllOff(targetDeviceId);
        const devicesToTurnOff = [
          defaultLaundry,
          tvPlug,
          bedroomLed,
          bedroomMainLight,
          dualPlug,
          closetHanger,
          closetDoor,
        ].filter(
          (id): id is string => Boolean(id && id !== targetDeviceId)
        );
        await Promise.all(
          devicesToTurnOff.map((devId) =>
            tuyaSmartHomeService.triggerEcoAllOff(devId).catch(() => {})
          )
        );
        break;
      case "FLAMENGO_GOAL":
        result = await tuyaSmartHomeService.triggerClubGoalCelebration(targetDeviceId, "FLAMENGO");
        break;
      case "GREMIO_GOAL":
        result = await tuyaSmartHomeService.triggerClubGoalCelebration(targetDeviceId, "GREMIO");
        break;
      case "PALMEIRAS_GOAL":
        result = await tuyaSmartHomeService.triggerClubGoalCelebration(targetDeviceId, "PALMEIRAS");
        break;
      case "CUSTOM":
        if (!commands || !Array.isArray(commands)) {
          return NextResponse.json(
            { error: "Comandos customizados ausentes ou inválidos." },
            { status: 400 }
          );
        }
        result = await tuyaSmartHomeService.sendDeviceCommands(targetDeviceId, commands);
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
