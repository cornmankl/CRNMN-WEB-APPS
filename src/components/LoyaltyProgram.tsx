import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedButton } from './AnimatedButton';

interface LoyaltyProgramProps {
  user: any;
  orderHistory: any[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_item' | 'upgrade';
  value: string;
  icon: string;
  available: boolean;
}

interface UserStats {
  totalPoints: number;
  currentTier: string;
  nextTier: string;
  pointsToNextTier: number;
  totalOrders: number;
  favoriteFllavor: string;
  totalSpent: number;
  streak: number;
}

export function LoyaltyProgram({ user, orderHistory }: LoyaltyProgramProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAchievementModal, setShowAchievementModal] = useState<Achievement | null>(null);

  // Loyalty tiers
  const tiers = [
    { name: 'Bronze', points: 0, color: 'from-orange-700 to-orange-500', benefits: ['5% birthday discount'] },
    { name: 'Silver', points: 500, color: 'from-gray-400 to-gray-300', benefits: ['Free delivery on weekends', '10% birthday discount'] },
    { name: 'Gold', points: 1500, color: 'from-yellow-500 to-yellow-400', benefits: ['Priority delivery', 'Exclusive flavors', '15% birthday discount'] },
    { name: 'Platinum', points: 3000, color: 'from-purple-500 to-pink-500', benefits: ['VIP customer service', 'Early access to new flavors', '20% birthday discount', 'Free monthly corn cup'] }
  ];

