export class TelegramNotificationService {
  private botToken: string;
  private defaultChatId: string;

  constructor() {
    this.botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      "8747587886:AAFAAg5Ky43Y68X9MbXXCd_iCdNFnRbIMrI";
    this.defaultChatId = process.env.TELEGRAM_CHAT_ID || "6315130099";
  }

  /**
   * Dispatches proactive Markdown message to Telegram chat
   */
  async sendMessage(text: string, chatId?: string): Promise<boolean> {
    const targetChatId = chatId || this.defaultChatId;
    if (!this.botToken || !targetChatId) {
      console.warn("[TelegramService] Token or Chat ID not configured.");
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: targetChatId,
          text,
          parse_mode: "Markdown",
        }),
      });

      const data = await res.json();
      return data.ok ?? false;
    } catch (err) {
      console.error("[TelegramService] Error sending message:", err);
      return false;
    }
  }

  /**
   * Eclusa 18h30 Notification: Transition & Workout Reminder
   */
  async sendEclusa1830Alert(workoutSummary: string): Promise<boolean> {
    const text = `
⚡ *[BIO-TRIAD OS: ECLUSA 18H30]*
Boa noite, Daniel! Hora de fechar as tarefas do trabalho e destravar o modo atleta.

🏃 *Missão das 19h:*
${workoutSummary}

💡 *Automação:* Luzes da sala ajustadas para 6500K (Foco & Dopamina).
🧠 Faça o Brain Dump de pendências no app para esvaziar a mente!
`;
    return this.sendMessage(text.trim());
  }

  /**
   * Freio Térmico 20h30 Notification: Melatonin & Wind Down
   */
  async sendThermalBrake2030Alert(): Promise<boolean> {
    const text = `
🌙 *[BIO-TRIAD OS: FREIO TÉRMICO 20H30]*
Treino concluído com maestria!

🧊 *Protocolo Parassimpático:*
- Ducha morna/fria para queda da temperatura corporal central.
- Hidratação com magnésio quelato.
- Luz âmbar ativada a 2200K (25% brilho) para liberação de melatonina.

Boa recuperação para o Clã Lopes!
`;
    return this.sendMessage(text.trim());
  }

  /**
   * Match Day Alert (Flamengo or Grêmio)
   */
  async sendMatchDayAlert(params: {
    teamName: string;
    opponent: string;
    kickoffTime: string;
    tensionIndex: number;
    recommendedEndTime: string;
  }): Promise<boolean> {
    const text = `
⚽ *[MATCH DAY ALVO: ${params.teamName.toUpperCase()}]*
Próxima partida: *vs ${params.opponent}* às *${params.kickoffTime}*.

⚠️ *Índice de Tensão:* ${params.tensionIndex}/5
⏱️ *Corte Logístico:* O treino das 19h deve encerrar impreterivelmente às *${params.recommendedEndTime}*.
🍿 *Buffer Calórico:* +350 kcal ativado para petiscos saudáveis sem sair da dieta TACO!
`;
    return this.sendMessage(text.trim());
  }
}

export const telegramNotificationService = new TelegramNotificationService();
