# Bio-Triad OS (Anti-Mock & Real-Data Edition - V10.0)

> **Sistema Operacional Unificado de Performance Híbrida, Nutrição TACO de Precisão e Neuro-Descompressão**  
> *Repositório Oficial:* `https://github.com/danielsoutolopes-cell/correr.git`

---

## 1. Visão Geral da Arquitetura

O **Bio-Triad OS** é uma plataforma full-stack de engenharia esportiva e descompressão neural desenhada especificamente para a **Família Lopes (Daniel & Patrícia)**, integrando:

1. **Performance Híbrida & Corrida Dual-Mode:**
   - **Rua (Outdoor):** Métricas de GPS, pace alvo (`min/km`), zonas de frequência cardíaca Z1 a Z5 e cadência.
   - **Esteira (Indoor):** Conversão biomecânica via fórmula de Costill com inclinação compensatória (1.0% a 4.0%) e blocos de tempo/velocidade somando no máximo **60 minutos nos dias úteis**.
   - **Musculação Completa (Fichas A, B, C):** IronLog com adaptação clínica estrita para a **prótese reversa no ombro direito de Daniel** (bloqueio de exercícios overhead, substituição por pegada neutra a 45° no plano escapular).
   - **Ciclismo & Mobilidade:** 1 a 2x por semana (giros regenerativos e pedal recreativo em família).

2. **Fim de Semana Flexível:**
   - Alternância dinâmica entre **Modo Clássico** (Longão de 16-18 km no Domingo) vs. **Modo Família** (Longão no Sábado + Pedal em Família no Domingo).

3. **Nutrição de Precisão & Tabela TACO Oficial:**
   - **Multimodal Bio-Scanner:** Alimentado por `gemini-2.5-flash` para identificação taxonômica de pratos e fotos.
   - **Tabela TACO (UNICAMP):** Classificação tática em **P1-P3** (Proteínas), **C1-C3** (Carboidratos/Leguminosas) e **V1-V3** (Vegetais, Nitratos e Lipídeos Cardioprotetores).
   - **Porcionamento Familiar:** Cálculo automático de gramaturas para Daniel (80kg -> meta 75kg) vs Patrícia (58kg -> meta 55kg).
   - **Modo Petiscos Saudáveis:** Buffer calórico de +350 kcal ativado em dias de jogos tensos.
   - **Calculadora de Carb-Loading:** Saturação de glicogênio (7-8g carb/kg) nos 3 dias pré-prova de 21k.

4. **Saúde Mental & Neuro-Descompressão (5 Estações):**
   - **Eclusa 18h30:** Brain Dump para desconexão do trabalho antes da rotina familiar e do treino.
   - **Freio Térmico 20h30:** Resfriamento fisiológico pós-treino e estímulo da melatonina com iluminação âmbar.
   - **Protocolo Pós-Jogo:** Manejo da taquicardia e do tônus simpático pós-partidas de Flamengo e Grêmio.
   - **Reset de Dias OFF:** Segunda e Sexta-feira dedicadas a descanso passivo completo.
   - **Botão SOS 4-7-8:** Player visual com guia respiratório (4s inspiração, 7s retenção, 8s expiração).

5. **Family Football Hub em Tempo Real:**
   - Consulta à internet via Google Gen AI SDK com grounding no Google Search.
   - Tabela do Brasileirão atualizada, últimos resultados e próximos jogos de Flamengo e Grêmio.
   - Índice de Tensão Cardíaca (1 a 5) com corte logístico automático de treino para término às 20h50 quando Tensão >= 4.

6. **Hardware & IoT (Zero Mock):**
   - **Samsung Galaxy Watch Ultra:** Consumo direto da API REST do Intervals.icu (`/wellness` e `/activities` para o atleta `I753639`).
   - **Tuya Smart Home Cloud:** OpenAPI dos EUA com assinatura HMAC-SHA256 para controle de cenas de luzes e tomadas inteligentes.

7. **Temporada de Provas 2027:**
   - **P1 Confirmada:** Maratona Internacional de São Paulo (21k) - 11 de Abril de 2027.
   - **P1 Confirmada:** Nike SP City Marathon (21k) - 25 de Julho de 2027.
   - **P2 Prep (Rascunho TBD):** Meia Maratona de Praia Grande (21k) - Janela Set/Out 2027.
   - Tapering regressivo de 3 semanas e Recovery Lock de 14 dias pós-21k.

---

## 2. Stack Tecnológica

- **Framework:** Next.js 15 (App Router) + React 18 + TypeScript estrito
- **Estilização:** Tailwind CSS com paleta esportiva escura (`#090D16`), cards (`#111827`) e acentos neon HSL
- **ORM & Banco de Dados:** Drizzle ORM + PostgreSQL (`src/db/schema.ts`)
- **Motor de Inteligência Artificial:** `@google/genai` (Gemini 2.5 Flash + Google Search Grounding)
- **PWA:** `manifest.json` com suporte a `Web Share Target` para compartilhamento direto de fotos
- **Agendamento Serverless:** Vercel Cron (`vercel.json`)

---

## 3. Variáveis de Ambiente (`.env.local` / `.env`)

```ini
# Google Gen AI SDK (Obrigatório para Football Hub e Bio-Scanner visual)
GEMINI_API_KEY="sua_chave_gemini"

# Intervals.icu REST API (Telemetria do Galaxy Watch Ultra)
INTERVALS_API_KEY="sua_chave_intervals"
INTERVALS_ATHLETE_ID="I753639"

# Tuya Smart Home Cloud OpenAPI (EUA)
TUYA_CLIENT_ID="seu_tuya_access_id"
TUYA_CLIENT_SECRET="seu_tuya_secret"
TUYA_ENDPOINT="https://openapi.tuyaus.com"
TUYA_DEVICE_LIVING_ROOM_LIGHT="id_lampada_sala"
TUYA_DEVICE_BALCONY_LED="id_fita_led"

# PostgreSQL Serverless (Neon / Supabase / Local)
DATABASE_URL="postgres://postgres:postgres@localhost:5432/bio_triad_os"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 4. Execução Local

```bash
# Instalação das dependências
npm install

# Inicialização do servidor em desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Seeding do banco de dados com a Tabela TACO Oficial
npm run db:seed
```
