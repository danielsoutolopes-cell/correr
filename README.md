# Bio-Triad OS (Haute Horlogerie & Tactical Dispatch Edition - V11.0)

> **Sistema Operacional Unificado de Performance Híbrida, Nutrição TACO de Precisão, Logística de Alvorada e Neuro-Descompressão**  
> *Repositório Oficial:* `https://github.com/danielsoutolopes-cell/correr.git`  
> *Ambiente de Produção:* `https://correr-gukc.onrender.com`  
> *Residência do Clã:* `Rua Maracá, 132, São Paulo, SP, CEP 04313-210`

---

## 1. Visão Geral da Arquitetura & Módulos

O **Bio-Triad OS** é uma plataforma full-stack de engenharia esportiva, descompressão neural e automação residencial desenhada especificamente para o **Clã Lopes (Daniel, Patrícia & Gabriel)**:

1. **Alvorada de Prova & Despacho Tático (Rua Maracá, 132):**
   - **Origem Fixada:** `Rua Maracá, 132, São Paulo, SP, CEP 04313-210` (Vila Guarani / Jabaquara).
   - **Regra de Ouro (-1h):** Chegada no local da prova garantida com 1 hora de antecedência (ex: 05:30 para largada 06:30).
   - **Cálculo de Deslocamento:** 14.2 km até a Marginal Pinheiros (22 min de carro + 10 min de manobra = 32 min total; saída às 04:58).
   - **Tomada Dupla Tuya (`ebc4a8285904c4bd43crx7`):** Acionamento automatizado do cafezinho de Daniel (`switch_1` 15 min) e chimarrão de Patrícia (`switch_2` 10 min).
   - **Iluminação Tática do Closet:** Leds do Cabide e Porta em 4000K para uniformes e tênis com placa de carbono.
   - **Navegação com 1 Clique:** Deep-links diretos para Waze e Google Maps.

2. **Simulador Tático Km a Km & Modo Prova Ao Vivo:**
   - **Execução em Tempo Real:** Cronômetro Haute Horlogerie centesimal, contagem regressiva 3-2-1 e tiro de largada sonoro via Web Audio API.
   - **Registro de Splits:** Botão "Passar Km" que registra tempo parcial, compara com o planejado e calcula o delta em tempo real.
   - **Áudio Coach ao Vivo:** Voz sintetizada que narra os tempos e dá instruções de ritmo e hidratação.
   - **Metrônomo Sonoro de Cadência:** Ajuste preciso de SPM (178 Daniel, 180 Patrícia, 185 Gabriel).
   - **Calibrador de Base:** Salva os tempos para cálculo de zonas e gera Trophy Cards para redes sociais.

3. **Sincronização com Futebol & Trava de Treino (-1h):**
   - **Trava de Corte Vespertino:** Corta o treino 1 hora antes do início do jogo (Flamengo, Grêmio ou Palmeiras) para banho e acomodação.
   - **Onde Assistir:** Indicação em tempo real dos canais e serviços de streaming da partida (Globo, Premiere, SporTV, CazéTV, Prime Video, Disney+).

4. **Mental Health & Módulo Streaming (Netflix, Disney+, Prime Video):**
   - Sugestões curadas de filmes, documentários esportivos, séries e doramas para relaxamento pós-jantar.
   - Botão "🎬 Modo Cinema" com iluminação âmbar a 15% e tomada da TV ligada.

5. **Previsão do Tempo do Dia Seguinte (D+1):**
   - Temperatura matinal, umidade, vento, ponto de orvalho e sugestão de vestuário e hidratação para a manhã seguinte.

6. **Hall do Clã Lopes, Troféus & Easter Eggs:**
   - Vitrine de 1.652 km somados pela família, tempos oficiais líquidos (*Chip Time*), posições gerais e de categoria.
   - Easter eggs com cliques no logotipo exibindo celebrações clubistas com hinos e fogos.

7. **Nutrição de Precisão TACO (Balança dos 58% vs 42%):**
   - Panela familiar única dividida matematicamente na balança (58% Daniel / 42% Patrícia).
   - Protocolo de café da manhã de prova pré-calculado com carboidratos de rápida absorção e sódio.

8. **Automação Residencial Tuya IoT (12 Cenas Ativas):**
   - Conexão direta com OpenAPI Tuya US com assinatura HMAC-SHA256 para lâmpadas, fitas LED, tomadas inteligentes e ar-condicionado.

---

## 2. Stack Tecnológica

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Estética:** Haute Horlogerie Dark Theme, Vanilla TailwindCSS, Neons HSL, Glassmorphism
- **Áudio & Voz:** Web Audio API (Sintetizador Harmônico de Buzinas e Metrônomo) + SpeechSynthesis nativo
- **Inteligência Artificial:** Google Gemini 2.5 Flash com Search Grounding
- **APIs de Terceiros:** Intervals.icu REST, OpenWeatherMap, Tuya IoT Cloud OpenAPI, Evolution API WhatsApp, Telegram Bot API
- **Banco de Dados:** PostgreSQL Serverless Neon / Supabase

---

## 3. Variáveis de Ambiente (`.env`)

```ini
# Google Gemini 2.5 Flash
GEMINI_API_KEY="sua_chave_gemini"

# Intervals.icu (Galaxy Watch Ultra Daniel)
INTERVALS_ATHLETE_ID="I753639"
INTERVALS_API_KEY="sua_chave_intervals"

# Tuya Smart Home Cloud (US OpenAPI)
TUYA_CLIENT_ID="seu_access_id"
TUYA_CLIENT_SECRET="seu_client_secret"
TUYA_ENDPOINT="https://openapi.tuyaus.com"
TUYA_DEVICE_DUAL_PLUG="ebc4a8285904c4bd43crx7"
TUYA_DEVICE_BEDROOM_LED="eb4deff019cb6627614ic8"
TUYA_DEVICE_CLOSET_HANGER_LED="eb7e8e6b7909ed343dfawf"
TUYA_DEVICE_LIVING_ROOM_LIGHT="eb52fdf73913d81cf5ruqt"

# WhatsApp Evolution API
EVOLUTION_API_URL="https://whatsapp-ecostone.onrender.com"
EVOLUTION_INSTANCE_NAME="ecostone"
EVOLUTION_API_KEY="sua_chave"

# Telegram Bot
TELEGRAM_BOT_TOKEN="seu_token"
TELEGRAM_CHAT_ID="seu_chat_id"
```

---

## 4. Execução Local & Build

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Validar e compilar produção
npm run build
```

---

*Bio-Triad OS v11.0.0 • Desenvolvido com carinho e precisão suíça para o Clã Lopes.*
