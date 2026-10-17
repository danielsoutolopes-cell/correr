export interface WhatsAppConnectionStatus {
  connected: boolean;
  state: "open" | "connecting" | "close" | "refused" | "unauthorized" | "unknown";
  instanceName: string;
  baseUrl: string;
  statusCode?: number;
  diagnostic?: string;
  raw?: any;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  diagnostic?: string;
  raw?: any;
}

export class WhatsAppEvolutionService {
  private baseUrl: string;
  private instanceName: string;
  private apiKey: string;
  private defaultRecipient: string;

  constructor() {
    this.baseUrl = (
      process.env.EVOLUTION_API_URL || "https://whatsapp-ecostone.onrender.com"
    ).replace(/\/$/, "");
    this.instanceName = process.env.EVOLUTION_INSTANCE_NAME || "ecostone";
    this.apiKey = process.env.EVOLUTION_API_KEY || "Gabriel2006";
    this.defaultRecipient =
      process.env.EVOLUTION_RECIPIENT_NUMBER || "5511988139833";
  }

  /**
   * Retorna o número de WhatsApp individualizado para Daniel ou Patrícia
   */
  getRecipientForProfile(profile: "DANIEL" | "PATRICIA" | "GABRIEL" | "CLAN"): string {
    if (profile === "PATRICIA") {
      return process.env.WHATSAPP_PATRICIA_PHONE || "5511988136702";
    }
    return process.env.WHATSAPP_DANIEL_PHONE || "5511988139833";
  }

  /**
   * Checks the connection state of the WhatsApp instance on Evolution API v2
   */
  async checkConnectionState(): Promise<WhatsAppConnectionStatus> {
    const endpoint = `${this.baseUrl}/instance/connectionState/${encodeURIComponent(
      this.instanceName
    )}`;

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: this.apiKey,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        return {
          connected: false,
          state: "unauthorized",
          instanceName: this.instanceName,
          baseUrl: this.baseUrl,
          statusCode: 401,
          diagnostic:
            "401 Unauthorized: A Global API Key (AUTHENTICATION_API_KEY) configurada no Render difere de 'Gabriel2006' ou o deploy de atualização das variáveis ainda está em andamento.",
          raw: data,
        };
      }

      if (res.status === 404) {
        return {
          connected: false,
          state: "close",
          instanceName: this.instanceName,
          baseUrl: this.baseUrl,
          statusCode: 404,
          diagnostic: `Instância '${this.instanceName}' não foi encontrada no servidor. Pode ser necessário criá-la no Evolution Manager.`,
          raw: data,
        };
      }

      const instanceState =
        data?.instance?.state || data?.state || (res.ok ? "open" : "unknown");
      const isConnected = instanceState === "open";

      return {
        connected: isConnected,
        state: isConnected ? "open" : instanceState === "connecting" ? "connecting" : "close",
        instanceName: this.instanceName,
        baseUrl: this.baseUrl,
        statusCode: res.status,
        diagnostic: isConnected
          ? "Instância conectada e pronta para disparos via WhatsApp!"
          : `Instância em estado '${instanceState}'. É necessário escanear o QR Code no WhatsApp se desconectado.`,
        raw: data,
      };
    } catch (err: any) {
      return {
        connected: false,
        state: "refused",
        instanceName: this.instanceName,
        baseUrl: this.baseUrl,
        statusCode: 500,
        diagnostic: `Falha de rede ao conectar à Evolution API (${this.baseUrl}): ${err?.message || "Timeout"}`,
      };
    }
  }

  /**
   * Sends a plain text message through Evolution API v2
   */
  async sendTextMessage(
    text: string,
    targetNumber?: string
  ): Promise<WhatsAppSendResult> {
    const recipient = this.cleanPhoneNumber(targetNumber || this.defaultRecipient);
    const endpoint = `${this.baseUrl}/message/sendText/${encodeURIComponent(
      this.instanceName
    )}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: recipient,
          text: text,
          options: {
            delay: 1000,
            presence: "composing",
            linkPreview: true,
          },
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          error: data?.response?.message || data?.error || `HTTP ${res.status}`,
          diagnostic:
            res.status === 401
              ? "Chave Global apikey não autorizada na Evolution API."
              : "Verifique o status da conexão da instância no Evolution Manager.",
          raw: data,
        };
      }

      return {
        success: true,
        messageId: data?.key?.id || data?.id,
        raw: data,
      };
    } catch (err: any) {
      console.error("[EvolutionWhatsAppService] Error dispatching text:", err);
      return {
        success: false,
        error: err?.message || "Unknown network error",
        diagnostic: "Não foi possível alcançar o servidor Evolution API.",
      };
    }
  }

  /**
   * Eclusa 18h30 Alert - Transition from Work to Athlete Mode
   */
  async sendEclusa1830Alert(
    workoutSummary: string,
    targetNumber?: string
  ): Promise<WhatsAppSendResult> {
    const text = `⚡ *[BIO-TRIAD OS: ECLUSA 18H30]*\n\nBoa noite, Daniel! Hora de fechar as tarefas do trabalho e destravar o modo atleta.\n\n🏃 *Missão das 19h:*\n${workoutSummary}\n\n💡 *Automação Smart Home:* Luzes da sala ajustadas para 6500K (Foco & Dopamina).\n🧠 Acesse o Bio-Triad OS para o Brain Dump de pendências e esvaziar a mente antes do treino!`;
    return this.sendTextMessage(text, targetNumber);
  }

  /**
   * Freio Térmico 20h30 Alert - Parassympathetic recovery & melatonin induction
   */
  async sendThermalBrake2030Alert(
    targetNumber?: string
  ): Promise<WhatsAppSendResult> {
    const text = `🌙 *[BIO-TRIAD OS: FREIO TÉRMICO 20H30]*\n\nTreino concluído com maestria!\n\n🧊 *Protocolo Parassimpático:*\n- Ducha morna/fria para queda da temperatura corporal central.\n- Hidratação com magnésio quelato.\n- Luz âmbar ativada a 2200K (25% brilho) para liberação de melatonina.\n\nBoa recuperação para o Clã Lopes!`;
    return this.sendTextMessage(text, targetNumber);
  }

  /**
   * Match Day Alert (Flamengo or Grêmio)
   */
  async sendMatchDayAlert(
    params: {
      teamName: string;
      opponent: string;
      kickoffTime: string;
      tensionIndex: number;
      recommendedEndTime: string;
    },
    targetNumber?: string
  ): Promise<WhatsAppSendResult> {
    const text = `⚽ *[MATCH DAY ALVO: ${params.teamName.toUpperCase()}]*\n\nPróxima partida: *vs ${params.opponent}* às *${params.kickoffTime}*.\n\n⚠️ *Índice de Tensão:* ${params.tensionIndex}/5\n🔒 *Trava de Corte Vespertino (1h Antes):* O treino deve encerrar impreterivelmente às *${params.recommendedEndTime}* (exatamente 1 hora antes do pontapé inicial das ${params.kickoffTime}) para estabilizar a FC e permitir o banho relaxante.\n🍿 *Buffer Calórico TACO:* +350 kcal ativado para petiscos saudáveis sem sair do plano!`;
    return this.sendTextMessage(text, targetNumber);
  }

  /**
   * TACO Nutrition Macro Summary Alert
   */
  async sendTacoNutritionAlert(
    params: {
      mealName: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    },
    targetNumber?: string
  ): Promise<WhatsAppSendResult> {
    const text = `🥗 *[BIO-TRIAD OS: NUTRIÇÃO TACO]*\n\nRefeição Registrada: *${params.mealName}*\n\n📊 *Macros Calculados:*\n- Calorias: *${params.calories} kcal*\n- Proteína: *${params.protein}g*\n- Carboidratos: *${params.carbs}g*\n- Lipídios: *${params.fats}g*\n\nBalanço calórico atualizado com sucesso no diário nutricional!`;
    return this.sendTextMessage(text, targetNumber);
  }

  /**
   * Strips non-digit characters from the phone number
   */
  private cleanPhoneNumber(number: string): string {
    const digits = number.replace(/\D/g, "");
    if (!digits.startsWith("55") && digits.length >= 10 && digits.length <= 11) {
      return `55${digits}`;
    }
    return digits;
  }
}

export const whatsAppEvolutionService = new WhatsAppEvolutionService();
