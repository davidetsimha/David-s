'use client'

import { X, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BulkActionBarProps {
  selectedCount: number
  onSetAvailable: () => void
  onSetUnavailable: () => void
  onClose: () => void
  loading?: boolean
}

export function BulkActionBar({
  selectedCount,
  onSetAvailable,
  onSetUnavailable,
  onClose,
  loading = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl shadow-elevated">
        {/* Counter */}
        <span className="text-sm font-medium text-white whitespace-nowrap">
          {selectedCount} produit{selectedCount > 1 ? 's' : ''} selectionne{selectedCount > 1 ? 's' : ''}
        </span>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-700" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onSetAvailable}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white border-0"
          >
            <Eye className="w-4 h-4" />
            Disponible
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onSetUnavailable}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white border-0"
          >
            <EyeOff className="w-4 h-4" />
            Indisponible
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-700" />

        {/* Close */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