  // Calculate user statistics
  useEffect(() => {
    const totalOrders = orderHistory.length;
    const totalSpent = orderHistory.reduce((sum, order) => {
      return sum + parseFloat(order.price?.replace('RM ', '') || '0');
    }, 0);
    
    // Calculate points (10 points per RM spent + bonus points)
    const basePoints = Math.floor(totalSpent * 10);
    const bonusPoints = totalOrders * 50; // 50 bonus points per order
    const totalPoints = basePoints + bonusPoints;

    // Determine tier
    let currentTier = 'Bronze';
    let nextTier = 'Silver';
    let pointsToNextTier = 500 - totalPoints;

    for (let i = tiers.length - 1; i >= 0; i--) {
      if (totalPoints >= tiers[i].points) {
        currentTier = tiers[i].name;
        if (i < tiers.length - 1) {
          nextTier = tiers[i + 1].name;
          pointsToNextTier = tiers[i + 1].points - totalPoints;
        } else {
          nextTier = 'Platinum';
          pointsToNextTier = 0;
        }
        break;
      }
    }

    // Calculate streak (mock - consecutive days with orders)
    const streak = Math.min(totalOrders, 7);

    // Favorite flavor analysis
    const flavorCount = orderHistory.reduce((acc, order) => {
      const flavor = order.name?.toLowerCase().includes('chocolate') ? 'Chocolate' :
                    order.name?.toLowerCase().includes('cheese') ? 'Cheese' :
                    order.name?.toLowerCase().includes('caramel') ? 'Caramel' :
                    order.name?.toLowerCase().includes('susu') ? 'Susu Pekat' : 'Classic';
      acc[flavor] = (acc[flavor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteFllavor = Object.entries(flavorCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Classic';

    setUserStats({
      totalPoints,
      currentTier,
      nextTier,
      pointsToNextTier: Math.max(0, pointsToNextTier),
      totalOrders,
      favoriteFllavor,
      totalSpent,
      streak
    });

    // Generate achievements
    generateAchievements(totalOrders, totalSpent, streak, favoriteFllavor);
    generateRewards(totalPoints);
  }, [orderHistory]);

  const generateAchievements = (orders: number, spent: number, streak: number, favorite: string) => {
    const allAchievements: Achievement[] = [
      {
        id: 'first-order',
        title: 'First Taste',
        description: 'Complete your first CORNMAN order',
        points: 100,
        icon: 'celebration',
        unlocked: orders >= 1,
        rarity: 'common'
      },
      {
        id: 'flavor-explorer',
        title: 'Flavor Explorer',
        description: 'Try all 4 signature flavors',
        points: 300,
        icon: 'explore',
        unlocked: false, // Would need to track flavors tried
        progress: Math.min(orders, 4),
        maxProgress: 4,
        rarity: 'rare'
      },
      {
        id: 'big-spender',
        title: 'Corn Connoisseur',
        description: 'Spend RM 100 total',
        points: 200,
        icon: 'diamond',
        unlocked: spent >= 100,
        progress: Math.min(spent, 100),
        maxProgress: 100,
        rarity: 'rare'
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Order for 7 consecutive days',
        points: 500,
        icon: 'local_fire_department',
        unlocked: streak >= 7,
        progress: streak,
        maxProgress: 7,
        rarity: 'epic'
      },
      {
        id: 'weekend-warrior',
        title: 'Weekend Warrior',
        description: 'Order 5 times on weekends',
        points: 150,
        icon: 'weekend',
        unlocked: orders >= 5, // Simplified
        rarity: 'common'
      },
      {
        id: 'corn-legend',
        title: 'Corn Legend',
        description: 'Reach 50 total orders',
        points: 1000,
        icon: 'emoji_events',
        unlocked: orders >= 50,
        progress: orders,
        maxProgress: 50,
        rarity: 'legendary'
      }
    ];

    setAchievements(allAchievements);
  };

  const generateRewards = (totalPoints: number) => {
    const availableRewards: Reward[] = [
      {
        id: 'free-delivery',
        title: 'Free Delivery',
        description: 'Free delivery on your next order',
        pointsCost: 200,
        type: 'discount',
        value: 'RM 3.00',
        icon: 'local_shipping',
        available: totalPoints >= 200
      },
      {
        id: 'discount-10',
        title: '10% Off',
        description: '10% discount on your next order',
        pointsCost: 300,
        type: 'discount',
        value: '10%',
        icon: 'percent',
        available: totalPoints >= 300
      },
      {
        id: 'free-classic',
        title: 'Free Classic Cup',
        description: 'Complimentary CORNMAN Classic Cup',
        pointsCost: 500,
        type: 'free_item',
        value: 'RM 7.90',
        icon: 'restaurant',
        available: totalPoints >= 500
      },
      {
        id: 'size-upgrade',
        title: 'Size Upgrade',
        description: 'Free upgrade to large size',
        pointsCost: 150,
        type: 'upgrade',
        value: 'Large',
        icon: 'upgrade',
        available: totalPoints >= 150
      },
      {
        id: 'exclusive-flavor',
        title: 'Exclusive Flavor Access',
        description: 'Try limited edition flavors first',
        pointsCost: 800,
        type: 'upgrade',
        value: 'VIP Access',
        icon: 'vip',
        available: totalPoints >= 800
      }
    ];

    setRewards(availableRewards);
  };

  const getCurrentTierData = () => {
    return tiers.find(tier => tier.name === userStats?.currentTier) || tiers[0];
  };

  const getNextTierData = () => {
    return tiers.find(tier => tier.name === userStats?.nextTier) || tiers[tiers.length - 1];
  };

  const getTierProgress = () => {
    if (!userStats) return 0;
    const currentTierData = getCurrentTierData();
    const nextTierData = getNextTierData();
    
    if (userStats.currentTier === 'Platinum') return 100;
    
    const progressInTier = userStats.totalPoints - currentTierData.points;
    const tierRange = nextTierData.points - currentTierData.points;
    
    return (progressInTier / tierRange) * 100;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-500';
      case 'rare': return 'from-blue-600 to-blue-500';
      case 'epic': return 'from-purple-600 to-purple-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-600 to-gray-500';
    }
  };

  if (!userStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading your loyalty status...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full mb-4"
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.2)',
              '0 0 30px rgba(255, 215, 0, 0.4)',
              '0 0 20px rgba(255, 215, 0, 0.2)'
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">👑</span>
          <span className="text-sm font-semibold text-yellow-400">LOYALTY PROGRAM</span>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold neon-text mb-2">
          Corn Kingdom Rewards
        </h2>
        <p className="text-neutral-400">
          Earn points, unlock achievements, and enjoy exclusive benefits
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-neutral-800 rounded-full">
          {[
            { id: 'overview', name: 'Overview', icon: 'dashboard' },
            { id: 'achievements', name: 'Achievements', icon: 'emoji_events' },
            { id: 'rewards', name: 'Rewards', icon: 'redeem' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'neon-bg text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span className="material-icons text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Tier Status */}
          <div className="card p-8">
            <div className="text-center mb-6">
              <motion.div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${getCurrentTierData().color} flex items-center justify-center mx-auto mb-4`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="material-icons text-4xl text-white">workspace_premium</span>
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">{userStats.currentTier} Member</h3>
              <p className="text-neutral-400">You're part of our exclusive loyalty program</p>
            </div>

            {/* Progress to Next Tier */}
            {userStats.pointsToNextTier > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Progress to {userStats.nextTier}</span>
                  <span className="text-sm neon-text">{Math.round(getTierProgress())}%</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${getNextTierData().color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getTierProgress()}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  {userStats.pointsToNextTier} more points to reach {userStats.nextTier}
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Points', value: userStats.totalPoints.toLocaleString(), icon: 'stars' },
                { label: 'Orders', value: userStats.totalOrders, icon: 'shopping_bag' },
                { label: 'Favorite', value: userStats.favoriteFllavor, icon: 'favorite' },
                { label: 'Streak', value: `${userStats.streak} days`, icon: 'local_fire_department' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-neutral-800 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.span
                    className="material-icons text-2xl neon-text block mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.icon}
                  </motion.span>
                  <p className="font-bold text-lg">{stat.value}</p>
                  <p className="text-xs text-neutral-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-4">Your {userStats.currentTier} Benefits</h3>
            <div className="space-y-2">
              {getCurrentTierData().benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="material-icons text-[var(--neon-green)]">check_circle</span>
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`card p-6 cursor-pointer ${
                achievement.unlocked ? 'border-[var(--neon-green)]/50' : 'opacity-75'
              }`}
              whileHover={{ scale: 1.03 }}
              onClick={() => setShowAchievementModal(achievement)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center`}
                  animate={achievement.unlocked ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="material-icons text-white">{achievement.icon}</span>
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    {achievement.unlocked && (
                      <span className="material-icons text-[var(--neon-green)] text-sm">verified</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{achievement.description}</p>
                  
                  {achievement.progress !== undefined && (
                    <div className="mb-2">
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-[var(--neon-green)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-neutral-700 rounded-full capitalize">
                      {achievement.rarity}
                    </span>
                    <span className="text-sm neon-text font-semibold">
                      +{achievement.points} points
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              className={`card p-6 ${
                reward.available ? 'border-[var(--neon-green)]/50' : 'opacity-50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon-green)] to-green-400 flex items-center justify-center">
                  <span className="material-icons text-black">{reward.icon}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{reward.title}</h4>
                  <p className="text-sm text-neutral-400 mb-3">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold neon-text">{reward.pointsCost}</span>
                      <span className="text-sm text-neutral-400 ml-1">points</span>
                    </div>
                    
                    <AnimatedButton
                      variant={reward.available ? "primary" : "secondary"}
                      size="sm"
                      disabled={!reward.available}
                      icon={<span className="material-icons">redeem</span>}
                    >
                      {reward.available ? 'Redeem' : 'Locked'}
                    </AnimatedButton>
                  </div>
                  
                  <p className="text-xs text-neutral-500 mt-2">
                    Value: {reward.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Achievement Modal */}
      <AnimatePresence>
        {showAchievementModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAchievementModal(null)}
          >
            <motion.div
              className="bg-[var(--neutral-900)] rounded-3xl p-8 max-w-md w-full border border-[var(--neutral-800)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRarityColor(showAchievementModal.rarity)} flex items-center justify-center mx-auto mb-4`}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="material-icons text-4xl text-white">{showAchievementModal.icon}</span>
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-2">{showAchievementModal.title}</h3>
                <p className="text-neutral-400 mb-4">{showAchievementModal.description}</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-xs px-3 py-1 bg-neutral-700 rounded-full capitalize">
                    {showAchievementModal.rarity}
                  </span>
                  <span className="text-lg neon-text font-bold">
                    +{showAchievementModal.points} points
                  </span>
                </div>
                
                {showAchievementModal.unlocked ? (
                  <motion.div
                    className="flex items-center justify-center gap-2 text-[var(--neon-green)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="material-icons">verified</span>
                    <span className="font-semibold">Achievement Unlocked!</span>
                  </motion.div>
                ) : (
                  <p className="text-neutral-500">Keep going to unlock this achievement!</p>
                )}
                
                <AnimatedButton
                  variant="primary"
                  className="mt-6"
                  onClick={() => setShowAchievementModal(null)}
                >
                  Close
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}