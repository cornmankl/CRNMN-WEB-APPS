import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { MusicPlayer } from './MusicPlayer';

export function MusicToggle() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayer = () => {
    setIsPlayerOpen(!isPlayerOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Music Toggle Button */}
      <motion.div
        className="fixed bottom-4 left-4 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={togglePlayer}
            className={`w-14 h-14 rounded-full shadow-lg ${
              isPlayerOpen
                ? 'bg-[var(--neon-green)] text-black'
                : 'bg-[var(--neutral-800)] text-white hover:bg-[var(--neutral-700)]'
            }`}
          >
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            >
              <Music className="w-6 h-6" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[var(--neon-green)]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Music Player */}
      <MusicPlayer
        isOpen={isPlayerOpen}
        onClose={closePlayer}
        onToggleMinimize={toggleMinimize}
        isMinimized={isMinimized}
      />
    </>
  );
}
