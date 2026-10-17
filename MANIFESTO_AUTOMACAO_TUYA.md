# 🏛️ MANIFESTO DE AUTOMAÇÃO RESIDENCIAL TUYA SMART HOME
## Bio-Triad OS • Clã Lopes (Daniel & Patrícia)
**Versão:** 1.0 Haute Horlogerie & Sports Physiology  
**Data Oficial:** 17 de Outubro de 2026  
**Lema:** *"Ciência Biomecânica, Eficiência Energética e Paixão Esportiva — Tudo Pelo Meio Ambiente"*

---

## 1. Preâmbulo & Filosofia

A integração do ecossistema **Tuya Cloud OpenAPI** ao **Bio-Triad OS** não é mero capricho de conveniência doméstica: é uma extensão física da nossa engenharia de performance humana e sustentabilidade ecológica.

Assim como o **Galaxy Watch Ultra 47mm Titanium** captura a microtelemetria biológica (HRV rMSSD, FC de repouso, sono profundo) de Daniel, e a **Telemetria Strava Feminina / Check-in Matinal** calibra o volume e pace de Patrícia, o ambiente residencial inteligente deve reagir autonomamente para:
1. **Regular a Cronobiologia:** Otimizar as curvas de cortisol matinal, dopamina pré-treino e melatonina noturna.
2. **Controlar a Fisiologia Térmica (Protocolo Costill):** Mitigar o desvio cardiovascular (*cardiac drift*) nos treinos de esteira e acelerar a recuperação celular no sono criogênico.
3. **Potencializar a Nutrição TACO:** Orquestrar o shot matinal de cafeína e o pré-aquecimento de refeições sem desperdício de energia.
4. **Preservar o Meio Ambiente (Green Computing & Eco-Home):** Cortar 100% de consumo fantasma (*vampire draw*) durante os treinos fora de casa.
5. **Celebrar a Identidade dos Atletas:** Respeitar com elegância as paixões clubistas — o **Flamengo** de Daniel e o **Grêmio** da Patrícia.

---

## 2. Arquitetura Técnica da Integração

```mermaid
graph TD
    A[Bio-Triad OS Web App / Next.js] -->|HTTPS POST| B[/api/tuya/command]
    B -->|HMAC-SHA256 Sign| C[TuyaSmartHomeService]
    C -->|OAuth 2.0 Token Bearer| D[Tuya Cloud OpenAPI - openapi.tuyaus.com]
    D -->|Zigbee / Wi-Fi Mesh| E[Dispositivos de Hardware]
    
    subgraph Dispositivos Físicos
        E --> F[Lâmpadas & Fitas LED RGB+CCT]
        E --> G[Ar-Condicionado / Tuya Smart IR]
        E --> H[Smart Plugs 16A com Medidor]
        E --> I[Sensores de Presença & Porta]
    end
    
    B -.->|Disparo Paralelo| J[Evolution API WhatsApp]
```

### 2.1. Assinatura Criptográfica HMAC-SHA256
A comunicação com o endpoint `https://openapi.tuyaus.com` utiliza o padrão corporativo da Tuya OpenAPI:
- **Método HTTP:** `POST` ou `GET`
- **Content-Hash:** SHA-256 do corpo JSON da requisição
- **String to Sign:** `HTTP_METHOD + "\n" + contentHash + "\n" + headers + "\n" + urlPath`
- **Assinatura Final:** `HMAC-SHA256(clientId + accessToken + timestamp + stringToSign, clientSecret).toUpperCase()`
- **Segurança de Token:** Cache em memória com renovação proativa 60 segundos antes da expiração.

---

## 3. O Decálogo das Automações Inteligentes

Abaixo estão as 10 automações fundamentais arquitetadas para o Clã Lopes:

