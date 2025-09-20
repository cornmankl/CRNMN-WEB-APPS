import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

interface SwipeableCarouselProps {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    className?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showDots?: boolean;
    showArrows?: boolean;
}

export function SwipeableCarousel({
    items,
    renderItem,
    className = '',
    autoPlay = true,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true
}: SwipeableCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const { isMobile } = useResponsive();
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const xTransform = useTransform(x, [-300, 0, 300], [-1, 0, 1]);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || isDragging) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, isDragging, items.length]);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = (event: any, info: PanInfo) => {
        setIsDragging(false);

        const threshold = 50;
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
            if (offset > 0 || velocity > 0) {
                // Swipe right - go to previous
                setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
            } else {
                // Swipe left - go to next
                setCurrentIndex((prev) => (prev + 1) % items.length);
            }
        }

        x.set(0);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    if (items.length === 0) return null;

    return (
        <div className={`relative overflow-hidden ${className}`} ref={containerRef}>
            {/* Carousel Container */}
            <motion.div
                className="flex"
                style={{
                    x: useTransform(x, (value) => -currentIndex * 100 + (value / containerRef.current?.offsetWidth || 1) * 100),
                }}
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                dragElastic={0.1}
                dragMomentum={false}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="w-full flex-shrink-0"
                        style={{
                            scale: useTransform(
                                xTransform,
                                [-1, 0, 1],
                                [0.95, 1, 0.95]
                            ),
                            opacity: useTransform(
                                xTransform,
                                [-1, 0, 1],
                                [0.7, 1, 0.7]
                            ),
                        }}
                    >
                        {renderItem(item, index)}
                    </motion.div>
                ))}
            </motion.div>

            {/* Navigation Arrows */}
            {showArrows && !isMobile && (
                <>
                    <motion.button
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                        onClick={goToPrevious}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                        onClick={goToNext}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                </>
            )}

            {/* Dots Indicator */}
            {showDots && items.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {items.map((_, index) => (
                        <motion.button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-green-400 w-6'
                                    : 'bg-white/50 hover:bg-white/70'
                                }`}
                            onClick={() => goToSlide(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </div>
            )}

            {/* Mobile Swipe Indicator */}
            {isMobile && items.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
                    <span className="text-white text-xs">
                        {currentIndex + 1} / {items.length}
                    </span>
                </div>
            )}
        </div>
    );
}
