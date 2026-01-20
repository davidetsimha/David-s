'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface EventVideoSectionProps {
  src: string;
  poster?: string;
}

export function EventVideoSection({ src, poster }: EventVideoSectionProps) {
  const t = useTranslations();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  return (
    <section className="py-16 bg-stone-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-3">
            {t.raw('events.videoSection.badge') || 'Decouvrez'}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            {t.raw('events.videoSection.title') || 'Notre Univers'}
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto">
            {t.raw('events.videoSection.subtitle') || "Plongez dans l'ambiance de nos evenements"}
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative aspect-video bg-black rounded-sm overflow-hidden shadow-2xl group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            poster={poster}
            className="w-full h-full object-cover cursor-pointer"
            onClick={togglePlay}
            muted={isMuted}
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>

          {/* Play button overlay - shown when paused */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlay}
            >
              <button
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50
                  flex items-center justify-center transition-all duration-300
                  hover:bg-white/30 hover:scale-110"
              >
                <Play className="w-8 h-8 text-white ms-1" fill="white" />
              </button>
            </div>
          )}

          {/* Controls bar */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent
              px-4 pb-4 pt-16 transition-opacity duration-300
              ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Progress bar */}
            <div
              className="h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gold-500 rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full
                  opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gold-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gold-400 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gold-400 transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
