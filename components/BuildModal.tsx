
import React, { useState } from 'react';
import { X, Bike, Settings, PenTool, Database, Camera, Check } from 'lucide-react';
import { Engine, Build } from '../types';
import { buildStore } from '../services/buildStore';

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  engines: Engine[];
  userId: string;
  userName: string;
  onSuccess: () => void;
}

const BuildModal: React.FC<BuildModalProps> = ({ isOpen, onClose, engines, userId, userName, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    engineId: engines[0]?.id || '',
    frame: '',
    carburetor: '',
    exhaust: '',
    gears: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buildStore.saveBuild({
      ...formData,
      userId,
      userName,
      photos: [] // В реальном приложении здесь была бы логика загрузки фото
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Bike className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Новая сборка</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Опишите свой уникальный конфиг</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Название байка</label>
            <input required placeholder="Напр: Red Devil Enduro 250" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Двигатель</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none"
                value={formData.engineId} onChange={e => setFormData({...formData, engineId: e.target.value})}>
                {engines.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Рама</label>
              <input required placeholder="Напр: Kayo T4 / KTM Replica" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" 
                value={formData.frame} onChange={e => setFormData({...formData, frame: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Карбюратор</label>
              <input placeholder="Nibbi PWK32" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" 
                value={formData.carburetor} onChange={e => setFormData({...formData, carburetor: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Выхлоп</label>
              <input placeholder="Akrapovic Style" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" 
                value={formData.exhaust} onChange={e => setFormData({...formData, exhaust: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Звезды</label>
              <input placeholder="13/45" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" 
                value={formData.gears} onChange={e => setFormData({...formData, gears: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Описание сборки и советы</label>
            <textarea placeholder="Какие нюансы при установке? Что пришлось допилить?" className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 text-white min-h-[120px]" 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest text-white shadow-xl shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Check size={20} /> Опубликовать сборку
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuildModal;
