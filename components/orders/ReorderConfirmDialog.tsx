'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { ShoppingCart, Layers, X } from 'lucide-react';

export type ReorderAction = 'replace' | 'merge' | 'cancel';

interface ReorderConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onAction: (action: ReorderAction) => void;
}

export function ReorderConfirmDialog({ open, onClose, onAction }: ReorderConfirmDialogProps) {
  const t = useTranslations();
  const locale = useLocale();
  const direction = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('orderHistory.reorderConfirm.title')}
      description={t('orderHistory.reorderConfirm.message')}
      size="sm"
    >
      <div className="space-y-3" dir={direction}>
        {/* Replace option */}
        <button
          onClick={() => onAction('replace')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-stone-200
            hover:border-gold-400 hover:bg-gold-50/50 transition-all text-start"
        >
          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-gold-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-stone-800">
              {t('orderHistory.reorderConfirm.replace')}
            </p>
            <p className="text-sm text-stone-500">
              {t('orderHistory.reorderConfirm.replaceDesc')}
            </p>
          </div>
        </button>

        {/* Merge option */}
        <button
          onClick={() => onAction('merge')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-stone-200
            hover:border-bronze-400 hover:bg-bronze-50/50 transition-all text-start"
        >
          <div className="w-10 h-10 rounded-full bg-bronze-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-bronze-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-stone-800">
              {t('orderHistory.reorderConfirm.merge')}
            </p>
            <p className="text-sm text-stone-500">
              {t('orderHistory.reorderConfirm.mergeDesc')}
            </p>
          </div>
        </button>

        {/* Cancel option */}
        <button
          onClick={() => onAction('cancel')}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl
            text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
          {t('orderHistory.reorderConfirm.cancel')}
        </button>
      </div>
    </Modal>
  );
}
