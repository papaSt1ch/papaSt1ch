
import React, { useState } from 'react';
import { Engine, User } from '../types';
import { Check, X, ShieldCheck, Activity, Zap, BarChart2, Bookmark, BookmarkCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonViewProps {
  selectedEngines: Engine[];
  onRemove: (id: string) => void;
  currentUser: User | null;
  onSave?: (engineIds: string[]) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ selectedEngines, onRemove, currentUser, onSave }) => {
  const [saved, setSaved] = useState(false);

  if (selectedEngines.length === 0) {
    return (
      <div className="text-center py-20 md:py-32 bg-slate-900/50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-800 flex flex-col items-center gap-4 px-6">
        <div className="bg-slate-800 p-6 rounded-full text-slate-600">
          <BarChart2 size={48} />
        </div>
        <div>
          <p className="text-slate-300 text-xl font-bold">Список сравнения пуст</p>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Выберите моторы в каталоге, чтобы увидеть их детальное сравнение здесь.</p>
        </div>
      </div>
    );
  }

  const chartData = selectedEngines.map(e => ({
    name: e.name,
    power: e.power,
    torque: e.torque,
    resource: e.resource,
  }));

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4'];
  const maxPower = Math.max(...selectedEngines.map(e => e.power), 1);
  const maxTorque = Math.max(...selectedEngines.map(e => e.torque), 1);

  const handleSave = () => {
    if (onSave) {
      onSave(selectedEngines.map(e => e.id));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
          Сравнивается моторов: {selectedEngines.length}
        </p>
        {currentUser && (
          <button 
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${saved ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {saved ? 'Сохранено' : 'Сохранить сравнение'}
          </button>
        )}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { key: 'power', label: 'Мощность (л.с.)', icon: <Zap size={18} />, color: '#f97316' },
          { key: 'torque', label: 'Крутящий момент (Нм)', icon: <Activity size={18} />, color: '#3b82f6' },
          { key: 'resource', label: 'Ресурс (1-10)', icon: <ShieldCheck size={18} />, color: '#10b981', domain: [0, 10] }
        ].map((chart) => (
          <div key={chart.key} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl">
            <h3 className="text-[10px] md:text-sm font-black text-slate-400 mb-4 md:6 flex items-center gap-2 uppercase tracking-widest">
              <span style={{ color: chart.color }}>{chart.icon}</span> {chart.label}
            </h3>
            <div className="h-32 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={chart.domain as any} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1rem', padding: '8px' }}
                    itemStyle={{ color: chart.color, fontSize: '11px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#fff', marginBottom: '2px', fontSize: '11px' }}
                  />
                  <Bar dataKey={chart.key} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Table */}
      <div className="relative">
        <div className="absolute left-[80px] md:left-48 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none opacity-50" />
        
        <div className="overflow-x-auto rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-800 bg-slate-900/40 shadow-2xl scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-6 md:py-8 px-4 md:px-6 bg-slate-950 text-slate-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest sticky left-0 z-30 w-[80px] md:w-48 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  Параметры
                </th>
                {selectedEngines.map((e, idx) => (
                  <th key={e.id} className="py-6 md:py-8 px-6 md:px-8 min-w-[240px] md:min-w-[300px] bg-slate-950/40">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-white font-black uppercase italic tracking-tighter text-base md:text-xl truncate max-w-[150px] md:max-w-none">
                            {e.name}
                          </span>
                        </div>
                        <span className="text-orange-500 text-[8px] md:text-[10px] font-mono tracking-widest uppercase truncate">{e.brand}</span>
                      </div>
                      <button 
                        onClick={() => onRemove(e.id)} 
                        className="text-slate-600 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              <tr>
                <td className="py-4 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  Индекс / Тип
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-4 px-6 md:px-8">
                    <div className="flex flex-col">
                      <span className="text-slate-300 font-mono text-xs md:text-sm">{e.index}</span>
                      <span className="text-slate-500 text-[9px] font-black uppercase tracking-tighter">{e.stroke} • {e.volume} cc</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-6 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  Мощность
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-6 px-6 md:px-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-1 text-orange-500 font-black text-xl md:text-2xl tracking-tighter">
                        {e.power} <span className="text-[9px] text-slate-600 uppercase">л.с.</span>
                      </div>
                      <div className="w-full bg-slate-800/50 h-1.5 md:h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-orange-600 to-orange-400 h-full transition-all duration-1000"
                          style={{ width: `${(e.power / maxPower) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-6 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  Момент
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-6 px-6 md:px-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-1 text-blue-400 font-black text-xl md:text-2xl tracking-tighter">
                        {e.torque} <span className="text-[9px] text-slate-600 uppercase">Нм</span>
                      </div>
                      <div className="w-full bg-slate-800/50 h-1.5 md:h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-1000"
                          style={{ width: `${(e.torque / maxTorque) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-6 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  Ресурс
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-6 px-6 md:px-8">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 font-black text-lg md:text-xl shrink-0">{e.resource}</span>
                      <div className="flex gap-0.5">
                        {[...Array(10)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1 md:w-1.5 h-4 md:h-6 rounded-full ${i < e.resource ? 'bg-green-500' : 'bg-slate-800'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  Спецификация
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-4 px-6 md:px-8">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[8px] md:text-[9px] font-black uppercase text-cyan-400 whitespace-nowrap">
                        {e.cooling}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[8px] md:text-[9px] font-black uppercase text-indigo-400 whitespace-nowrap">
                        {e.fuelSystem}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-6 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)] align-top">
                  Плюсы
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-6 px-6 md:px-8 align-top">
                    <div className="space-y-1.5">
                      {e.pros.slice(0, 3).map((p, i) => (
                        <div key={i} className="flex gap-2 items-start text-[10px] md:text-xs">
                          <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                          <span className="text-slate-400 leading-tight">{p}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-6 px-4 md:px-6 text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)] align-top">
                  Минусы
                </td>
                {selectedEngines.map(e => (
                  <td key={e.id} className="py-6 px-6 md:px-8 align-top">
                    <div className="space-y-1.5">
                      {e.cons.slice(0, 3).map((c, i) => (
                        <div key={i} className="flex gap-2 items-start text-[10px] md:text-xs">
                          <X size={12} className="text-red-500 mt-0.5 shrink-0" />
                          <span className="text-slate-400 leading-tight">{c}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
        Листайте таблицу вправо <span className="text-lg">→</span>
      </div>
    </div>
  );
};

export default ComparisonView;
