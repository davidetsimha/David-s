import { Loader2, Target, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQuoteConversionRate } from '../../../hooks/useQuotes';

export function ConversionStats() {
  const { data, isLoading } = useQuoteConversionRate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (circumference * (data?.rate ?? 0)) / 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-900">Conversion Devis</h3>
        <Target className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center gap-6">
        {/* Progress Ring */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4a846" />
                <stop offset="100%" stopColor="#c9983a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-900">{data?.rate ?? 0}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Confirmes</span>
            </div>
            <span className="font-medium text-gray-900">{data?.confirmed ?? 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">En attente</span>
            </div>
            <span className="font-medium text-gray-900">{data?.pending ?? 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">Refuses</span>
            </div>
            <span className="font-medium text-gray-900">{data?.rejected ?? 0}</span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="font-medium text-gray-900">{data?.total ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
