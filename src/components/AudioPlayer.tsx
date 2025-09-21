import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

export function AudioPlayer({
  src,
  title = "CORNMAN Theme",
  artist = "Bau pandan wangi, topping ikut suka!",
  className = "",
  autoPlay = false,
  loop = true,
  showControls = true
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (autoPlay) {
      audio.play().catch(() => {
        // Auto-play failed, user needs to interact first
      });
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [autoPlay]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(audio.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center ${className}`}>
        <p className="text-red-400 text-sm">Failed to load audio: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-[var(--neutral-900)]/80 backdrop-blur-sm border border-[var(--neutral-700)] rounded-xl p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="metadata"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-[var(--neon-green)] to-[var(--brand-white)] rounded-full flex items-center justify-center"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
        >
          <span className="text-black text-lg font-bold">🌽</span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <p className="text-[var(--neutral-400)] text-sm truncate">{artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-[var(--neutral-400)]">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1">
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>
          <span className="text-xs text-[var(--neutral-400)]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={skipBackward}
              size="sm"
              variant="ghost"
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={restart}
              size="sm"
              variant="ghost"
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={togglePlayPause}
              size="lg"
              className="w-16 h-16 rounded-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </motion.div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={skipForward}
              size="sm"
              variant="ghost"
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleMute}
                size="sm"
                variant="ghost"
                className="text-[var(--neutral-400)] hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--neutral-900)]/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-[var(--neutral-400)] text-sm">Loading audio...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
