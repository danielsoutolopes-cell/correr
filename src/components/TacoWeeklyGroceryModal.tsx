"use client";

import React, { useState } from "react";
import {
  X,
  ShoppingCart,
  Send,
  CheckCircle2,
  Utensils,
  Flame,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

interface TacoWeeklyGroceryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroceryCategory {
  categoryName: string;
  badgeColor: string;
  items: { id: string; name: string; amount: string; tacticalClass: string; checked: boolean }[];
}

export function TacoWeeklyGroceryModal({ isOpen, onClose }: TacoWeeklyGroceryModalProps) {
  const [categories, setCategories] = useState<GroceryCategory[]>([
    {
      categoryName: "Açougue & Peixaria (Proteínas Nobres P1)",
      badgeColor: "bg-red-950 text-red-300 border-red-800",
      items: [
        { id: "frango", name: "Peito de Frango Desossado (Sassami / Filé)", amount: "3.5 kg", tacticalClass: "P1", checked: false },
        { id: "patinho", name: "Patinho Bovino Moído 2x (Magra)", amount: "1.8 kg", tacticalClass: "P1", checked: false },
        { id: "tilapia", name: "Filé de Tilápia / Pescada Branca", amount: "1.2 kg", tacticalClass: "P1", checked: false },
        { id: "ovos", name: "Ovos Caipiras Grandes", amount: "3 dúzias (36 unid)", tacticalClass: "P1", checked: false },
      ],
    },
    {
      categoryName: "Hortifruti & Feira Livre (Carboidratos C1 & Fibras V1)",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
      items: [
        { id: "batata_doce", name: "Batata-Doce Roxa (Tubérculo Z2)", amount: "3.0 kg", tacticalClass: "C1", checked: false },
        { id: "brocolis", name: "Brócolis Ninja Fresco", amount: "3 maços", tacticalClass: "V1", checked: false },
        { id: "beterraba", name: "Beterraba (Nitrato p/ Vasodilatação)", amount: "1.5 kg", tacticalClass: "C1 / V2", checked: false },
        { id: "espinafre", name: "Espinafre / Rúcula / Folhas Escuras", amount: "2 maços", tacticalClass: "V1", checked: false },
        { id: "bananas", name: "Bananas Prata (Potássio Pré-Treino)", amount: "2 dúzias", tacticalClass: "C1", checked: false },
        { id: "kiwi", name: "Kiwi Nacional (Serotonina & Melatonina Noturna)", amount: "8 unidades", tacticalClass: "V2", checked: false },
        { id: "limoes", name: "Limões Tahiti (Shot da Manhã & Magnésio)", amount: "1.0 kg", tacticalClass: "V2", checked: false },
      ],
    },
    {
      categoryName: "Mercearia & Lipídios Nobres (C2 & V3)",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
      items: [
        { id: "arroz_integral", name: "Arroz Integral Tipo 1 (Base da Panela)", amount: "2.0 kg", tacticalClass: "C1", checked: false },
        { id: "aveia", name: "Aveia em Flocos Grossos", amount: "1.0 kg", tacticalClass: "C1", checked: false },
        { id: "azeite", name: "Azeite Extravirgem (Acidez < 0.2%)", amount: "1 garrafa (500ml)", tacticalClass: "V3", checked: false },
        { id: "mel", name: "Mel Silvestre Puro (Carb-Load Pré-Longão)", amount: "1 pote (300g)", tacticalClass: "C2", checked: false },
      ],
    },
  ]);

  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState<boolean>(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState<string | null>(null);

  const toggleItem = (catIndex: number, itemIndex: number) => {
    setCategories((prev) => {
      const copy = [...prev];
      copy[catIndex].items[itemIndex].checked = !copy[catIndex].items[itemIndex].checked;
      return copy;
    });
  };

  const handleSendToWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    setWhatsAppSuccess(null);

    // Format formatted message
    let message = "🛒 *LISTA SEMANAL DE COMPRAS TACO • CLÃ LOPES*\n";
    message += "Nutrição consolidada para Daniel (2350 kcal) e Patrícia (1780 kcal):\n\n";

    categories.forEach((cat) => {
      message += `*${cat.categoryName}*\n`;
      cat.items.forEach((it) => {
        const mark = it.checked ? "✅ [Já temos]" : "⬜ [Comprar]";
        message += `${mark} ${it.name} • *${it.amount}*\n`;
      });
      message += "\n";
    });

    message += "💡 _Baseado na proporção da panela familiar: 58% Daniel / 42% Patrícia._";

    try {
      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TACO_NUTRITION",
          workoutSummary: message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsAppSuccess("✅ Lista disparada com sucesso no WhatsApp da família!");
      } else {
        setWhatsAppSuccess(`⚠️ ${data.error || "Aguardando leitura do QR Code"}`);
      }
    } catch {
      setWhatsAppSuccess("❌ Erro ao conectar na Evolution API.");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#101726] via-[#090D16] to-[#06080E] border border-white/10 rounded-3xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0A0E18]/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className="h-full w-full bg-[#070A11] rounded-[14px] flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  Lista Semanal de Compras TACO (Açougue &amp; Feira)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  Semana Clã Lopes
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Consolidado 7 Dias • Daniel (2350 kcal • 58%) + Patrícia (1780 kcal • 42%)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback notification */}
        {whatsAppSuccess && (
          <div className="p-3 mx-4 mt-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 font-mono flex items-center justify-between">
            <span>{whatsAppSuccess}</span>
            <button onClick={() => setWhatsAppSuccess(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Body Categories */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {categories.map((cat, catIdx) => (
            <div
              key={cat.categoryName}
              className="p-4 rounded-2xl bg-[#07090E] border border-white/10 space-y-2.5 shadow-inner"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold text-white font-mono tracking-wide">
                  {cat.categoryName}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${cat.badgeColor}`}>
                  {cat.items.length} itens
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {cat.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(catIdx, itemIdx)}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                      item.checked
                        ? "bg-emerald-950/20 border-emerald-500/40 opacity-60 line-through text-gray-500"
                        : "bg-[#111827]/60 border-white/5 hover:border-white/20 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="rounded accent-emerald-500"
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-blue-300">
                        {item.tacticalClass}
                      </span>
                      <strong className="text-white">{item.amount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#0A0E18]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <p className="text-[11px] text-gray-400">
            * Marque os itens que já possui na despensa antes de enviar.
          </p>

          <button
            onClick={handleSendToWhatsApp}
            disabled={isSendingWhatsApp}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isSendingWhatsApp ? "Disparando..." : "Disparar Lista no WhatsApp"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
