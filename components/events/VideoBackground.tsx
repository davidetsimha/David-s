'use client';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
}

export function VideoBackground({
  src,
  poster,
  className = '',
  overlayClassName = 'bg-gradient-to-r from-black/70 via-black/50 to-black/70'
}: VideoBackgroundProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
