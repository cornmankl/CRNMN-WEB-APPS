import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Star, Award, Target, Calendar, Zap } from 'lucide-react';
import { useActionHaptics } from '../hooks/useHapticFeedback';

interface UserAnalyticsProps {
    userId: string;
    onClose: () => void;
    isOpen: boolean;
}

interface AnalyticsData {
    orders: {
        total: number;
        thisMonth: number;
        averageValue: number;
        favoriteCategory: string;
    };
    spending: {
        total: number;
        thisMonth: number;
        averagePerOrder: number;
        trend: 'up' | 'down' | 'stable';
    };
    loyalty: {
        points: number;
        tier: 'bronze' | 'silver' | 'gold' | 'platinum';
        nextTierPoints: number;
        benefits: string[];
    };
    preferences: {
        favoriteProducts: Array<{
            name: string;
            orderCount: number;
            lastOrdered: string;
        }>;
        peakOrderTime: string;
        averageOrderValue: number;
    };
    achievements: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        unlocked: boolean;
        progress: number;
        maxProgress: number;
    }>;
}

export function UserAnalytics({ userId, onClose, isOpen }: UserAnalyticsProps) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
    const { hapticSuccess } = useActionHaptics();

    useEffect(() => {
        if (isOpen) {
            loadAnalytics();
        }
    }, [isOpen, selectedPeriod]);

    const loadAnalytics = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - in real app, this would come from your analytics API
        setAnalytics({
            orders: {
                total: 47,
                thisMonth: 8,
                averageValue: 32.50,
                favoriteCategory: 'Premium'
            },
            spending: {
                total: 1527.50,
                thisMonth: 260.00,
                averagePerOrder: 32.50,
                trend: 'up'
            },
            loyalty: {
                points: 1250,
                tier: 'gold',
                nextTierPoints: 250,
                benefits: ['Free delivery', 'Priority support', 'Exclusive offers']
            },
            preferences: {
                favoriteProducts: [
                    { name: 'CORNMAN Classic Cup', orderCount: 12, lastOrdered: '2 days ago' },
                    { name: 'Susu Pekat Classic', orderCount: 8, lastOrdered: '1 week ago' },
                    { name: 'Cheddar Cheese Explosion', orderCount: 6, lastOrdered: '3 days ago' }
                ],
                peakOrderTime: '7:00 PM - 9:00 PM',
                averageOrderValue: 32.50
            },
            achievements: [
                {
                    id: 'first_order',
                    title: 'First Bite',
                    description: 'Place your first order',
                    icon: '🎉',
                    unlocked: true,
                    progress: 1,
                    maxProgress: 1
                },
                {
                    id: 'loyal_customer',
                    title: 'Loyal Customer',
                    description: 'Place 10 orders',
                    icon: '⭐',
                    unlocked: true,
                    progress: 10,
                    maxProgress: 10
                },
                {
                    id: 'big_spender',
                    title: 'Big Spender',
                    description: 'Spend RM 500 total',
                    icon: '💰',
                    unlocked: true,
                    progress: 500,
                    maxProgress: 500
                },
                {
                    id: 'night_owl',
                    title: 'Night Owl',
                    description: 'Order after 10 PM',
                    icon: '🦉',
                    unlocked: false,
                    progress: 0,
                    maxProgress: 1
                },
                {
                    id: 'early_bird',
                    title: 'Early Bird',
                    description: 'Order before 8 AM',
                    icon: '🐦',
                    unlocked: false,
                    progress: 0,
                    maxProgress: 1
                }
            ]
        });

        setLoading(false);
        hapticSuccess();
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'bronze': return 'text-orange-400';
            case 'silver': return 'text-gray-300';
            case 'gold': return 'text-yellow-400';
            case 'platinum': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'bronze': return '🥉';
            case 'silver': return '🥈';
            case 'gold': return '🥇';
            case 'platinum': return '💎';
            default: return '⭐';
        }
    };

    if (!analytics) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-gray-900 rounded-t-2xl p-6 w-full max-h-[90vh] overflow-y-auto"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-green-400" />
                                Your Analytics
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Period Selector */}
                                <div className="flex gap-2">
                                    {(['week', 'month', 'year'] as const).map((period) => (
                                        <button
                                            key={period}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === period
                                                    ? 'bg-green-500 text-black'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                            onClick={() => setSelectedPeriod(period)}
                                        >
                                            {period.charAt(0).toUpperCase() + period.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Order Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span className="text-gray-400 text-sm">Total Orders</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{analytics.orders.total}</p>
                                        <p className="text-green-400 text-sm">+{analytics.orders.thisMonth} this month</p>
                                    </div>

                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                            <span className="text-gray-400 text-sm">Total Spent</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">RM {analytics.spending.total.toFixed(2)}</p>
                                        <p className="text-green-400 text-sm">RM {analytics.spending.thisMonth.toFixed(2)} this month</p>
                                    </div>
                                </div>

                                {/* Loyalty Status */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-semibold flex items-center gap-2">
                                            <Award className="w-5 h-5 text-yellow-400" />
                                            Loyalty Status
                                        </h3>
                                        <span className={`text-2xl ${getTierColor(analytics.loyalty.tier)}`}>
                                            {getTierIcon(analytics.loyalty.tier)}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                                            <span>{analytics.loyalty.tier.charAt(0).toUpperCase() + analytics.loyalty.tier.slice(1)} Tier</span>
                                            <span>{analytics.loyalty.points} points</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{ width: `${(analytics.loyalty.points / (analytics.loyalty.points + analytics.loyalty.nextTierPoints)) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {analytics.loyalty.nextTierPoints} points to next tier
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-gray-400 text-sm">Your Benefits:</p>
                                        {analytics.loyalty.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center gap-2 text-green-400 text-sm">
                                                <Zap className="w-3 h-3" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Favorite Products */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        Favorite Products
                                    </h3>
                                    <div className="space-y-3">
                                        {analytics.preferences.favoriteProducts.map((product, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-gray-400 text-sm">Last ordered: {product.lastOrdered}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-400 font-semibold">{product.orderCount} orders</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-purple-400" />
                                        Achievements
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {analytics.achievements.map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className={`p-3 rounded-lg border ${achievement.unlocked
                                                        ? 'border-green-500 bg-green-500/10'
                                                        : 'border-gray-600 bg-gray-700/50'
                                                    }`}
                                            >
                                                <div className="text-center">
                                                    <div className="text-2xl mb-2">{achievement.icon}</div>
                                                    <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-400'
                                                        }`}>
                                                        {achievement.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {achievement.description}
                                                    </p>
                                                    {!achievement.unlocked && (
                                                        <div className="mt-2">
                                                            <div className="w-full bg-gray-600 rounded-full h-1">
                                                                <div
                                                                    className="bg-purple-400 h-1 rounded-full"
                                                                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {achievement.progress}/{achievement.maxProgress}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Insights */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        Your Insights
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">Peak order time:</span>
                                            <span className="text-white font-medium">{analytics.preferences.peakOrderTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">Average order value:</span>
                                            <span className="text-white font-medium">RM {analytics.preferences.averageOrderValue.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">Favorite category:</span>
                                            <span className="text-white font-medium">{analytics.preferences.favoriteCategory}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
