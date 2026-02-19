
import React, { useState, useEffect } from 'react';
import { Engine, ReliabilityReport, AIPrediction, BreakdownCategory } from '../types';
import { predictEngineFailures } from '../services/gemini';
import { engineStore } from '../services/engineStore';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Clock, 
  TrendingUp, 
  Loader2,
  Info,
  ChevronRight,
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';

interface AIFailurePredictorProps {
  engine: Engine;
  userReport?: ReliabilityReport;
}

const AIFailurePredictor: React.FC<AIFailurePredictorProps> = ({ engine, userReport }) => {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      const reports = engineStore.getAllReports().filter(r => r.engineId === engine.id);
      const res = await predictEngineFailures(engine, reports, userReport);
      setPrediction(res);
      setLoading(false);
    };
    fetchPrediction();
  }, [engine.id, userReport]);

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <div className="text-center">
          <p className="text-white font-black uppercase text-[10px] tracking-widest">Анализируем историю эксплуатации...</p>
          <p className="text-slate-500 text-[8px] uppercase mt-1">AI сравнивает тысячи параметров</p>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Высокий': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Средний': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-3 rounded-2xl shadow-xl shadow-orange-600/20">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Прогноз поломок</h3>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">На базе {prediction.dataConfidence} отчетов</span>
               <div className="w-1 h-1 bg-slate-700 rounded-full" />
               <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getRiskColor(prediction.riskLevel)}`}>
                 Риск: {prediction.riskLevel}
               </span>
            </div>
          </div>
        </div>
        
        {userReport && (
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
             <Clock size={16} className="text-blue-500" />
             <div>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Текущий пробег</p>
               <p className="text-xs font-black text-white">{userReport.mileage} {userReport.mileageUnit}</p>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Risk Score Visual */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Вероятность неисправности</span>
            <span className="text-2xl font-black text-white">{prediction.riskScore}%</span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(249,115,22,0.3)] ${
                prediction.riskScore > 60 ? 'bg-red-600' : prediction.riskScore > 30 ? 'bg-orange-500' : 'bg-green-500'
              }`} 
              style={{ width: `${prediction.riskScore}%` }}
            />
          </div>
        </div>

        {/* Potential Issues List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prediction.potentialIssues.map((issue, idx) => (
            <div key={idx} className="bg-slate-950/40 border border-slate-800 p-5 rounded-3xl group hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-slate-900 rounded-lg text-orange-500">
                    <AlertTriangle size={14} />
                  </span>
                  <span className="text-[11px] font-black text-white uppercase tracking-tighter">{issue.category}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase italic">~{issue.mileageWindow}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic mb-3">{issue.reason}</p>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full opacity-50" 
                  style={{ width: `${issue.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Expert Advice Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
           <div className="space-y-3">
             <div className="flex items-center gap-2 text-blue-400">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">Персональный совет</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 italic">
               {prediction.personalAdvice}
             </p>
           </div>
           
           <div className="space-y-3">
             <div className="flex items-center gap-2 text-green-400">
               <TrendingUp size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">План обслуживания</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed bg-green-500/5 p-4 rounded-2xl border border-green-500/10 italic">
               {prediction.maintenanceForecast}
             </p>
           </div>
        </div>
      </div>
      
      {/* Footer / Disclaimer */}
      <div className="px-8 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-center gap-2">
         <ShieldAlert size={12} className="text-slate-600" />
         <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
           Прогноз носит рекомендательный характер и основан на математической вероятности
         </p>
      </div>
    </div>
  );
};

export default AIFailurePredictor;
