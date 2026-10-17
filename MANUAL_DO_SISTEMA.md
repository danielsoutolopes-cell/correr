# 📘 BIO-TRIAD OS • MANUAL OFICIAL DE OPERAÇÃO & ENGENHARIA CLÍNICA
**Versão:** 11.0.0 *Haute Horlogerie & Tactical Dispatch Edition*  
**Household ID:** `LOPES-TRIAD-2027`  
**Atletas:** Daniel Souto Lopes (Flamengo 🔴⚫), Patrícia Lopes (Grêmio 🔵⚪⚫) & Gabriel Lopes (Palmeiras 🟢⚪)  
**Residência Oficial:** `Rua Maracá, 132, São Paulo, SP, CEP 04313-210` (Vila Guarani / Jabaquara)  
**Ambiente de Produção:** [https://correr-gukc.onrender.com](https://correr-gukc.onrender.com)  

---

## 🧭 1. INTRODUÇÃO & FILOSOFIA DO SISTEMA

O **Bio-Triad OS** é um sistema operacional biométrico, esportivo e logístico projetado sob medida para a família Lopes. Ele unifica em uma interface com estética de alta relojoaria (*Haute Horlogerie / Richard Mille / Porsche Design*):
1. **Treinador Híbrido:** Corrida Z2 contínua (*Dual-Mode* rua vs esteira com cálculo de Costill) + Musculação A/B/C adaptada.
2. **Nutrição TACO Real (UNICAMP):** Classificação taxonômica de alimentos e divisão da refeição familiar cozida em **uma única panela** (58% Daniel / 42% Patrícia).
3. **Logística & Alvorada de Prova:** Cálculo automatizado de tempo de carro a partir da Rua Maracá, 132, cumprimento estrito da **Regra de Chegada 1h Antes da Largada (-1h)**, acionamento da Tomada Dupla Tuya (cafezinho de Daniel e chimarrão de Patrícia) e deep-links no Waze e Google Maps.
4. **Simulador Tático Km a Km:** Cronômetro Haute Horlogerie centesimal, buzina e tiro de largada sonoro, metrônomo de cadência (178/180/185 SPM) e cálculo de splits com delta de pace.
5. **Trava de Treino Inteligente:** Corte automático do treino vespertino 1 hora antes do início do jogo do clube (Flamengo, Grêmio ou Palmeiras).
6. **Neuro-Descompressão & IoT:** Cenas circadianas Tuya Smart Home, módulo Netflix & streaming esportivo, e gestão de adrenalina.
7. **Política Estrita Anti-Mock:** Zero `Math.random()`. Dados de futebol utilizam Google Gemini 2.5 Flash com Grounding ao vivo, telemetria consome APIs REST do Intervals.icu e comandos acionam a nuvem Tuya física real.

---

## 👥 2. IDENTIDADE ATLÉTICA DO CLÃ LOPES

O sistema opera sob **individualização matemática estrita**. Nenhum pace, treino, prova, time de futebol ou pesagem de prato é compartilhado incorretamente.

| Parâmetro Tático | 🔴⚫ Daniel Souto Lopes | 🔵⚪ Patrícia Lopes | 🟢⚪ Gabriel Lopes |
| :--- | :--- | :--- | :--- |
| **Clube de Coração** | **Flamengo (Maracanã)** | **Grêmio (Arena)** | **Palmeiras (Allianz Parque)** |
| **Idade & Estatura** | 52 anos • 170 cm | 56 anos • 162 cm | 20 anos • 182 cm |
| **Massa Corporal** | 80.0 kg (Meta P1: **75.0 kg**) | 58.0 kg (Meta P1: **55.0 kg**) | 72.0 kg (Meta: Manutenção) |
| **Prova Alvo P1** | **Athenas Mizuno Run Longer (21k)** | **Athenas Mizuno Run Longer (14k)** | **Circuito das Estações (10k)** |
| **Meta de Tempo P1** | **Sub-1h55** (Pace alvo: **5:27 min/km**) | **Sub-1h24** (Pace alvo: **6:00 min/km**) | **Sub-48min** (Pace alvo: **4:48 min/km**) |
| **Pace de Rodagem Z2** | **5:50 a 6:20 min/km** | **6:30 a 7:15 min/km** | **5:00 a 5:30 min/km** |
| **Cadência Alvo (SPM)** | **178 SPM** | **180 SPM** | **185 SPM** |
| **Hardware & Wearables**| **Galaxy Watch Ultra (47mm)** | **Strava App / Smartwatch** | **Strava App / Garmin** |
| **Intervals.icu ID** | `I753639` (Sono, HRV, RHR) | Entrada Manual / Strava Pro | Entrada Manual / Strava |
| **Condição Clínica** | **Prótese Reversa de Ombro Direito** | **Membros Superiores 100% Livres**| **Atleta Jovem Sem Restrições** |
| **Foco Biomecânico** | Proteção articular e sem cargas overhead | Glúteo Médio & Prevenção de Valgo | Potência e Economia de Corrida |
| **Balança TACO da Panela**| **58% da Panela Familiar** (2350 kcal) | **42% da Panela Familiar** (1780 kcal) | Individualizado Jovem |

---

## 🌅 3. ALVORADA DE PROVA & DESPACHO TÁTICO UNIVERSAL (ADAPTÁVEL A TODAS AS CORRIDAS & HORAS DE LARGADA)

No dia de qualquer corrida oficial programada no sistema, cada minuto conta. O módulo de **Alvorada de Prova & Despacho Tático** foi arquitetado de forma 100% universal e inteligente: **ele é válido e adaptável para absolutamente TODAS as provas cadastradas no Bio-Triad OS** (Athenas Mizuno, Meia Internacional de SP, Meia Vênus Jockey Club, Olga Kos Pacaembu/Ibirapuera, Circuito das Estações, Corrida da USP, São Silvestre ou qualquer prova personalizada criada no gerenciador).

### A. Princípio da Adaptação Inteligente ao Horário de Largada ($T_{gun}$)
Ao invés de horários fixos engessados, o sistema utiliza um **algoritmo de cronometria reversa circular**, ancorado no horário oficial de disparo da prova ($T_{gun}$):
* **Configurável por Prova:** O usuário ou o sistema calibra a hora oficial da largada (ex: `06:00`, `06:15`, `06:30`, `06:45`, `07:00`, `07:30`, `08:00`). O valor é salvo no perfil da prova e lembrado no navegador.
* **Cálculo em Tempo Real:** Todo o encadeamento de automações (despertar, luz âmbar no quarto, tomada dupla de café/mate, closet guiado, café da manhã TACO, saída de carro e sono da véspera) se recalcula instantaneamente quando o horário de largada é alterado.

### B. Origem Residencial & Cálculo de Deslocamento Automático
* **Origem Oficial Fixa:** `Rua Maracá, 132, São Paulo, SP, CEP 04313-210` (Vila Guarani / Jabaquara).
* **Auto-Geocodificação de Arenas e Destinos:**
  - **Marginal Pinheiros (Parque do Povo / Shopping JK):** 14.2 km • 32 min (22 min direção + 10 min estacionamento).
  - **Ibirapuera / Obelisco (Portão 3):** 7.8 km • 24 min (14 min direção + 10 min estacionamento).
  - **Pacaembu (Praça Charles Miller):** 12.8 km • 30 min (20 min direção + 10 min estacionamento).
  - **USP (Cidade Universitária / CEPEUSP):** 18.5 km • 38 min (26 min direção + 12 min estacionamento).
  - **Jockey Club de São Paulo (Meia Vênus):** 13.5 km • 30 min (20 min direção + 10 min estacionamento).
  - **Avenida Paulista / São Silvestre:** 11.4 km • 33 min (18 min direção + 15 min estacionamento).
  - **Local Personalizado:** Campo livre com cálculo de deslocamento customizado.

### C. A Regra de Ouro da Chegada (-1h)
A meta de chegada à arena de qualquer prova é **rigorosamente 1 hora antes da largada oficial**:
* $T_{chegada} = T_{gun} - 60 \text{ min}$
* $T_{saída} = T_{chegada} - T_{trânsito}$ (calculado de carro a partir da Rua Maracá, 132).
* *Exemplo 1 (Largada 06:30 na Marginal):* Chegada às **05:30** • Saída de carro às **04:58** (32 min trânsito).
* *Exemplo 2 (Largada 06:15 no Ibirapuera):* Chegada às **05:15** • Saída de carro às **04:51** (24 min trânsito).
* *Exemplo 3 (Largada 07:00 no Pacaembu):* Chegada às **06:00** • Saída de carro às **05:30** (30 min trânsito).
* *Vantagens comprovadas:* Vaga de estacionamento garantida sem congestionamentos de acesso, uso de sanitários químicos com fila zero, 15 minutos para trote leve Z1 e mobilidade articular, e entrada no curral de pace com batimentos cardíacos serenos 15 minutos antes do tiro de largada.

### D. Encadeamento Reverso das 9 Etapas Automatizadas
A partir de $T_{gun}$, o sistema orquestra:
1. **$T_{gun} - 9 \text{h} 50 \text{min}$ ($T_{sono}$):** *Sono da Véspera (8h N3).* Recomendação de deitar até o horário indicado para garantir 8 horas de sono restaurador e liberação ótima de GH antes do despertar.
2. **$T_{gun} - 1 \text{h} 50 \text{min}$ ($T_{alvorada}$):** *Alvorada Solar no Quarto.* O `Led Quarto` (`eb4deff019cb6627614ic8`) acende suavemente em tom âmbar 2700K (15% subindo para 60%), elevando o cortisol circadiano e cessando a melatonina sem taquicardia.
3. **$T_{gun} - 1 \text{h} 40 \text{min}$ ($T_{alarme}$):** *Despertar & Briefing Treinador.* Voz sintetizada do aplicativo narrando temperatura no local, vento, umidade e diretriz tática.
4. **$T_{gun} - 1 \text{h} 35 \text{min}$ ($T_{bebidas}$):** *Tomada Dupla Tuya (`ebc4a8285904c4bd43crx7`).*
   - **Daniel:** Canal 1 (`switch_1`) liga cafeteira (auto-off em 15 min) para pico de cafeína no aquecimento.
   - **Patrícia:** Canal 2 (`switch_2`) liga chaleira de Mate/Chimarrão (auto-off em 10 min) para polifenóis termogênicos.
   - **Casal / Clã:** Ambos os canais são ativados simultaneamente.
5. **$T_{gun} - 1 \text{h} 30 \text{min}$ ($T_{closet}$):** *Closet Iluminado.* `Led Cabide` (`eb7e8e6b7909ed343dfawf`) e `Led Porta` acendem em 4000K (70%) para visualização de uniformes, número de peito e tênis de carbono.
6. **$T_{gun} - 1 \text{h} 25 \text{min}$ ($T_{café}$):** *Nutrição TACO de Rápida Digestão.* Tostada de sourdough + pasta de amendoim + mel/banana + 400ml de água eletrolítica (350mg de sódio).
7. **$T_{gun} - 1 \text{h} 02 \text{min}$ ($T_{saída}$):** *Modo 'Fui Correr' (Eco All-Off).* Corte total de standbys e partida de carro da garagem da Rua Maracá, 132.
8. **$T_{gun} - 60 \text{min}$ ($T_{chegada}$):** *Chegada ao Local (-1h).* Estacionamento concluído, aquecimento e curral.
9. **$T_{gun}$ (0 min):** *LARGADA OFICIAL 🏁.* Disparo da prova e início da cronometria.

---

## ⏱️ 4. SIMULADOR TÁTICO KM A KM & MODO PROVA AO VIVO

Acessível pelo botão **"Tática"** na TopBar ou no Cockpit:
1. **Modo Planejamento Km a Km:**
   - Permite desenhar a estratégia de cada km da prova (Zonas de FC, Paces, Consumo de Carbogel e Hidratação).
   - Indicação visual de pontos de hidratação (água a cada 2.5 km e gel aos 40-45 min).
2. **Modo Prova Ao Vivo (Execução em Tempo Real):**
   - **Contagem Regressiva 3-2-1:** Buzina e tiro de largada com áudio sintetizado em alta fidelidade via Web Audio API.
   - **Cronômetro Haute Horlogerie:** Mostrador centesimal com estética de relógio de corrida de precisão.
   - **Botão "Passar Km":** Registra a passagem de cada split de 1 km, calculando a parcial, a média e o delta vs pace planejado.
   - **Áudio Coach em Tempo Real:** Narrador de voz em português que anuncia em tempo real: *"Km 5 concluído! Tempo parcial 27 minutos e 15 segundos. Você está 12 segundos adiantado! Mantenha a cadência!"*.
   - **Metrônomo Sonoro de Cadência:** Beep acústico configurável (178 SPM para Daniel, 180 SPM para Patrícia, 185 SPM para Gabriel) para ditar o ritmo exato da passada.
   - **Calibração de Base:** Botão que salva o tempo no `localStorage` como calibrador para os próximos treinos e abre o gerador de Trophy Cards.

---

## ⚽ 5. SINCRONIZAÇÃO COM FUTEBOL & TRAVA DE TREINO VESPERTINO (-1H)

Para garantir que o treino nunca colida com a transmissão dos jogos do clube do coração:
1. **Trava Inteligente de Treino 1h Antes do Kickoff:**
   - Se o jogo do Flamengo começa às 18:30 (ou do Grêmio às 16:00), o sistema calcula automaticamente o horário limite de corte: **17:30** (ou **15:00**).
   - Bloqueia no Cockpit a prescrição de treinos longos vespertinos que ultrapassem essa eclusa, garantindo tempo hábil para banho, hidratação e acomodação diante da TV.
   - Alertas proativos via WhatsApp e Telegram informando a trava do dia.
2. **Onde Assistir (Canais de Transmissão):**
   - O card de futebol do sistema informa em tempo real o canal e serviço de streaming oficial da partida (TV Globo, SporTV, Premiere, CazéTV, Prime Video, Disney+ / ESPN).

---

## 🍿 6. MENTAL HEALTH & MÓDULO STREAMING (NETFLIX, DISNEY, PRIME)

A aba **"Saúde Mental"** foi enriquecida com a central de entretenimento e relaxamento:
1. **Curadoria de Filmes & Séries:**
   - Documentários inspiradores de corrida (*100 Meters*, *Breaking2*, *The Barkley Marathons*).
   - Filmes aclamados e séries para descompressão parassimpática no pré-sono.
   - Doramas populares e dramas leves para consumo pós-jantar sem ativação excessiva do sistema nervoso simpático.
   - Filtros dinâmicos por plataforma: Netflix, Disney+, Amazon Prime Video.
2. **Modo Cinema na Iluminação Tuya:**
   - Botão **"🎬 Ativar Modo Cinema"** que reduz as luzes da sala e suíte para 15% em tom âmbar 2200K e liga a tomada inteligente da TV (`ebc2434ca5ee0361acjqqp`).

---

## ☀️ 7. PREVISÃO DO TEMPO DO DIA SEGUINTE (D+1)

Integrado ao Cockpit e ao serviço de meteorologia OpenWeather:
1. **Card de Previsão D+1 (Amanhã):**
   - Exibe a temperatura projetada para as primeiras horas da manhã (06h00 às 08h00), umidade relativa do ar, ponto de orvalho e vento.
2. **Recomendação Tática de Vestuário & Pacing:**
   - Temperatura abaixo de 17°C: Camiseta manga curta técnica, aquecimento mais longo de 12 minutos.
   - Temperatura acima de 22°C: Regata ultra ventilada, hidratação acrescida de 150ml a cada 20 min, compensação de pace de +5 a +8 s/km para evitar estresse térmico precoce.

---

## 🏆 8. HALL DO CLÃ LOPES, TROFÉUS & EASTER EGGS

Acessível pelo botão **"Hall Clã"** na TopBar:
1. **Quadro de Medalhas e Recordes Coletivos:**
   - Registro de 1.652 km somados pela família.
   - Registro de Tempos Oficiais Líquidos (*Chip Time*), Gun Time, classificações gerais e por faixa etária (ex: M50-54, F55-59, M20-24).
   - Percentis de chegada (ex: *"Melhor que 92% do pelotão"*).
2. **Gerador de Trophy Card HD para Instagram Stories & WhatsApp:**
   - Cria cards verticais em proporção 9:16 com gradientes neon, tempo oficial, pace médio, batimentos e brasão do clube do coração para postagem imediata.
3. **Easter Eggs Interativos:**
   - Clicar 5 vezes sobre o logotipo do Bio-Triad OS na TopBar dispara fogos de artifício e hinos dos clubes (Hino do Mengão, Hino do Grêmio ou Palmeiras).

---

## 🍳 9. BALANÇA TÁTICA TACO: A REGRA DOS 58% VS 42%

Para evitar o desgaste de cozinhar refeições separadas todos os dias, o casal adota a **Divisão Inteligente da Panela Familiar**:

```
[ Panela Familiar Cozida no Fogão ]
               │
               ▼
   [ Balança Digital de Cozinha ] ──► Pesar o Total (ex: 700g)
               │
       ┌───────┴───────┐
       ▼               ▼
 58% (Daniel)     42% (Patrícia)
    406g             294g
 (~55g P, ~700 kcal) (~40g P, ~500 kcal)
```

1. Cozinhem a comida da família em **uma única panela ou refratário** (ex: Frango desfiado com legumes, Carne Moída com Batata-Doce ou Arroz Integral com Brócolis).
2. Pousem a travessa na balança e anotem o peso total (ex: 650g).
3. Na aba **"Nutrição"** ou **"Clã"**, digitem `650` na Balança Tática.
4. O sistema calcula na hora:
   - **Prato de Daniel:** 377g (58%).
   - **Prato de Patrícia:** 273g (42%).
5. Ambos atingem suas metas com zero comida desperdiçada e apenas uma panela para lavar.

---

## 💡 10. AUTOMAÇÃO RESIDENCIAL TUYA SMART HOME (12 CENAS)

O ecossistema controla as luzes, tomadas e sensores através do `openapi.tuyaus.com` (OAuth 2.0 com HMAC-SHA256):

1. 🌅 **Alvorada de Prova (`RACE_MORNING_ALVORADA`):** Quarto âmbar + Tomada Dupla (Café e Mate) + Closet.
2. 👔 **Closet Tático (`CLOSET_ON`):** Leds do Cabide e Porta em 4000K para uniformes e tênis de carbono.
3. 🌅 **Aurora Solar Gradual (`SUNRISE_LONG_RUN`):** Despertar suave às 06h00 com rampa de luz quente.
4. ⚡ **Foco Pré-Treino 18h30 (`PRE_WORKOUT_FOCUS`):** Luz fria 6500K a 100% para estímulo neuromuscular.
5. 🌙 **Freio Térmico 20h30 (`PARASYMPATHETIC_NIGHT`):** Luz âmbar 2200K a 20% com corte de radiação azul.
6. ❄️ **AC Esteira 19°C (`PRE_COOLING_TREADMILL`):** Pré-resfriamento térmico de Costill (economiza 12-15 bpm).
7. 🛏️ **Sono Criogênico 20°C (`CRYO_SLEEP`):** Ar-condicionado ajustado para induzir hipotermia distal e GH.
8. ☕ **Cafezinho de Daniel (`CAFEZINHO_ON`):** Tomada dupla canal 1 com auto-off em 15 min.
9. 🌿 **Mate da Patrícia (`MATE_ON`):** Tomada dupla canal 2 com auto-off em 10 min.
10. ⚡ **Tomada Dupla Ambos (`BEBIDAS_DUAL_ON`):** Aciona ambos os canais da tomada dupla simultaneamente.
11. 🌿 **Modo "Fui Correr" Eco All-Off (`ECO_ALL_OFF`):** Desliga TVs, monitores, tomadas e luzes ao sair.
12. ⚽ **Match Day Mengão / Grêmio (`FLAMENGO_MATCH` / `GREMIO_MATCH`):** Iluminação temática do clube.

---

## 🔧 11. CENTRAL DE SETUP & INTEGRAÇÕES

Acessível pelo botão **"Setup"** na TopBar:
1. **Strava para Patrícia e Gabriel:**
   - Instruções passo a passo para conectar as contas individuais no Strava via Webhook ou exportação de GPX/TCX.
2. **Tuya Smart Home:**
   - Verificação das credenciais `TUYA_CLIENT_ID` e `TUYA_CLIENT_SECRET`, status dos dispositivos e teste de ping de hardware.
3. **WhatsApp Evolution API:**
   - Status da instância `ecostone`, números de Daniel e Patrícia cadastrados e testes de disparo.

---

## 📲 12. ALERTAS PROATIVOS WHATSAPP & TELEGRAM

- **Evolution API v2 WhatsApp:**
  - Instância oficial: `ecostone` (`https://whatsapp-ecostone.onrender.com`).
  - Alerta do Treino do Dia (Eclusa das 18h30).
  - Alerta de Trava de Treino 1h antes dos jogos de futebol.
  - Alerta de Freio Térmico e corte de telas às 20h30.
- **Telegram Bot:**
  - `@Coach_Pro_Alertas_bot` (Chat ID `6315130099`).
  - Relatórios meteorológicos e índices de radiação UV / vento.

---

## ☁️ 13. ARQUITETURA DE NUVEM & DEPLOY EM PRODUÇÃO

- **Framework:** Next.js 15 (App Router, React 19, TypeScript, TailwindCSS).
- **Hospedagem Primária:** Render Container Web Service (`correr-gukc.onrender.com`).
- **Edge Cron:** Vercel Serverless (`0 12 * * *`).
- **Green Computing:** Cache inteligente para Intervals.icu (15 min) e previsão do tempo (30 min).
- **Monitoramento UptimeRobot:** Monitor ID `803014115` pingando `/api/health` 24/7.

---

*Manual oficial atualizado e certificado para o Clã Lopes pelo Agente Antigravity. Todos os direitos reservados.*
