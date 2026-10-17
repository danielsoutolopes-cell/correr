export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string; // "Run", "Ride", "VirtualRun"
  sport_type: string;
  start_date_local: string;
  average_speed: number; // m/s
  max_speed: number; // m/s
  average_cadence?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  elev_high?: number;
  elev_low?: number;
  calories?: number;
}

export class StravaService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID || "203901";
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET || "";
    this.refreshToken = process.env.STRAVA_REFRESH_TOKEN || "";
    this.accessToken = process.env.STRAVA_ACCESS_TOKEN || null;
    this.tokenExpiresAt = parseInt(process.env.STRAVA_EXPIRES_AT || "0", 10);
  }

  /**
   * Refreshes OAuth2 access token if expired
   */
  async getValidAccessToken(): Promise<string | null> {
    const nowSec = Math.floor(Date.now() / 1000);
    if (this.accessToken && this.tokenExpiresAt > nowSec + 60) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      console.warn("[StravaService] Missing Strava client credentials or refresh token.");
      return this.accessToken;
    }

    try {
      const res = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
        }),
      });

      if (!res.ok) {
        throw new Error(`Strava refresh failed with status ${res.status}`);
      }

      const data = await res.json();
      this.accessToken = data.access_token;
      this.tokenExpiresAt = data.expires_at;
      return this.accessToken;
    } catch (err) {
      console.error("[StravaService] Error refreshing token:", err);
      return this.accessToken;
    }
  }

  /**
   * Fetches recent athlete activities from Strava V3
   */
  async getRecentActivities(limit: number = 10): Promise<StravaActivity[]> {
    const token = await this.getValidAccessToken();
    if (!token) {
      console.warn("[StravaService] No valid Strava access token.");
      return [];
    }

    try {
      const res = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          next: { revalidate: 300 }, // 5 min cache
        }
      );

      if (!res.ok) {
        throw new Error(`Strava API error: ${res.status}`);
      }

      const activities: StravaActivity[] = await res.json();
      return activities;
    } catch (err) {
      console.error("[StravaService] Failed to fetch activities:", err);
      return [];
    }
  }
}

export const stravaService = new StravaService();
