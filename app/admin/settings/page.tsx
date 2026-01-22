'use client'

import { useState } from 'react'
import { Loader2, Edit2, X, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAllConfig, useUpdateConfig } from '@/hooks/useConfig'
import type { SiteConfig } from '@/services/config.service'

const CONFIG_LABELS: Record<string, { label: string; description: string }> = {
  whatsapp_number: {
    label: 'Numero WhatsApp',
    description: 'Numero de telephone pour le bouton WhatsApp (format international)',
  },
  whatsapp_number_orders: {
    label: 'WhatsApp Commandes',
    description: 'Numero WhatsApp pour les commandes de Shabbat',
  },
  store_phone: {
    label: 'Telephone magasin',
    description: 'Numero de telephone principal du magasin',
  },
  store_email: {
    label: 'Email magasin',
    description: 'Adresse email de contact',
  },
  store_address: {
    label: 'Adresse',
    description: 'Adresse physique du magasin',
  },
}

function formatKey(key: string): string {
  return CONFIG_LABELS[key]?.label || key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function getDescription(key: string): string {
  return CONFIG_LABELS[key]?.description || ''
}

export default function AdminSettingsPage() {
  const { data: configs, isLoading } = useAllConfig()
  const updateMutation = useUpdateConfig()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = (config: SiteConfig) => {
    setEditingKey(config.key)
    setEditValue(config.value)
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setEditValue('')
  }

  const saveEdit = () => {
    if (!editingKey) return
    updateMutation.mutate(
      { key: editingKey, value: editValue },
      {
        onSuccess: () => {
          setEditingKey(null)
          setEditValue('')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Parametres</h1>
        <p className="text-gray-500 mt-1">Configuration generale du site</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : configs?.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">Aucun parametre configure.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {configs?.map((config) => (
            <Card key={config.key} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{formatKey(config.key)}</h3>
                  {getDescription(config.key) && (
                    <p className="text-xs text-gray-400 mt-0.5">{getDescription(config.key)}</p>
                  )}

                  {editingKey === config.key ? (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit()
                          if (e.key === 'Escape') cancelEdit()
                        }}
                      />
                      <button
                        onClick={saveEdit}
                        disabled={updateMutation.isPending}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                      {config.value || <span className="text-gray-400 italic">Non defini</span>}
                    </p>
                  )}

                  {config.updated_at && (
                    <p className="text-xs text-gray-400 mt-2">
                      Modifie le {new Date(config.updated_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

                {editingKey !== config.key && (
                  <button
                    onClick={() => startEdit(config)}
                    className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
