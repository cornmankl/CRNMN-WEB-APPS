import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Heart, Share2 } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    badge?: string;
    isFavorite?: boolean;
}

interface MobileProductGridProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
    onToggleFavorite?: (productId: number) => void;
}

export function MobileProductGrid({ products, onAddToCart, onToggleFavorite }: MobileProductGridProps) {
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const { isMobile, isTablet } = useResponsive();

    const updateQuantity = (productId: number, change: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) + change)
        }));
    };

    const addToCart = (product: Product) => {
        const quantity = quantities[product.id] || 1;
        onAddToCart(product, quantity);
        setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    };

    const getGridCols = () => {
        if (isMobile) return 'grid-cols-1';
        if (isTablet) return 'grid-cols-2';
        return 'grid-cols-3';
    };

    return (
        <div className="px-4 py-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Our Menu</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{products.length} items</span>
                    </div>
                </div>

                {/* Products Grid */}
                <div className={`grid ${getGridCols()} gap-4`}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden group hover:border-green-500/30 transition-all duration-300">
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Badge */}
                                    {product.badge && (
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                                {product.badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-8 h-8 p-0 rounded-full bg-black/50 hover:bg-black/70"
                                            onClick={() => onToggleFavorite?.(product.id)}
                                        >
                                            <Heart className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-8 h-8 p-0 rounded-full bg-black/50 hover:bg-black/70"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-white mb-1 line-clamp-2">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-green-400 font-bold text-lg">{product.price}</span>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-8 h-8 p-0 rounded-full"
                                                onClick={() => updateQuantity(product.id, -1)}
                                                disabled={!quantities[product.id]}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="text-white font-medium w-8 text-center">
                                                {quantities[product.id] || 0}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-8 h-8 p-0 rounded-full"
                                                onClick={() => updateQuantity(product.id, 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <Button
                                        className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold"
                                        onClick={() => addToCart(product)}
                                        disabled={!quantities[product.id]}
                                    >
                                        {quantities[product.id] ? 'Add to Cart' : 'Select Quantity'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-8">
                    <Button
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                    >
                        Load More Products
                    </Button>
                </div>
            </div>
        </div>
    );
}
