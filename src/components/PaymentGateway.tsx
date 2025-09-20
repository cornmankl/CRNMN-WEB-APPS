import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Bitcoin, 
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Lock
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'ewallet' | 'crypto' | 'bank';
  icon: React.ReactNode;
  description: string;
  processingFee: number;
  available: boolean;
  logo?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Visa, Mastercard, AMEX',
    processingFee: 0,
    available: true
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    type: 'ewallet',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Malaysia\'s preferred e-wallet',
    processingFee: 0,
    available: true
  },
  {
    id: 'tng',
    name: 'Touch \'n Go eWallet',
    type: 'ewallet',
    icon: <Wallet className="w-5 h-5" />,
    description: 'Instant payment via TnG',
    processingFee: 0,
    available: true
  },
  {
    id: 'boost',
    name: 'Boost',
    type: 'ewallet',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Pay with Boost e-wallet',
    processingFee: 0,
    available: true
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    type: 'ewallet',
    icon: <Wallet className="w-5 h-5" />,
    description: 'Shopee digital wallet',
    processingFee: 0,
    available: true
  },
  {
    id: 'fpx',
    name: 'Online Banking (FPX)',
    type: 'bank',
    icon: <Shield className="w-5 h-5" />,
    description: 'Malaysian banks (Maybank, CIMB, etc.)',
    processingFee: 0,
    available: true
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    type: 'crypto',
    icon: <Bitcoin className="w-5 h-5" />,
    description: 'Pay with cryptocurrency',
    processingFee: 1.5,
    available: true
  }
];

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  cartItems: any[];
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentGateway({
  isOpen,
  onClose,
  amount,
  cartItems,
  onPaymentSuccess,
  onPaymentError
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success' | 'error'>('method');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const processingFee = selectedPaymentMethod ? (amount * selectedPaymentMethod.processingFee / 100) : 0;
  const totalAmount = amount + processingFee;

  const validateCardDetails = () => {
    const newErrors: { [key: string]: string } = {};

    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!paymentDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    }

    if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!paymentDetails.cardName.trim()) {
      newErrors.cardName = 'Please enter cardholder name';
    }

    if (!paymentDetails.email || !/\S+@\S+\.\S+/.test(paymentDetails.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!paymentDetails.phone || paymentDetails.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async () => {
    if (selectedMethod === 'stripe' && !validateCardDetails()) {
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would call your payment processor
      const paymentResult = await processPayment({
        method: selectedMethod,
        amount: totalAmount,
        currency: 'MYR',
        details: paymentDetails,
        items: cartItems
      });

      if (paymentResult.success) {
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(paymentResult.paymentId);
          onClose();
        }, 2000);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStep('error');
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock payment processor
  const processPayment = async (paymentData: any): Promise<{success: boolean, paymentId?: string, error?: string}> => {
    // This is a mock implementation
    // In production, integrate with actual payment processors like Stripe, iPay88, etc.
    
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      return {
        success: true,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Payment declined. Please try a different payment method.'
      };
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Select Payment Method</h3>
        <p className="text-sm text-[var(--neutral-400)]">Choose your preferred payment option</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMethod(method.id)}
            disabled={!method.available}
            className={`
              p-4 rounded-xl border-2 transition-all text-left
              ${selectedMethod === method.id
                ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/5'
                : 'border-[var(--neutral-700)] hover:border-[var(--neutral-600)]'
              }
              ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-lg 
                  ${selectedMethod === method.id 
                    ? 'bg-[var(--neon-green)] text-black' 
                    : 'bg-[var(--neutral-800)] text-[var(--neutral-400)]'
                  }
                `}>
                  {method.icon}
                </div>
                <div>
                  <div className="font-medium text-white">{method.name}</div>
                  <div className="text-sm text-[var(--neutral-400)]">{method.description}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {method.processingFee > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{method.processingFee}% fee
                  </Badge>
                )}
                {!method.available && (
                  <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500/20">
                    Coming Soon
                  </Badge>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Order Summary */}
      <Card className="p-4 bg-[var(--neutral-800)] border-[var(--neutral-700)]">
        <h4 className="font-medium text-white mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--neutral-400)]">Subtotal</span>
            <span className="text-white">RM {amount.toFixed(2)}</span>
          </div>
          {processingFee > 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--neutral-400)]">Processing Fee</span>
              <span className="text-white">RM {processingFee.toFixed(2)}</span>
            </div>
          )}
          <Separator className="bg-[var(--neutral-700)]" />
          <div className="flex justify-between font-medium">
            <span className="text-white">Total</span>
            <span className="text-[var(--neon-green)]">RM {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Button
        onClick={() => setStep('details')}
        className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
        disabled={!selectedPaymentMethod?.available}
      >
        Continue with {selectedPaymentMethod?.name}
      </Button>
    </div>
  );

  const renderPaymentDetails = () => {
    if (selectedMethod === 'stripe') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-[var(--neon-green)]" />
            <span className="text-sm text-[var(--neutral-400)]">Your payment information is secure and encrypted</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  cardNumber: formatCardNumber(e.target.value)
                }))}
                maxLength={19}
                className={errors.cardNumber ? 'border-red-500' : ''}
              />
              {errors.cardNumber && (
                <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    expiryDate: formatExpiryDate(e.target.value)
                  }))}
                  maxLength={5}
                  className={errors.expiryDate ? 'border-red-500' : ''}
                />
                {errors.expiryDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                  }))}
                  maxLength={4}
                  className={errors.cvv ? 'border-red-500' : ''}
                />
                {errors.cvv && (
                  <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={paymentDetails.cardName}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  cardName: e.target.value
                }))}
                className={errors.cardName ? 'border-red-500' : ''}
              />
              {errors.cardName && (
                <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={paymentDetails.email}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+60123456789"
                value={paymentDetails.phone}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep('method')}
              variant="outline"
              className="flex-1 border-[var(--neutral-700)]"
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
            >
              Pay RM {totalAmount.toFixed(2)}
            </Button>
          </div>
        </div>
      );
    } else {
      // For other payment methods (e-wallets, crypto, etc.)
      return (
        <div className="space-y-4 text-center">
          <div className="p-8">
            <div className="w-16 h-16 bg-[var(--neon-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {selectedPaymentMethod?.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Complete payment with {selectedPaymentMethod?.name}
            </h3>
            <p className="text-[var(--neutral-400)] mb-6">
              You will be redirected to {selectedPaymentMethod?.name} to complete your payment of RM {totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep('method')}
              variant="outline"
              className="flex-1 border-[var(--neutral-700)]"
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
            >
              Continue to {selectedPaymentMethod?.name}
            </Button>
          </div>
        </div>
      );
    }
  };

  const renderProcessing = () => (
    <div className="text-center py-8">
      <Loader2 className="w-16 h-16 text-[var(--neon-green)] animate-spin mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Processing Payment</h3>
      <p className="text-[var(--neutral-400)]">Please wait while we process your payment...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Payment Successful!</h3>
      <p className="text-[var(--neutral-400)]">Your order has been confirmed and will be prepared shortly.</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-8">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Payment Failed</h3>
      <p className="text-[var(--neutral-400)] mb-6">
        There was an issue processing your payment. Please try again.
      </p>
      <Button
        onClick={() => setStep('method')}
        className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
      >
        Try Again
      </Button>
    </div>
  );

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
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6 bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Secure Payment</h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-[var(--neutral-400)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {step === 'method' && renderMethodSelection()}
            {step === 'details' && renderPaymentDetails()}
            {step === 'processing' && renderProcessing()}
            {step === 'success' && renderSuccess()}
            {step === 'error' && renderError()}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
