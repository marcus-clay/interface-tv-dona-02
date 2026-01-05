import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SpeakerHigh, SpeakerX, ArrowsOutSimple, ArrowLeft, SkipForward } from '@phosphor-icons/react';
import { formatDuration, cn } from '@/lib/utils';
import { Film, Series } from '@/types';

interface VideoPlayerProps {
  content: Film | Series;
  onClose: () => void;
  autoPlay?: boolean;
}

export default function VideoPlayer({ content, onClose, autoPlay = true }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Simulation de la lecture
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 100 : p + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-hide controls logic
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [isPlaying]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black-pure flex items-center justify-center overflow-hidden font-sans"
      onMouseMove={handleMouseMove}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Simulated Video Content */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <img 
          src={content.backdrop} 
          className={cn("w-full h-full object-cover transition-transform duration-[10s]", isPlaying ? "scale-105" : "scale-100")}
          alt="Video content"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-transparent to-black-pure/60" />
      </div>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-12"
            onClick={(e) => e.stopPropagation()} // Prevent play/pause when clicking controls
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start">
              <button 
                onClick={onClose}
                className="group flex items-center gap-4 text-white hover:text-accent-primary transition-colors"
              >
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md group-hover:bg-white/20">
                  <ArrowLeft weight="bold" className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold drop-shadow-md">{content.title}</h2>
                  <p className="text-sm text-text-secondary">S1:E1 "Pilot" • 4K HDR</p>
                </div>
              </button>
              
              <button className="bg-white/10 px-4 py-2 rounded-sm backdrop-blur-md text-sm font-medium hover:bg-white/20 transition-colors">
                Settings
              </button>
            </div>

            {/* Center Play/Pause Indicator (Optional, large icon) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {!isPlaying && (
                <div className="bg-black/40 p-6 rounded-full backdrop-blur-sm">
                   <Play weight="fill" className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="space-y-6 bg-gradient-to-t from-black-pure/90 p-6 -m-6 rounded-t-xl">
              {/* Progress Bar */}
              <div className="group relative h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-accent-primary transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-0 h-full w-4 bg-white rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity" 
                  style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-accent-primary transition-colors">
                    {isPlaying ? <Pause weight="fill" className="w-8 h-8" /> : <Play weight="fill" className="w-8 h-8" />}
                  </button>
                  <button onClick={() => setProgress(p => Math.max(0, p - 5))} className="hover:text-white text-text-secondary transition-colors">
                    <span className="text-xs font-bold">-10s</span>
                  </button>
                  <button onClick={() => setProgress(p => Math.min(100, p + 5))} className="hover:text-white text-text-secondary transition-colors">
                     <span className="text-xs font-bold">+10s</span>
                  </button>
                  
                  <div className="text-sm font-medium text-text-secondary ml-4">
                    {formatDuration(12 * (progress/100))} / {'duration' in content ? content.duration : `${content.seasons} saisons`}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   {content.type === 'series' && (
                     <button className="flex items-center gap-2 text-sm font-medium hover:text-white text-text-secondary transition-colors">
                       <SkipForward weight="bold" /> Next Episode
                     </button>
                   )}
                   <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white text-text-secondary transition-colors">
                     {isMuted ? <SpeakerX className="w-6 h-6" /> : <SpeakerHigh className="w-6 h-6" />}
                   </button>
                   <button className="hover:text-white text-text-secondary transition-colors">
                     <ArrowsOutSimple className="w-6 h-6" />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}