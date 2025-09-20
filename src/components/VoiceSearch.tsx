import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Search, X, Sparkles } from 'lucide-react';
import { useActionHaptics } from '../hooks/useHapticFeedback';

interface VoiceSearchProps {
    onSearch: (query: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

export function VoiceSearch({ onSearch, onClose, isOpen }: VoiceSearchProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const { hapticSuccess, hapticError, hapticLight } = useActionHaptics();

    // AI-powered search suggestions
    const aiSuggestions = [
        "Show me spicy corn options",
        "What's the most popular item?",
        "Find corn under RM 10",
        "Show me new products",
        "What's trending today?",
        "Find vegetarian options",
        "Show me premium corn",
        "What's the best seller?"
    ];

    useEffect(() => {
        if (!isOpen) return;

        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                hapticLight();
            };

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setTranscript(finalTranscript || interimTranscript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                if (transcript.trim()) {
                    handleSearch(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                hapticError();
            };
        }
    }, [isOpen, transcript, hapticLight, hapticError]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleSearch = async (query: string) => {
        setIsProcessing(true);
        hapticSuccess();

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSearch(query);
        setIsProcessing(false);
        onClose();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setTranscript(suggestion);
        handleSearch(suggestion);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-green-400" />
                                AI Voice Search
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Voice Interface */}
                        <div className="text-center mb-6">
                            <motion.div
                                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${isListening
                                        ? 'bg-green-500 animate-pulse'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                                onClick={isListening ? stopListening : startListening}
                            >
                                {isListening ? (
                                    <MicOff className="w-8 h-8 text-white" />
                                ) : (
                                    <Mic className="w-8 h-8 text-white" />
                                )}
                            </motion.div>

                            <p className="text-gray-300 mb-2">
                                {isListening ? 'Listening...' : 'Tap to start voice search'}
                            </p>

                            {transcript && (
                                <motion.div
                                    className="bg-gray-800 rounded-lg p-3 mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <p className="text-white text-sm">{transcript}</p>
                                </motion.div>
                            )}

                            {isProcessing && (
                                <motion.div
                                    className="flex items-center justify-center gap-2 text-green-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Processing with AI...</span>
                                </motion.div>
                            )}
                        </div>

                        {/* AI Suggestions */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">Try asking:</h3>
                            {aiSuggestions.map((suggestion, index) => (
                                <motion.button
                                    key={index}
                                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-green-400" />
                                        {suggestion}
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Manual Search */}
                        <div className="mt-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    placeholder="Or type your search..."
                                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                                />
                                <button
                                    onClick={() => handleSearch(transcript)}
                                    disabled={!transcript.trim() || isProcessing}
                                    className="bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
