
import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  FileText, 
  Github, 
  Globe, 
  Mail, 
  ChevronRight, 
  Heart,
  Bot
} from 'lucide-react';

const About: React.FC = () => {
  const version = "1.2.4-stable";
  
  const sections = [
    {
      title: "Конфиденциальность",
      desc: "Как мы обрабатываем ваши данные и запросы к AI.",
      icon: <ShieldCheck className="text-green-500" />,
      link: "#"
    },
    {
      title: "Условия использования",
      desc: "Правила использования сервиса и ответственности.",
      icon: <FileText className="text-blue-500" />,
      link: "#"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-4">
          <Info size={40} />
        </div>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">MotoEngine Pro</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Версия {version}
          </span>
          <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <Bot size={12} /> AI Powered
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <p className="text-slate-300 leading-relaxed text-lg italic font-medium">
            "MotoEngine Pro — это не просто база данных. Это ультимативный инструмент для каждого райдера, 
            который хочет понимать свой байк изнутри."
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Приложение создано профессиональными мотожурналистами и инженерами для систематизации знаний о китайских двигателях. 
            Мы используем современные технологии искусственного интеллекта (Google Gemini), чтобы предоставлять 
            персонализированные рекомендации по подбору и тюнингу моторов в режиме реального времени.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 text-slate-800/20 rotate-12 pointer-events-none">
          <Info size={200} />
        </div>
      </div>

      {/* Links & Legal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((item, idx) => (
          <a 
            key={idx}
            href={item.link}
            className="group bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-[10px] font-medium leading-tight">{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>

      {/* Contacts & Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <button className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><Mail size={20} /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><Globe size={20} /></button>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Made with <Heart size={12} className="text-red-500 animate-pulse" /> for the Moto Community
        </div>
      </div>
    </div>
  );
};

export default About;
