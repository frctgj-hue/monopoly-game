import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeClass = () => {
    switch (type) {
      case 'success': return 'theme-toast success border-l-4 border-[var(--color-accent-green)]';
      case 'error': return 'theme-toast error border-l-4 border-[var(--color-accent-red)]';
      case 'warning': return 'theme-toast warning border-l-4 border-[var(--color-accent-gold)]';
      default: return 'theme-panel border-l-4 border-[var(--color-accent-blue)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <div className={`${getTypeClass()} flex items-center gap-3 animate-slide-in-right shadow-lg`}>
      <div className="text-lg font-bold opacity-80">{getIcon()}</div>
      <div className="flex-1">
        <p className="font-medium text-sm text-[var(--color-text-primary)]">{message}</p>
      </div>
    </div>
  );
};

export default Toast;