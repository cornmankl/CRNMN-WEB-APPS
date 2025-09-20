import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedButton } from './AnimatedButton';

interface LiveOrderTrackingProps {
  orderId: string;
  onClose: () => void;
}

interface OrderStatus {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
  icon: string;
  estimatedTime?: string;
}

interface DeliveryDriver {
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  photo: string;
  location: { lat: number; lng: number };
}

export function LiveOrderTracking({ orderId, onClose }: LiveOrderTrackingProps) {
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [currentLocation, setCurrentLocation] = useState({ lat: 3.1390, lng: 101.6869 }); // KL
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Mock order tracking data
  useEffect(() => {
    const mockOrderStatuses: OrderStatus[] = [
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your corn order has been received and confirmed',
        timestamp: '2:30 PM',
        completed: true,
        active: false,
        icon: 'check_circle'
      },
      {
        id: 'preparing',
        title: 'Preparing Your Corn',
        description: 'Our chefs are crafting your gourmet corn with fresh ingredients',
        timestamp: '2:35 PM',
        completed: true,
        active: false,
        icon: 'restaurant',
        estimatedTime: '5-7 min'
      },
      {
        id: 'ready',
        title: 'Ready for Pickup',
        description: 'Your order is ready and waiting for our delivery partner',
        timestamp: '2:42 PM',
        completed: true,
        active: false,
        icon: 'done_all'
      },
      {
        id: 'dispatched',
        title: 'Out for Delivery',
        description: 'Ahmad is on the way with your fresh corn!',
        timestamp: '2:45 PM',
        completed: false,
        active: true,
        icon: 'delivery_dining',
        estimatedTime: '10-15 min'
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Enjoy your delicious CORNMAN experience!',
        timestamp: '',
        completed: false,
        active: false,
        icon: 'celebration'
      }
    ];

    const mockDriver: DeliveryDriver = {
      name: 'Ahmad Rahman',
      phone: '+60 12-345-6789',
      vehicle: 'Honda Beat - ABC 1234',
      rating: 4.9,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: { lat: 3.1405, lng: 101.6885 }
    };

    const mockOrderDetails = {
      id: orderId,
      items: [
        { name: 'CORNMAN Classic Cup', quantity: 2, price: 'RM 15.80' },
        { name: 'Chocolate Corn Delight', quantity: 1, price: 'RM 9.50' }
      ],
      total: 'RM 25.30',
      deliveryAddress: 'Jalan Bukit Bintang, 55100 Kuala Lumpur',
      paymentMethod: 'Credit Card ****1234'
    };

    setOrderStatuses(mockOrderStatuses);
    setDriver(mockDriver);
    setOrderDetails(mockOrderDetails);

    // Simulate live updates
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
      
      // Simulate driver location updates
      setCurrentLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusProgress = () => {
    const completedCount = orderStatuses.filter(status => status.completed).length;
    return (completedCount / orderStatuses.length) * 100;
  };

  const activeStatus = orderStatuses.find(status => status.active);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[var(--neutral-900)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--neutral-800)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--neutral-900)] border-b border-[var(--neutral-800)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold neon-text">Live Order Tracking</h2>
              <p className="text-neutral-400">Order #{orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Order Progress</span>
              <span className="text-sm neon-text">{Math.round(getStatusProgress())}% Complete</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[var(--neon-green)] to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${getStatusProgress()}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Live Status */}
          {activeStatus && (
            <motion.div
              className="bg-gradient-to-r from-[var(--neon-green)]/10 to-transparent p-6 rounded-2xl border border-[var(--neon-green)]/30"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(57, 255, 20, 0.1)',
                  '0 0 30px rgba(57, 255, 20, 0.2)',
                  '0 0 20px rgba(57, 255, 20, 0.1)'
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-full neon-bg text-black flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="material-icons">{activeStatus.icon}</span>
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{activeStatus.title}</h3>
                  <p className="text-neutral-400">{activeStatus.description}</p>
                  {estimatedTime > 0 && (
                    <p className="text-sm neon-text mt-1">
                      ETA: {estimatedTime} minutes
                    </p>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-[var(--neon-green)]"
                >
                  <span className="material-icons">refresh</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Driver Information */}
          {driver && activeStatus?.id === 'dispatched' && (
            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-icons">person</span>
                Your Delivery Partner
              </h3>
              
              <div className="flex items-center gap-4">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{driver.name}</h4>
                  <p className="text-sm text-neutral-400">{driver.vehicle}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-icons text-yellow-400 text-sm">star</span>
                    <span className="text-sm">{driver.rating}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    icon={<span className="material-icons">phone</span>}
                  >
                    Call
                  </AnimatedButton>
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    icon={<span className="material-icons">chat</span>}
                  >
                    Chat
                  </AnimatedButton>
                </div>
              </div>

              {/* Live Location */}
              <div className="mt-4 p-4 bg-neutral-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Live Location</span>
                  <motion.span
                    className="text-xs px-2 py-1 neon-bg text-black rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    LIVE
                  </motion.span>
                </div>
                <div className="h-32 bg-neutral-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-green-900/30"></div>
                  <motion.div
                    className="w-4 h-4 rounded-full neon-bg"
                    animate={{
                      x: [0, 20, -10, 15],
                      y: [0, -15, 10, -5]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <p className="text-xs text-neutral-400 mt-8">
                    📍 Currently at Jalan Sultan Ismail
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Timeline */}
          <div>
            <h3 className="font-bold text-lg mb-6">Order Timeline</h3>
            <div className="space-y-4">
              {orderStatuses.map((status, index) => (
                <motion.div
                  key={status.id}
                  className={`flex items-start gap-4 ${
                    status.completed ? 'opacity-100' : status.active ? 'opacity-100' : 'opacity-50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status.completed
                        ? 'neon-bg text-black'
                        : status.active
                        ? 'border-2 border-[var(--neon-green)] text-[var(--neon-green)]'
                        : 'border-2 border-neutral-600 text-neutral-600'
                    }`}
                    animate={status.active ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="material-icons text-lg">{status.icon}</span>
                  </motion.div>
                  
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{status.title}</h4>
                      {status.timestamp && (
                        <span className="text-sm text-neutral-400">{status.timestamp}</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400 mt-1">{status.description}</p>
                    {status.estimatedTime && status.active && (
                      <p className="text-xs neon-text mt-1">Estimated: {status.estimatedTime}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          {orderDetails && (
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="neon-text">{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-neutral-700 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="neon-text">{orderDetails.total}</span>
                  </div>
                </div>
                
                <div className="text-sm text-neutral-400 space-y-1 mt-4">
                  <p><strong>Delivery:</strong> {orderDetails.deliveryAddress}</p>
                  <p><strong>Payment:</strong> {orderDetails.paymentMethod}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <AnimatedButton
              variant="secondary"
              className="flex-1"
              icon={<span className="material-icons">support_agent</span>}
            >
              Contact Support
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              className="flex-1"
              icon={<span className="material-icons">refresh</span>}
            >
              Refresh Status
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}