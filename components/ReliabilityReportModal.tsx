
import React, { useState } from 'react';
import { X, ClipboardCheck, AlertTriangle, Save, Gauge, Activity, Wrench, CheckCircle2 } from 'lucide-react';
import { ReliabilityReport, BreakdownCategory, Engine } from '../types';
import { engineStore } from '../services/engineStore';

interface ReliabilityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: Engine;
  userId: string;
  onSuccess: () => void;
}

const ReliabilityReportModal: React.FC<ReliabilityReportModalProps> = ({ isOpen, onClose, engine, userId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<ReliabilityReport>>({
    engineId: engine.id,
    userId: userId,
    mileage: 0,
    mileageUnit: 'h',
    usageStyle: 'Любительский',
    usageType: 'Эндуро',
    hasBreakdowns: false,
    breakdownCategories: [],
    description: '',
    maintenanceRating: 5
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.mileage! <= 0) throw new Error('Укажите корректный пробег');
      
      engineStore.submitReport(formData as Omit<ReliabilityReport, 'id' | 'createdAt'>);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleCategory = (cat: BreakdownCategory) => {
    const current = formData.breakdownCategories || [];
    const next = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    setFormData({ ...formData, breakdownCategories: next, hasBreakdowns: next.length > 0 });
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Опыт эксплуатации</h2>
            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mt-1">{engine.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Gauge size={14} className="text-orange-500" /> Текущий пробег
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    required
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition-all"
                    placeholder="0"
                    value={formData.mileage}
                    onChange={e => setFormData({...formData, mileage: Number(e.target.value)})}
                  />
                  <select 
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none"
                    value={formData.mileageUnit}
                    onChange={e => setFormData({...formData, mileageUnit: e.target.value as any})}
                  >
                    <option value="h">м/ч</option>
                    <option value="km">км</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Стиль эксплуатации
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {['Спокойный', 'Любительский', 'Жёсткий / Спорт'].map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({...formData, usageStyle: style as any})}
                      className={`p-4 rounded-2xl border text-sm font-bold transition-all text-left ${formData.usageStyle === style ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-sm tracking-widest text-white shadow-xl shadow-orange-900/20 mt-4"
              >
                Далее
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500" /> Были ли поломки?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.values(BreakdownCategory).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.breakdownCategories?.includes(cat) ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Wrench size={14} className="text-green-500" /> Качество обслуживания (1-5)
                </label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({...formData, maintenanceRating: rating})}
                      className={`w-10 h-10 rounded-xl font-black transition-all ${formData.maintenanceRating === rating ? 'bg-green-600 text-white' : 'bg-slate-950 text-slate-600'}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Комментарий (опционально)</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none min-h-[100px]"
                  placeholder="Опишите подробности эксплуатации..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Назад</button>
                <button type="submit" className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-900/20">Отправить отчет</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReliabilityReportModal;
