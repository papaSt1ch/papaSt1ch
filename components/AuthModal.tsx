
import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Sparkles, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (isLogin) {
        user = await authService.login(formData.email, formData.password);
      } else {
        if (formData.password.length < 6) throw new Error('Пароль должен быть не менее 6 символов');
        user = await authService.register(formData.email, formData.password, formData.name);
      }
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="bg-orange-500/10 p-5 rounded-3xl border border-orange-500/20 text-orange-500 shadow-lg shadow-orange-500/5">
              <Sparkles size={40} />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white text-center uppercase italic tracking-tighter mb-2">
            {isLogin ? 'С возвращением' : 'Новый аккаунт'}
          </h2>
          <p className="text-slate-500 text-center text-xs font-bold uppercase tracking-widest mb-10">
            {isLogin ? 'Вход в MotoEngine Pro' : 'Присоединяйтесь к сообществу'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Ваше имя"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-12 focus:outline-none focus:border-orange-500 transition-colors text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="Email адрес"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-12 focus:outline-none focus:border-orange-500 transition-colors text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="Пароль"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-12 focus:outline-none focus:border-orange-500 transition-colors text-white"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-900/20"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? 'Войти' : 'Создать'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 hover:text-orange-500 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
