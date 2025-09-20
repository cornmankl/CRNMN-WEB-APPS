import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedButton } from './AnimatedButton';
import originalCrnmnImage from 'figma:asset/e7573302acc3ed30b98153f11b3ac659cedea5ad.png';

interface RecommendationEngineProps {
  user: any;
  orderHistory: any[];
  currentCart: any[];
  addToCart: (item: any) => void;
}

interface Recommendation {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  confidence: number;
  reason: string;
  category: string;
  tags: string[];
}

export function RecommendationEngine({ user, orderHistory, currentCart, addToCart }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('personalized');

  // Advanced recommendation algorithm
  const generateRecommendations = () => {
    const allItems = [
      {
        id: 1,
        name: 'CORNMAN Classic Cup',
        description: 'Sweet corn + butter + cheese',
        price: 'RM 7.90',
        image: 'figma:asset/e7573302acc3ed30b98153f11b3ac659cedea5ad.png',
        category: 'classic',
        tags: ['popular', 'bestseller', 'comfort-food']
      },
      {
        id: 5,
        name: 'Chocolate Corn Delight',
        description: 'Sweet corn kernels drizzled with rich Belgian chocolate sauce',
        price: 'RM 9.50',
        image: 'https://images.unsplash.com/photo-1545086421-168708d4f603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkcml6emxlJTIwY29ybiUyMGN1cCUyMGdvdXJtZXQlMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'dessert',
        tags: ['sweet', 'premium', 'indulgent']
      },
      {
        id: 6,
        name: 'Cheddar Cheese Explosion',
        description: 'Premium corn loaded with aged Australian cheddar cheese',
        price: 'RM 10.90',
        image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVkZGFyJTIwY2hlZXNlJTIwY29ybiUyMGdvdXJtZXQlMjBjdXAlMjBkYXJrJTIwbW9vZHklMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2MzM2NTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'cheese',
        tags: ['cheese-lover', 'premium', 'savory']
      },
      {
        id: 7,
        name: 'Susu Pekat Classic',
        description: 'Authentic Malaysian corn with sweet condensed milk drizzle',
        price: 'RM 8.50',
        image: 'https://images.unsplash.com/photo-1736605406266-dbb985ef3325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25kZW5zZWQlMjBtaWxrJTIwd2hpdGUlMjBjcmVhbSUyMGNvcm4lMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'traditional',
        tags: ['local-favorite', 'nostalgic', 'sweet']
      },
      {
        id: 8,
        name: 'Caramel Corn Supreme',
        description: 'Sweet corn kernels glazed with smooth golden caramel',
        price: 'RM 9.90',
        image: 'https://images.unsplash.com/photo-1610479615051-a022c076da08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhbWVsJTIwc2F1Y2UlMjBnb2xkZW4lMjBjb3JuJTIwZ291cm1ldCUyMGRhcmslMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2MzM2NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'dessert',
        tags: ['gourmet', 'sweet', 'signature']
      }
    ];

    // AI Algorithm: Analyze user behavior and preferences
    const userPreferences = analyzeUserPreferences();
    const cartBasedSuggestions = getCartBasedSuggestions();
    const trending = getTrendingItems();
    
    let recommendations: Recommendation[] = [];

    // 1. Personalized recommendations based on order history
    if (orderHistory.length > 0) {
      recommendations.push(...getPersonalizedRecommendations(allItems, userPreferences));
    }

    // 2. Cart-based cross-sell recommendations
    if (currentCart.length > 0) {
      recommendations.push(...cartBasedSuggestions);
    }

    // 3. Trending and popular items
    recommendations.push(...trending);

    // 4. First-time user recommendations
    if (orderHistory.length === 0) {
      recommendations.push(...getNewUserRecommendations(allItems));
    }

    // Remove duplicates and sort by confidence
    const uniqueRecommendations = recommendations
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);

    return uniqueRecommendations;
  };

  const analyzeUserPreferences = () => {
    if (!orderHistory || orderHistory.length === 0) {
      return { categories: [], tags: [], priceRange: 'medium' };
    }

    const categories = orderHistory.map(order => order.category || 'classic');
    const categoryFreq = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averagePrice = orderHistory.reduce((sum, order) => {
      return sum + parseFloat(order.price?.replace('RM ', '') || '8.00');
    }, 0) / orderHistory.length;

    return {
      categories: Object.keys(categoryFreq).sort((a, b) => categoryFreq[b] - categoryFreq[a]),
      tags: ['sweet', 'savory'], // Would be extracted from order history
      priceRange: averagePrice > 10 ? 'high' : averagePrice > 8 ? 'medium' : 'low'
    };
  };

  const getPersonalizedRecommendations = (items: any[], preferences: any): Recommendation[] => {
    return items
      .filter(item => {
        // Prefer categories user has ordered before
        return preferences.categories.includes(item.category);
      })
      .map(item => ({
        ...item,
        confidence: 0.9,
        reason: `Based on your love for ${preferences.categories[0]} flavors`
      }));
  };

  const getCartBasedSuggestions = (): Recommendation[] => {
    // Mock cart-based suggestions
    return [
      {
        id: 5,
        name: 'Chocolate Corn Delight',
        description: 'Perfect dessert to complete your meal',
        price: 'RM 9.50',
        image: 'https://images.unsplash.com/photo-1545086421-168708d4f603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkcml6emxlJTIwY29ybiUyMGN1cCUyMGdvdXJtZXQlMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        confidence: 0.8,
        reason: 'Pairs perfectly with your current selection',
        category: 'dessert',
        tags: ['dessert', 'complement']
      }
    ];
  };

  const getTrendingItems = (): Recommendation[] => {
    return [
      {
        id: 7,
        name: 'Susu Pekat Classic',
        description: 'Trending this week among Malaysian food lovers',
        price: 'RM 8.50',
        image: 'https://images.unsplash.com/photo-1736605406266-dbb985ef3325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25kZW5zZWQlMjBtaWxrJTIwd2hpdGUlMjBjcmVhbSUyMGNvcm4lMjBzdHJlZXQlMjBmb29kJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU2MzM2NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        confidence: 0.7,
        reason: '🔥 Trending this week',
        category: 'traditional',
        tags: ['trending', 'popular']
      }
    ];
  };

  const getNewUserRecommendations = (items: any[]): Recommendation[] => {
    return [
      {
        ...items[0], // Classic Cup
        confidence: 0.95,
        reason: 'Perfect for first-time CORNMAN customers'
      }
    ];
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const newRecommendations = generateRecommendations();
      setRecommendations(newRecommendations);
      setIsLoading(false);
    }, 1000);
  }, [user, orderHistory, currentCart]);

  const categories = [
    { id: 'personalized', name: 'For You', icon: '🎯' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'new', name: 'New Flavors', icon: '✨' },
    { id: 'popular', name: 'Popular', icon: '⭐' }
  ];

  const filteredRecommendations = recommendations.filter(item => {
    if (activeCategory === 'personalized') return item.confidence > 0.8;
    if (activeCategory === 'trending') return item.tags.includes('trending') || item.tags.includes('popular');
    if (activeCategory === 'new') return item.id > 4; // Mock new items
    if (activeCategory === 'popular') return item.tags.includes('bestseller') || item.tags.includes('popular');
    return true;
  });

  return (
    <motion.section 
      className="bg-gradient-to-br from-neutral-900 to-black rounded-3xl p-8 mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--neon-green)]/20 to-transparent rounded-full mb-4"
          animate={{
            boxShadow: [
              '0 0 20px rgba(57, 255, 20, 0.2)',
              '0 0 30px rgba(57, 255, 20, 0.4)',
              '0 0 20px rgba(57, 255, 20, 0.2)'
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">🤖</span>
          <span className="text-sm font-semibold neon-text">AI POWERED</span>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold neon-text mb-2">
          Recommended Just For You
        </h2>
        <p className="text-neutral-400">
          Our AI analyzes your taste preferences to suggest the perfect corn flavors
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 p-1 bg-neutral-800 rounded-full">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === category.id
                  ? 'neon-bg text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="card p-6"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              <div className="aspect-video bg-neutral-800 rounded-2xl mb-4"></div>
              <div className="h-4 bg-neutral-800 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Recommendations Grid */
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredRecommendations.map((item, index) => (
            <motion.div
              key={item.id}
              className="card group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Confidence Badge */}
              <motion.div
                className="absolute top-4 right-4 z-10 px-2 py-1 bg-black/80 rounded-full text-xs font-semibold"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                <span className="neon-text">{Math.round(item.confidence * 100)}% match</span>
              </motion.div>

              {/* AI Reason Badge */}
              <motion.div
                className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-[var(--neon-green)] to-green-400 text-black rounded-full text-xs font-semibold"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: { delay: 0.5 + index * 0.2, type: 'spring', stiffness: 200 }
                }}
              >
                {item.reason}
              </motion.div>

              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                {item.id === 1 ? (
                  <img
                    src={originalCrnmnImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                ) : (
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--neon-green)] transition-colors">
                  {item.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <motion.span 
                    className="font-bold text-lg neon-text"
                    animate={{
                      textShadow: [
                        '0 0 5px rgba(57, 255, 20, 0.5)',
                        '0 0 10px rgba(57, 255, 20, 0.8)',
                        '0 0 5px rgba(57, 255, 20, 0.5)'
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {item.price}
                  </motion.span>
                  
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={() => addToCart(item)}
                    icon={<span className="material-icons text-base">smart_toy</span>}
                    bounceOnClick={true}
                  >
                    Try This!
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* AI Learning Footer */}
      <motion.div 
        className="text-center mt-8 p-4 bg-gradient-to-r from-neutral-800/50 to-transparent rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-sm text-neutral-400">
          🧠 Our AI gets smarter with every order • Based on your preferences and {orderHistory.length} previous orders
        </p>
      </motion.div>
    </motion.section>
  );
}
