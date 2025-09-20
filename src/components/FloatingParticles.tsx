import { motion } from 'motion/react';
import { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
}

export function FloatingParticles({ 
  count = 20, 
  color = 'rgba(57, 255, 20, 0.1)', 
  size = 4,
  speed = 1,
  className = ''
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: size + Math.random() * size,
    }));
  }, [count, size]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-20"
          style={{
            backgroundColor: color,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(particle.id) * 50, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration / speed,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Corn-themed floating icons
export function FloatingCornIcons({ count = 8 }: { count?: number }) {
  const cornIcons = ['🌽', '🧈', '🧀', '🍯', '🍫', '🥛'];
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20, // Start below screen
      icon: cornIcons[Math.floor(Math.random() * cornIcons.length)],
      delay: Math.random() * 10,
      duration: 20 + Math.random() * 15,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl opacity-10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(particle.id * 2) * 100],
            rotate: [0, 360],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        >
          {particle.icon}
        </motion.div>
      ))}
    </div>
  );
}