| # | Nome da Automação | Gatilho Temporal / Evento | Hardware Tuya | Datapoints (DP Codes) | Objetivo Fisiológico & Ecológico |
|---|---|---|---|---|---|
| **01** | **Aurora Solar Gradual** | Domingos 06:00 (Pré-Longão) | Lâmpadas & Fita LED Quarto/Sala | `colour_data: {h:32, s:800, v:600}`, `bright_value_v2: 600` | Inibe melatonina e eleva cortisol suavemente, sem estresse de alarme. |
| **02** | **Surge de Dopamina (Eclusa)** | Seg-Qui 18:30 | Lâmpadas Escritório & Sala | `temp_value_v2: 950` (6500K), `bright_value_v2: 900` | Luz fria inibe sonolência pós-trabalho e induz prontidão neuromuscular. |
| **03** | **Freio Térmico Parassimpático** | Diariamente 20:30 | Iluminação Geral da Casa | `temp_value_v2: 100` (2200K Âmbar), `bright_value_v2: 250` | Bloqueia espectro azul (460nm), estimulando síntese endógena de melatonina. |
| **04** | **Pré-Resfriamento de Esteira (Costill)** | 15 min pré-treino indoor | Ar-Condicionado / Tuya IR | `switch: true`, `mode: "cold"`, `temp_set: 19`, `windspeed: "high"` | Mitiga deriva cardíaca. Correr a 19°C economiza 12-15 bpm no mesmo pace. |
| **05** | **Câmara de Sono Criogênico (N3)** | 22:30 às 04:30 | AC Quarto + Sensor de Temp | `switch: true`, `mode: "cold"`, `temp_set: 20`, `windspeed: "low"` | Queda da temperatura central corporal maximiza estágio N3 e pico de GH. |
| **06** | **Barista Pré-Longão (Cafeína)** | 05:45 (Dias de Longão) | Smart Plug 16A Cafeteira | `switch_1: true`, `countdown_1: 900` (auto-off 15 min) | Garante 3mg/kg de cafeína anidra absorvida 45 min antes de correr 21 km. |
| **07** | **Modo "Fui Correr" (Eco All-Off)** | Saída de casa para treino | Smart Plugs + Interruptores | `switch_led: false`, `switch: false`, `switch_1: false` | Corta consumo fantasma (80W/h) de monitores, TVs e luzes secundárias. |
| **08** | **Chegada Triunfante & Descompressão** | Abertura de porta retorno | Fita LED Hall + Tomada Ventilador | `colour_data: {h:145, s:600, v:700}`, `switch: true` | Luz verde eucalipto e ventilação suave aceleram recuperação vagal pós-treino. |
| **09** | **Match Day Mengão (Maracanã)** | 1h antes do jogo do Flamengo | Lâmpadas & Fitas LED Sala | `colour_data: {h:358, s:1000, v:1000}` (Vermelho Escarlate) | Imersão sensorial para Daniel + ativação de buffers alimentares no Cockpit. |
| **10** | **Match Day Grêmio (Arena)** | 1h antes do jogo do Grêmio | Lâmpadas & Fitas LED Sala | `colour_data: {h:202, s:920, v:1000}` (Azul Celeste) | Celebração da identidade tricolor gaúcha de Patrícia com luz fria e celeste. |

---

## 4. Detalhamento Fisiológico & Científico

### 4.1. Cronobiologia Luminosa (Lâmpadas RGB+CCT)
A retina possui células ganglionares intrinsecamente fotossensíveis (ipRGCs) que expressam **melanopsina**, com pico de sensibilidade em **480 nm (luz azul)**. 
- **Às 18h30 (6500K Fria):** A incidência de fótons de alta frequência suprime a melatonina e sinaliza ao núcleo supraquiasmático (NSQ) estado de alerta máximo para a corrida noturna ou academia.
- **Às 20h30 (2200K Âmbar a 20%):** O comprimento de onda passa para a faixa de 600-700 nm (vermelho/âmbar), incapaz de ativar ipRGCs, permitindo que a glândula pineal secrete melatonina para adormecimento rápido.

### 4.2. Gestão Térmica de Esteira (Protocolo Costill 19°C)
David Costill demonstrou que em ambientes acima de 22°C com umidade relativa moderada, o organismo desvia até **25% do débito cardíaco** para o leito capilar subcutâneo exclusivamente para termorregulação por sudorese. 
- Isso causa **Deriva Cardíaca (*Cardiac Drift*)**: a frequência cardíaca sobe progressivamente mesmo mantendo exatamente a mesma velocidade na esteira.
- O pré-resfriamento do cômodo para **19°C via Tuya IR** 15 minutos antes do início do treino garante que a quase totalidade do volume sistólico seja dedicada à oxigenação dos grupos musculares locomotores (quadríceps, glúteos e sóleos).

