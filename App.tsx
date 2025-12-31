
import React, { useState } from 'react';
import { IndustrySector, SafetyAnalysis } from './types';
import { analyzeSiteSafety } from './services/geminiService';
import IndustrySelector from './components/IndustrySelector';
import GuidelineUploader from './components/GuidelineUploader';
import CameraCapture from './components/CameraCapture';
import SafetyDashboard from './components/SafetyDashboard';
import { ShieldCheck, Info, History, Settings, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [sector, setSector] = useState<IndustrySector>(IndustrySector.CONSTRUCTION);
  const [guidelines, setGuidelines] = useState('');
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeSiteSafety(imageData, sector, guidelines);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. The AI model might be busy or the site is too complex. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-20 flex-col items-center py-8 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-12">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <nav className="flex flex-col gap-8">
          <button className="p-3 text-blue-400 bg-blue-500/10 rounded-xl"><Info className="w-6 h-6" /></button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><History className="w-6 h-6" /></button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><Settings className="w-6 h-6" /></button>
        </nav>
        <button className="mt-auto p-3 text-slate-600 hover:text-rose-400 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/30 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">SENTINEL<span className="text-blue-500">AI</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Visual Safety Auditor</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-[10px] font-bold uppercase text-slate-500">Live Status</span>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-semibold text-emerald-400">Systems Active</span>
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 lg:p-10">
            <div className="grid lg:grid-cols-12 gap-10">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-8">
                <section>
                  <IndustrySelector selected={sector} onSelect={setSector} />
                </section>

                <section>
                  <GuidelineUploader onUpdate={setGuidelines} />
                </section>

                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Model Capability</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs py-1 px-2 rounded bg-slate-800 border border-slate-700">Gemini 3 Pro Vision</span>
                    <span className="text-xs py-1 px-2 rounded bg-slate-800 border border-slate-700">Object Detection</span>
                    <span className="text-xs py-1 px-2 rounded bg-slate-800 border border-slate-700">Safety Reasoning</span>
                  </div>
                </div>
              </div>

              {/* Viewport Column */}
              <div className="lg:col-span-7 space-y-12">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Site Visual Input</h2>
                    <span className="text-[10px] font-mono text-slate-600">1280x720@30FPS</span>
                  </div>
                  <CameraCapture onCapture={handleCapture} isAnalyzing={isAnalyzing} />
                </section>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <section id="analysis-results">
                  {analysis ? (
                    <SafetyDashboard analysis={analysis} />
                  ) : !isAnalyzing && (
                    <div className="h-64 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 space-y-2">
                      <ShieldCheck className="w-10 h-10 opacity-20" />
                      <p className="text-sm">Scan a frame to generate a safety report</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info for mobile */}
        <footer className="p-4 border-t border-slate-800 bg-slate-900 text-center text-[10px] text-slate-500 uppercase tracking-widest">
          Powered by Gemini 3 Intelligence &bull; Internal Use Only &bull; SentinelAI &copy; 2024
        </footer>
      </main>
    </div>
  );
};

export default App;
