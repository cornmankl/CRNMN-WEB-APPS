import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Facebook, Twitter, Instagram, MessageCircle, Mail, Gift, Users, Star } from 'lucide-react';
import { useActionHaptics } from '../hooks/useHapticFeedback';

interface SocialSharingProps {
    product?: {
        id: number;
        name: string;
        description: string;
        price: string;
        image: string;
    };
    order?: {
        id: string;
        total: number;
        items: any[];
    };
    onClose: () => void;
    isOpen: boolean;
}

export function SocialSharing({ product, order, onClose, isOpen }: SocialSharingProps) {
    const [referralCode, setReferralCode] = useState('');
    const [referralStats, setReferralStats] = useState({
        totalReferrals: 0,
        totalEarnings: 0,
        thisMonth: 0
    });
    const { hapticSuccess, hapticLight } = useActionHaptics();

    useEffect(() => {
        if (isOpen) {
            // Generate or get referral code
            const code = localStorage.getItem('referralCode') || generateReferralCode();
            setReferralCode(code);
            localStorage.setItem('referralCode', code);

            // Load referral stats
            loadReferralStats();
        }
    }, [isOpen]);

    const generateReferralCode = () => {
        return 'CORN' + Math.random().toString(36).substr(2, 6).toUpperCase();
    };

    const loadReferralStats = () => {
        // In a real app, this would come from an API
        setReferralStats({
            totalReferrals: 12,
            totalEarnings: 45.50,
            thisMonth: 8
        });
    };

    const shareContent = () => {
        if (product) {
            return {
                title: `Check out ${product.name} at THEFMSMKT!`,
                text: `${product.description} - Only ${product.price}! 🌽`,
                url: `${window.location.origin}?ref=${referralCode}&product=${product.id}`,
                image: product.image
            };
        } else if (order) {
            return {
                title: `Just ordered from THEFMSMKT!`,
                text: `Ordered ${order.items.length} items for RM ${order.total.toFixed(2)}. Use my code ${referralCode} for 10% off! 🌽`,
                url: `${window.location.origin}?ref=${referralCode}`,
                image: '/og-image.jpg'
            };
        } else {
            return {
                title: 'THEFMSMKT - Premium Corn Delivery',
                text: `Get 10% off your first order with code ${referralCode}! Premium corn delivered to your door. 🌽`,
                url: `${window.location.origin}?ref=${referralCode}`,
                image: '/og-image.jpg'
            };
        }
    };

    const shareToNative = async (platform: string) => {
        const content = shareContent();

        try {
            if (navigator.share) {
                await navigator.share({
                    title: content.title,
                    text: content.text,
                    url: content.url
                });
                hapticSuccess();
            } else {
                // Fallback for platforms that don't support Web Share API
                await shareToPlatform(platform, content);
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    const shareToPlatform = async (platform: string, content: any) => {
        const encodedUrl = encodeURIComponent(content.url);
        const encodedText = encodeURIComponent(content.text);
        const encodedTitle = encodeURIComponent(content.title);

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct URL sharing, copy to clipboard
                await copyToClipboard(content.text + ' ' + content.url);
                hapticSuccess();
                return;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            hapticSuccess();
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            hapticSuccess();
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const copyReferralCode = () => {
        copyToClipboard(referralCode);
    };

    const shareReferralLink = () => {
        const content = shareContent();
        copyToClipboard(`${content.text} ${content.url}`);
    };

    const shareOptions = [
        { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
        { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
        { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'bg-blue-500' },
        { id: 'email', name: 'Email', icon: Mail, color: 'bg-gray-600' }
    ];

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
                        className="bg-gray-900 rounded-t-2xl p-6 w-full max-w-md mx-auto"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-green-400" />
                                Share & Earn
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Referral Stats */}
                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Gift className="w-5 h-5 text-green-400" />
                                <h3 className="text-white font-semibold">Your Referral Stats</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-green-400">{referralStats.totalReferrals}</p>
                                    <p className="text-gray-400 text-sm">Total Referrals</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-400">RM {referralStats.totalEarnings.toFixed(2)}</p>
                                    <p className="text-gray-400 text-sm">Total Earnings</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-400">{referralStats.thisMonth}</p>
                                    <p className="text-gray-400 text-sm">This Month</p>
                                </div>
                            </div>
                        </div>

                        {/* Referral Code */}
                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                            <h3 className="text-white font-semibold mb-3">Your Referral Code</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2">
                                    <code className="text-green-400 font-mono text-lg">{referralCode}</code>
                                </div>
                                <motion.button
                                    className="bg-green-500 hover:bg-green-400 text-black px-3 py-2 rounded-lg font-semibold"
                                    onClick={copyReferralCode}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Copy className="w-4 h-4" />
                                </motion.button>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                Share this code and earn 10% commission on every order!
                            </p>
                        </div>

                        {/* Share Options */}
                        <div className="space-y-3">
                            <h3 className="text-white font-semibold mb-3">Share on Social Media</h3>

                            <div className="grid grid-cols-2 gap-3">
                                {shareOptions.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        className={`${option.color} hover:opacity-80 text-white p-3 rounded-lg flex items-center gap-2 transition-opacity`}
                                        onClick={() => shareToNative(option.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <option.icon className="w-5 h-5" />
                                        <span className="font-medium">{option.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 space-y-2">
                            <motion.button
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                                onClick={shareReferralLink}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Copy className="w-4 h-4" />
                                Copy Referral Link
                            </motion.button>

                            <motion.button
                                className="w-full bg-green-500 hover:bg-green-400 text-black py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                                onClick={() => shareToNative('whatsapp')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Share via WhatsApp
                            </motion.button>
                        </div>

                        {/* Referral Benefits */}
                        <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Referral Benefits
                            </h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Earn 10% commission on every referral's order</li>
                                <li>• Your friends get 10% off their first order</li>
                                <li>• No limit on referrals - earn unlimited!</li>
                                <li>• Payouts processed weekly</li>
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
