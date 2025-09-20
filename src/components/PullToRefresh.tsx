import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    threshold?: number;
    disabled?: boolean;
}

export function PullToRefresh({
    onRefresh,
    children,
    threshold = 80,
    disabled = false
}: PullToRefreshProps) {
    const [isPulling, setIsPulling] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: TouchEvent) => {
        if (disabled || isRefreshing) return;

        const scrollTop = containerRef.current?.scrollTop || 0;
        if (scrollTop === 0) {
            setStartY(e.touches[0].clientY);
            setIsPulling(true);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isPulling || disabled || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const distance = Math.max(0, currentY - startY);

        setCurrentY(currentY);
        setPullDistance(Math.min(distance, threshold * 1.5));

        // Prevent default scrolling when pulling
        if (distance > 0) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = async () => {
        if (!isPulling || disabled || isRefreshing) return;

        setIsPulling(false);

        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            try {
                await onRefresh();
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setIsRefreshing(false);
                }, 1000);
            } catch (error) {
                console.error('Refresh failed:', error);
                setIsRefreshing(false);
            }
        }

        setPullDistance(0);
        setStartY(0);
        setCurrentY(0);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPulling, pullDistance, threshold, disabled, isRefreshing]);

    const progress = Math.min(pullDistance / threshold, 1);
    const rotation = progress * 360;

    return (
        <div className="relative overflow-hidden" ref={containerRef}>
            {/* Pull to Refresh Indicator */}
            <AnimatePresence>
                {(isPulling || isRefreshing || isSuccess) && (
                    <motion.div
                        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        style={{ height: `${Math.min(pullDistance, threshold)}px` }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <motion.div
                                className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
                                animate={{
                                    rotate: isRefreshing ? 360 : rotation,
                                    scale: isSuccess ? 1.2 : 1
                                }}
                                transition={{
                                    rotate: { duration: isRefreshing ? 1 : 0.2, repeat: isRefreshing ? Infinity : 0 },
                                    scale: { duration: 0.2 }
                                }}
                            >
                                {isSuccess ? (
                                    <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                    <RefreshCw className="w-5 h-5 text-green-400" />
                                )}
                            </motion.div>

                            <motion.p
                                className="text-green-400 text-sm font-medium"
                                animate={{ opacity: progress > 0.5 ? 1 : 0.5 }}
                            >
                                {isSuccess ? 'Refreshed!' :
                                    isRefreshing ? 'Refreshing...' :
                                        progress > 0.5 ? 'Release to refresh' : 'Pull to refresh'}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <motion.div
                style={{
                    transform: `translateY(${Math.min(pullDistance * 0.5, threshold * 0.5)}px)`,
                    transition: isPulling ? 'none' : 'transform 0.3s ease-out'
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
