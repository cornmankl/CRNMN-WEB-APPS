import { motion } from 'framer-motion';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  loading?: boolean;
  glow?: boolean;
  pulse?: boolean;
  bounceOnClick?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      loading = false,
      glow = false,
      pulse = false,
      bounceOnClick = true,
      className = '',
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'relative overflow-hidden rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
    
    const variants = {
      primary: `
        bg-[var(--neon-green)] text-[var(--brand-black)] 
        hover:bg-[#2EE000] hover:shadow-lg hover:shadow-[var(--neon-green)]/25
        focus:ring-[var(--neon-green)]/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${glow ? 'shadow-lg shadow-[var(--neon-green)]/25' : ''}
      `,
      secondary: `
        border-2 border-[var(--neutral-800)] bg-transparent text-white 
        hover:border-[var(--neutral-600)] hover:bg-[var(--neutral-900)]/50
        focus:ring-[var(--neutral-600)]/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      ghost: `
        bg-transparent text-[var(--neutral-300)] 
        hover:text-white hover:bg-[var(--neutral-900)]/30
        focus:ring-[var(--neutral-600)]/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      neon: `
        bg-transparent border-2 border-[var(--neon-green)] text-[var(--neon-green)]
        hover:bg-[var(--neon-green)] hover:text-black hover:shadow-lg hover:shadow-[var(--neon-green)]/50
        focus:ring-[var(--neon-green)]/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${glow ? 'shadow-lg shadow-[var(--neon-green)]/25' : ''}
      `
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    };

    const buttonVariants = {
      initial: { 
        scale: 1,
        boxShadow: glow ? '0 0 20px rgba(57, 255, 20, 0.2)' : '0 0 0px rgba(57, 255, 20, 0)'
      },
      hover: { 
        scale: 1.05,
        boxShadow: glow ? '0 0 30px rgba(57, 255, 20, 0.4)' : '0 0 0px rgba(57, 255, 20, 0)',
        transition: { duration: 0.2, ease: 'easeOut' }
      },
      tap: { 
        scale: bounceOnClick ? 0.95 : 1.02,
        transition: { duration: 0.1, ease: 'easeInOut' }
      },
      disabled: {
        scale: 1,
        boxShadow: '0 0 0px rgba(57, 255, 20, 0)'
      }
    };

    const pulseVariants = {
      initial: { opacity: 0.6, scale: 1 },
      animate: { 
        opacity: [0.6, 1, 0.6], 
        scale: [1, 1.02, 1],
        transition: { 
          duration: 2, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }
      }
    };

    const rippleVariants = {
      initial: { scale: 0, opacity: 0.6 },
      animate: { 
        scale: 4, 
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && onClick) {
        onClick(e);
      }
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        variants={pulse && !disabled ? pulseVariants : buttonVariants}
        initial="initial"
        animate={pulse && !disabled ? "animate" : "initial"}
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : "disabled"}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effect background */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: variant === 'primary' || variant === 'neon' 
              ? 'radial-gradient(circle, rgba(57, 255, 20, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
          }}
          variants={rippleVariants}
          initial="initial"
        />

        {/* Content container */}
        <motion.div 
          className="relative flex items-center justify-center gap-2"
          animate={{
            x: loading ? [-1, 1, -1] : 0,
            transition: loading ? { repeat: Infinity, duration: 0.5 } : {}
          }}
        >
          {loading ? (
            <motion.div 
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : icon ? (
            <motion.div
              animate={{ 
                rotate: variant === 'primary' ? [0, 5, -5, 0] : 0,
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              {icon}
            </motion.div>
          ) : null}
          
          <motion.span
            animate={{
              color: loading ? ['currentColor', 'rgba(255,255,255,0.5)', 'currentColor'] : 'currentColor',
              transition: loading ? { duration: 1.5, repeat: Infinity } : {}
            }}
          >
            {children}
          </motion.span>
        </motion.div>

        {/* Glow effect for neon variant */}
        {(variant === 'neon' || variant === 'primary') && glow && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(57, 255, 20, 0.1) 50%, transparent 70%)',
              filter: 'blur(8px)',
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
              transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