### 4.3. Câmara de Sono Criogênico (Sono N3 & Pico de GH)
A transição para o sono profundo de ondas lentas (estágio N3) exige uma **redução de ~1°C na temperatura corporal central (*core temperature*)**. Em quartos quentes (>23°C), o corpo gasta energia dilatando vasos distais para resfriar, gerando microdespertares e fragmentação de sono (visíveis na HRV rMSSD do Galaxy Watch Ultra).
- O comando `CRYO_SLEEP` fixa o ambiente em 20°C no início da noite, garantindo a janela ótima de secreção do hormônio do crescimento (somatotropina) entre 23h30 e 02h00.

---

## 5. Mapeamento de Datapoints Tuya (Códigos de Hardware)

### 5.1. Iluminação Inteligente (Bulbos & Fitas LED Wi-Fi/Zigbee)
```json
[
  { "code": "switch_led", "value": true },
  { "code": "work_mode", "value": "white" },
  { "code": "bright_value_v2", "value": 900 },
  { "code": "temp_value_v2", "value": 950 }
]
```
- `temp_value_v2`: Escala de 0 (2200K ultra quente) a 1000 (6500K branco puro polar).
- `colour_data`: Objeto JSON com `{ "h": 0-360, "s": 0-1000, "v": 0-1000 }` para matizes RGB precisos (Flamengo: `h: 358`, Grêmio: `h: 202`).

### 5.2. Climatização (Ar-Condicionado via Módulo Tuya Universal IR)
```json
[
  { "code": "switch", "value": true },
  { "code": "mode", "value": "cold" },
  { "code": "temp_set", "value": 19 },
  { "code": "windspeed", "value": "high" }
]
```

### 5.3. Tomadas & Plugs Inteligentes (Smart Plug 16A / 20A)
```json
[
  { "code": "switch_1", "value": true },
  { "code": "countdown_1", "value": 900 }
]
```
- `countdown_1`: Temporizador de segurança em segundos (ex: 900s = 15 minutos de fervura de café/chá antes de auto-desligamento).
- `cur_power`: Leitura em tempo real de consumo em Watts (W) para cálculo de eficiência energética.

---

## 6. Sinergia com Evolution API WhatsApp

Cada automação executada no Tuya dispara opcionalmente uma confirmação proativa no WhatsApp através do nosso servidor oficial da Evolution API:

```
[Bio-Triad OS • Alerta Tuya]
⚡ Cena Ativada: Pré-Resfriamento de Esteira 19°C (Costill Protocol)
🏃 Atleta: Daniel Lopes (Treino Z2/Z3 8km às 19h00)
🌡️ Climatização: Ar-condicionado sala ajustado para 19°C
🌿 Consumo Eco: Previsão de economia de 14 bpm por mitigação de deriva cardíaca!
```

---

## 7. Variáveis de Ambiente no Servidor Render / Vercel

Para que as requisições de hardware sejam despachadas para o gateway físico da sua casa, certifique-se de configurar no seu `.env` ou painel de variáveis da Render/Vercel:

```bash
# Tuya Cloud OpenAPI Credentials
TUYA_ENDPOINT="https://openapi.tuyaus.com"
TUYA_CLIENT_ID="seu_access_id_tuya"
TUYA_CLIENT_SECRET="seu_access_secret_tuya"

# Mapeamento de Hardware Real
TUYA_DEVICE_LIVING_ROOM_LIGHT="tuya_light_01"
TUYA_DEVICE_BALCONY_LED="tuya_led_02"
TUYA_DEVICE_AC_TREADMILL="tuya_ir_ac_01"
TUYA_DEVICE_COFFEE_PLUG="tuya_plug_coffee"
TUYA_DEVICE_BEDROOM_AC="tuya_ir_bedroom_ac"
```

> **Nota:** Caso o sistema opere sem credenciais Tuya configuradas, o `TuyaSmartHomeService` entra em modo gracioso com log claro e mock visual, garantindo que a aplicação nunca trave nem gere erro 500 para os usuários.

---

## 8. Conclusão & Próximos Passos

Com o presente Manifesto e a suíte de endpoints `/api/tuya/command` ativa:
1. O **Bio-Triad OS** passa de um mero registrador de treinos para um **sistema nervoso central biomecânico e residencial**.
2. Daniel e Patrícia possuem comando tátil em tempo real no **Cockpit** e no modal interativo **Manifesto Tuya**, além de automação por cronograma.
3. A casa opera a favor da medalha nos 21k e 10k, sem desperdiçar um único watt desnecessário.

*Clã Lopes: Onde alta relojoaria, ciência esportiva e lar inteligente convergem.*
