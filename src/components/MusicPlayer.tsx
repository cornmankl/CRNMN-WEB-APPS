import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { AudioPlayer } from './AudioPlayer';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
  isMinimized: boolean;
}

export function MusicPlayer({ isOpen, onClose, onToggleMinimize, isMinimized }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    {
      id: 1,
      title: "CORNMAN Theme",
      artist: "Bau pandan wangi, topping ikut suka!",
      src: "/audio/cornman-theme.mp3",
      cover: "🌽"
    }
  ];

  const currentTrackData = tracks[currentTrack];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className={`fixed z-50 ${
          isMinimized 
            ? 'bottom-4 right-4 w-80' 
            : 'bottom-4 right-4 w-96'
        }`}
      >
        {isMinimized ? (
          // Minimized Player
          <motion.div
            className="bg-[var(--neutral-900)]/95 backdrop-blur-sm border border-[var(--neutral-700)] rounded-lg p-3 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-[var(--neon-green)] to-[var(--brand-white)] rounded-full flex items-center justify-center"
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              >
                <span className="text-black text-lg">🌽</span>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {currentTrackData.title}
                </p>
                <p className="text-[var(--neutral-400)] text-xs truncate">
                  {currentTrackData.artist}
                </p>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  onClick={onToggleMinimize}
                  size="sm"
                  variant="ghost"
                  className="text-[var(--neutral-400)] hover:text-white p-1"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onClose}
                  size="sm"
                  variant="ghost"
                  className="text-[var(--neutral-400)] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Full Player
          <motion.div
            className="bg-[var(--neutral-900)]/95 backdrop-blur-sm border border-[var(--neutral-700)] rounded-xl shadow-2xl"
            layout
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--neutral-700)]">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-[var(--neon-green)]" />
                <h3 className="text-white font-semibold">CORNMAN Music</h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  onClick={onToggleMinimize}
                  size="sm"
                  variant="ghost"
                  className="text-[var(--neutral-400)] hover:text-white"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onClose}
                  size="sm"
                  variant="ghost"
                  className="text-[var(--neutral-400)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Player Content */}
            <div className="p-4">
              <AudioPlayer
                src={currentTrackData.src}
                title={currentTrackData.title}
                artist={currentTrackData.artist}
                autoPlay={false}
                loop={true}
                showControls={true}
              />
            </div>

            {/* Track Info */}
            <div className="px-4 pb-4">
              <div className="text-center">
                <p className="text-[var(--neutral-400)] text-sm">
                  Now Playing: {currentTrackData.title}
                </p>
                <p className="text-[var(--neutral-500)] text-xs mt-1">
                  {currentTrackData.artist}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
