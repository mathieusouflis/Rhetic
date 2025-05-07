import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Body, Small } from './Typography';
import Icon from './Icons';
import classNames from 'classnames';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

// Système global pour gérer les toasts
let toastQueue: ToastProps[] = [];
let listeners: ((toasts: ToastProps[]) => void)[] = [];

// Fonction pour ajouter un toast
export const addToast = (toast: Omit<ToastProps, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { ...toast, id };
  
  toastQueue = [...toastQueue, newToast];
  listeners.forEach(listener => listener(toastQueue));
  
  // Auto-suppression après durée
  if (toast.duration) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }
  
  return id;
};

// Fonction pour supprimer un toast
export const removeToast = (id: string) => {
  toastQueue = toastQueue.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener(toastQueue));
};

// Composant Toast individuel
export const Toast: React.FC<ToastProps> = ({ 
  id, 
  title, 
  message, 
  type = 'info',
  onClose 
}) => {
  const getIconName = () => {
    switch (type) {
      case 'success': return 'check';
      case 'error': return 'x';
      case 'warning': return 'alert_triangle';
      case 'info': 
      default: return 'bell';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return 'var(--blue)';
      case 'error': return 'var(--red)';
      case 'warning': return 'var(--yellow)';
      case 'info': 
      default: return 'var(--white)';
    }
  };

  const handleClose = () => {
    removeToast(id);
    if (onClose) onClose();
  };

  return (
    <div 
      className={classNames(
        "flex flex-col gap-2 p-4 rounded-[10px] border animate-in slide-in-from-right duration-300 w-80",
        "border-[var(--black-400)] bg-[var(--black-700)]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name={getIconName()} color={getIconColor()} size={18} />
          <Body className="font-bold">{title}</Body>
        </div>
        <button 
          onClick={handleClose}
          className="text-[var(--black-300)] hover:text-[var(--white)] transition-colors"
        >
          <Icon name="x" size={14} />
        </button>
      </div>
      
      {message && (
        <Small className="text-[var(--black-100)]">{message}</Small>
      )}
    </div>
  );
};

// Conteneur de toasts
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastProps[]>(toastQueue);
  
  useEffect(() => {
    const listener = (newToasts: ToastProps[]) => {
      setToasts([...newToasts]);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};