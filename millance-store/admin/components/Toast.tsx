import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast { id: number; type: 'success' | 'error' | 'warning'; message: string; }
interface ToastContextType { toast: (type: Toast['type'], message: string) => void; }

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const icons = { success: <CheckCircle size={16} />, error: <XCircle size={16} />, warning: <AlertCircle size={16} /> };
  const colors = { success: '#10B981', error: '#EF4444', warning: '#F59E0B' };
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="admin-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`admin-toast ${t.type}`}>
            <span style={{ color: colors[t.type] }}>{icons[t.type]}</span>
            <span>{t.message}</span>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0 4px' }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
