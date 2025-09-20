import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface MobileCartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
    onCheckout: () => void;
}

export function MobileCart({
    isOpen,
    onClose,
    items,
    total,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout
}: MobileCartProps) {
    const { isMobile } = useResponsive();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        // Simulate checkout process
        await new Promise(resolve => setTimeout(resolve, 1000));
        onCheckout();
        setIsCheckingOut(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Cart Panel */}
                    <motion.div
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-md border-l border-green-500/20 z-50 flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-green-400" />
                                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                                <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Your cart is empty</h3>
                                    <p className="text-gray-500 text-sm">Add some delicious corn to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className="bg-gray-900/50 border-gray-800 p-4">
                                                <div className="flex gap-3">
                                                    {/* Product Image */}
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-green-400 font-bold text-sm mb-2">
                                                            RM {(item.price * item.quantity).toFixed(2)}
                                                        </p>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-6 h-6 p-0 rounded-full"
                                                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </Button>
                                                            <span className="text-white font-medium text-sm w-6 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-6 h-6 p-0 rounded-full"
                                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="w-6 h-6 p-0 text-red-400 hover:text-red-300 ml-auto"
                                                                onClick={() => onRemoveItem(item.id)}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-800 p-4 space-y-4">
                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-white">Total:</span>
                                    <span className="text-2xl font-bold text-green-400">RM {total.toFixed(2)}</span>
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 text-lg"
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        'Checkout Now'
                                    )}
                                </Button>

                                {/* Delivery Info */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">
                                        Free delivery for orders above RM 25
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
