"use client";

import React, { useState } from "react";
import {
  BookOpen,
  X,
  Flame,
  Shield,
  Users,
  Watch,
  Scale,
  Zap,
  Moon,
  MessageSquare,
  HelpCircle,
  Activity,
  Compass,
  Utensils,
  Brain,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Smartphone,
  CloudSun,
} from "lucide-react";

interface HelpManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
}

export function HelpManualModal({ isOpen, onClose, currentProfile }: HelpManualModalProps) {
  const [activeTopic, setActiveTopic] = useState<
    "OVERVIEW" | "DANIEL" | "PATRICIA" | "PANELA_TACO" | "HARDWARE" | "SMART_HOME" | "WHATSAPP" | "FAQ"
  >("OVERVIEW");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-b from-[#0D121F] via-[#080B12] to-[#05070B] border border-white/10 rounded-3xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0A0E18]/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-400 to-amber-400 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-[#070A11] rounded-[14px] flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Manual de Operação do Bio-Triad OS
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  v10.0 Haute Sports
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Guia Definitivo do Clã Lopes • Treinos Individuais • Panela TACO • Telemetria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
            title="Fechar Manual"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Left Navigation + Right Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Topics */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-3 sm:p-4 bg-[#07090E]/60 overflow-y-auto space-y-1 font-mono text-xs">
            {[
              { id: "OVERVIEW", label: "1. Visão Geral & Filosofia", icon: Activity },
              { id: "DANIEL", label: "2. Daniel (FLA • 21k)", icon: Flame, color: "text-red-400" },
              { id: "PATRICIA", label: "3. Patrícia (GRE • 10k)", icon: Shield, color: "text-sky-400" },
              { id: "PANELA_TACO", label: "4. Panela TACO (58% x 42%)", icon: Scale, color: "text-amber-400" },
              { id: "HARDWARE", label: "5. Galaxy Watch & Strava", icon: Watch, color: "text-emerald-400" },
              { id: "SMART_HOME", label: "6. Tuya Smart Home", icon: Zap, color: "text-purple-400" },
              { id: "WHATSAPP", label: "7. WhatsApp & Telegram", icon: MessageSquare, color: "text-green-400" },
              { id: "FAQ", label: "8. FAQ & Solução de Dúvidas", icon: HelpCircle },
            ].map((topic) => {
              const Icon = topic.icon;
              const isActive = activeTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id as any)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                    isActive
                      ? "bg-white/10 text-white font-bold border border-white/20 shadow-md"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${topic.color || "text-gray-400"}`} />
                    <span className="truncate">{topic.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-gray-300 text-xs sm:text-sm leading-relaxed">
            {/* Topic 1: OVERVIEW */}
            {activeTopic === "OVERVIEW" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                    Módulo de Abertura
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Filosofia do Bio-Triad OS: A Tríade da Longevidade
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Como funciona o ecossistema integrado de saúde, treino e recuperação do casal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-blue-500/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Compass className="h-4 w-4" />
                      <span>1. Treinador Híbrido</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Corrida Z2 contínua (rua vs esteira) com cálculo de Costill + Musculação A/B/C adaptada para cada corpo.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Utensils className="h-4 w-4" />
                      <span>2. Nutrição TACO Real</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Tabela TACO oficial da UNICAMP (P1-P3, C1-C3, V1-V3) com divisão de porção única cozida na mesma panela.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-purple-500/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Brain className="h-4 w-4" />
                      <span>3. Neuro-Descompressão</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Eclusa 18h30 (descarrego mental), Freio Térmico 20h30 e controle pós-jogos decisivos de Flamengo e Grêmio.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#090D16] border border-white/5 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Princípio Anti-Mock Estrito (Zero Simulações)
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Nenhum dado é gerado por números aleatórios (sem <code className="text-amber-300">Math.random()</code>). O futebol pesquisa jogos e tabelas reais com IA Gemini 2.5 Flash Grounding, os dados corporais usam fórmulas da Marinha Americana e Costill, a nuvem Tuya aciona as lâmpadas reais da residência e o Intervals.icu busca a telemetria do Galaxy Watch.
                  </p>
                </div>
              </div>
            )}

            {/* Topic 2: DANIEL */}
            {activeTopic === "DANIEL" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-red-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔴⚫</span>
                    <h3 className="text-xl font-black text-white">
                      Manual do Atleta: Daniel Souto Lopes
                    </h3>
                  </div>
                  <p className="text-xs text-red-400 font-mono mt-0.5">
                    Flamengo • Maracanã • 43 anos • 80.0kg (Meta: 75kg) • 170cm
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
                    <h4 className="font-bold text-red-300 flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      Regra Médica de Ouro: Prótese Reversa de Ombro Direito
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Daniel possui uma prótese reversa glenoumeral no ombro direito. Por recomendação ortopédica estrita:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1">
                      <li><strong>Bloqueio Total:</strong> Zero desenvolvimentos overhead (acima da cabeça) e zero supino reto com barra.</li>
                      <li><strong>Prescrição Segura:</strong> Supino com halteres pegada neutra 45°, elevação no plano escapular (scaption 30°) e remadas com peito apoiado.</li>
                      <li><strong>Na Corrida:</strong> O braço direito deve manter balanço relaxado, sem oscilações bruscas que gerem tração na cápsula artificial.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                      <span className="text-gray-400 block">Prova Alvo P1:</span>
                      <span className="font-bold text-white text-sm">Meia Maratona de SP (21k)</span>
                      <span className="text-emerald-400 block">11/04/2027 • Sub-1h55 (Pace 5:27)</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                      <span className="text-gray-400 block">Ritmo Z2 Base:</span>
                      <span className="font-bold text-white text-sm">5:50 a 6:20 min/km</span>
                      <span className="text-cyan-400 block">Esteira: 9.7 a 10.3 km/h (1%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Topic 3: PATRICIA */}
            {activeTopic === "PATRICIA" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-sky-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔵⚪⚫</span>
                    <h3 className="text-xl font-black text-white">
                      Manual da Atleta: Patrícia Lopes
                    </h3>
                  </div>
                  <p className="text-xs text-sky-400 font-mono mt-0.5">
                    Grêmio Foot-Ball Porto Alegrense • Arena • 40 anos • 58.0kg (Meta: 55kg) • 162cm
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-2">
                    <h4 className="font-bold text-sky-300 flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-sky-400" />
                      Foco Biomecânico: Glúteos, Estabilidade Pélvica & Passada
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Ao contrário do Daniel, <strong>os ombros da Patrícia são 100% livres, sadios e liberados para cargas completas</strong>. O foco central do seu treino é:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1">
                      <li><strong>Estabilidade de Pelve:</strong> Fortalecimento pesado de glúteo médio e isquiotibiais para evitar a queda do quadril durante a fase de apoio da corrida.</li>
                      <li><strong>Prevenção de Valgo Dinâmico:</strong> Exercícios de abdução com miniband e agachamento búlgaro para proteger os joelhos contra colapsos mediais nos 10K.</li>
                      <li><strong>Superiores Posturais:</strong> Remadas e deltoides com halteres para manter o peito aberto e respiração fluida sem projetar os ombros à frente.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                      <span className="text-gray-400 block">Prova Alvo P1:</span>
                      <span className="font-bold text-white text-sm">Circuito das Estações SP (10k)</span>
                      <span className="text-amber-400 block">23/05/2027 • Sub-1h00 (Pace 6:00)</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                      <span className="text-gray-400 block">Ritmo Z2 Base:</span>
                      <span className="font-bold text-white text-sm">6:30 a 7:15 min/km</span>
                      <span className="text-cyan-400 block">Esteira: 8.3 a 9.2 km/h (1%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Topic 4: PANELA_TACO */}
            {activeTopic === "PANELA_TACO" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-amber-500/30 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                    Nutrição & Logística Familiar
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Balança Tática TACO: A Regra dos 58% vs 42%
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Como alimentar dois atletas de categorias de peso diferentes sem cozinhar duas vezes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs">
                  <h4 className="font-bold text-amber-300 text-sm">O Passo a Passo na Cozinha:</h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-gray-300">
                    <li><strong>Cozinhe tudo junto:</strong> Prepare a refeição familiar (frango com legumes, carne moída com batata-doce, arroz com brócolis) em uma única panela ou travessa.</li>
                    <li><strong>Coloque a panela/refeição na balança:</strong> Anote o peso total cozido (exemplo: <strong>700 gramas</strong>).</li>
                    <li><strong>Abra a aba "Clã" ou "Nutrição" do sistema:</strong> Digite 700g no campo da Balança Tática.</li>
                    <li><strong>Sirva os pratos:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Prato do Daniel:</strong> Pesar <strong>406g (58%)</strong> $\rightarrow$ atinge ~55g Proteína, ~85g Carboidratos, ~700 kcal.</li>
                        <li><strong>Prato da Patrícia:</strong> Pesar <strong>294g (42%)</strong> $\rightarrow$ atinge ~40g Proteína, ~60g Carboidratos, ~500 kcal.</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1 text-xs">
                  <span className="font-bold text-white block">Tabela Taxonômica TACO:</span>
                  <p className="text-gray-400">
                    <strong>P1 a P3:</strong> Proteínas magras (peito de frango, tilápia, ovos, patinho).<br />
                    <strong>C1 a C3:</strong> Carboidratos complexos (arroz integral, batata-doce, aveia, mandioca).<br />
                    <strong>V1 a V3:</strong> Fibras e lipídios nobres (azeite extravirgem, abacate, brócolis, espinafre).
                  </p>
                </div>
              </div>
            )}

            {/* Topic 5: HARDWARE */}
            {activeTopic === "HARDWARE" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-emerald-500/30 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                    Hardware & Telemetria Wearable
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Galaxy Watch Ultra vs Monitoramento Patrícia
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Esclarecimento sobre dispositivos pareados e leitura de sensores em 2026/2027.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
                  <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                    <Watch className="h-4 w-4 text-emerald-400" />
                    Transparência de Hardware: Quem possui o Galaxy Watch Ultra?
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    <strong>Atualmente, apenas o Daniel possui o Galaxy Watch Ultra 47mm Titanium</strong>. O sistema foi programado para respeitar essa realidade com total elegância:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                    <li>
                      <strong>Daniel (Intervals.icu ID `I753639`):</strong> Seus dados de sono profundo, variabilidade da frequência cardíaca (HRV rMSSD), frequência cardíaca de repouso (52 bpm) e passos são capturados via sensor biométrico oficial do Galaxy Watch Ultra.
                    </li>
                    <li>
                      <strong>Patrícia (Strava Pro & Telemetria Feminina):</strong> A Patrícia monitora suas corridas e treinos de academia através do app do Strava no smartphone ou smartwatch complementar. Seus ritmos e zonas de frequência cardíaca operam nas faixas femininas calculadas (Z1 115-130 a Z5 175-190 bpm), sem depender do hardware do Galaxy Watch.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1 text-xs">
                  <span className="font-bold text-white block">Botão de Sincronização:</span>
                  <p className="text-gray-400">
                    No topo do sistema, ao lado das provas, o botão <strong>"Galaxy Ultra / Patrícia Watch"</strong> efetua uma requisição direta aos servidores do Intervals e Strava para atualizar a prontidão física do dia.
                  </p>
                </div>
              </div>
            )}

            {/* Topic 6: SMART_HOME */}
            {activeTopic === "SMART_HOME" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-purple-500/30 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase">
                    Automação Residencial IoT
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Cenas Tuya Cloud: Iluminação Circadiana
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Como comandar as luzes inteligentes da casa para otimizar hormônios de treino e sono.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-blue-500/30 space-y-1">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <Zap className="h-4 w-4" />
                      1. Foco Pré-Treino 18h30
                    </span>
                    <p className="text-gray-300">
                      Luz fria a 6500K com 100% de brilho. Estimula cortisol produtivo e dopamina para preparar a mente para a corrida das 19h.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-purple-500/30 space-y-1">
                    <span className="font-bold text-purple-400 flex items-center gap-1.5">
                      <Moon className="h-4 w-4" />
                      2. Freio Térmico 20h30
                    </span>
                    <p className="text-gray-300">
                      Luz âmbar suave a 2200K com 20% de brilho. Bloqueia raios azuis e sinaliza para a glândula pineal liberar melatonina.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-red-500/30 space-y-1">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <Flame className="h-4 w-4" />
                      3. Modo Mengão (Maracanã)
                    </span>
                    <p className="text-gray-300">
                      Iluminação rubro-negra pulsante nos dias de jogo do Flamengo, com buffer de petiscos saudáveis no Cockpit.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-sky-500/30 space-y-1">
                    <span className="font-bold text-sky-400 flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      4. Modo Grêmio (Arena)
                    </span>
                    <p className="text-gray-300">
                      Iluminação azul celeste e branca para as partidas do Imortal Tricolor da Patrícia.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-cyan-500/30 space-y-1">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <CloudSun className="h-4 w-4" />
                      5. AC Esteira 19°C (Costill)
                    </span>
                    <p className="text-gray-300">
                      Pré-resfriamento térmico via Tuya IR 15 min antes da esteira para mitigar deriva cardíaca (economiza 12-15 bpm no mesmo ritmo).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-emerald-500/30 space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Zap className="h-4 w-4" />
                      6. Modo "Fui Correr" Eco Off
                    </span>
                    <p className="text-gray-300">
                      Corte geral de consumo fantasma (TVs, displays, ar-condicionado) ao trancar a porta. Filosofia "Tudo pelo meio ambiente".
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-gray-300 space-y-1">
                  <span className="font-bold text-purple-300 block">Manifesto de Automações Completo:</span>
                  <p className="text-gray-400">
                    O documento oficial <code className="text-purple-300">MANIFESTO_AUTOMACAO_TUYA.md</code> contém todas as 10 automações detalhadas com Datapoint Codes e justificativa fisiológica. Abra o modal interativo pelo botão <strong>"Manifesto & Automações"</strong> na aba Cockpit.
                  </p>
                </div>
              </div>
            )}

            {/* Topic 7: WHATSAPP */}
            {activeTopic === "WHATSAPP" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-green-500/30 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-green-400 uppercase">
                    Comunicação Proativa & Alertas
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Evolution API v2 WhatsApp &amp; Telegram Bot
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Como o sistema avisa o casal no celular nos horários-chave do dia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
                  <h4 className="font-bold text-emerald-300 text-sm">Disparos Automáticos Configurados:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><strong>Às 18h30 (Eclusa):</strong> Envia no WhatsApp do Daniel e Patrícia o treino do dia (rua ou esteira) e o lembrete de transição de trabalho.</li>
                    <li><strong>Às 20h30 (Freio Térmico):</strong> Dispara o lembrete de hidratação com magnésio, ducha morna e corte de telas azuis.</li>
                    <li><strong>Dias de Jogo:</strong> Informa o horário de encerramento do treino para não coincidir com a bola rolando de Flamengo ou Grêmio.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1 text-xs font-mono">
                  <span className="font-bold text-white block font-sans">Credenciais Oficiais Ativas:</span>
                  <p className="text-gray-400">
                    Servidor Evolution: <code className="text-emerald-400">https://whatsapp-ecostone.onrender.com</code><br />
                    Instância: <code className="text-emerald-400">ecostone</code><br />
                    Bot Telegram: <code className="text-blue-400">@Coach_Pro_Alertas_bot</code>
                  </p>
                </div>
              </div>
            )}

            {/* Topic 8: FAQ */}
            {activeTopic === "FAQ" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                    Resolução Rápida
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Perguntas Frequentes (FAQ)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Respostas diretas para as dúvidas mais comuns do casal.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                    <span className="font-bold text-white block">
                      1. "Como corremos juntos na esteira sem que um atrapalhe o outro?"
                    </span>
                    <p className="text-gray-300">
                      Usem o modo <strong>Esteiras Pareadas</strong>: coloquem duas esteiras lado a lado na academia. Daniel ajusta a dele para 9.5 km/h e Patrícia ajusta a dela para 8.8 km/h (ambas a 1.0% de inclinação). Vocês correrão juntos pelo mesmo tempo e ambos ficarão exatamente na Zona 2!
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                    <span className="font-bold text-white block">
                      2. "Se o dia estiver muito quente em São Paulo, o que fazemos com o pace?"
                    </span>
                    <p className="text-gray-300">
                      O widget de <strong>Weather-Pacing</strong> no Cockpit calcula o custo térmico em tempo real. Se o termômetro passar de 25°C, o sistema adiciona automaticamente de +8s a +15s/km no pace alvo ou recomenda migrar o treino para a esteira no ar-condicionado.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 space-y-1">
                    <span className="font-bold text-white block">
                      3. "Como tirar foto do prato para saber a quantidade?"
                    </span>
                    <p className="text-gray-300">
                      Na aba <strong>Nutrição</strong>, clique no botão verde <em>"Fotografar / Enviar Prato"</em>. A IA Gemini 2.5 Flash analisa os alimentos e separa as gramas recomendadas para o Daniel e para a Patrícia instantaneamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0A0E18]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-gray-400 font-mono">
            Bio-Triad OS • Clã Lopes Household • Hospedado na Nuvem Render & Vercel
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all font-mono"
          >
            Entendido • Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
}
