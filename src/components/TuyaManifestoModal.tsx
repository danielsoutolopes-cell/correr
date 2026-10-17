"use client";

import React, { useState } from "react";
import {
  Zap,
  Moon,
  Flame,
  Shield,
  Snowflake,
  Coffee,
  Power,
  Trophy,
  X,
  CheckCircle2,
  Sliders,
  Wind,
  Thermometer,
  Sparkles,
  Home,
  Cpu,
  Layers,
  Leaf,
  Clock,
  Radio,
  Sunrise,
  Shirt,
} from "lucide-react";

import { ProfileId } from "@/lib/types";

interface TuyaManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerScene: (scene: string, label: string) => void;
  currentProfile: ProfileId;
}

interface AutomationCard {
  id: string;
  sceneCode: string;
  category: "CIRCADIAN" | "THERMAL" | "NUTRITION" | "TRANSITION" | "MATCHDAY" | "ECO";
  title: string;
  hardware: string;
  datapoints: string;
  rationale: string;
  triggerTime: string;
  color: string;
  icon: any;
}

export function TuyaManifestoModal({
  isOpen,
  onClose,
  onTriggerScene,
  currentProfile,
}: TuyaManifestoModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDaniel = currentProfile !== "PATRICIA";

  const automations: AutomationCard[] = [
    {
      id: "race_morning_dispatch",
      sceneCode: "RACE_MORNING_ALVORADA",
      category: "CIRCADIAN",
      title: "Alvorada de Prova (Rua Maracá • -1h Largada)",
      hardware: "Led Quarto + Tomada Dupla (Café & Mate) + Leds Closet",
      datapoints: "colour_data: { h: 32, s: 750, v: 550 }, switch_1: true (900s), switch_2: true (600s)",
      rationale:
        "Orquestração completa para o dia de prova: acende quarto em tom solar âmbar 2700K, liga cafezinho de Daniel e mate de Patrícia na tomada dupla e ilumina os uniformes no closet.",
      triggerTime: "04:05 nos domingos de prova (145 min antes da largada)",
      color: "border-amber-500/50 text-amber-200 bg-amber-950/30",
      icon: Sunrise,
    },
    {
      id: "closet_kit",
      sceneCode: "CLOSET_ON",
      category: "TRANSITION",
      title: "Iluminação Tática do Closet & Placa de Carbono",
      hardware: "Led Cabide (eb7e8e6b7909ed343dfawf) + Led Porta",
      datapoints: "work_mode: 'white', temp_value_v2: 500 (4000K Neutro), bright_value_v2: 750",
      rationale:
        "Luz branca neutra sem ofuscamento para conferência do uniforme, fixação do número de peito e calçamento dos tênis com placa de carbono.",
      triggerTime: "04:20 nos dias de prova / 05:30 nos treinos",
      color: "border-purple-500/50 text-purple-200 bg-purple-950/20",
      icon: Shirt,
    },
    {
      id: "sunrise",
      sceneCode: "SUNRISE_LONG_RUN",
      category: "CIRCADIAN",
      title: "Despertar Solar Gradual (Longão 06:00)",
      hardware: "Led Quarto (Casal) + L_Futebol (Sala)",
      datapoints: "colour_data: { h: 32, s: 800, v: 600 }, bright_value_v2: 600",
      rationale:
        "Simula a rampa espectral da aurora solar para inibir a melatonina e elevar o cortisol de prontidão sem taquicardia de alarme sonoro.",
      triggerTime: "Domingos às 06:00 (ou 45 min pré-longão)",
      color: "border-amber-500/40 text-amber-300 bg-amber-950/20",
      icon: Sparkles,
    },
    {
      id: "focus_1830",
      sceneCode: "PRE_WORKOUT_FOCUS",
      category: "CIRCADIAN",
      title: "Surge de Dopamina & Foco Pré-Treino (18:30)",
      hardware: "Lâmpada L_Futebol (Sala/TV Novadigital)",
      datapoints: "work_mode: 'white', temp_value_v2: 950 (6500K Fria), bright: 900",
      rationale:
        "Luz branca fria a 6500K suprime a sonolência pós-trabalho de escritório e induz foco catecolaminérgico para a corrida das 19h.",
      triggerTime: "Segunda a Quinta às 18:30 (Eclusa)",
      color: "border-blue-500/40 text-blue-300 bg-blue-950/20",
      icon: Zap,
    },
    {
      id: "thermal_brake_2030",
      sceneCode: "PARASYMPATHETIC_NIGHT",
      category: "CIRCADIAN",
      title: "Freio Térmico & Modulação Parassimpática (20:30)",
      hardware: "Led Quarto (2200K Âmbar) + Luz Casal (Off)",
      datapoints: "work_mode: 'white', temp_value_v2: 100 (2200K Âmbar), bright: 250",
      rationale:
        "Corta 100% de radiação azul nos olhos, induzindo a secreção endógena de melatonina para preparar o sono profundo medido no Galaxy Watch.",
      triggerTime: "Diariamente às 20:30 pontual",
      color: "border-purple-500/40 text-purple-300 bg-purple-950/20",
      icon: Moon,
    },
    {
      id: "alvorada_prova",
      sceneCode: "RACE_MORNING_ALVORADA",
      category: "CIRCADIAN",
      title: "Alvorada de Prova Universal (Rua Maracá • Regra -1h)",
      hardware: "Led Quarto (2700K) + Tomada Dupla (Café/Mate) + Leds Closet (4000K)",
      datapoints: "colour_data: {h:32, s:750, v:550}, switch_1: true (900s), switch_2: true (600s), closet: 4000K",
      rationale:
        "Cálculo reverso inteligente adaptável a qualquer prova (Athenas, Meia SP, Olga Kos, etc.). Acorda com luz âmbar suave, liga café de Daniel e mate de Patrícia na tomada dupla e ilumina o armário.",
      triggerTime: "Domingos de Prova (Recalculado por Prova: T-gun - 1h50)",
      color: "border-amber-500/50 text-amber-300 bg-amber-950/30",
      icon: Sunrise,
    },
    {
      id: "costill_treadmill",
      sceneCode: "PRE_COOLING_TREADMILL",
      category: "THERMAL",
      title: "Pré-Resfriamento de Esteira 19°C (Protocolo Costill)",
      hardware: "Ar-Condicionado Tuya Smart IR / Termostato",
      datapoints: "switch: true, mode: 'cold', temp_set: 19, windspeed: 'high'",
      rationale:
        "Mitiga a deriva cardíaca (cardiac drift) em treinos indoor. Correr a 19°C em vez de 24°C economiza 12-15 bpm no mesmo ritmo de pace.",
      triggerTime: "15 minutos antes de iniciar treino na esteira",
      color: "border-cyan-500/40 text-cyan-300 bg-cyan-950/20",
      icon: Snowflake,
    },
    {
      id: "cryo_sleep",
      sceneCode: "CRYO_SLEEP",
      category: "THERMAL",
      title: "Câmara Criogênica para Sono Profundo N3 (20°C)",
      hardware: "Temperatura Suite (Sensor Zigbee) + AC Quarto",
      datapoints: "switch: true, mode: 'cold', temp_set: 20, windspeed: 'low'",
      rationale:
        "Mantém a temperatura central do corpo baixa durante a primeira metade da noite, maximizando o pico de hormônio do crescimento (GH).",
      triggerTime: "22:00 às 04:30 (automatizado)",
      color: "border-indigo-500/40 text-indigo-300 bg-indigo-950/20",
      icon: Thermometer,
    },
    {
      id: "cafezinho_daniel",
      sceneCode: "CAFEZINHO_ON",
      category: "NUTRITION",
      title: "Tomada 1: Cafezinho Pré-Treino (Daniel • 21k)",
      hardware: "Tomada Dupla (ebc4a8285904c4bd43crx7) • Canal switch_1",
      datapoints: "switch_1: true, countdown_1: 900 (auto-off em 15 min)",
      rationale:
        "Ativa a cafeteira 15 min antes da saída para garantir 3mg/kg de cafeína anidra no organismo antes do longão de 21 km.",
      triggerTime: "05:45 nos dias de treino de Daniel",
      color: "border-amber-600/40 text-amber-200 bg-amber-950/20",
      icon: Coffee,
    },
    {
      id: "mate_patricia",
      sceneCode: "MATE_ON",
      category: "NUTRITION",
      title: "Tomada 2: Mate & Chimarrão Gaúcho (Patrícia • 14k)",
      hardware: "Tomada Dupla (ebc4a8285904c4bd43crx7) • Canal switch_2",
      datapoints: "switch_2: true, countdown_2: 600 (auto-off em 10 min)",
      rationale:
        "Ferve a chaleira elétrica com infusão rica em polifenóis e termogênese natural para a rainha dos 14k da Athenas Mizuno.",
      triggerTime: "06:00 nos dias de treino de Patrícia",
      color: "border-emerald-600/40 text-emerald-200 bg-emerald-950/20",
      icon: Leaf,
    },
    {
      id: "bebidas_casal",
      sceneCode: "BEBIDAS_DUAL_ON",
      category: "NUTRITION",
      title: "Tomada Dupla: Café & Mate Simultâneos do Casal",
      hardware: "Tomada Dupla (ebc4a8285904c4bd43crx7) • switch_1 + switch_2",
      datapoints: "switch_1: true, switch_2: true (ambos os canais ativos)",
      rationale:
        "Sincroniza o café de Daniel e o mate de Patrícia simultaneamente quando ambos treinam juntos nas manhãs de fim de semana.",
      triggerTime: "Manhãs de treino conjunto",
      color: "border-cyan-600/40 text-cyan-200 bg-cyan-950/20",
      icon: Zap,
    },
    {
      id: "eco_all_off",
      sceneCode: "ECO_ALL_OFF",
      category: "ECO",
      title: "Modo 'Fui Correr' • Corte Verde de Energia Fantasma",
      hardware: "Tomada TV + L_Futebol + Lavanderia + Luz Casal",
      datapoints: "switch_led: false, switch: false, switch_1: false",
      rationale:
        "Filosofia 'Tudo pelo meio ambiente': desliga TVs, displays, standbys e luzes secundárias quando o casal sai para treinar na rua.",
      triggerTime: "Ao trancar a porta para correr",
      color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/20",
      icon: Leaf,
    },
    {
      id: "flamengo_match",
      sceneCode: "FLAMENGO_MATCH",
      category: "MATCHDAY",
      title: "Match Day Mengão Rubro-Negro (Maracanã)",
      hardware: "Lâmpada L_Futebol (Sala/TV Novadigital RGB)",
      datapoints: "colour_data: { h: 358, s: 1000, v: 1000 } (Scarlet Red)",
      rationale:
        "Imersão visual total para os jogos do Flamengo de Daniel, com buffers calóricos saudáveis da dieta TACO ativos no Cockpit.",
      triggerTime: "1h antes dos jogos do Flamengo",
      color: "border-red-500/40 text-red-300 bg-red-950/20",
      icon: Flame,
    },
    {
      id: "gremio_match",
      sceneCode: "GREMIO_MATCH",
      category: "MATCHDAY",
      title: "Match Day Grêmio Imortal Tricolor (Arena)",
      hardware: "Lâmpada L_Futebol (Sala/TV Novadigital RGB)",
      datapoints: "colour_data: { h: 202, s: 920, v: 1000 } (Sky Blue)",
      rationale:
        "Atmosfera azul celeste e branca para os jogos do Grêmio da Patrícia, celebrando a identidade esportiva individual.",
      triggerTime: "1h antes dos jogos do Grêmio",
      color: "border-sky-500/40 text-sky-300 bg-sky-950/20",
      icon: Shield,
    },
    {
      id: "goal_strobe",
      sceneCode: isDaniel ? "FLAMENGO_GOAL" : "GREMIO_GOAL",
      category: "MATCHDAY",
      title: isDaniel ? "Gol do Flamengo! (Pulso Estroboscópico)" : "Gol do Grêmio! (Pulso Estroboscópico)",
      hardware: "Lâmpada L_Futebol (Sala/TV Novadigital RGB)",
      datapoints: "flash_scene_1: 'strobe', bright: 1000",
      rationale:
        "Celebração sensorial dinâmica disparada pelo app quando o clube marca gol na partida.",
      triggerTime: "Instantâneo via botão ou Webhook de gol",
      color: isDaniel
        ? "border-red-600/50 text-red-200 bg-red-950/30"
        : "border-sky-600/50 text-sky-200 bg-sky-950/30",
      icon: Trophy,
    },
  ];

  const filteredAutomations =
    activeCategory === "ALL"
      ? automations
      : automations.filter((a) => a.category === activeCategory);

  const handleDispatch = (item: AutomationCard) => {
    onTriggerScene(item.sceneCode, item.title);
    setDispatchedId(item.id);
    setTimeout(() => setDispatchedId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-gradient-to-b from-[#0D121F] via-[#080B12] to-[#05070B] border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0A0E18]/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-400 to-emerald-400 p-[1.5px] shadow-lg shadow-purple-500/20">
              <div className="h-full w-full bg-[#070A11] rounded-[14px] flex items-center justify-center">
                <Cpu className="h-5 w-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Manifesto de Automações Tuya Smart Home
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  OpenAPI v1.0
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Cronobiologia • Gestão Térmica • Nutrição TACO • Match Day • Eco-Green
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
            title="Fechar Manifesto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-white/5 bg-[#080B12] overflow-x-auto text-xs font-mono">
          {[
            { id: "ALL", label: "Todas (9)", icon: Layers },
            { id: "CIRCADIAN", label: "Cronobiologia (3)", icon: Zap },
            { id: "THERMAL", label: "Gestão Térmica (2)", icon: Snowflake },
            { id: "NUTRITION", label: "Nutrição & Café (1)", icon: Coffee },
            { id: "TRANSITION", label: "Transição (1)", icon: Home },
            { id: "MATCHDAY", label: "Match Day (3)", icon: Trophy },
            { id: "ECO", label: "Eco-Green (1)", icon: Leaf },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSel = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                  isSel
                    ? "bg-purple-950/60 border-purple-500/50 text-white font-bold shadow-md shadow-purple-500/10"
                    : "border-white/5 bg-white/5 text-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-purple-400" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Automation Cards Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAutomations.map((item) => {
              const Icon = item.icon;
              const isDispatched = dispatchedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 bg-[#090D16]/90 backdrop-blur-md shadow-lg flex flex-col justify-between transition-all ${item.color} relative overflow-hidden`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{item.title}</h3>
                          <span className="text-[10px] font-mono opacity-80 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.triggerTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed mb-3">
                      {item.rationale}
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono text-gray-400 mb-3">
                      <div>
                        <strong className="text-gray-300">Hardware:</strong> {item.hardware}
                      </div>
                      <div className="truncate">
                        <strong className="text-gray-300">Datapoints:</strong>{" "}
                        <code className="text-purple-300">{item.datapoints}</code>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      Cena: <span className="text-white font-bold">{item.sceneCode}</span>
                    </span>

                    <button
                      onClick={() => handleDispatch(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all shadow-md ${
                        isDispatched
                          ? "bg-emerald-600 text-white border-emerald-400"
                          : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                      }`}
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          <span>Comando Enviado!</span>
                        </>
                      ) : (
                        <>
                          <Radio className="h-3.5 w-3.5 text-amber-300" />
                          <span>Disparar no Hardware</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Architecture Protocol Summary */}
          <div className="rounded-2xl p-4 bg-[#0A0E18] border border-white/10 text-xs text-gray-300 space-y-2 font-mono">
            <div className="flex items-center gap-2 text-white font-bold font-sans text-sm">
              <Sliders className="h-4 w-4 text-emerald-400" />
              Arquitetura de Assinatura Criptográfica Tuya HMAC-SHA256
            </div>
            <p className="text-gray-400 leading-relaxed font-sans">
              Cada comando despachado pelo sistema gera dinamicamente uma assinatura criptográfica{" "}
              <code>HMAC-SHA256</code> autenticada com seu <code>TUYA_CLIENT_ID</code> e{" "}
              <code>TUYA_CLIENT_SECRET</code> contra os servidores de baixa latência em{" "}
              <code>https://openapi.tuyaus.com</code>. Tokens OAuth 2.0 são reutilizados e renovados
              com 60s de margem de segurança.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080B12] flex items-center justify-between">
          <div className="text-[11px] font-mono text-gray-400">
            Documento completo gravado em: <code className="text-purple-400">MANIFESTO_AUTOMACAO_TUYA.md</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all"
          >
            Concluir & Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
