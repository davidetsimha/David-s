'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PaymentRedirectPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function redirectToPayment() {
      try {
        const response = await fetch('/api/payment/generate-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.success && data.paymentUrl) {
          // Redirect to Yaad payment page
          window.location.href = data.paymentUrl;
        } else {
          setError(data.error || 'Erreur lors de la génération du lien de paiement');
        }
      } catch (err) {
        setError('Erreur de connexion');
      }
    }

    redirectToPayment();
  }, [orderId]);

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-stone-500 text-sm">
            Si le problème persiste, contactez-nous.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
        <p className="text-stone-600">Redirection vers le paiement...</p>
      </div>
    </div>
  );
}
