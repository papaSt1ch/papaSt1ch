
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { engines as staticEngines } from './data/engines';
import { Engine, User, ReliabilityReport, Build, ActivityItem, Comment } from './types';
import EngineCard from './components/EngineCard';
import ComparisonView from './components/ComparisonView';
import AIAdvisor from './components/AIAdvisor';
import AIRecommendationWizard from './components/AIRecommendationWizard';
import About from './components/About';
import AuthModal from './components/AuthModal';
import AddEngineModal from './components/AddEngineModal';
import UserProfile from './components/UserProfile';
import ReliabilityReportModal from './components/ReliabilityReportModal';
import AIFailurePredictor from './components/AIFailurePredictor';
import BuildModal from './components/BuildModal';
import StatisticsView from './components/StatisticsView';
import { authService } from './services/auth';
import { engineStore } from './services/engineStore';
import { buildStore } from './services/buildStore';
import { 
  Database, 
  Sparkles, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  ArrowLeft, 
  Target, 
  Wrench, 
  Activity, 
  Layers, 
  X, 
  XCircle,
  AlertCircle, 
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Navigation,
  Info,
  AlertTriangle,
  Globe,
  Settings2,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Plus,
  BarChart2,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  ClipboardList,
  Bike,
  Users,
  MessageCircle,
  Clock,
  Zap,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Cpu,
  Fuel,
  Settings,
  Star,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

type SortKey = 'name' | 'power' | 'resource' | 'price' | 'volume' | 'reliability';
type SortOrder = 'asc' | 'desc';

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </div>
);

