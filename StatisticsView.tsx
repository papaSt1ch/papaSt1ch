
import React, { useState } from 'react';
import { Engine, CoolingType, User } from '../types';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  ImageIcon, 
  Activity, 
  Wind, 
  Droplets, 
  Thermometer, 
  Fuel,
  Cpu,
  Trophy,
  Bike,
  Globe,
  Heart,
  BarChart2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EngineCardProps {
  engine: Engine;
  onClick: () => void;
  onCompareToggle: (e: React.MouseEvent) => void;
  isComparing: boolean;
  currentUser: User | null;
  onFavoriteToggle?: (id: string) => void;
}

const EngineCard: React.FC<EngineCardProps> = ({ 
  engine, 
  onClick, 
  onCompareToggle, 
  isComparing, 
  currentUser,
  onFavoriteToggle 
}) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const primaryImage = engine.images[0];
  const isFavorite = currentUser?.favorites.includes(engine.id);

  const getCoolingIndicator = () => {
    switch (engine.cooling) {
      case CoolingType.AIR:
        return { 
          icon: <Wind size={14} />, 
          label: 'Воздух', 
          style: 'bg-slate-500/10 text-slate-400 border-slate-500/20' 
        };
      case CoolingType.OIL:
        return { 
          icon: <Droplets size={14} />, 
          label: 'Масло', 
          style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
        };
      case CoolingType.LIQUID:
        return { 
          icon: <Thermometer size={14} />, 
          label: 'Вода', 
          style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
        };
      default:
        return { 
          icon: <Wind size={14} />, 
          label: 'Воздух', 
          style: 'bg-slate-800 text-slate-400 border-slate-700' 
        };
    }
  };

  const getFuelIndicator = () => {
    const fs = engine.fuelSystem.toLowerCase();
    const isInjection = fs.includes('инжектор') || fs.includes('efi') || fs.includes('injection');
    
    return isInjection 
      ? { 
          icon: <Cpu size={14} />, 
          label: 'Инжектор', 
          style: 'bg-violet-500/10 text-violet-400 border-violet-500/30' 
        }
      : { 
          icon: <Fuel size={14} />, 
          label: 'Карбюратор', 
          style: 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
        };
  };

  const cooling = getCoolingIndicator();
  const fuel = getFuelIndicator();
  const displayedBikes = engine.commonBikes.slice(0, 3);

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden active:scale-[0.98] transition-all cursor-pointer group flex flex-col shadow-2xl h-full hover:border-slate-700/50"
      onClick={onClick}
    >
      <div className="relative h-52 bg-slate-950 flex items-center justify-center overflow-hidden">
        {primaryImage && imgStatus !== 'error' ? (
          <>
            <img 
              src={primaryImage.url} 
              alt={engine.name}
              className={`w-full h-full object-contain p-4 transition-all duration-700 ease-out ${imgStatus === 'loaded' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-110 rotate-3'}`}
              loading="lazy"
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
            />
            {imgStatus === 'loaded' && (
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider border border-white/10 shadow-2xl z-10">
                <Globe size={10} className="text-blue-400" />
                {engine.originCountry}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-800 p-6 text-center w-full h-full bg-slate-900/50">
            <ImageIcon size={40} className="opacity-10" />
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Link 
            to="/stats" 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950/80 backdrop-blur-md p-2 rounded-xl text-orange-500 hover:text-white transition-all border border-slate-800"
            title="Посмотреть в рейтинге"
          >
            <BarChart2 size={16} />
          </Link>
        </div>

        {/* Auth Features */}
        <div className="absolute bottom-5 left-5 flex gap-2 z-20">
          {currentUser && (
            <button 
              onClick={(e) => { e.stopPropagation(); onFavoriteToggle?.(engine.id); }}
              className={`p-3.5 rounded-2xl transition-all shadow-2xl backdrop-blur-md border ${isFavorite ? 'bg-red-500 border-red-400 text-white scale-110' : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-700/50'}`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        
        <button 
          onClick={onCompareToggle}
          className={`absolute bottom-5 right-5 p-3.5 rounded-2xl transition-all shadow-2xl z-20 backdrop-blur-md border ${isComparing ? 'bg-orange-500 border-orange-400 text-white scale-110 rotate-12' : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-700/50'}`}
        >
          <TrendingUp size={20} />
        </button>
      </div>

      <div className="p-7 flex-1 flex flex-col">
        <div className="mb-5">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{engine.name}</h3>
          </div>
          <p className="text-slate-500 text-[10px] font-mono mb-4 uppercase tracking-[0.15em] opacity-80">{engine.brand}</p>
          
          <div className="flex flex-wrap gap-2.5">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tight ${cooling.style}`}>
              {cooling.icon} <span>{cooling.label}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Zap size={12} className="text-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">Мощность</span>
            </div>
            <span className="text-white font-black text-base">{engine.power}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Shield size={12} className="text-green-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">Индекс</span>
            </div>
            <span className="text-white font-black text-base">{engine.reliabilityIndex || 75}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineCard;
