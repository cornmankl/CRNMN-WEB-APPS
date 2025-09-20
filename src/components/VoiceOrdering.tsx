import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  ShoppingCart,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface VoiceOrderingProps {
  addToCart: (item: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
  variants?: string[];
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Chocolate Corn Delight', price: 'RM 9.50', category: 'dessert' },
  { id: 2, name: 'Cheddar Cheese Classic', price: 'RM 8.90', category: 'savory' },
  { id: 3, name: 'Susu Pekat Traditional', price: 'RM 8.50', category: 'traditional' },
  { id: 4, name: 'Caramel Crunch', price: 'RM 9.00', category: 'dessert' },
  { id: 5, name: 'THEFMSMKT Classic Mix', price: 'RM 12.90', category: 'combo' }
];

export function VoiceOrdering({ addToCart, isOpen, onClose }: VoiceOrderingProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<MenuItem[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check microphone permissions
  const checkMicrophonePermissions = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        console.log('Microphone permission status:', permission.state);
        
        if (permission.state === 'denied') {
          setStatus('error');
          toast.error('Microphone access is denied. Please enable microphone permissions in your browser settings.');
          return false;
        }
      }
      
      // Test microphone access with getUserMedia
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately - we just wanted to test access
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (error) {
          console.error('Microphone access error:', error);
          setStatus('error');
          toast.error('Unable to access microphone. Please check your browser permissions.');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return true; // Assume permissions are OK if we can't check
    }
  };

  // Handle speech recognition errors
  const handleSpeechError = (error: string) => {
    console.error('Speech recognition error:', error);
    setIsListening(false);
    
    switch (error) {
      case 'not-allowed':
        setStatus('error');
        toast.error('Microphone access denied. Please allow microphone permissions and try again.');
        break;
      case 'no-speech':
        setStatus('error');
        toast.error('No speech detected. Please try speaking closer to your microphone.');
        break;
      case 'audio-capture':
        setStatus('error');
        toast.error('No microphone found. Please check your audio devices.');
        break;
      case 'network':
        setStatus('error');
        toast.error('Network error occurred. Please check your internet connection.');
        break;
      case 'service-not-allowed':
        setStatus('error');
        toast.error('Speech recognition service not allowed. Please try again.');
        break;
      default:
        setStatus('error');
        toast.error(`Speech recognition error: ${error}. Please try again.`);
    }
  };

  useEffect(() => {
    // Initialize speech recognition (don't check permissions yet)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setStatus('listening');
        setIsListening(true);
        speak('I\'m listening for your order. You can say items like chocolate corn or cheddar cheese.');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(event.results[i][0].confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          processVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        handleSpeechError(event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (status === 'listening') {
          setStatus('idle');
        }
      };
    } else {
      // Browser doesn't support speech recognition
      setStatus('error');
      toast.error('Voice recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current || isMuted) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to use a more natural voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en-')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synthRef.current.speak(utterance);
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    // Check permissions before starting
    const hasPermission = await checkMicrophonePermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setTranscript('');
      setRecognizedItems([]);
      setStatus('listening');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setStatus('error');
      toast.error('Failed to start voice recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStatus('idle');
  };

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    setStatus('processing');

    try {
      const lowerInput = input.toLowerCase();
      const foundItems: MenuItem[] = [];

      // Simple keyword matching for menu items
      menuItems.forEach(item => {
        const itemKeywords = item.name.toLowerCase().split(' ');
        const categoryKeywords = [item.category];
        
        // Check if any keywords match
        const hasMatch = itemKeywords.some(keyword => 
          lowerInput.includes(keyword) || 
          lowerInput.includes(keyword.substring(0, 4)) // Partial match
        ) || categoryKeywords.some(category => lowerInput.includes(category));

        // Special cases for common voice recognition patterns
        const specialMatches = [
          { pattern: /chocolate|choco/i, item: 'Chocolate Corn Delight' },
          { pattern: /cheese|cheddar/i, item: 'Cheddar Cheese Classic' },
          { pattern: /susu|milk|pekat/i, item: 'Susu Pekat Traditional' },
          { pattern: /caramel|carame/i, item: 'Caramel Crunch' },
          { pattern: /mix|combo|classic/i, item: 'THEFMSMKT Classic Mix' }
        ];

        const specialMatch = specialMatches.find(match => 
          match.pattern.test(lowerInput) && match.item === item.name
        );

        if (hasMatch || specialMatch) {
          foundItems.push(item);
        }
      });

      // Extract quantities
      const quantityMatch = lowerInput.match(/(\d+|one|two|three|four|five)/);
      let quantity = 1;
      
      if (quantityMatch) {
        const quantityText = quantityMatch[1];
        const numberMap: { [key: string]: number } = {
          'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
        };
        quantity = numberMap[quantityText] || parseInt(quantityText) || 1;
      }

      setRecognizedItems(foundItems);

      if (foundItems.length > 0) {
        setStatus('success');
        const itemNames = foundItems.map(item => item.name).join(' and ');
        speak(`Found ${itemNames}. ${foundItems.length === 1 ? 'Adding' : 'Adding these items'} to your cart.`);
        
        // Add items to cart after a brief delay
        setTimeout(() => {
          foundItems.forEach(item => {
            for (let i = 0; i < quantity; i++) {
              addToCart(item);
            }
          });
          toast.success(`Added ${foundItems.length} item${foundItems.length > 1 ? 's' : ''} to cart!`);
        }, 1500);
      } else {
        setStatus('error');
        speak('Sorry, I couldn\'t find those items. Try saying chocolate corn, cheddar cheese, or susu pekat.');
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      setStatus('error');
      speak('Sorry, there was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'listening':
        return <Mic className="w-6 h-6 text-[var(--neon-green)]" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-[var(--neon-green)] animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <MicOff className="w-6 h-6 text-[var(--neutral-400)]" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing order...';
      case 'success':
        return 'Order recognized!';
      case 'error':
        return 'Please try again';
      default:
        return 'Ready to listen';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <Card className="p-8 bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-[var(--neon-green)]" />
                <h2 className="text-2xl font-bold text-white">Voice Ordering</h2>
              </div>
              <p className="text-[var(--neutral-400)]">
                Say your order naturally, like "I want chocolate corn and cheddar cheese"
              </p>
            </div>

            {/* Voice Visual Indicator */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  scale: isListening ? [1, 1.2, 1] : 1,
                  opacity: isListening ? [1, 0.7, 1] : 1
                }}
                transition={{
                  duration: 1,
                  repeat: isListening ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center border-2 
                  ${status === 'listening' 
                    ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/10' 
                    : status === 'success'
                    ? 'border-green-500 bg-green-500/10'
                    : status === 'error'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-[var(--neutral-600)] bg-[var(--neutral-800)]'
                  }
                `}
              >
                {getStatusIcon()}
              </motion.div>
            </div>

            {/* Status and Transcript */}
            <div className="text-center mb-6">
              <Badge 
                className={`mb-3 ${
                  status === 'success' ? 'bg-green-500/10 text-green-400' :
                  status === 'error' ? 'bg-red-500/10 text-red-400' :
                  status === 'listening' ? 'bg-[var(--neon-green)]/10 text-[var(--neon-green)]' :
                  'bg-[var(--neutral-800)] text-[var(--neutral-400)]'
                }`}
              >
                {getStatusText()}
              </Badge>
              
              {transcript && (
                <div className="p-3 bg-[var(--neutral-800)] rounded-lg">
                  <p className="text-sm text-[var(--neutral-300)]">
                    "{transcript}"
                  </p>
                  {confidence > 0 && (
                    <p className="text-xs text-[var(--neutral-500)] mt-1">
                      Confidence: {Math.round(confidence * 100)}%
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Recognized Items */}
            {recognizedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Recognized Items:
                </h4>
                <div className="space-y-2">
                  {recognizedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 bg-[var(--neutral-800)] rounded-lg"
                    >
                      <span className="text-white">{item.name}</span>
                      <span className="text-[var(--neon-green)] font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error Help Section */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <h4 className="font-medium text-red-400">Voice Recognition Issue</h4>
                </div>
                <div className="text-sm text-red-300 space-y-2">
                  <p>Having trouble? Try these steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Enable microphone permissions in your browser</li>
                    <li>Make sure your microphone is connected</li>
                    <li>Speak clearly and close to your microphone</li>
                    <li>Try refreshing the page if the issue persists</li>
                  </ul>
                </div>
                <Button
                  onClick={async () => {
                    const hasPermission = await checkMicrophonePermissions();
                    if (hasPermission) {
                      setStatus('idle');
                    }
                  }}
                  size="sm"
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Check Permissions Again
                </Button>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`flex-1 ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>

              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="outline"
                size="sm"
                className="px-3"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Quick Commands Help */}
            <div className="mt-6 p-4 bg-[var(--neutral-800)] rounded-lg">
              <h5 className="font-medium text-white mb-2">Try saying:</h5>
              <div className="grid grid-cols-1 gap-1 text-sm text-[var(--neutral-400)]">
                <span>• "I want chocolate corn"</span>
                <span>• "Two cheddar cheese please"</span>
                <span>• "Add susu pekat to my order"</span>
                <span>• "I'll have the classic mix"</span>
              </div>
              
              {window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && (
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                  <p className="text-yellow-400">
                    💡 <strong>Note:</strong> Voice recognition requires HTTPS for security. 
                    If you're having issues, make sure you're using a secure connection.
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full mt-4 border-[var(--neutral-700)]"
            >
              Close
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
