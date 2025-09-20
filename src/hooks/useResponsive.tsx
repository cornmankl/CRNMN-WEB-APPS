import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
    xs: 0,      // Mobile phones (portrait)
    sm: 640,    // Mobile phones (landscape) / Small tablets
    md: 768,    // Tablets (portrait)
    lg: 1024,   // Tablets (landscape) / Small desktops
    xl: 1280,   // Desktops
    '2xl': 1536 // Large desktops
};

export function useResponsive() {
    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;

            let newBreakpoint: Breakpoint = 'xs';
            if (width >= breakpoints['2xl']) newBreakpoint = '2xl';
            else if (width >= breakpoints.xl) newBreakpoint = 'xl';
            else if (width >= breakpoints.lg) newBreakpoint = 'lg';
            else if (width >= breakpoints.md) newBreakpoint = 'md';
            else if (width >= breakpoints.sm) newBreakpoint = 'sm';

            setCurrentBreakpoint(newBreakpoint);
            setIsMobile(width < breakpoints.md);
            setIsTablet(width >= breakpoints.md && width < breakpoints.lg);
            setIsDesktop(width >= breakpoints.lg);
        };

        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    return {
        currentBreakpoint,
        isMobile,
        isTablet,
        isDesktop,
        isXs: currentBreakpoint === 'xs',
        isSm: currentBreakpoint === 'sm',
        isMd: currentBreakpoint === 'md',
        isLg: currentBreakpoint === 'lg',
        isXl: currentBreakpoint === 'xl',
        is2Xl: currentBreakpoint === '2xl'
    };
}

// Mobile-first utility functions
export const getMobileClasses = (mobile: string, tablet?: string, desktop?: string) => {
    let classes = mobile;
    if (tablet) classes += ` md:${tablet}`;
    if (desktop) classes += ` lg:${desktop}`;
    return classes;
};

export const getSpacing = (mobile: string, tablet?: string, desktop?: string) => {
    return getMobileClasses(mobile, tablet, desktop);
};
