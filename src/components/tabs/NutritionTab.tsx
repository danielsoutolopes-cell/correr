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
} from "lucide-react";
import { OFFICIAL_TACO_FOODS } from "@/lib/taco-data";
import { FoodTacticalClass, TacoFoodItem } from "@/lib/types";

interface NutritionTabProps {
  currentProfile: "DANIEL" | "PATRICIA" | "CLAN";
  hasMatchDaySnackMode?: boolean;
}

export function NutritionTab({ currentProfile, hasMatchDaySnackMode = true }: NutritionTabProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [scannerAnalyzing, setScannerAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [carbLoadingActive, setCarbLoadingActive] = useState<boolean>(false);

  const isDaniel = currentProfile !== "PATRICIA";

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

  // Carb-loading calculations for Daniel (80kg * 8g carb/kg = 640g carb/dia)
  const targetCarbLoadingG = isDaniel ? 80 * 8 : 58 * 7;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Multimodal Bio-Scanner Hero Widget */}
      <div className="rounded-2xl bg-gradient-to-br from-[#111827] via-[#161F33] to-[#111827] border border-emerald-500/30 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                Multimodal Bio-Scanner
              </span>
              <span className="text-xs text-gray-400">
                Alimentado por Gemini 2.5 Flash &amp; Tabela TACO Oficial
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">
              Escaneamento Visual &amp; Porcionamento Familiar
            </h2>
            <p className="text-xs text-gray-300">
              Fotografe seu prato ou envie uma captura para identificação taxonômica (P1-P3, C1-C3, V1-V3)
              e cálculo de porção exato para Daniel vs Patrícia.
            </p>
          </div>

          {/* Camera Upload Trigger */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
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
          <div className="mt-5 p-4 rounded-xl bg-[#090D16]/90 border border-emerald-500/40 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <span className="text-xs font-bold text-emerald-400">
                Resultado do Bio-Scanner: {scanResult.dishName}
              </span>
              <button
                onClick={() => setScanResult(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Limpar
              </button>
            </div>

            {/* Identified Food Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {scanResult.identifiedItems?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[#111827] border border-gray-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{item.name}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">
                      {item.tacticalClass}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Daniel: <strong className="text-white">{item.estimatedGramsDaniel}g</strong> •
                    Patrícia: <strong className="text-white">{item.estimatedGramsPatricia}g</strong>
                  </p>
                  <p className="text-[10px] text-emerald-400">
                    {item.caloriesKcal} kcal ({item.proteinG}g P • {item.carbsG}g C • {item.fatsG}g G)
                  </p>
                </div>
              ))}
            </div>

            {/* Dual Family Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-xs">
                <span className="font-bold text-red-300 block mb-1">
                  Daniel (80kg • Meta Performance)
                </span>
                <p className="text-gray-200">
                  Total: <strong>{scanResult.totalsDaniel?.caloriesKcal} kcal</strong> (
                  {scanResult.totalsDaniel?.proteinG}g Proteína •{" "}
                  {scanResult.totalsDaniel?.carbsG}g Carboidrato •{" "}
                  {scanResult.totalsDaniel?.fatsG}g Gordura)
                </p>
              </div>

              <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/30 text-xs">
                <span className="font-bold text-sky-300 block mb-1">
                  Patrícia (58kg • Meta Recomposição)
                </span>
                <p className="text-gray-200">
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
        {/* Game Day Snacks Mode (+350 kcal Buffer) */}
        <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-bold text-white">
                Modo Petiscos Saudáveis (Dia de Jogo)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Buffer: +350 kcal ativado
            </span>
          </div>

          <p className="text-xs text-gray-300">
            Alternativas saudáveis para controlar a ansiedade e manter a dieta intacta durante as
            partidas de Flamengo e Grêmio:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#090D16] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  Espetinho de Peito de Frango com Chimichurri (P1)
                </span>
                <span className="text-[11px] text-gray-400">Proteína limpa de alta saciedade</span>
              </div>
              <span className="font-bold text-emerald-400">140 kcal • 26g P</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  Chips de Batata-Doce na Airfryer com Alecrim (C1)
                </span>
                <span className="text-[11px] text-gray-400">Carboidrato de liberação gradual</span>
              </div>
              <span className="font-bold text-blue-400">120 kcal • 24g C</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  Pipoca de Panela com Azeite Extravirgem (C1 / V3)
                </span>
                <span className="text-[11px] text-gray-400">Fibras e polifenóis antioxidantes</span>
              </div>
              <span className="font-bold text-amber-400">90 kcal • 15g C</span>
            </div>
          </div>
        </div>

        {/* Strategic Pre-Race Carb-Loading Calculator */}
        <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Calculadora de Carb-Loading Pré-21k
              </h3>
            </div>
            <button
              onClick={() => setCarbLoadingActive(!carbLoadingActive)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                carbLoadingActive
                  ? "bg-amber-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {carbLoadingActive ? "Carb-Load Ativo" : "Simular Carb-Load"}
            </button>
          </div>

          <p className="text-xs text-gray-300">
            Protocolo de 3 dias pré-prova (Meia de SP ou Nike SP City) para saturação dos
            depósitos de glicogênio hepático e muscular:
          </p>

          <div className="p-3 rounded-xl bg-[#090D16] border border-amber-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Meta diária de carboidratos:</span>
              <span className="text-base font-extrabold text-amber-400">
                {targetCarbLoadingG}g / dia (8g/kg)
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <span>Alimentos estratégicos recomendados:</span>
              <span className="font-semibold text-white">Arroz Branco, Batata-Doce, Aveia, Mel</span>
            </div>

            <p className="text-[10px] text-gray-400">
              * Reduzir gorduras para &lt; 35g/dia e fibras nos últimos 2 dias para evitar desconforto
              gastrointestinal durante os 21km.
            </p>
          </div>
        </div>
      </div>

      {/* Official TACO Database Table with P1-P3, C1-C3, V1-V3 Tactical Badges */}
      <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Tabela TACO Oficial (UNICAMP) &amp; Classes Táticas
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Composição oficial por 100g e porções calculadas para Daniel vs Patrícia.
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
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedClass === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-[#090D16] text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar alimentos oficiais TACO (ex: Frango, Arroz, Tilápia, Beterraba, Brócolis)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090D16] border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* TACO Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#090D16] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-2.5 px-3">Alimento TACO</th>
                <th className="py-2.5 px-3">Classe</th>
                <th className="py-2.5 px-3">Calorias (100g)</th>
                <th className="py-2.5 px-3">Macros (P / C / G)</th>
                <th className="py-2.5 px-3">Porção Daniel</th>
                <th className="py-2.5 px-3">Porção Patrícia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredFoods.map((item) => (
                <tr key={item.id} className="hover:bg-[#161F33] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {item.name}
                    <span className="block text-[10px] text-gray-500 font-normal">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
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
                  <td className="py-2.5 px-3 font-bold text-white">{item.caloriesKcal} kcal</td>
                  <td className="py-2.5 px-3 text-gray-300">
                    <span className="text-red-400 font-semibold">{item.proteinG}g P</span> •{" "}
                    <span className="text-blue-400 font-semibold">{item.carbsG}g C</span> •{" "}
                    <span className="text-amber-400 font-semibold">{item.fatsG}g G</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">
                    {item.familyRecommendedPortionDanielG}g
                  </td>
                  <td className="py-2.5 px-3 font-bold text-sky-400">
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
