import React, { useState } from 'react';
import { X, Plus, Info, Check, AlertTriangle, Save, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { Engine, EngineBrand, CoolingType, StrokeType } from '../types';
import { engineStore } from '../services/engineStore';

interface AddEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const AddEngineModal: React.FC<AddEngineModalProps> = ({ isOpen, onClose, userId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Engine>>({
    name: '',
    index: '',
    brand: EngineBrand.YX,
    volume: 125,
    stroke: StrokeType.FOUR,
    cooling: CoolingType.AIR,
    power: 0,
    torque: 0,
    valves: 2,
    timingType: 'SOHC',
    fuelSystem: 'Карбюратор',
    bestFor: ['Питбайк'],
    resource: 5,
    tuningPotential: 5,
    maintenanceDifficulty: 5,
    priceCategory: 'Бюджет',
    pros: [''],
    cons: [''],
    commonIssues: [''],
    maintenanceTips: [''],
    commonBikes: [''],
    description: '',
    originCountry: 'Китай',
    designOrigin: 'Копия',
    images: []
  });

  if (!isOpen) return null;

  const handleListChange = (field: keyof Engine, index: number, value: string) => {
    const list = [...(formData[field] as string[])];
    list[index] = value;
    setFormData({ ...formData, [field]: list });
  };

  const addListItem = (field: keyof Engine) => {
    setFormData({ ...formData, [field]: [...(formData[field] as string[]), ''] });
  };

  const removeListItem = (field: keyof Engine, index: number) => {
    const list = [...(formData[field] as string[])].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: list });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Фильтрация пустых строк из списков
      const cleanData = { ...formData };
      ['pros', 'cons', 'commonIssues', 'maintenanceTips', 'commonBikes'].forEach(key => {
        cleanData[key] = (cleanData[key] as string[]).filter(item => item.trim() !== '');
      });

      engineStore.submitNew(cleanData as Omit<Engine, 'id' | 'status' | 'createdAt'>, userId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const brands = Object.values(EngineBrand);
  const countries = ['Китай', 'Япония', 'Европа', 'Тайвань'];
  const origins = ['Оригинал', 'Лицензия', 'Копия', 'Модернизация'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Новая маркировка</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Добавление мотора в базу данных</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Steps Progress */}
        <div className="px-8 py-4 bg-slate-950/30 flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-800'}`} />
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                <Info className="text-orange-500" /> Основная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Название модели</label>
                  <input required placeholder="Напр: ZS 172FMM-3A" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-orange-500 text-white outline-none" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Заводской индекс</label>
                  <input required placeholder="Напр: 172FMM" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-orange-500 text-white outline-none" 
                    value={formData.index} onChange={e => setFormData({...formData, index: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Бренд / Производитель</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-orange-500 text-white outline-none"
                    value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value as EngineBrand})}>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Страна происхождения</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-orange-500 text-white outline-none"
                    value={formData.originCountry} onChange={e => setFormData({...formData, originCountry: e.target.value as any})}>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Описание</label>
                <textarea required placeholder="Краткая история и назначение мотора..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-orange-500 text-white outline-none min-h-[120px]" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                <Save className="text-blue-500" /> Технические характеристики
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Объем (см³)</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" 
                    value={formData.volume} onChange={e => setFormData({...formData, volume: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Мощность (л.с.)</label>
                  <input type="number" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" 
                    value={formData.power} onChange={e => setFormData({...formData, power: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Момент (Нм)</label>
                  <input type="number" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" 
                    value={formData.torque} onChange={e => setFormData({...formData, torque: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Клапанов</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" 
                    value={formData.valves} onChange={e => setFormData({...formData, valves: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Охлаждение</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white"
                    value={formData.cooling} onChange={e => setFormData({...formData, cooling: e.target.value as CoolingType})}>
                    {Object.values(CoolingType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Тактность</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white"
                    value={formData.stroke} onChange={e => setFormData({...formData, stroke: e.target.value as StrokeType})}>
                    {Object.values(StrokeType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Тип питания</label>
                  <input placeholder="Напр: Карбюратор PWK32" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" 
                    value={formData.fuelSystem} onChange={e => setFormData({...formData, fuelSystem: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                <Check className="text-green-500" /> Оценки и Рекомендации
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Ресурс (1-10)', key: 'resource' as const },
                  { label: 'Тюнинг (1-10)', key: 'tuningPotential' as const },
                  { label: 'Сложность (1-10)', key: 'maintenanceDifficulty' as const }
                ].map(item => (
                  <div key={item.key} className="space-y-4 bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">{item.label}</label>
                    {/* Fix: use type assertion to any to resolve the complex union type mismatch for ReactNode children */}
                    <div className="text-4xl font-black text-white text-center">{(formData as any)[item.key]}</div>
                    <input type="range" min="1" max="10" className="w-full h-1 bg-slate-800 rounded-full accent-orange-500 cursor-pointer" 
                      value={formData[item.key] || 5} onChange={e => setFormData({...formData, [item.key]: Number(e.target.value)})} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Назначение</label>
                <div className="flex flex-wrap gap-2">
                  {['Питбайк', 'Эндуро', 'Кросс', 'Универсал', 'Мотард'].map(cat => (
                    <button key={cat} type="button" 
                      onClick={() => {
                        const current = formData.bestFor || [];
                        const next = current.includes(cat as any) ? current.filter(c => c !== cat) : [...current, cat];
                        setFormData({...formData, bestFor: next as any});
                      }}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.bestFor?.includes(cat as any) ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                <Plus className="text-purple-500" /> Подробные списки
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pros & Cons */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-2">Плюсы</label>
                  {formData.pros?.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" value={p} onChange={e => handleListChange('pros', i, e.target.value)} />
                      <button type="button" onClick={() => removeListItem('pros', i)} className="p-2 text-slate-600 hover:text-red-500"><X size={16}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem('pros')} className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-white transition-colors ml-2"><Plus size={14}/> Добавить</button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-2">Минусы</label>
                  {formData.cons?.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" value={p} onChange={e => handleListChange('cons', i, e.target.value)} />
                      <button type="button" onClick={() => removeListItem('cons', i)} className="p-2 text-slate-600 hover:text-red-500"><X size={16}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem('cons')} className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-white transition-colors ml-2"><Plus size={14}/> Добавить</button>
                </div>

                {/* Issues & Common Bikes */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2">Типичные проблемы</label>
                  {formData.commonIssues?.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" value={p} onChange={e => handleListChange('commonIssues', i, e.target.value)} />
                      <button type="button" onClick={() => removeListItem('commonIssues', i)} className="p-2 text-slate-600 hover:text-red-500"><X size={16}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem('commonIssues')} className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-white transition-colors ml-2"><Plus size={14}/> Добавить</button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2">Где встречается (модели байков)</label>
                  {formData.commonBikes?.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" value={p} onChange={e => handleListChange('commonBikes', i, e.target.value)} />
                      <button type="button" onClick={() => removeListItem('commonBikes', i)} className="p-2 text-slate-600 hover:text-red-500"><X size={16}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem('commonBikes')} className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-white transition-colors ml-2"><Plus size={14}/> Добавить</button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button type="button" disabled={step === 1} onClick={() => setStep(step - 1)}
            className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-all flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
            <ChevronLeft size={16} /> Назад
          </button>
          
          <div className="flex gap-3">
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)}
                className="px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-900/20 transition-all flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                Далее <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" onClick={handleSubmit}
                className="px-10 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white shadow-xl shadow-green-900/20 transition-all flex items-center gap-2 uppercase font-black text-[12px] tracking-tighter">
                <Check size={18} /> Отправить на модерацию
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEngineModal;