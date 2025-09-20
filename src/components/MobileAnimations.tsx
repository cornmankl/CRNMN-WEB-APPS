import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

// Stagger animation for lists
export function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}

// Stagger item for individual elements
export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <motion.div
            className={className}
            variants={itemVariants}
        >
            {children}
        </motion.div>
    );
}

// Bounce animation for buttons
export function BounceButton({
    children,
    onClick,
    className = '',
    hapticFeedback
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    hapticFeedback?: () => void;
}) {
    const handleClick = () => {
        hapticFeedback?.();
        onClick?.();
    };

    return (
        <motion.button
            className={className}
            onClick={handleClick}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 }
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
        >
            {children}
        </motion.button>
    );
}

// Floating animation for decorative elements
export function FloatingElement({
    children,
    className = '',
    duration = 3,
    delay = 0
}: {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
}) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay
            }}
        >
            {children}
        </motion.div>
    );
}

// Slide in from direction
export function SlideIn({
    children,
    direction = 'left',
    className = '',
    delay = 0
}: {
    children: React.ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    className?: string;
    delay?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const directionVariants = {
        left: { x: -100, opacity: 0 },
        right: { x: 100, opacity: 0 },
        up: { y: 100, opacity: 0 },
        down: { y: -100, opacity: 0 }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={directionVariants[direction]}
            animate={isInView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    );
}

// Scale in animation
export function ScaleIn({
    children,
    className = '',
    delay = 0,
    scale = 0.8
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    scale?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ scale, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    );
}

// Pulse animation for loading states
export function PulseAnimation({
    children,
    className = '',
    isActive = true
}: {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
}) {
    return (
        <motion.div
            className={className}
            animate={isActive ? {
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
            } : {}}
            transition={{
                duration: 1.5,
                repeat: isActive ? Infinity : 0,
                ease: 'easeInOut'
            }}
        >
            {children}
        </motion.div>
    );
}

// Shake animation for errors
export function ShakeAnimation({
    children,
    className = '',
    isShaking = false
}: {
    children: React.ReactNode;
    className?: string;
    isShaking?: boolean;
}) {
    return (
        <motion.div
            className={className}
            animate={isShaking ? {
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.5 }
            } : {}}
        >
            {children}
        </motion.div>
    );
}

// Magnetic button effect
export function MagneticButton({
    children,
    className = '',
    onClick,
    hapticFeedback
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hapticFeedback?: () => void;
}) {
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = 'translate(0px, 0px)';
    };

    const handleClick = () => {
        hapticFeedback?.();
        onClick?.();
    };

    return (
        <motion.button
            ref={ref}
            className={className}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
}

// Parallax scroll effect
export function ParallaxScroll({
    children,
    className = '',
    speed = 0.5
}: {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const scrolled = window.pageYOffset;
            const rate = scrolled * -speed;
            ref.current.style.transform = `translateY(${rate}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
