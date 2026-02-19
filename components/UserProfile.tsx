

import React, { useState, useEffect } from 'react';
import { User, Engine, EngineStatus, Build, ActivityItem } from '../types';
import { engineStore } from '../services/engineStore';
import { buildStore } from '../services/buildStore';
import { authService } from '../services/auth';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ShieldCheck, 
  Bookmark, 
  Trash2, 
  Eye, 
  Bike, 
  Users, 
  Star, 
  MessageCircle, 
  Zap, 
  Settings,
  Heart
} from 'lucide-react';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onViewComparison: (engineIds: string[]) => void;
  onUserUpdate: (updatedUser: User) => void;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onViewComparison, onUserUpdate, isOwnProfile = true }) => {
  const [submissions, setSubmissions] = useState<Engine[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'builds' | 'saved' | 'mod' | 'activity'>(isOwnProfile ? 'builds' : 'builds');

  useEffect(() => {
    setSubmissions(engineStore.getContributions());
    setBuilds(buildStore.getBuilds().filter(b => b.userId === user.id));
    setActivities(buildStore.getActivities().filter(a => a.userId === user.id));
  }, [user.id]);

  const mySubmissions = submissions.filter(s => s.authorId === user.id);
  const pendingForMod = submissions.filter(s => s.status === 'pending');
  const savedComparisons = user.savedComparisons || [];

  const handleModerate = (id: string, status: EngineStatus) => {
    engineStore.moderate(id, status);
    setSubmissions(engineStore.getContributions());
  };

  const getStatusLabel = (status?: EngineStatus) => {
    switch (status) {
      case 'approved': return 'Опубликовано';
      case 'rejected': return 'Отклонено';
      default: return 'На проверке';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]">
        {/* Header - Profile Info */}
        <div className="p-10 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-700 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-orange-900/40">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Star size={10} className="text-orange-500 fill-orange-500" />
              <span className="text-[10px] font-black text-white">{user.reputation}</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{user.name}</h2>
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {user.level}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium mb-6">{user.bio || 'Этот райдер еще не добавил описание своего пути.'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Подписчики</p>
                <p className="text-xl font-black text-white">0</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Сборки</p>
                <p className="text-xl font-black text-white">{builds.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Репутация</p>
                <p className="text-xl font-black text-white">{user.reputation}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isOwnProfile ? (
              <button className="p-4 bg-slate-800 text-slate-400 rounded-3xl hover:text-white transition-all"><Settings size={20} /></button>
            ) : (
              <button className="bg-orange-600 text-white px-8 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-900/20">Подписаться</button>
            )}
            <button onClick={onClose} className="p-4 text-slate-500 hover:text-white transition-colors"><XCircle size={32} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-10 overflow-x-auto scrollbar-hide bg-slate-950/20">
          <button onClick={() => setActiveTab('builds')} className={`px-6 py-5 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'builds' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'}`}>
            <Bike size={14} /> Сборки ({builds.length})
          </button>
          <button onClick={() => setActiveTab('my')} className={`px-6 py-5 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'my' ? 'border-orange-500 text-white' : 'border-transparent text-slate-500'}`}>
            <Zap size={14} /> Моторы
          </button>
          <button onClick={() => setActiveTab('activity')} className={`px-6 py-5 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'activity' ? 'border-blue-500 text-white' : 'border-transparent text-slate-500'}`}>
            <Clock size={14} /> Активность
          </button>
          {isOwnProfile && (
            <button onClick={() => setActiveTab('saved')} className={`px-6 py-5 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'saved' ? 'border-green-500 text-white' : 'border-transparent text-slate-500'}`}>
              <Bookmark size={14} /> Сохраненные
            </button>
          )}
          {user.role === 'moderator' && isOwnProfile && (
            <button onClick={() => setActiveTab('mod')} className={`px-6 py-5 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'mod' ? 'border-red-500 text-white' : 'border-transparent text-slate-500'}`}>
              <ShieldCheck size={14} /> Модерация ({pendingForMod.length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
          {activeTab === 'builds' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {builds.length > 0 ? builds.map(build => (
                <div key={build.id} className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden group hover:border-indigo-500/50 transition-all flex flex-col">
                  <div className="aspect-video bg-slate-900 flex items-center justify-center text-slate-700 relative">
                    <Bike size={48} />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button className="p-2 bg-slate-950/60 backdrop-blur-md rounded-xl text-red-500"><Heart size={14} fill="currentColor" /></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-lg mb-1">{build.name}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{build.frame} • {build.gears}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                       <div className="flex-1 bg-slate-900 px-3 py-2 rounded-xl text-[9px] font-bold text-slate-400 uppercase truncate">
                         {/* Corrected property access to carburetor */}
                         {build.carburetor || 'PE28'}
                       </div>
                       <button className="text-indigo-400 p-2"><Eye size={18} /></button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-slate-600 opacity-30">
                  <Bike size={64} className="mx-auto mb-4" />
                  <p className="uppercase font-black tracking-widest">Сборок пока нет</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {activities.length > 0 ? activities.map(act => (
                <div key={act.id} className="flex gap-4 items-start bg-slate-950/40 border border-slate-800 p-5 rounded-3xl">
                  <div className={`p-3 rounded-2xl ${act.type === 'NEW_BUILD' ? 'bg-indigo-600' : 'bg-orange-600'}`}>
                    {act.type === 'NEW_BUILD' ? <Bike size={18} /> : <Zap size={18} />}
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm">
                      <span className="font-bold">{act.userName}</span> {act.type === 'NEW_BUILD' ? 'опубликовал новую сборку' : 'обновил отчет по мотору'}
                      <span className="text-indigo-400 font-bold ml-1">"{act.targetName}"</span>
                    </p>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{new Date(act.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-slate-600 opacity-30">
                  <Clock size={64} className="mx-auto mb-4" />
                  <p className="uppercase font-black tracking-widest">Активности не найдено</p>
                </div>
              )}
            </div>
          )}

          {/* ... Other tab contents (my, saved, mod) ... */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
