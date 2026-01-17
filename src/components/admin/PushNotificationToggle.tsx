import { useState } from 'react';
import { Bell, BellOff, Loader2, AlertCircle } from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { Button } from '../ui/Button';

export function PushNotificationToggle() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const [showError, setShowError] = useState(false);

  const handleToggle = async () => {
    setShowError(false);
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch {
      setShowError(true);
    }
  };

  // Not supported
  if (!isSupported) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <BellOff className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Notifications non disponibles</p>
            <p className="text-xs text-gray-500">Votre navigateur ne supporte pas les notifications push</p>
          </div>
        </div>
      </div>
    );
  }

  // Permission denied
  if (permission === 'denied') {
    return (
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <BellOff className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Notifications bloquees</p>
            <p className="text-xs text-red-600">
              Veuillez autoriser les notifications dans les parametres de votre navigateur
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isSubscribed
          ? 'bg-green-50 border-green-200'
          : 'bg-amber-50 border-amber-200'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isSubscribed ? 'bg-green-100' : 'bg-amber-100'
            }`}
          >
            {isSubscribed ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <p className={`text-sm font-medium ${isSubscribed ? 'text-green-700' : 'text-amber-700'}`}>
              {isSubscribed ? 'Notifications activees' : 'Notifications desactivees'}
            </p>
            <p className={`text-xs ${isSubscribed ? 'text-green-600' : 'text-amber-600'}`}>
              {isSubscribed
                ? 'Vous recevrez une alerte pour chaque nouvelle commande plateau'
                : 'Activez les notifications pour etre alerte des nouvelles commandes'}
            </p>
          </div>
        </div>

        <Button
          variant={isSubscribed ? 'secondary' : 'primary'}
          onClick={handleToggle}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSubscribed ? (
            <>
              <BellOff className="w-4 h-4" />
              Desactiver
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Activer
            </>
          )}
        </Button>
      </div>

      {(showError || error) && (
        <div className="mt-3 p-2 bg-red-100 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700">
            {error?.message || 'Une erreur est survenue. Veuillez reessayer.'}
          </p>
        </div>
      )}
    </div>
  );
}
