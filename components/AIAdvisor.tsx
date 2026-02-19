
import React, { useState } from 'react';
import { getAIRecommendation } from '../services/gemini';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

const AIAdvisor: React.FC = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setChat(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const recommendation = await getAIRecommendation(userText);
    setChat(prev => [...prev, { role: 'bot', text: recommendation || 'Ошибка сервиса.' }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[600px] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-white">AI Мото-Эксперт</h2>
            <p className="text-xs text-slate-400">Подбор мотора и советы по тюнингу</p>
          </div>
        </div>
        <div className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-full uppercase font-bold tracking-wider">
          Gemini Flash 3
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chat.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-10">
            <MessageSquare size={48} className="text-slate-700" />
            <div>
              <p className="text-slate-300 font-medium mb-2">Задайте любой вопрос по китайским моторам</p>
              <p className="text-slate-500 text-sm">Например: "Мой вес 90кг, хочу катать эндуро в горах, что выбрать: 172FMM или NC250?"</p>
            </div>
          </div>
        )}
        
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-orange-600' : 'bg-slate-700'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none shadow-lg whitespace-pre-wrap'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                <Loader2 className="animate-spin text-orange-500" size={20} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-800/80 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спросите эксперта..."
            className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-orange-500 transition-colors text-white placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAdvisor;
