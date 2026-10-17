export interface WeatherPacingData {
  city: string;
  tempC: number;
  feelsLikeC: number;
  humidityPct: number;
  windSpeedKmh: number;
  condition: string;
  icon: string;
  paceAdjustmentSec: number; // Seconds added to target pace per km
  environmentalRisk: "OPTIMAL" | "MILD_HEAT" | "MODERATE_HEAT" | "SEVERE_HEAT_INDOOR_RECOMMENDED";
  tacticalRecommendation: string;
  staticMapUrl?: string;
}

export class WeatherPacingService {
  private weatherApiKey: string;
  private mapsApiKey: string;
  private mapsBaseUrl: string;

  constructor() {
    this.weatherApiKey = process.env.OPENWEATHER_API_KEY || "5da58775f6ec76784b6d24b2f848d8be";
    this.mapsApiKey = process.env.MAPS_API_KEY || "ac0f9a1f73ad4399a345429e56281f3c";
    this.mapsBaseUrl = process.env.MAPS_BASE_URL || "https://maps.geoapify.com/v1/staticmap";
  }

  /**
   * Fetches real-time weather and computes running pace physiological penalty
   */
  async getCurrentWeather(city: string = "Sao Paulo,BR"): Promise<WeatherPacingData> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&lang=pt_br&appid=${this.weatherApiKey}`;

      const res = await fetch(url, { next: { revalidate: 900 } }); // 15 min cache
      if (!res.ok) {
        throw new Error(`OpenWeather API error: ${res.status}`);
      }

      const data = await res.json();
      const tempC = Number(data.main.temp.toFixed(1));
      const feelsLikeC = Number(data.main.feels_like.toFixed(1));
      const humidityPct = data.main.humidity;
      const windSpeedKmh = Number(((data.wind?.speed || 0) * 3.6).toFixed(1));
      const condition = data.weather?.[0]?.description || "Céu limpo";
      const icon = data.weather?.[0]?.icon || "01d";

      // Physiological Pace Penalty Formula (Galloway / Costill Thermal Cost)
      // Optimum marathon temperature is 10-14°C. For every degree above 15°C, pace drops ~0.5% to 1.5%.
      let paceAdjustmentSec = 0;
      let environmentalRisk: WeatherPacingData["environmentalRisk"] = "OPTIMAL";
      let tacticalRecommendation = "Clima perfeito para rodagem de asfalto em ritmo alvo.";

      if (feelsLikeC <= 15) {
        paceAdjustmentSec = 0;
        environmentalRisk = "OPTIMAL";
        tacticalRecommendation = "Condições ideais de VO2 max. Zero perda por estresse térmico.";
      } else if (feelsLikeC <= 20) {
        paceAdjustmentSec = 3;
        environmentalRisk = "MILD_HEAT";
        tacticalRecommendation =
          "Temperatura moderada. Adicione +3s/km no pace alvo e hidrate a cada 4km.";
      } else if (feelsLikeC <= 25) {
        paceAdjustmentSec = 8;
        environmentalRisk = "MODERATE_HEAT";
        tacticalRecommendation =
          "Calor moderado. Adicione +8s/km. Consumir isotônico e pastilha de sal.";
      } else {
        paceAdjustmentSec = 16;
        environmentalRisk = "SEVERE_HEAT_INDOOR_RECOMMENDED";
        tacticalRecommendation =
          "Estresse térmico elevado. Recomenda-se migrar o treino para ESTEIRA CLIMATIZADA (Indoor).";
      }

      // Geoapify Static Map (Ibirapuera / SP City Marathon Circuit)
      const lat = data.coord?.lat || -23.5874;
      const lon = data.coord?.lon || -46.6576;
      const staticMapUrl = `${this.mapsBaseUrl}?style=osm-dark&width=600&height=300&center=lonlat:${lon},${lat}&zoom=13&apiKey=${this.mapsApiKey}`;

      return {
        city: data.name || "São Paulo",
        tempC,
        feelsLikeC,
        humidityPct,
        windSpeedKmh,
        condition,
        icon,
        paceAdjustmentSec,
        environmentalRisk,
        tacticalRecommendation,
        staticMapUrl,
      };
    } catch (err) {
      console.error("[WeatherService] Error:", err);
      return {
        city: "São Paulo",
        tempC: 18.0,
        feelsLikeC: 18.0,
        humidityPct: 80,
        windSpeedKmh: 12.0,
        condition: "Parcialmente nublado",
        icon: "03d",
        paceAdjustmentSec: 2,
        environmentalRisk: "MILD_HEAT",
        tacticalRecommendation: "Clima ameno. Rodagem de asfalto liberada com hidratação padrão.",
      };
    }
  }
}

export const weatherPacingService = new WeatherPacingService();