const ActivityFeed = ({ items }: { items: ActivityItem[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 mb-4">Живая лента сообщества</h3>
      <div className="space-y-3">
        {items.slice(0, 5).map(item => (
          <div key={item.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400">
               {item.type === 'NEW_BUILD' ? <Bike size={18} /> : <Zap size={18} />}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs text-slate-300 truncate">
                 <span className="font-bold text-white">{item.userName}</span> добавил сборку <span className="text-indigo-400">"{item.targetName}"</span>
               </p>
               <p className="text-[8px] font-black text-slate-600 uppercase mt-0.5">{new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = ({ 
  engines,
  selectedEngineIds, 
  onToggleCompare,
  currentUser,
  onFavoriteToggle,
  onOpenAuth,
  onOpenAddEngine,
  onOpenProfile,
  onOpenBuild
}: { 
  engines: Engine[],
  selectedEngineIds: string[], 
  onToggleCompare: (id: string) => void,
  currentUser: User | null,
  onFavoriteToggle: (id: string) => void,
  onOpenAuth: () => void,
  onOpenAddEngine: () => void,
  onOpenProfile: () => void,
  onOpenBuild: () => void
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [activities, setActivities] = useState<ActivityItem[]>(buildStore.getActivities());

  const filteredEngines = useMemo(() => {
    let results = engines.filter(e => 
      e.name.toLowerCase().includes(search.toLowerCase()) || 
      e.brand.toLowerCase().includes(search.toLowerCase()) ||
      e.index.toLowerCase().includes(search.toLowerCase())
    );

    return results.sort((a, b) => {
      let comparison = 0;
      if (sort === 'name') comparison = a.name.localeCompare(b.name);
      else if (sort === 'power') comparison = a.power - b.power;
      else if (sort === 'reliability') comparison = (a.reliabilityIndex || 0) - (b.reliabilityIndex || 0);
      return order === 'asc' ? comparison : -comparison;
    });
  }, [engines, search, sort, order]);

  return (
    <Page>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-2xl shadow-xl shadow-orange-500/10">
                <Database size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">MotoEngine Pro</h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Community Hub & Engine DB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl pr-4 cursor-pointer hover:border-slate-700 transition-all" onClick={onOpenProfile}>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{currentUser.level}</p>
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                  </div>
                </div>
              ) : (
                <button onClick={onOpenAuth} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                  Войти
                </button>
              )}
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-3">
             <Link to="/wizard" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20">
               <Navigation size={14} /> Подбор мотора
             </Link>
             <Link to="/stats" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all active:scale-95">
               <BarChart3 size={14} className="text-orange-500" /> Рейтинги
             </Link>
             <button onClick={onOpenBuild} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
               <Bike size={14} /> Создать сборку
             </button>
             <Link to="/compare" className="relative bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all">
               <BarChart3 size={14} /> Сравнение
               {selectedEngineIds.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950">{selectedEngineIds.length}</span>}
             </Link>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input type="text" placeholder="Поиск моторов для вашей сборки..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-12 focus:border-orange-500 outline-none text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEngines.map(engine => (
                <EngineCard key={engine.id} engine={engine} onClick={() => navigate(`/engine/${engine.id}`)} isComparing={selectedEngineIds.includes(engine.id)} currentUser={currentUser} onFavoriteToggle={onFavoriteToggle} onCompareToggle={(e) => { e.stopPropagation(); onToggleCompare(engine.id); }} />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block space-y-8">
           <ActivityFeed items={activities} />
           <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] space-y-6">
              <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Топ авторов</h3>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-800 rounded-xl" />
                   <div>
                     <p className="text-xs font-bold text-white">Rider_{i}00</p>
                     <p className="text-[9px] font-black text-orange-500 uppercase">Эксперт • {100-i*10} РЕП</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </Page>
  );
};

const EngineDetail = ({ 
  engines, 
  currentUser, 
  onOpenReport, 
  onToggleCompare, 
  onFavoriteToggle,
  selectedEngineIds 
}: { 
  engines: Engine[], 
  currentUser: User | null, 
  onOpenReport: () => void,
  onToggleCompare: (id: string) => void,
  onFavoriteToggle: (id: string) => void,
  selectedEngineIds: string[]
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const engine = engines.find(e => e.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'pros' | 'maintenance' | 'reviews'>('overview');
  const [imgError, setImgError] = useState(false);
  const reliabilityStats = engine ? engineStore.getEngineStats(engine.id) : null;
  const userReport = (currentUser && engine) ? engineStore.getAllReports().find(r => r.engineId === engine.id && r.userId === currentUser.id) : undefined;
  const isComparing = engine ? selectedEngineIds.includes(engine.id) : false;
  const isFavorite = (currentUser && engine) ? currentUser.favorites.includes(engine.id) : false;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (engine) {
      setComments(buildStore.getComments(engine.id));
    }
  }, [engine]);

  if (!engine) return <div className="p-10 text-center text-white">Мотор не найден</div>;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;
    
    const comment = buildStore.addComment({
      userId: currentUser.id,
      userName: currentUser.name,
      targetId: engine.id,
      text: newComment
    });
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <Page>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-orange-500 transition-colors">
            <ArrowLeft size={16} /> Назад к списку
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => onFavoriteToggle(engine.id)}
              className={`p-3 rounded-2xl border transition-all ${isFavorite ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => onToggleCompare(engine.id)}
              className={`p-3 rounded-2xl border transition-all ${isComparing ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
            >
              <TrendingUp size={20} />
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl flex flex-col lg:flex-row">
          {/* Left Side: Images & Quick Actions */}
          <div className="lg:w-2/5 relative bg-slate-950 flex items-center justify-center p-8 border-r border-slate-800">
            {engine.images.length > 0 && !imgError ? (
              <img src={engine.images[0].url} className="w-full h-auto max-h-[400px] object-contain drop-shadow-[0_0_30px_rgba(249,115,22,0.1)]" alt={engine.name} onError={() => setImgError(true)} />
            ) : (
              <div className="flex flex-col items-center opacity-20"><Database size={120} /></div>
            )}
            
            <div className="absolute top-6 left-6">
               <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-2">
                 <Globe size={12} className="text-blue-400" /> {engine.originCountry}
               </span>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ресурс</p>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-4 rounded-full ${i < engine.resource ? 'bg-green-500' : 'bg-slate-800'}`} />
                  ))}
                </div>
              </div>
              <div className="bg-orange-600/10 p-4 rounded-3xl border border-orange-500/20 text-center">
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Тюнинг</p>
                 <p className="text-xl font-black text-white">{engine.tuningPotential}/10</p>
              </div>
            </div>
          </div>

          {/* Right Side: Content & Tabs */}
          <div className="lg:w-3/5 flex flex-col">
            <div className="p-10 border-b border-slate-800 bg-slate-900/50">
               <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{engine.name}</h1>
               <div className="flex flex-wrap items-center gap-4">
                 <p className="text-orange-500 font-mono text-sm tracking-[0.2em] uppercase font-bold">{engine.brand} • {engine.index}</p>
                 <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                 <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                   <ShieldCheck size={14} className="text-green-500" /> Надежность: {engine.reliabilityIndex || '75'}%
                 </span>
               </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 px-10 overflow-x-auto scrollbar-hide bg-slate-900">
               {[
                 { id: 'overview', label: 'Обзор', icon: <Layers size={14}/> },
                 { id: 'specs', label: 'Характеристики', icon: <Settings size={14}/> },
                 { id: 'pros', label: 'За и Против', icon: <CheckCircle2 size={14}/> },
                 { id: 'maintenance', label: 'Надежность', icon: <Wrench size={14}/> },
                 { id: 'reviews', label: 'Отзывы', icon: <MessageCircle size={14}/> }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.id ? 'border-orange-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </div>

            <div className="p-10 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <AIFailurePredictor engine={engine} userReport={userReport} />
                  <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-slate-800">
                    <h3 className="text-lg font-black uppercase italic text-white mb-4">О модели</h3>
                    <p className="text-slate-400 leading-relaxed italic">{engine.description}</p>
                  </div>
                  {reliabilityStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Без поломок</p>
                          <p className="text-xl font-black text-green-500">{Math.round((reliabilityStats.noBreakdowns / reliabilityStats.total) * 100)}%</p>
                       </div>
                       <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Средний пробег</p>
                          <p className="text-xl font-black text-blue-500">{Math.round(reliabilityStats.avgMileage)} <span className="text-[10px]">м/ч</span></p>
                       </div>
                       <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Отчетов</p>
                          <p className="text-xl font-black text-white">{reliabilityStats.total}</p>
                       </div>
                       <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Репутация</p>
                          <p className="text-xl font-black text-orange-500">{engine.reliabilityIndex}%</p>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                  {[
                    { label: 'Объем', val: `${engine.volume} см³`, icon: <Activity className="text-orange-500"/> },
                    { label: 'Мощность', val: `${engine.power} л.с.`, icon: <Zap className="text-yellow-500"/> },
                    { label: 'Момент', val: `${engine.torque} Нм`, icon: <TrendingUp className="text-blue-500"/> },
                    { label: 'Тип', val: engine.stroke, icon: <Layers className="text-purple-500"/> },
                    { label: 'Охлаждение', val: engine.cooling, icon: engine.cooling === 'Жидкостное' ? <Droplets className="text-cyan-500"/> : <Wind className="text-slate-400"/> },
                    { label: 'Клапанов', val: engine.valves, icon: <Settings className="text-slate-500"/> },
                    { label: 'ГРМ', val: engine.timingType, icon: <Clock className="text-green-500"/> },
                    { label: 'Питание', val: engine.fuelSystem, icon: <Fuel className="text-orange-400"/> },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-950/40 border border-slate-800 rounded-3xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl">{spec.icon}</div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{spec.label}</span>
                      </div>
                      <span className="text-sm font-black text-white">{spec.val}</span>
                    </div>
                  ))}
                  <div className="md:col-span-2 p-6 bg-slate-950/40 border border-slate-800 rounded-[2rem] space-y-3">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Подходит для:</p>
                     <div className="flex flex-wrap gap-2">
                       {engine.bestFor.map(cat => (
                         <span key={cat} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded-xl tracking-widest">{cat}</span>
                       ))}
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'pros' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <CheckCircle2 size={14}/> Сильные стороны
                    </h4>
                    {engine.pros.map((p, i) => (
                      <div key={i} className="bg-green-500/5 border border-green-500/10 p-4 rounded-2xl flex gap-3 italic">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0"/>
                        <p className="text-xs text-slate-300 leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <XCircle size={14}/> Слабые стороны
                    </h4>
                    {engine.cons.map((c, i) => (
                      <div key={i} className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex gap-3 italic">
                        <XCircle size={16} className="text-red-500 shrink-0"/>
                        <p className="text-xs text-slate-300 leading-relaxed">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <AlertTriangle size={14}/> Типичные неисправности
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {engine.commonIssues.map((issue, i) => (
                        <div key={i} className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-3xl flex items-start gap-3">
                          <ShieldAlert size={18} className="text-orange-500 shrink-0"/>
                          <p className="text-xs text-slate-300 font-medium italic">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-600/5 border border-indigo-600/10 p-8 rounded-[2.5rem] space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <ClipboardList size={16}/> Рекомендации по обслуживанию
                    </h4>
                    <ul className="space-y-3">
                      {engine.maintenanceTips.map((tip, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-3 italic">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-[2.5rem] space-y-3">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Совместимость и модели:</p>
                     <p className="text-xs text-slate-400 italic font-medium leading-relaxed">
                       Чаще всего устанавливается на рамы <span className="text-white font-bold">{engine.compatibleFrames}</span>. 
                       Встречается на байках: {engine.commonBikes.join(', ')}.
                     </p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  {/* Reliability Reports Summary */}
                  <div className="bg-slate-950/60 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Опыт владельцев</h3>
                       <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">Основано на {engine.reportsCount || 0} отчетах</p>
                    </div>
                    {currentUser && (
                      <button onClick={onOpenReport} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-900/20 active:scale-95 transition-all flex items-center gap-2">
                        <ClipboardList size={16}/> Написать отчет
                      </button>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Обсуждение сообщества</h4>
                    {currentUser && (
                      <form onSubmit={handleAddComment} className="relative">
                        <textarea 
                          placeholder="Ваш комментарий или вопрос о моторе..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-6 text-sm text-white focus:border-orange-500 outline-none min-h-[120px] transition-all"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="absolute bottom-4 right-4 bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl text-orange-500 transition-all">
                          <Plus size={24}/>
                        </button>
                      </form>
                    )}
                    
                    <div className="space-y-4">
                      {comments.length > 0 ? comments.map(c => (
                        <div key={c.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex gap-4">
                           <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0">
                             {c.userName.charAt(0).toUpperCase()}
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-white text-sm">{c.userName}</span>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-400 italic leading-relaxed">{c.text}</p>
                              <div className="flex gap-4 mt-4">
                                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-orange-500 transition-colors">
                                  <ThumbsUp size={14}/> Полезно
                                </button>
                                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-500 transition-colors">
                                  <MessageSquare size={14}/> Ответить
                                </button>
                              </div>
                           </div>
                        </div>
                      )) : (
                        <div className="py-20 text-center opacity-20">
                          <MessageCircle size={48} className="mx-auto mb-4"/>
                          <p className="text-[10px] font-black uppercase tracking-widest">Комментариев пока нет</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

const App: React.FC = () => {
  const [selectedEngineIds, setSelectedEngineIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddEngineOpen, setIsAddEngineOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBuildOpen, setIsBuildOpen] = useState(false);

  const engines = useMemo(() => engineStore.getAllActive(), [currentUser, isAddEngineOpen, isReportOpen]);

  const handleToggleCompare = (id: string) => {
    setSelectedEngineIds(prev => prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]);
  };

  const handleFavoriteToggle = (engineId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const nextFavorites = authService.toggleFollow(currentUser.id, engineId); // Note: using toggleFollow logic for favorites too
    authService.updateProfile(currentUser.id, { favorites: nextFavorites });
    setCurrentUser(authService.getCurrentUser());
  };

  const activeEngineId = window.location.hash.match(/#\/engine\/([^/]+)/)?.[1] || null;
  const activeEngineForReport = activeEngineId ? engines.find(e => e.id === activeEngineId) : null;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <Home 
            engines={engines}
            selectedEngineIds={selectedEngineIds}
            onToggleCompare={handleToggleCompare}
            currentUser={currentUser}
            onFavoriteToggle={handleFavoriteToggle}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAddEngine={() => setIsAddEngineOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenBuild={() => { if (!currentUser) setIsAuthOpen(true); else setIsBuildOpen(true); }}
          />
        } />
        <Route path="/engine/:id" element={
          <EngineDetail 
            engines={engines} 
            currentUser={currentUser} 
            onOpenReport={() => setIsReportOpen(true)}
            onToggleCompare={handleToggleCompare}
            onFavoriteToggle={handleFavoriteToggle}
            selectedEngineIds={selectedEngineIds}
          />
        } />
        <Route path="/stats" element={<Page><StatisticsView /></Page>} />
        <Route path="/compare" element={
          <Page>
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-orange-500 transition-colors">
                <ArrowLeft size={16} /> К каталогу
              </Link>
              <ComparisonView 
                selectedEngines={engines.filter(e => selectedEngineIds.includes(e.id))}
                onRemove={handleToggleCompare}
                currentUser={currentUser}
                onSave={(ids) => {
                  if (currentUser) {
                    authService.updateProfile(currentUser.id, { savedComparisons: [...(currentUser.savedComparisons || []), ids] });
                    setCurrentUser(authService.getCurrentUser());
                  }
                }}
              />
            </div>
          </Page>
        } />
        <Route path="/advisor" element={
          <Page>
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-orange-500 transition-colors">
                <ArrowLeft size={16} /> Назад
              </Link>
              <AIAdvisor />
            </div>
          </Page>
        } />
        <Route path="/wizard" element={
          <Page>
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-orange-500 transition-colors">
                <ArrowLeft size={16} /> Назад
              </Link>
              <AIRecommendationWizard />
            </div>
          </Page>
        } />
        <Route path="/about" element={
          <Page>
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-orange-500 transition-colors">
                <ArrowLeft size={16} /> Назад
              </Link>
              <About />
            </div>
          </Page>
        } />
      </Routes>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(user) => setCurrentUser(user)} />
      
      {currentUser && (
        <>
          <AddEngineModal isOpen={isAddEngineOpen} onClose={() => setIsAddEngineOpen(false)} userId={currentUser.id} onSuccess={() => setIsAddEngineOpen(false)} />
          {isProfileOpen && <UserProfile user={currentUser} onClose={() => setIsProfileOpen(false)} onViewComparison={() => {}} onUserUpdate={setCurrentUser} />}
          {isBuildOpen && <BuildModal isOpen={isBuildOpen} onClose={() => setIsBuildOpen(false)} engines={engines} userId={currentUser.id} userName={currentUser.name} onSuccess={() => setIsBuildOpen(false)} />}
          {isReportOpen && activeEngineForReport && (
            <ReliabilityReportModal 
              isOpen={isReportOpen}
              onClose={() => setIsReportOpen(false)}
              engine={activeEngineForReport}
              userId={currentUser.id}
              onSuccess={() => setIsReportOpen(false)}
            />
          )}
        </>
      )}
    </HashRouter>
  );
};

export default App;
