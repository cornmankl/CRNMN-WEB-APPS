import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Settings, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  deliveryReminders: boolean;
  newProducts: boolean;
  loyaltyRewards: boolean;
}

interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  timestamp: number;
  type: 'order' | 'promotion' | 'delivery' | 'product' | 'loyalty';
  read: boolean;
  data?: any;
}

interface PushNotificationManagerProps {
  user: any;
}

export function PushNotificationManager({ user }: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: true,
    deliveryReminders: true,
    newProducts: false,
    loyaltyRewards: true
  });
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkNotificationSupport();
    loadSettings();
    loadNotifications();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('thefmsmkt-notification-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('thefmsmkt-notification-settings', JSON.stringify(newSettings));
  };

  const loadNotifications = () => {
    const saved = localStorage.getItem('thefmsmkt-notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  };

  const saveNotifications = (newNotifications: NotificationMessage[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('thefmsmkt-notifications', JSON.stringify(newNotifications));
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
        toast.success('Notifications enabled! You\'ll receive updates about your orders.');
      } else {
        toast.error('Notifications denied. You can enable them in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications.');
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // In production, use your actual VAPID public key
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(subscription);
      
      // Send subscription to your server
      await sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      // Send to your backend to store the subscription
      const response = await fetch('/api/subscribe-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId: user?.id,
          settings
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const addNotification = (notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationMessage = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50); // Keep last 50
    saveNotifications(updatedNotifications);

    // Show browser notification if permitted
    if (permission === 'granted' && shouldShowNotification(notification.type)) {
      showBrowserNotification(newNotification);
    }
  };

  const shouldShowNotification = (type: NotificationMessage['type']): boolean => {
    switch (type) {
      case 'order': return settings.orderUpdates;
      case 'promotion': return settings.promotions;
      case 'delivery': return settings.deliveryReminders;
      case 'product': return settings.newProducts;
      case 'loyalty': return settings.loyaltyRewards;
      default: return true;
    }
  };

  const showBrowserNotification = (notification: NotificationMessage) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icon-192x192.png',
          image: notification.image,
          badge: '/icon-96x96.png',
          data: notification.data,
          requireInteraction: notification.type === 'order',
          actions: [
            {
              action: 'view',
              title: 'View Details',
              icon: '/icon-96x96.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ],
          tag: notification.type,
          vibrate: [200, 100, 200]
        });
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    saveNotifications(updatedNotifications);
  };

  const clearNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const getNotificationIcon = (type: NotificationMessage['type']) => {
    switch (type) {
      case 'order': return '📦';
      case 'promotion': return '🎉';
      case 'delivery': return '🚚';
      case 'product': return '🆕';
      case 'loyalty': return '🏆';
      default: return '🔔';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Demo function to simulate notifications
  const sendTestNotification = () => {
    const testNotifications = [
      {
        title: 'Order Update',
        body: 'Your Chocolate Corn Delight is being prepared!',
        type: 'order' as const
      },
      {
        title: 'Special Promotion',
        body: '20% off on all weekend orders! Use code WEEKEND20',
        type: 'promotion' as const
      },
      {
        title: 'Delivery Update',
        body: 'Your order will arrive in 15 minutes',
        type: 'delivery' as const
      },
      {
        title: 'New Product Alert',
        body: 'Try our new Spicy Jalapeño Corn flavor!',
        type: 'product' as const
      },
      {
        title: 'Loyalty Reward',
        body: 'You earned 50 points! Redeem for free corn.',
        type: 'loyalty' as const
      }
    ];

    const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
    addNotification(randomNotification);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        onClick={() => setShowSettings(!showSettings)}
        variant="ghost"
        size="sm"
        className="relative p-2"
      >
        {permission === 'granted' ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center p-0 bg-[var(--neon-green)] text-black text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 z-50"
          >
            <Card className="p-4 bg-[var(--neutral-900)] border-[var(--neutral-800)] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={sendTestNotification}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Test
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isSupported ? (
                <div className="text-center py-4">
                  <BellOff className="w-8 h-8 text-[var(--neutral-500)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--neutral-400)]">
                    Push notifications are not supported in this browser
                  </p>
                </div>
              ) : permission === 'default' || permission === 'denied' ? (
                <div className="text-center py-4">
                  <Bell className="w-8 h-8 text-[var(--neutral-500)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--neutral-400)] mb-3">
                    Enable notifications to get updates about your orders
                  </p>
                  <Button
                    onClick={requestPermission}
                    size="sm"
                    className="bg-[var(--neon-green)] text-black"
                  >
                    Enable Notifications
                  </Button>
                </div>
              ) : (
                <div>
                  {/* Notification Settings */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Order Updates</span>
                      <Switch
                        checked={settings.orderUpdates}
                        onCheckedChange={(checked) => 
                          saveSettings({ ...settings, orderUpdates: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Promotions</span>
                      <Switch
                        checked={settings.promotions}
                        onCheckedChange={(checked) => 
                          saveSettings({ ...settings, promotions: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Delivery Reminders</span>
                      <Switch
                        checked={settings.deliveryReminders}
                        onCheckedChange={(checked) => 
                          saveSettings({ ...settings, deliveryReminders: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">New Products</span>
                      <Switch
                        checked={settings.newProducts}
                        onCheckedChange={(checked) => 
                          saveSettings({ ...settings, newProducts: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Loyalty Rewards</span>
                      <Switch
                        checked={settings.loyaltyRewards}
                        onCheckedChange={(checked) => 
                          saveSettings({ ...settings, loyaltyRewards: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* Recent Notifications */}
                  <div className="border-t border-[var(--neutral-800)] pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white">Recent</span>
                      {notifications.length > 0 && (
                        <Button
                          onClick={clearAllNotifications}
                          size="sm"
                          variant="ghost"
                          className="text-xs text-[var(--neutral-400)]"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[var(--neutral-500)] text-center py-4">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`
                              p-3 rounded-lg border transition-colors cursor-pointer
                              ${notification.read 
                                ? 'bg-[var(--neutral-800)] border-[var(--neutral-700)]' 
                                : 'bg-[var(--neon-green)]/5 border-[var(--neon-green)]/20'
                              }
                            `}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">
                                    {getNotificationIcon(notification.type)}
                                  </span>
                                  <span className="text-sm font-medium text-white truncate">
                                    {notification.title}
                                  </span>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-[var(--neutral-400)] line-clamp-2">
                                  {notification.body}
                                </p>
                                <p className="text-xs text-[var(--neutral-500)] mt-1">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
