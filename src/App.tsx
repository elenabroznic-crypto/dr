import React, { useState } from 'react';
import { Network, History, FileText, Send, Sparkles, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NetworkGraph from './components/NetworkGraph';
import { analyzeHistoricalText } from './services/geminiService';
import { Actor, AnalysisResult, Relation } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_TEXT = `Domovinski rat (1991. – 1995.) bio je obrambeno-oslobodilački rat za neovisnost i cjelovitost hrvatske države protiv agresije udruženih snaga velikosrpskih ekstremista u Hrvatskoj, JNA te Srbije i Crne Gore.

Ključne političke figure bile su predsjednik Franjo Tuđman, koji je vodio hrvatsku politiku prema neovisnosti. S druge strane, u Beogradu je Slobodan Milošević provodio politiku "Svi Srbi u jednoj državi". 

Međunarodna zajednica reagirala je različito. Europska zajednica pokušala je diplomatskim putem zaustaviti sukobe, dok je Vijeće sigurnosti UN-a nametnulo embargo na uvoz oružja, što je otežalo obranu Hrvatskoj. Godine 1992. stigle su snage UNPROFOR-a.

Vanceov plan bio je pokušaj postizanja primirja. Kasnije, operacija Oluja 1995. godine dovela je do oslobađanja okupiranih teritorija, nakon čega je potpisan Daytonski sporazum kojim je prekinut rat u Bosni i Hercegovini i otvoren put mirnoj reintegraciji hrvatskog Podunavlja.`;

export default function App() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeHistoricalText(text);
      setResult(data);
      setSelectedActor(null);
    } catch (error) {
      console.error("Greška pri analizi:", error);
      alert("Došlo je do greške prilikom analize teksta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 flex flex-col overflow-hidden">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Network size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Arhivator: Gemini Graph Analysis</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Povijest Domovinskog rata / Politička Mreža</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setText("")}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-semibold text-sm border border-indigo-100 hover:bg-indigo-100 transition-colors"
          >
            Novi Dokument
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Pokreni Analizu
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-12 grid-rows-6 gap-4 min-h-0">
        
        {/* Main Visualization Card */}
        <section className="col-span-8 row-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4 z-10 bg-white/50 backdrop-blur-sm -mx-2 -mt-2 p-2 rounded-xl">
            <h2 className="font-bold text-slate-800">Mreža Političkih Odnosa</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase">Sukob</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Diplomacija</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Sporazum</span>
            </div>
          </div>
          
          <div className="flex-grow relative min-h-0 rounded-2xl overflow-hidden bg-slate-50/30">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                 <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gemini analizira kompleksno vrijeme...</span>
              </div>
            )}
            {result ? (
              <NetworkGraph 
                actors={result.actors} 
                relations={result.relations} 
                onActorClick={setSelectedActor} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Network size={48} className="mb-4 opacity-10" />
                <p className="text-sm font-medium">Nema učitanih podataka. Pokrenite analizu teksta.</p>
              </div>
            )}
          </div>
        </section>

        {/* Actors List Card */}
        <section className="col-span-4 row-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Identificirani Akteri</h2>
            {result && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{result.actors.length} ukupno</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {result ? (
              result.actors.map((actor) => (
                <button
                  key={actor.id}
                  onClick={() => setSelectedActor(actor)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all group",
                    selectedActor?.id === actor.id 
                      ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200" 
                      : "bg-slate-50 border-slate-100 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm group-hover:text-indigo-600 transition-colors">{actor.name}</p>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">{actor.type}</p>
                    </div>
                    {actor.type === 'Government' && <div className="w-2 h-2 rounded-full bg-red-400" />}
                    {actor.type === 'Individual' && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                    {actor.type === 'InternationalOrganization' && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </div>
                </button>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-xs">
                Učitajte tekst za popis aktera
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedActor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-100 bg-indigo-50 -mx-6 -mb-6 px-6 pb-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Detalji o akteru</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{selectedActor.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">{selectedActor.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Document Analysis Snippet (Text Input) */}
        <section className="col-span-6 row-span-2 bg-indigo-900 text-white border border-transparent rounded-3xl p-6 shadow-md overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", loading ? "bg-amber-400 animate-pulse" : "bg-emerald-400")}></div>
              <h2 className="font-bold text-indigo-100 uppercase text-xs tracking-widest">Ulazni povijesni tekst</h2>
            </div>
            <div className="text-[10px] text-indigo-300 font-mono">{text.length} znakova</div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 w-full bg-indigo-950/50 rounded-xl p-3 text-sm text-indigo-50 focus:outline-none placeholder:text-indigo-700 resize-none border border-indigo-800/50"
            placeholder="Ovdje zalijepite tekst za analizu..."
          />
        </section>

        {/* Relationship Stats Card */}
        <section className="col-span-6 row-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h2 className="font-bold text-slate-800 mb-4">Statistika Relacija</h2>
          
          <div className="flex items-end gap-3 h-24 mb-4">
            {['Conflict', 'Diplomacy', 'Agreement', 'Other'].map((type) => {
              const count = result?.relations.filter(r => r.type === type).length || 0;
              const max = result ? Math.max(...['Conflict', 'Diplomacy', 'Agreement', 'Other'].map(t => result.relations.filter(r => r.type === t).length)) : 10;
              const height = result ? (count / max) * 100 : 0;
              
              const colors: Record<string, string> = {
                Conflict: 'bg-red-400',
                Diplomacy: 'bg-indigo-400',
                Agreement: 'bg-emerald-400',
                Other: 'bg-slate-400'
              };

              return (
                <div key={type} className="flex-1 flex flex-col items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 5)}%` }}
                    className={cn("w-full rounded-t-lg transition-all", colors[type])} 
                  />
                  <p className="text-[9px] text-center mt-2 font-bold text-slate-500 uppercase">{type.slice(0, 5)}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-tight">Ukupno detektiranih veza:</p>
            <span className="text-lg font-mono font-bold text-indigo-600">{result?.relations.length || 0}</span>
          </div>
        </section>

      </main>
    </div>
  );
}
