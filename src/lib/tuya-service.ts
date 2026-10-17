import crypto from "crypto";

export interface TuyaDeviceCommand {
  code: string;
  value: boolean | number | string | Record<string, unknown>;
}

export interface TuyaCommandResult {
  success: boolean;
  t: number;
  msg?: string;
  result?: unknown;
}

export class TuyaSmartHomeService {
  private endpoint: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.endpoint = process.env.TUYA_ENDPOINT || "https://openapi.tuyaus.com";
    this.clientId = process.env.TUYA_CLIENT_ID || "";
    this.clientSecret = process.env.TUYA_CLIENT_SECRET || "";
  }

  /**
   * Generates standard Tuya Cloud HMAC-SHA256 signature
   */
  private generateSign(
    method: string,
    path: string,
    timestamp: string,
    accessToken: string = "",
    body: string = ""
  ): { sign: string; contentHash: string } {
    const contentHash = crypto.createHash("sha256").update(body).digest("hex");
    const stringToSign = [
      method.toUpperCase(),
      contentHash,
      "", // headers string (empty for default)
      path,
    ].join("\n");

    const message = this.clientId + accessToken + timestamp + stringToSign;
    const sign = crypto
      .createHmac("sha256", this.clientSecret)
      .update(message)
      .digest("hex")
      .toUpperCase();

    return { sign, contentHash };
  }

  /**
   * Obtains OAuth 2.0 token from Tuya Cloud OpenAPI
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.clientId || !this.clientSecret) {
      console.warn("[TuyaService] TUYA_CLIENT_ID or TUYA_CLIENT_SECRET not configured.");
      return null;
    }

    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    try {
      const timestamp = Date.now().toString();
      const path = "/v1.0/token?grant_type=1";
      const { sign } = this.generateSign("GET", path, timestamp);

      const res = await fetch(`${this.endpoint}${path}`, {
        method: "GET",
        headers: {
          client_id: this.clientId,
          sign,
          t: timestamp,
          sign_method: "HMAC-SHA256",
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success && data.result?.access_token) {
        this.accessToken = data.result.access_token;
        this.tokenExpiresAt = Date.now() + (data.result.expire_time || 7200) * 1000;
        return this.accessToken;
      }

      console.error("[TuyaService] Token acquisition failed:", data);
      return null;
    } catch (err) {
      console.error("[TuyaService] Error contacting Tuya cloud:", err);
      return null;
    }
  }

  /**
   * Sends actual hardware commands to a Tuya smart device (Bulb, LED Strip, Smart Socket)
   */
  async sendDeviceCommands(
    deviceId: string,
    commands: TuyaDeviceCommand[]
  ): Promise<TuyaCommandResult> {
    const timestamp = Date.now().toString();

    if (!this.clientId || !this.clientSecret) {
      return {
        success: false,
        t: Number(timestamp),
        msg: "Erro: TUYA_CLIENT_ID e TUYA_CLIENT_SECRET são obrigatórios para despachar comandos reais.",
      };
    }

    const token = await this.getAccessToken();
    if (!token) {
      return {
        success: false,
        t: Number(timestamp),
        msg: "Falha na autenticação Tuya OpenAPI (https://openapi.tuyaus.com): Token OAuth 2.0 não obtido.",
      };
    }

    try {
      const path = `/v1.0/iot-03/devices/${deviceId}/commands`;
      const body = JSON.stringify({ commands });
      const { sign } = this.generateSign("POST", path, timestamp, token, body);

      const res = await fetch(`${this.endpoint}${path}`, {
        method: "POST",
        headers: {
          client_id: this.clientId,
          access_token: token,
          sign,
          t: timestamp,
          sign_method: "HMAC-SHA256",
          "Content-Type": "application/json",
        },
        body,
      });

      const responseData = await res.json();
      return {
        success: responseData.success ?? false,
        t: Number(timestamp),
        msg: responseData.msg || (responseData.success ? "Comando executado com sucesso no hardware." : "Erro na API Tuya"),
        result: responseData.result,
      };
    } catch (err) {
      console.error("[TuyaService] Error sending commands:", err);
      return {
        success: false,
        t: Number(timestamp),
        msg: `Falha de rede ao disparar comando: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Match Day Scene: Flamengo (Red & Black pulse)
   */
  async triggerMatchDayRubroNegro(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: true },
      { code: "work_mode", value: "colour" },
      {
        code: "colour_data",
        value: JSON.stringify({ h: 358, s: 1000, v: 1000 }), // Vibrant Scarlet Red
      },
      { code: "bright_value_v2", value: 1000 },
    ]);
  }

  /**
   * Match Day Scene: Grêmio (Sky Blue & White)
   */
  async triggerMatchDayGremio(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: true },
      { code: "work_mode", value: "colour" },
      {
        code: "colour_data",
        value: JSON.stringify({ h: 202, s: 920, v: 1000 }), // Tricolor Sky Blue
      },
      { code: "bright_value_v2", value: 1000 },
    ]);
  }

  /**
   * Pre-Workout Focus Scene at 18:30 (Cool daylight 6500K for dopamine & focus)
   */
  async triggerPreWorkoutFocus(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: true },
      { code: "work_mode", value: "white" },
      { code: "temp_value_v2", value: 950 }, // 6500K Cool White
      { code: "bright_value_v2", value: 900 },
    ]);
  }

  /**
   * Thermal Brake & Parasympathetic Mode at 20:30 (Warm amber 2200K, low brightness)
   */
  async triggerNightParassympatheticMode(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: true },
      { code: "work_mode", value: "white" },
      { code: "temp_value_v2", value: 100 }, // Warm Candle Amber (2200K)
      { code: "bright_value_v2", value: 250 }, // Dim 25% for melatonin production
    ]);
  }

  /**
   * Sunrise Simulation at 06:30 for Sunday Long Run
   */
  async triggerSunriseForLongRun(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: true },
      { code: "work_mode", value: "colour" },
      {
        code: "colour_data",
        value: JSON.stringify({ h: 32, s: 800, v: 600 }), // Morning Golden Sunrise
      },
      { code: "bright_value_v2", value: 600 },
    ]);
  }

  /**
   * Treadmill Pre-Cooling (Costill Protocol): AC to 19°C 15 min prior to indoor run to prevent cardiac drift
   */
  async triggerPreCoolingTreadmill(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch", value: true },
      { code: "mode", value: "cold" },
      { code: "temp_set", value: 19 },
      { code: "windspeed", value: "high" },
    ]);
  }

  /**
   * Cryogenic Sleep Chamber: 20°C cooling to trigger deep N3 slow-wave sleep & GH hormone peak
   */
  async triggerCryoSleepChamber(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch", value: true },
      { code: "mode", value: "cold" },
      { code: "temp_set", value: 20 },
      { code: "windspeed", value: "low" },
    ]);
  }

  /**
   * Smart Plug: Pre-Run Coffee Barista scheduled 15 min before long run alarm
   */
  async triggerCoffeeBaristaPreRun(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_1", value: true },
      { code: "countdown_1", value: 900 }, // Auto turn-off after 15 minutes
    ]);
  }

  /**
   * Eco-Green All Off ("Modo Fui Correr"): Kills non-essential standby circuits to save energy
   */
  async triggerEcoAllOff(deviceId: string): Promise<TuyaCommandResult> {
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: false },
      { code: "switch", value: false },
      { code: "switch_1", value: false },
    ]);
  }

  /**
   * Club Goal Strobe Celebration (Flamengo Scarlet Red / Grêmio Sky Blue)
   */
  async triggerClubGoalCelebration(
    deviceId: string,
    club: "FLAMENGO" | "GREMIO"
  ): Promise<TuyaCommandResult> {
    const isFla = club === "FLAMENGO";
    return this.sendDeviceCommands(deviceId, [
      { code: "switch_led", value: true },
      { code: "work_mode", value: "colour" },
      {
        code: "colour_data",
        value: JSON.stringify(
          isFla
            ? { h: 358, s: 1000, v: 1000 } // Scarlet Red
            : { h: 202, s: 920, v: 1000 } // Sky Blue
        ),
      },
      { code: "flash_scene_1", value: "strobe" },
      { code: "bright_value_v2", value: 1000 },
    ]);
  }
}

export const tuyaSmartHomeService = new TuyaSmartHomeService();
