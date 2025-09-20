import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Download, Share2 } from 'lucide-react';
import { useActionHaptics } from '../hooks/useHapticFeedback';

interface ARProductPreviewProps {
    product: {
        id: number;
        name: string;
        image: string;
        price: string;
    };
    onClose: () => void;
    isOpen: boolean;
}

export function ARProductPreview({ product, onClose, isOpen }: ARProductPreviewProps) {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { hapticSuccess, hapticError } = useActionHaptics();

    useEffect(() => {
        if (isOpen && isCameraActive) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isOpen, isCameraActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraError(null);
                hapticSuccess();
            }
        } catch (error) {
            console.error('Camera access denied:', error);
            setCameraError('Camera access is required for AR preview');
            hapticError();
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add product overlay
        const productImage = new Image();
        productImage.onload = () => {
            // Calculate product position (center-right of image)
            const productWidth = canvas.width * 0.3;
            const productHeight = productWidth * (productImage.height / productImage.width);
            const x = canvas.width - productWidth - 20;
            const y = (canvas.height - productHeight) / 2;

            // Draw product image
            context.drawImage(productImage, x, y, productWidth, productHeight);

            // Add product info overlay
            context.fillStyle = 'rgba(0, 0, 0, 0.8)';
            context.fillRect(x, y + productHeight, productWidth, 80);

            context.fillStyle = '#10B981';
            context.font = 'bold 16px Arial';
            context.fillText(product.name, x + 10, y + productHeight + 25);

            context.fillStyle = 'white';
            context.font = '14px Arial';
            context.fillText(product.price, x + 10, y + productHeight + 50);

            // Convert to blob and set as captured image
            canvas.toBlob((blob) => {
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
                    setCapturedImage(imageUrl);
                    hapticSuccess();
                }
            }, 'image/jpeg', 0.9);
        };

        productImage.src = product.image;
    };

    const resetCapture = () => {
        setCapturedImage(null);
        hapticSuccess();
    };

    const downloadImage = () => {
        if (!capturedImage) return;

        const link = document.createElement('a');
        link.href = capturedImage;
        link.download = `${product.name}-ar-preview.jpg`;
        link.click();
        hapticSuccess();
    };

    const shareImage = async () => {
        if (!capturedImage) return;

        try {
            if (navigator.share) {
                const response = await fetch(capturedImage);
                const blob = await response.blob();
                const file = new File([blob], `${product.name}-ar-preview.jpg`, { type: 'image/jpeg' });

                await navigator.share({
                    title: `${product.name} - AR Preview`,
                    text: `Check out this AR preview of ${product.name}!`,
                    files: [file]
                });
                hapticSuccess();
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(capturedImage);
                hapticSuccess();
            }
        } catch (error) {
            console.error('Share failed:', error);
            hapticError();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
                        <h2 className="text-white font-semibold">AR Product Preview</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Camera View */}
                    <div className="flex-1 relative">
                        {!isCameraActive ? (
                            <div className="flex-1 flex items-center justify-center bg-gray-900">
                                <motion.button
                                    className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-full font-semibold flex items-center gap-3"
                                    onClick={() => setIsCameraActive(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Camera className="w-6 h-6" />
                                    Start AR Preview
                                </motion.button>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />

                                {/* Product Overlay */}
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-32 object-cover rounded mb-2"
                                    />
                                    <h3 className="text-white font-semibold text-sm mb-1">{product.name}</h3>
                                    <p className="text-green-400 font-bold">{product.price}</p>
                                </div>

                                {/* Camera Controls */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                    <motion.button
                                        className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
                                        onClick={capturePhoto}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Camera className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>

                                {/* Error Message */}
                                {cameraError && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <div className="text-center text-white p-6">
                                            <p className="mb-4">{cameraError}</p>
                                            <button
                                                onClick={() => setIsCameraActive(false)}
                                                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg"
                                            >
                                                Go Back
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Captured Image View */}
                        {capturedImage && (
                            <div className="absolute inset-0 bg-black flex flex-col">
                                <img
                                    src={capturedImage}
                                    alt="AR Preview"
                                    className="flex-1 object-contain"
                                />

                                {/* Image Controls */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                    <motion.button
                                        className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center"
                                        onClick={resetCapture}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <RotateCcw className="w-6 h-6 text-white" />
                                    </motion.button>

                                    <motion.button
                                        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                                        onClick={downloadImage}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Download className="w-6 h-6 text-white" />
                                    </motion.button>

                                    <motion.button
                                        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
                                        onClick={shareImage}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Share2 className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hidden canvas for image processing */}
                    <canvas ref={canvasRef} className="hidden" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
