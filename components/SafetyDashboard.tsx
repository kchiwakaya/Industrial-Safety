
import React from 'react';
import { SafetyAnalysis, SafetyLevel } from '../types';
import { 
  ShieldAlert, ShieldCheck, ShieldOff, 
  ArrowRight, CheckCircle2, XCircle, 
  AlertTriangle, Lightbulb
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  analysis: SafetyAnalysis;
}

const SafetyDashboard: React.FC<Props> = ({ analysis }) => {
  const getLevelColor = (level: SafetyLevel) => {
    switch (level) {
      case 'Good': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Critical': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    }
  };

  const getLevelIcon = (level: SafetyLevel) => {
    switch (level) {
      case 'Good': return ShieldCheck;
      case 'Warning': return ShieldAlert;
      case 'Critical': return ShieldOff;
    }
  };

  const Icon = getLevelIcon(analysis.level);
  const chartData = [
    { name: 'Safety', value: analysis.score },
    { name: 'Risk', value: 100 - analysis.score }
  ];
  const COLORS = [
    analysis.level === 'Good' ? '#10b981' : analysis.level === 'Warning' ? '#f59e0b' : '#f43f5e',
    '#1e293b'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Score Gauge */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{analysis.score}</span>
              <span className="text-xs text-slate-500 ml-0.5">%</span>
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold uppercase text-slate-400">Safety Index</span>
        </div>

        {/* Status Card */}
        <div className={`col-span-2 border rounded-2xl p-6 flex items-start gap-4 ${getLevelColor(analysis.level)}`}>
          <div className="p-3 rounded-xl bg-white/10">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Status: {analysis.level}</h2>
            <p className="text-sm opacity-80 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* PPE Status */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/80">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">PPE Checklist Detection</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-slate-700">
          {analysis.ppeCheck.map((item, idx) => (
            <div key={idx} className="bg-slate-800 p-4 flex flex-col items-center text-center">
              {item.detected ? (
                item.compliant ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
                )
              ) : (
                <XCircle className="w-6 h-6 text-slate-600 mb-2" />
              )}
              <span className="text-xs font-medium text-slate-300">{item.item}</span>
              <span className={`text-[10px] mt-1 ${item.detected ? 'text-blue-400' : 'text-slate-500'}`}>
                {item.detected ? (item.compliant ? 'Compliant' : 'Improperly Worn') : 'Not Detected'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Violations & Hazards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Detected Hazards & Violations</h3>
        {analysis.violations.length > 0 ? (
          <div className="grid gap-3">
            {analysis.violations.map((v, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-4 group hover:border-slate-500 transition-colors">
                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                  v.severity === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
                  v.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-200">{v.hazard}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      v.severity === 'High' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {v.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{v.category}</p>
                  <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-400/5 p-2 rounded-lg border border-emerald-400/10">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{v.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-8 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-emerald-500 font-medium">No safety violations detected in this scan.</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Strategic Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {analysis.generalRecommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                {idx + 1}
              </span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SafetyDashboard;
