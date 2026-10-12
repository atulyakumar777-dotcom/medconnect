"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!mounted || !open) return null;

  const btnClasses = variant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400';
    
  const iconClasses = variant === 'danger'
    ? 'bg-red-100 text-red-600'
    : 'bg-yellow-100 text-yellow-600';

  const dialogContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all overflow-hidden">
        <div className="px-6 pt-6 pb-4 sm:flex sm:items-start">
          <div className={cn("mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10", iconClasses)}>
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-auto transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={cn("w-full inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-colors", btnClasses, isLoading && "opacity-70 cursor-not-allowed")}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Processing...
              </span>
            ) : confirmText}
          </button>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
