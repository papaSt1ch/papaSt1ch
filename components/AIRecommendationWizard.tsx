
import React, { useState } from 'react';
import { getStructuredRecommendation } from '../services/gemini';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  Mountain, 
  Bike, 
  Wallet, 
  Weight, 
  CheckCircle2, 
  Loader2,
  Bot
} from 'lucide-react';

const AIRecommendationWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    style: '',
    bikeType: '',
    weight: '75',
    experience: '',
    budget: ''
  });

  const styles = [
    { id: 'hard', label: 'Хард Эндуро', icon: <Mountain size={24} />, desc: 'Бревна, камни, крутые подъемы' },
    { id: 'cross', label: 'Мотокросс', icon: <Trophy size={24} />, desc: 'Прыжки, скорость, трек' },
    { id: 'pit', label: 'Питбайк', icon: <Bike size={24} />, desc: 'Покатушки по лесу, фан' },
    { id: 'tour', label: 'Туристик-эндуро', icon: <Mountain size={24} className="rotate-45" />, desc: 'Длинные дистанции, надежность' }
  ];

  const bikeTypes = ['Питбайк', 'Среднеразмерный (Lite)', 'Полноразмерный'];
  const experienceLevels = ['Новичок', 'Любитель', 'Опытный / Профи'];
  const budgetLevels = ['Бюджет', 'Средний', 'Премиум'];

  const handleComplete = async () => {
    setLoading(true);
    const recommendation = await getStructuredRecommendation(formData);
    setResult(recommendation);
    setLoading(false);
    setStep(6);
  };

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white uppercase italic">Стиль катания</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setFormData({...formData, style: s.label}); next(); }}
                  className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all text-left ${formData.style === s.label ? 'border-orange-500 bg-orange-500/10 shadow-lg' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
                >
                  <div className={`p-3 rounded-2xl ${formData.style === s.label ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{s.label}</div>
                    <div className="text-slate-500 text-sm">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white uppercase italic">Тип мотоцикла</h2>
            <div className="grid grid-cols-1 gap-3">
              {bikeTypes.map(type => (
                <button
                  key={type}
                  onClick={() => { setFormData({...formData, bikeType: type}); next(); }}
                  className={`p-6 rounded-3xl border-2 transition-all text-left font-bold text-lg ${formData.bikeType === type ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900/50'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white uppercase italic">Ваш вес</h2>
            <div className="flex flex-col items-center gap-8 py-10">
              <div className="text-6xl font-black text-orange-500 flex items-baseline gap-2">
                {formData.weight} <span className="text-2xl text-slate-500 uppercase">кг</span>
              </div>
              <input 
                type="range" min="40" max="130" 
                value={formData.weight} 
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <button onClick={next} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2">
                Далее <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white uppercase italic">Уровень опыта</h2>
            <div className="grid grid-cols-1 gap-3">
              {experienceLevels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { setFormData({...formData, experience: lvl}); next(); }}
                  className={`p-6 rounded-3xl border-2 transition-all text-left font-bold text-lg ${formData.experience === lvl ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900/50'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white uppercase italic">Бюджет на мотор</h2>
            <div className="grid grid-cols-1 gap-3">
              {budgetLevels.map(b => (
                <button
                  key={b}
                  onClick={() => { setFormData({...formData, budget: b}); }}
                  className={`p-6 rounded-3xl border-2 transition-all text-left font-bold text-lg ${formData.budget === b ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900/50'}`}
                >
                  {b}
                </button>
              ))}
            </div>
            <button 
              onClick={handleComplete} 
              disabled={!formData.budget}
              className="w-full bg-orange-600 disabled:bg-slate-800 disabled:text-slate-600 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 mt-4 shadow-xl shadow-orange-900/20 active:scale-95 transition-all"
            >
              <Sparkles size={20} /> Получить рекомендацию
            </button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-orange-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Bot size={120} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-500 p-3 rounded-2xl">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Ваш идеальный конфиг</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Анализ завершен</p>
                  </div>
                </div>
                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base border-t border-slate-800 pt-6">
                  {result}
                </div>
                <button 
                  onClick={() => setStep(1)} 
                  className="mt-8 w-full border border-slate-700 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                >
                  Начать заново
                </button>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {step < 6 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Шаг {step} из 5</span>
            <div className="flex gap-2">
              {step > 1 && (
                <button onClick={prev} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative">
             <Loader2 size={64} className="text-orange-500 animate-spin" />
             <Sparkles size={24} className="text-orange-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-black uppercase tracking-widest">Анализируем базу данных...</h3>
            <p className="text-slate-500 text-xs mt-2">Нейросеть подбирает мотор под ваши задачи</p>
          </div>
        </div>
      ) : renderStep()}
    </div>
  );
};

export default AIRecommendationWizard;
