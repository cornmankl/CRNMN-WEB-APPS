import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, CheckCircle, Truck, Utensils, Star, Phone, MessageCircle } from 'lucide-react';
import { useActionHaptics } from '../hooks/useHapticFeedback';

interface OrderStatus {
  id: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivered';
  estimatedTime: number;
  location: {
    lat: number;
    lng: number;
  };
  driver?: {
    name: string;
    phone: string;
    rating: number;
    photo: string;
  };
  timeline: Array<{
    status: string;
    timestamp: Date;
    description: string;
  }>;
}

interface LiveOrderTrackingProps {
  order: OrderStatus | null;
  onClose: () => void;
  isOpen: boolean;
}

export function LiveOrderTracking({ order, onClose, isOpen }: LiveOrderTrackingProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { hapticSuccess, hapticLight } = useActionHaptics();

  useEffect(() => {
    if (isOpen && order) {
      // Update time every second
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      // Simulate live updates
      const liveUpdateInterval = setInterval(() => {
        hapticLight();
      }, 30000); // Every 30 seconds

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearInterval(liveUpdateInterval);
      };
    }
  }, [isOpen, order, hapticLight]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Utensils className="w-5 h-5 text-orange-400" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'picked_up':
        return <Truck className="w-5 h-5 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'border-orange-400 bg-orange-400/10';
      case 'ready':
        return 'border-green-400 bg-green-400/10';
      case 'picked_up':
        return 'border-blue-400 bg-blue-400/10';
      case 'delivered':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-400 bg-gray-400/10';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const callDriver = () => {
    if (order?.driver?.phone) {
      window.open(`tel:${order.driver.phone}`);
      hapticSuccess();
    }
  };

  const messageDriver = () => {
    if (order?.driver?.phone) {
      window.open(`sms:${order.driver.phone}`);
      hapticSuccess();
    }
  };

  if (!order) return null;

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
          <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <h2 className="text-white font-semibold">Live Order Tracking</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Order Status */}
          <div className="p-4 bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">Order #{order.id}</h3>
                <p className="text-gray-400 text-sm">
                  Estimated delivery: {formatTime(order.estimatedTime)}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                <span className="text-white text-sm font-medium capitalize">
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <motion.div
                className="bg-green-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: order.status === 'preparing' ? '25%' :
                    order.status === 'ready' ? '50%' :
                      order.status === 'picked_up' ? '75%' : '100%'
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {order.timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.description}</p>
                    <p className="text-gray-400 text-xs">
                      {item.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Driver Info */}
          {order.driver && (
            <div className="p-4 bg-gray-900/30">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Your Driver
              </h4>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={order.driver.photo}
                  alt={order.driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-white font-medium">{order.driver.name}</h5>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-sm">{order.driver.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                  onClick={callDriver}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </motion.button>

                <motion.button
                  className="flex-1 bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                  onClick={messageDriver}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </motion.button>
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div className="flex-1 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Live map view would be here</p>
              <p className="text-sm">Location: {order.location.lat}, {order.location.lng}</p>
            </div>
          </div>

          {/* Live Updates Indicator */}
          <div className="p-4 bg-black/80 backdrop-blur-sm border-t border-gray-800">
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live updates every 30 seconds</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}