
import React, { useMemo, useState } from 'react';
import { analyticsStore } from '../services/analyticsStore';
import { EngineStats } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, ShieldCheck, AlertTriangle, Info, 
  BarChart3, PieChart as PieIcon, Trophy, Layers,
  ChevronRight, Calendar, Filter
} from 'lucide-react';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4'];

const StatisticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'popularity' | 'reliability' | 'problems'>('popularity');
  const stats = useMemo(() => analyticsStore.getStats(), []);

  const topPopular = useMemo(() => analyticsStore.getTopByPopularity(10), []);
  const topReliable = useMemo(() => analyticsStore.getTopByReliability(10), []);
  const topProblematic = useMemo(() => analyticsStore.getMostProblematic(10), []);

  const brandDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.forEach(s => counts[s.brand] = (counts[s.brand] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const renderStatCard = (item: EngineStats, idx: number, type: string) => {
    const getScoreColor = (score: number) => {
      if (score > 80) return 'text-green-500';
      if (score > 50) return 'text-orange-500';
      return 'text-red-500';
    };

    return (
      <div key={item.engineId} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-slate-700 transition-all">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center font-black text-slate-500 border border-slate-800">
            {idx + 1}
          </div>
          <div>
            <h4 className="text-white font-black uppercase italic tracking-tighter text-lg">{item.engineName}</h4>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.brand}</p>
          </div>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
              {type === 'popularity' ? 'Очков популярности' : type === 'reliability' ? 'Индекс надежности' : 'Процент поломок'}
            </p>
            <p className={`text-xl font-black ${getScoreColor(type === 'popularity' ? item.popularityScore : type === 'reliability' ? item.reliabilityScore : 100 - item.failureRate)}`}>
              {type === 'popularity' ? item.popularityScore : type === 'reliability' ? item.reliabilityScore + '%' : item.failureRate + '%'}
            </p>
          </div>
          <ChevronRight className="text-slate-800 group-hover:text-white transition-colors" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-4 rounded-[1.5rem] shadow-xl shadow-orange-900/20">
            <BarChart3 className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Аналитика Сообщества</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Прозрачная статистика на основе реальных данных</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveTab('popularity')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'popularity' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
            Популярность
          </button>
          <button onClick={() => setActiveTab('reliability')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reliability' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
            Надежность
          </button>
          <button onClick={() => setActiveTab('problems')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'problems' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
            Проблемы
          </button>
        </div>
      </div>

      {/* Overview Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                <TrendingUp className="text-orange-500" /> Динамика показателей
              </h3>
              <div className="flex gap-2">
                 <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold"><div className="w-2 h-2 rounded-full bg-orange-500"/> Популярность</span>
                 <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold"><div className="w-2 h-2 rounded-full bg-green-500"/> Надежность</span>
              </div>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={topPopular}>
                  <defs>
                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="engineName" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1rem' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="popularityScore" stroke="#f97316" fillOpacity={1} fill="url(#colorPop)" strokeWidth={3} />
                  <Area type="monotone" dataKey="reliabilityScore" stroke="#10b981" fill="none" strokeWidth={3} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col space-y-6">
           <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
             <PieIcon className="text-blue-500" /> Доля брендов
           </h3>
           <div className="flex-1 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={brandDistribution} 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5} 
                    dataKey="value"
                    stroke="none"
                  >
                    {brandDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-2">
              {brandDistribution.slice(0, 4).map((b, i) => (
                <div key={b.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-black text-slate-500 uppercase">{b.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            <Trophy className="text-yellow-500" /> 
            {activeTab === 'popularity' ? 'Самые востребованные' : activeTab === 'reliability' ? 'Эталоны надежности' : 'Критическая зона'}
          </h3>
          
          <div className="space-y-4">
            {activeTab === 'popularity' && topPopular.map((item, i) => renderStatCard(item, i, 'popularity'))}
            {activeTab === 'reliability' && topReliable.map((item, i) => renderStatCard(item, i, 'reliability'))}
            {activeTab === 'problems' && topProblematic.map((item, i) => renderStatCard(item, i, 'problems'))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl space-y-8 sticky top-24">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl">
                  <Info className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Как мы считаем?</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">1</div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <span className="text-white font-bold">Надежность</span> — средний пробег без поломок, помноженный на качество обслуживания владельцев. 
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">2</div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <span className="text-white font-bold">Популярность</span> — динамический вес, учитывающий количество владельцев, сборок и частоту просмотров.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">3</div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <span className="text-white font-bold">AI-верификация</span> — ИИ фильтрует подозрительные отчеты и аномалии в пробегах для честного результата.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800">
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                  Скачать полный отчет (CSV)
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
