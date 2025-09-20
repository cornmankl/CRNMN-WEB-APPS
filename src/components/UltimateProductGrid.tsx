import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Heart, Share2, Star, Filter, Search, SortAsc, Camera, Mic } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { useActionHaptics } from '../hooks/useHapticFeedback';
import { PullToRefresh } from './PullToRefresh';
import { SwipeableCarousel } from './SwipeableCarousel';
import { BounceButton, StaggerContainer, StaggerItem, ScaleIn } from './MobileAnimations';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    badge?: string;
    rating?: number;
    category: string;
    isFavorite?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
}

interface UltimateProductGridProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
    onToggleFavorite?: (productId: number) => void;
    onShare?: (product: Product) => void;
    onARPreview?: (product: Product) => void;
    onVoiceSearch?: () => void;
}

export function UltimateProductGrid({
    products,
    onAddToCart,
    onToggleFavorite,
    onShare,
    onARPreview,
    onVoiceSearch
}: UltimateProductGridProps) {
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { isMobile, isTablet } = useResponsive();
    const haptics = useActionHaptics();

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'all' || product.category === selectedCategory)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.price.replace('RM ', '')) - parseFloat(b.price.replace('RM ', ''));
                case 'price-high':
                    return parseFloat(b.price.replace('RM ', '')) - parseFloat(a.price.replace('RM ', ''));
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'new':
                    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
                default:
                    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
            }
        });

    const updateQuantity = (productId: number, change: number) => {
        haptics.onToggle();
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) + change)
        }));
    };

    const addToCart = (product: Product) => {
        const quantity = quantities[product.id] || 1;
        haptics.onAddToCart();
        onAddToCart(product, quantity);
        setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const getGridCols = () => {
        if (isMobile) return 'grid-cols-1';
        if (isTablet) return 'grid-cols-2';
        return 'grid-cols-3';
    };

    const renderProductCard = (product: Product, index: number) => (
        <ScaleIn key={product.id} delay={index * 0.1}>
            <Card className="mobile-card group hover:border-green-500/30 transition-all duration-300">
                {/* Product Image with Carousel */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <SwipeableCarousel
                        items={[product.image, product.image]} // In real app, you'd have multiple images
                        renderItem={(image, imgIndex) => (
                            <img
                                src={image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        )}
                        autoPlay={false}
                        showDots={false}
                        showArrows={false}
                        className="h-full"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.badge && (
                            <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                {product.badge}
                            </span>
                        )}
                        {product.isNew && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                NEW
                            </span>
                        )}
                        {product.isPopular && (
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                HOT
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BounceButton
                            className="w-8 h-8 p-0 rounded-full bg-black/50 hover:bg-black/70"
                            onClick={() => onToggleFavorite?.(product.id)}
                            hapticFeedback={haptics.onToggle}
                        >
                            <Heart className={`w-4 h-4 ${product.isFavorite ? 'text-red-400 fill-current' : 'text-white'}`} />
                        </BounceButton>

                        <BounceButton
                            className="w-8 h-8 p-0 rounded-full bg-black/50 hover:bg-black/70"
                            onClick={() => onShare?.(product)}
                            hapticFeedback={haptics.onButtonPress}
                        >
                            <Share2 className="w-4 h-4 text-white" />
                        </BounceButton>

                        {onARPreview && (
                            <BounceButton
                                className="w-8 h-8 p-0 rounded-full bg-black/50 hover:bg-black/70"
                                onClick={() => onARPreview(product)}
                                hapticFeedback={haptics.onButtonPress}
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </BounceButton>
                        )}
                    </div>

                    {/* Rating */}
                    {product.rating && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-medium">{product.rating}</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-green-400 font-bold text-lg">{product.price}</span>
                        <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BounceButton
                                className="w-8 h-8 p-0 rounded-full border border-gray-600 hover:border-green-500"
                                onClick={() => updateQuantity(product.id, -1)}
                                disabled={!quantities[product.id]}
                                hapticFeedback={haptics.onButtonPress}
                            >
                                <Minus className="w-4 h-4" />
                            </BounceButton>

                            <span className="text-white font-medium w-8 text-center">
                                {quantities[product.id] || 0}
                            </span>

                            <BounceButton
                                className="w-8 h-8 p-0 rounded-full border border-gray-600 hover:border-green-500"
                                onClick={() => updateQuantity(product.id, 1)}
                                hapticFeedback={haptics.onButtonPress}
                            >
                                <Plus className="w-4 h-4" />
                            </BounceButton>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <BounceButton
                        className="w-full mobile-btn-primary"
                        onClick={() => addToCart(product)}
                        disabled={!quantities[product.id]}
                        hapticFeedback={haptics.onAddToCart}
                    >
                        {quantities[product.id] ? 'Add to Cart' : 'Select Quantity'}
                    </BounceButton>
                </div>
            </Card>
        </ScaleIn>
    );

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="mobile-heading-2 text-white">Our Menu</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">{filteredProducts.length} items</span>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-12 mobile-input"
                            />
                            {onVoiceSearch && (
                                <motion.button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
                                    onClick={onVoiceSearch}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Mic className="w-4 h-4" />
                                </motion.button>
                            )}
                        </div>

                        {/* Filter Bar */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <BounceButton
                                className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all'
                                    ? 'bg-green-500 text-black'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                onClick={() => setSelectedCategory('all')}
                                hapticFeedback={haptics.onButtonPress}
                            >
                                All
                            </BounceButton>

                            {categories.slice(1).map((category) => (
                                <BounceButton
                                    key={category}
                                    className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${selectedCategory === category
                                        ? 'bg-green-500 text-black'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    onClick={() => setSelectedCategory(category)}
                                    hapticFeedback={haptics.onButtonPress}
                                >
                                    {category}
                                </BounceButton>
                            ))}
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <SortAsc className="w-4 h-4 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1 border border-gray-600 focus:border-green-500"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="new">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <StaggerContainer className={`grid ${getGridCols()} gap-4`}>
                        {filteredProducts.map((product, index) => (
                            <StaggerItem key={product.id}>
                                {renderProductCard(product, index)}
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">No products found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}

                    {/* Load More Button */}
                    {filteredProducts.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <BounceButton
                                className="mobile-btn-secondary"
                                hapticFeedback={haptics.onButtonPress}
                            >
                                Load More Products
                            </BounceButton>
                        </div>
                    )}
                </div>
            </div>
        </PullToRefresh>
    );
}
