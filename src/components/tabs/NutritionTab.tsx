"use client";

import React, { useState } from "react";
import {
  Utensils,
  Camera,
  Search,
  Filter,
  Users,
  Flame,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
  Layers,
  ChevronDown,
  Info,
  ShieldAlert,
  Scale,
  Award,
} from "lucide-react";
import { OFFICIAL_TACO_FOODS } from "@/lib/taco-data";
import { FoodTacticalClass, TacoFoodItem } from "@/lib/types";
import { getProfileSpecs } from "@/lib/physiology";

interface NutritionTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  hasMatchDaySnackMode?: boolean;
}

export function NutritionTab({ currentProfile, hasMatchDaySnackMode = true }: NutritionTabProps) {
  const [searchTerm, setSearchTerm] = useState<string>("Frango");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [scannerAnalyzing, setScannerAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [carbLoadingActive, setCarbLoadingActive] = useState<boolean>(false);

  const isDaniel = currentProfile !== "PATRICIA";
  const specs = getProfileSpecs(currentProfile);
  const danielSpecs = getProfileSpecs("DANIEL");
  const patriciaSpecs = getProfileSpecs("PATRICIA");

  // Filtered TACO database
  const filteredFoods = OFFICIAL_TACO_FOODS.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "ALL" ? true : food.tacticalClass.startsWith(selectedClass);
    return matchesSearch && matchesClass;
  });

  const handleSimulatePhotoScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setScannerAnalyzing(true);

    try {
      let base64String = "";
      if (file) {
        const reader = new FileReader();
        base64String = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch("/api/nutrition/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64String,
          textDescription: file ? file.name : "Prato com frango grelhado, arroz, feijão e brócolis",
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setScanResult(data.analysis);
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setScannerAnalyzing(false);
    }
  };

  // Carb-loading calculations: Daniel (80kg * 8g carb/kg = 640g carb/dia) vs Patricia (58kg * 7g carb/kg = 406g carb/dia)
  const targetCarbLoadingG = isDaniel ? 80 * 8 : 58 * 7;
  const carbLoadingDays = isDaniel ? 3 : 2;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Athlete Macro Target Strip - Haute Horlogerie Style */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C101A] via-[#101726] to-[#0C101A] border border-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xl border shadow-lg ${
                isDaniel
                  ? "bg-red-950/60 border-red-500/40 text-red-400"
                  : "bg-sky-950/60 border-sky-500/40 text-sky-400"
              }`}
            >
              {isDaniel ? "🔴⚫" : "🔵⚪"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  METAS DETERMINÍSTICAS TACO
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isDaniel
                      ? "bg-red-950/60 text-red-300 border-red-800"
                      : "bg-sky-950/60 text-sky-300 border-sky-800"
                  }`}
                >
                  {specs.name} • {specs.nutritionTaco.familyPlateShareText}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                {specs.nutritionTaco.caloricTargetKcal} kcal Alvo Diário
              </h2>
            </div>
          </div>

          {/* Macro Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto font-mono text-center">
            <div className="bg-[#07090E] px-3.5 py-2 rounded-2xl border border-red-500/30 shadow-inner">
              <span className="text-[9px] text-gray-400 block">Proteína (P1-P3)</span>
              <span className="text-sm font-bold text-red-400">
                {specs.nutritionTaco.proteinG}g{" "}
                <span className="text-[9px] text-gray-500 font-normal">
                  ({(specs.nutritionTaco.proteinG / specs.weightKg).toFixed(1)}g/kg)
                </span>
              </span>
            </div>

            <div className="bg-[#07090E] px-3.5 py-2 rounded-2xl border border-amber-500/30 shadow-inner">
              <span className="text-[9px] text-gray-400 block">Carboidrato (C1-C3)</span>
              <span className="text-sm font-bold text-amber-400">
                {specs.nutritionTaco.carbsG}g{" "}
                <span className="text-[9px] text-gray-500 font-normal">
                  ({(specs.nutritionTaco.carbsG / specs.weightKg).toFixed(1)}g/kg)
                </span>
              </span>
            </div>

            <div className="bg-[#07090E] px-3.5 py-2 rounded-2xl border border-blue-500/30 shadow-inner">
              <span className="text-[9px] text-gray-400 block">Gorduras Boas (V3)</span>
              <span className="text-sm font-bold text-cyan-400">
                {specs.nutritionTaco.fatsG}g{" "}
                <span className="text-[9px] text-gray-500 font-normal">
                  ({(specs.nutritionTaco.fatsG / specs.weightKg).toFixed(1)}g/kg)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multimodal Bio-Scanner Hero Widget */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101726] via-[#141C30] to-[#0D121F] border border-emerald-500/30 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                Multimodal Bio-Scanner TACO
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Gemini 2.5 Flash Vision &amp; UNICAMP
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">
              Escaneamento Visual &amp; Porcionamento do Casal
            </h2>
            <p className="text-xs text-gray-300">
              Fotografe o prato ou a panela para classificação taxonômica (P1-P3, C1-C3, V1-V3)
              e cálculo de pesagem automática: {danielSpecs.nutritionTaco.familyPlateShareText} (Daniel) e {patriciaSpecs.nutritionTaco.familyPlateShareText} (Patrícia).
            </p>
          </div>

          {/* Camera Upload Trigger */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
              <Camera className="h-4 w-4" />
              <span>{scannerAnalyzing ? "Analisando..." : "Fotografar / Enviar Prato"}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleSimulatePhotoScan}
                className="hidden"
                disabled={scannerAnalyzing}
              />
            </label>
          </div>
        </div>

        {/* Scan Results View */}
        {scanResult && (
          <div className="mt-5 p-4 rounded-2xl bg-[#07090E]/90 border border-emerald-500/40 animate-fadeIn space-y-4 shadow-inner relative z-10">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-emerald-400">
                Resultado do Bio-Scanner: {scanResult.dishName}
              </span>
              <button
                onClick={() => setScanResult(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕ Limpar
              </button>
            </div>

            {/* Identified Food Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {scanResult.identifiedItems?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#111827] border border-white/5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{item.name}</span>
                    <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">
                      {item.tacticalClass}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-gray-400">
                    Daniel: <strong className="text-white">{item.estimatedGramsDaniel}g</strong> (58%) •
                    Patrícia: <strong className="text-white">{item.estimatedGramsPatricia}g</strong> (42%)
                  </p>
                  <p className="text-[10px] font-mono text-emerald-400">
                    {item.caloriesKcal} kcal ({item.proteinG}g P • {item.carbsG}g C • {item.fatsG}g G)
                  </p>
                </div>
              ))}
            </div>

            {/* Dual Family Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs">
                <span className="font-bold text-red-300 block mb-1">
                  Daniel (80kg • 58% da Panela)
                </span>
                <p className="text-gray-200 font-mono">
                  Total: <strong>{scanResult.totalsDaniel?.caloriesKcal} kcal</strong> (
                  {scanResult.totalsDaniel?.proteinG}g Proteína •{" "}
                  {scanResult.totalsDaniel?.carbsG}g Carboidrato •{" "}
                  {scanResult.totalsDaniel?.fatsG}g Gordura)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30 text-xs">
                <span className="font-bold text-sky-300 block mb-1">
                  Patrícia (58kg • 42% da Panela)
                </span>
                <p className="text-gray-200 font-mono">
                  Total: <strong>{scanResult.totalsPatricia?.caloriesKcal} kcal</strong> (
                  {scanResult.totalsPatricia?.proteinG}g Proteína •{" "}
                  {scanResult.totalsPatricia?.carbsG}g Carboidrato •{" "}
                  {scanResult.totalsPatricia?.fatsG}g Gordura)
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              Insight Tático: {scanResult.tacticalInsights}
            </p>
          </div>
        )}
      </div>

      {/* Match Day Snacks Buffer & Carb-Loading Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Game Day Snacks Mode (+350 kcal Buffer Daniel / +250 kcal Patrícia) */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className={`h-4 w-4 ${isDaniel ? "text-red-500" : "text-sky-400"}`} />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Modo Petiscos da Partida ({isDaniel ? "Flamengo 🔴⚫" : "Grêmio 🔵⚪"})
              </h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                isDaniel
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-sky-500/20 text-sky-300 border-sky-500/30"
              }`}
            >
              Buffer: {isDaniel ? "+350 kcal" : "+250 kcal"}
            </span>
          </div>

          <p className="text-xs text-gray-300">
            Alternativas de alto teor de saciedade para gerenciar picos de adrenalina durante as partidas sem estourar o déficit calórico semanal:
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 flex items-center justify-between shadow-inner">
              <div>
                <span className="font-bold text-white block">
                  Espetinho de Peito de Frango com Chimichurri (P1)
                </span>
                <span className="text-[11px] text-gray-400 font-sans">Proteína limpa de alta saciedade</span>
              </div>
              <span className="font-bold text-emerald-400">140 kcal • 26g P</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 flex items-center justify-between shadow-inner">
              <div>
                <span className="font-bold text-white block">
                  Chips de Batata-Doce na Airfryer com Alecrim (C1)
                </span>
                <span className="text-[11px] text-gray-400 font-sans">Carboidrato de liberação gradual</span>
              </div>
              <span className="font-bold text-blue-400">120 kcal • 24g C</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/5 flex items-center justify-between shadow-inner">
              <div>
                <span className="font-bold text-white block">
                  Pipoca de Panela com Azeite Extravirgem (C1 / V3)
                </span>
                <span className="text-[11px] text-gray-400 font-sans">Fibras e polifenóis antioxidantes</span>
              </div>
              <span className="font-bold text-amber-400">90 kcal • 15g C</span>
            </div>
          </div>
        </div>

        {/* Strategic Pre-Race Carb-Loading Calculator */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Carb-Loading Pré-Prova ({specs.name.split(" ")[0]})
              </h3>
            </div>
            <button
              onClick={() => setCarbLoadingActive(!carbLoadingActive)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
                carbLoadingActive
                  ? "bg-amber-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {carbLoadingActive ? "Carb-Load Ativo" : "Simular Carb-Load"}
            </button>
          </div>

          <p className="text-xs text-gray-300">
            {isDaniel
              ? "Protocolo de 3 dias pré-21k (Meia de SP ou Nike SP City) para saturação dos estoques de glicogênio hepático e muscular (8g/kg):"
              : "Protocolo de 2 dias pré-10k (Circuito das Estações) para pico de energia sem retenção hídrica pesada (7g/kg):"}
          </p>

          <div className="p-3.5 rounded-2xl bg-[#07090E] border border-amber-500/30 space-y-2 text-xs font-mono shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Meta diária de carboidratos:</span>
              <span className="text-base font-extrabold text-amber-400">
                {targetCarbLoadingG}g / dia ({isDaniel ? "8g/kg" : "7g/kg"})
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <span>Alimentos estratégicos:</span>
              <span className="font-semibold text-white">Arroz Branco, Batata-Doce, Aveia, Mel, Suco de Uva</span>
            </div>

            <p className="text-[10px] text-gray-400 font-sans pt-1 border-t border-white/5">
              * Reduzir gorduras para &lt; 35g/dia e fibras nos últimos 2 dias para evitar desconforto
              gastrointestinal durante a corrida.
            </p>
          </div>
        </div>
      </div>

      {/* Official TACO Database Table with P1-P3, C1-C3, V1-V3 Tactical Badges */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-white/10 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Tabela TACO Oficial (UNICAMP) &amp; Classes Táticas
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Composição oficial por 100g e porções calculadas: Daniel (58%) vs Patrícia (42%).
            </p>
          </div>

          {/* Tactical Class Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "ALL", label: "Todos" },
              { id: "P", label: "P1-P3 (Proteínas)" },
              { id: "C", label: "C1-C3 (Carboidratos)" },
              { id: "V", label: "V1-V3 (Vegetais/Gorduras)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedClass(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedClass === tab.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-[#07090E] text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="h-4 w-4 text-gray-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar alimentos oficiais TACO (ex: Frango, Arroz, Tilápia, Beterraba, Brócolis, Carne)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#07090E] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {/* TACO Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#07090E] text-gray-400 uppercase text-[10px] font-mono tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-3.5">Alimento TACO</th>
                <th className="py-3 px-3.5">Classe</th>
                <th className="py-3 px-3.5">Calorias (100g)</th>
                <th className="py-3 px-3.5">Macros (P / C / G)</th>
                <th className="py-3 px-3.5 text-red-300">Porção Daniel (58%)</th>
                <th className="py-3 px-3.5 text-sky-300">Porção Patrícia (42%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredFoods.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3.5 font-semibold text-white font-sans">
                    {item.name}
                    <span className="block text-[10px] text-gray-500 font-mono">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.tacticalClass.startsWith("P")
                          ? "bg-red-950/80 text-red-300 border border-red-800"
                          : item.tacticalClass.startsWith("C")
                          ? "bg-blue-950/80 text-blue-300 border border-blue-800"
                          : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {item.tacticalClass}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-bold text-white">{item.caloriesKcal} kcal</td>
                  <td className="py-3 px-3.5 text-gray-300">
                    <span className="text-red-400 font-semibold">{item.proteinG}g P</span> •{" "}
                    <span className="text-blue-400 font-semibold">{item.carbsG}g C</span> •{" "}
                    <span className="text-amber-400 font-semibold">{item.fatsG}g G</span>
                  </td>
                  <td className="py-3 px-3.5 font-bold text-emerald-400">
                    {item.familyRecommendedPortionDanielG}g
                  </td>
                  <td className="py-3 px-3.5 font-bold text-sky-400">
                    {item.familyRecommendedPortionPatriciaG}g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
