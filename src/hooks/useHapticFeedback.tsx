import { useCallback } from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticFeedbackOptions {
    duration?: number;
    intensity?: number;
}

export function useHapticFeedback() {
    const triggerHaptic = useCallback((type: HapticType, options: HapticFeedbackOptions = {}) => {
        // Check if device supports haptic feedback
        if (!('vibrate' in navigator)) {
            console.log('Haptic feedback not supported on this device');
            return;
        }

        const patterns = {
            light: [10],
            medium: [20],
            heavy: [50],
            success: [10, 5, 10],
            warning: [30, 10, 30],
            error: [50, 20, 50, 20, 50]
        };

        const pattern = patterns[type] || patterns.medium;
        navigator.vibrate(pattern);
    }, []);

    const hapticLight = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
    const hapticMedium = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
    const hapticHeavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);
    const hapticSuccess = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
    const hapticWarning = useCallback(() => triggerHaptic('warning'), [triggerHaptic]);
    const hapticError = useCallback(() => triggerHaptic('error'), [triggerHaptic]);

    return {
        triggerHaptic,
        hapticLight,
        hapticMedium,
        hapticHeavy,
        hapticSuccess,
        hapticWarning,
        hapticError
    };
}

// Haptic feedback for specific actions
export const useActionHaptics = () => {
    const { hapticLight, hapticMedium, hapticSuccess, hapticError } = useHapticFeedback();

    return {
        onButtonPress: hapticLight,
        onToggle: hapticLight,
        onSwipe: hapticMedium,
        onAddToCart: hapticSuccess,
        onRemoveFromCart: hapticMedium,
        onError: hapticError,
        onSuccess: hapticSuccess,
        onNavigation: hapticLight
    };
};
