import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import { useQuoteConversionRate } from '../../../hooks/useQuotes';

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (value - startValue) * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue}</>;
}

function GaugeChart({ value, size = 200 }: { value: number; size?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Arc calculations for semicircle (180 degrees)
  const startAngle = 180;
  const endAngle = 0;
  const angleRange = startAngle - endAngle;

  // Convert percentage to angle
  const valueAngle = startAngle - (animatedValue / 100) * angleRange;

  // Helper to get point on arc
  const getPoint = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center - r * Math.sin(rad),
    };
  };

  // Create arc path
  const createArc = (startA: number, endA: number, r: number) => {
    const start = getPoint(startA, r);
    const end = getPoint(endA, r);
    const largeArc = Math.abs(startA - endA) > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  // Needle point
  const needleLength = radius - 20;
  const needleAngle = startAngle - (animatedValue / 100) * angleRange;
  const needleEnd = getPoint(needleAngle, needleLength);

  // Color segments
  const segments = [
    { start: 180, end: 126, color: '#ef4444' }, // 0-30% Red
    { start: 126, end: 72, color: '#f59e0b' },  // 30-60% Yellow
    { start: 72, end: 0, color: '#22c55e' },    // 60-100% Green
  ];

  return (
    <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
      <defs>
        <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <filter id="needleShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background track */}
      <path
        d={createArc(180, 0, radius)}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Color segments */}
      {segments.map((seg, i) => (
        <path
          key={i}
          d={createArc(seg.start, seg.end, radius)}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.2}
        />
      ))}

      {/* Progress arc */}
      <path
        d={createArc(180, Math.max(valueAngle, 0.1), radius)}
        fill="none"
        stroke={animatedValue >= 60 ? '#22c55e' : animatedValue >= 30 ? '#f59e0b' : '#ef4444'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />

      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map((tick) => {
        const tickAngle = 180 - (tick / 100) * 180;
        const innerPoint = getPoint(tickAngle, radius - strokeWidth / 2 - 8);
        const outerPoint = getPoint(tickAngle, radius - strokeWidth / 2 - 2);
        return (
          <g key={tick}>
            <line
              x1={innerPoint.x}
              y1={innerPoint.y}
              x2={outerPoint.x}
              y2={outerPoint.y}
              stroke="#9ca3af"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <text
              x={getPoint(tickAngle, radius - strokeWidth / 2 - 18).x}
              y={getPoint(tickAngle, radius - strokeWidth / 2 - 18).y + 4}
              fontSize={10}
              fill="#9ca3af"
              textAnchor="middle"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* Needle */}
      <g filter="url(#needleShadow)" style={{ transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <line
          x1={center}
          y1={center}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="url(#needleGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        <circle cx={center} cy={center} r={8} fill="#374151" />
        <circle cx={center} cy={center} r={4} fill="#fff" />
      </g>

      {/* Center value */}
      <text
        x={center}
        y={center + 35}
        fontSize={28}
        fontWeight={600}
        fill="#111827"
        textAnchor="middle"
      >
        <AnimatedNumber value={animatedValue} />%
      </text>
      <text
        x={center}
        y={center + 52}
        fontSize={11}
        fill="#6b7280"
        textAnchor="middle"
      >
        Taux de conversion
      </text>
    </svg>
  );
}

export function ConversionStats() {
  const { data, isLoading } = useQuoteConversionRate();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      </div>
    );
  }

  const rate = data?.rate ?? 0;

  const stats = [
    { label: 'Confirmes', value: data?.confirmed ?? 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'En attente', value: data?.pending ?? 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Refuses', value: data?.rejected ?? 0, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Conversion Devis</h3>
        <Target className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex flex-col items-center">
        <GaugeChart value={rate} size={220} />

        <div className="w-full grid grid-cols-3 gap-3 mt-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="w-full mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total devis</span>
          <span className="text-lg font-semibold text-gray-900">{data?.total ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
