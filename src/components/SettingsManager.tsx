import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Save,
    RefreshCw,
    Bell,
    Shield,
    Globe,
    CreditCard,
    Truck,
    Users,
    Database,
    Mail,
    Phone,
    MapPin,
    Clock,
    DollarSign,
    Percent,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface SettingsData {
    business: {
        name: string;
        phone: string;
        email: string;
        address: {
            street: string;
            city: string;
            postcode: string;
            state: string;
            country: string;
        };
        website: string;
        description: string;
    };
    delivery: {
        radius: number;
        fee: number;
        freeDeliveryThreshold: number;
        estimatedTime: number;
        workingHours: {
            monday: { open: string; close: string; closed: boolean };
            tuesday: { open: string; close: string; closed: boolean };
            wednesday: { open: string; close: string; closed: boolean };
            thursday: { open: string; close: string; closed: boolean };
            friday: { open: string; close: string; closed: boolean };
            saturday: { open: string; close: string; closed: boolean };
            sunday: { open: string; close: string; closed: boolean };
        };
    };
    payment: {
        currency: string;
        taxRate: number;
        stripePublicKey: string;
        stripeSecretKey: string;
        localPaymentMethods: string[];
        allowCashOnDelivery: boolean;
    };
    notifications: {
        email: {
            enabled: boolean;
            smtpHost: string;
            smtpPort: number;
            smtpUser: string;
            smtpPassword: string;
            fromEmail: string;
        };
        sms: {
            enabled: boolean;
            provider: string;
            apiKey: string;
            fromNumber: string;
        };
        push: {
            enabled: boolean;
            firebaseConfig: string;
        };
    };
    loyalty: {
        enabled: boolean;
        pointsPerRinggit: number;
        pointsToRinggit: number;
        welcomePoints: number;
        birthdayPoints: number;
        referralPoints: number;
    };
    security: {
        requireEmailVerification: boolean;
        requirePhoneVerification: boolean;
        allowSocialLogin: boolean;
        sessionTimeout: number;
        maxLoginAttempts: number;
    };
}

export function SettingsManager() {
    const [settings, setSettings] = useState<SettingsData>({
        business: {
            name: 'THEFMSMKT',
            phone: '+60123456789',
            email: 'info@thefmsmkt.com',
            address: {
                street: '123 Jalan Ampang',
                city: 'Kuala Lumpur',
                postcode: '50450',
                state: 'Selangor',
                country: 'Malaysia'
            },
            website: 'https://thefmsmkt.com',
            description: 'Premium Gourmet Corn Delivery'
        },
        delivery: {
            radius: 15,
            fee: 3.00,
            freeDeliveryThreshold: 25.00,
            estimatedTime: 30,
            workingHours: {
                monday: { open: '10:00', close: '22:00', closed: false },
                tuesday: { open: '10:00', close: '22:00', closed: false },
                wednesday: { open: '10:00', close: '22:00', closed: false },
                thursday: { open: '10:00', close: '22:00', closed: false },
                friday: { open: '10:00', close: '22:00', closed: false },
                saturday: { open: '10:00', close: '22:00', closed: false },
                sunday: { open: '10:00', close: '22:00', closed: false }
            }
        },
        payment: {
            currency: 'MYR',
            taxRate: 6.0,
            stripePublicKey: '',
            stripeSecretKey: '',
            localPaymentMethods: ['fpx', 'grabpay', 'boost', 'tng'],
            allowCashOnDelivery: true
        },
        notifications: {
            email: {
                enabled: true,
                smtpHost: '',
                smtpPort: 587,
                smtpUser: '',
                smtpPassword: '',
                fromEmail: 'noreply@thefmsmkt.com'
            },
            sms: {
                enabled: true,
                provider: 'twilio',
                apiKey: '',
                fromNumber: ''
            },
            push: {
                enabled: true,
                firebaseConfig: ''
            }
        },
        loyalty: {
            enabled: true,
            pointsPerRinggit: 1,
            pointsToRinggit: 100,
            welcomePoints: 50,
            birthdayPoints: 100,
            referralPoints: 200
        },
        security: {
            requireEmailVerification: true,
            requirePhoneVerification: true,
            allowSocialLogin: true,
            sessionTimeout: 24,
            maxLoginAttempts: 5
        }
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            // Load settings from API
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving settings' });
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (path: string, value: any) => {
        setSettings(prev => {
            const newSettings = { ...prev };
            const keys = path.split('.');
            let current = newSettings;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newSettings;
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
                <span className="ml-2">Loading settings...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-8 h-8 text-green-500" />
                        Settings
                    </h1>
                    <p className="text-gray-400">Manage your application settings</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={loadSettings}
                        disabled={loading}
                        variant="outline"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                            : 'bg-red-900/20 border border-red-500/30 text-red-400'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {message.text}
                </motion.div>
            )}

            {/* Settings Tabs */}
            <Tabs defaultValue="business" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 bg-gray-800">
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Business Settings */}
                <TabsContent value="business" className="space-y-6">
                    <Card className="p-6 bg-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            Business Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="business-name">Business Name</Label>
                                    <Input
                                        id="business-name"
                                        value={settings.business.name}
                                        onChange={(e) => updateSetting('business.name', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="business-phone">Phone Number</Label>
                                    <Input
                                        id="business-phone"
                                        value={settings.business.phone}
                                        onChange={(e) => updateSetting('business.phone', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="business-email">Email Address</Label>
                                    <Input
                                        id="business-email"
                                        type="email"
                                        value={settings.business.email}
                                        onChange={(e) => updateSetting('business.email', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="business-website">Website</Label>
                                    <Input
                                        id="business-website"
                                        value={settings.business.website}
                                        onChange={(e) => updateSetting('business.website', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="business-description">Description</Label>
                                    <Textarea
                                        id="business-description"
                                        value={settings.business.description}
                                        onChange={(e) => updateSetting('business.description', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-500" />
                                Business Address
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="address-street">Street Address</Label>
                                    <Input
                                        id="address-street"
                                        value={settings.business.address.street}
                                        onChange={(e) => updateSetting('business.address.street', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address-city">City</Label>
                                    <Input
                                        id="address-city"
                                        value={settings.business.address.city}
                                        onChange={(e) => updateSetting('business.address.city', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address-postcode">Postcode</Label>
                                    <Input
                                        id="address-postcode"
                                        value={settings.business.address.postcode}
                                        onChange={(e) => updateSetting('business.address.postcode', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address-state">State</Label>
                                    <Input
                                        id="address-state"
                                        value={settings.business.address.state}
                                        onChange={(e) => updateSetting('business.address.state', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Delivery Settings */}
                <TabsContent value="delivery" className="space-y-6">
                    <Card className="p-6 bg-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-orange-500" />
                            Delivery Configuration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                                    <Input
                                        id="delivery-radius"
                                        type="number"
                                        value={settings.delivery.radius}
                                        onChange={(e) => updateSetting('delivery.radius', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="delivery-fee">Delivery Fee (RM)</Label>
                                    <Input
                                        id="delivery-fee"
                                        type="number"
                                        step="0.01"
                                        value={settings.delivery.fee}
                                        onChange={(e) => updateSetting('delivery.fee', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="free-delivery-threshold">Free Delivery Threshold (RM)</Label>
                                    <Input
                                        id="free-delivery-threshold"
                                        type="number"
                                        step="0.01"
                                        value={settings.delivery.freeDeliveryThreshold}
                                        onChange={(e) => updateSetting('delivery.freeDeliveryThreshold', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="estimated-time">Estimated Delivery Time (minutes)</Label>
                                    <Input
                                        id="estimated-time"
                                        type="number"
                                        value={settings.delivery.estimatedTime}
                                        onChange={(e) => updateSetting('delivery.estimatedTime', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    Working Hours
                                </h4>

                                {Object.entries(settings.delivery.workingHours).map(([day, hours]) => (
                                    <div key={day} className="flex items-center gap-4">
                                        <div className="w-20 text-sm font-medium capitalize">{day}</div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={!hours.closed}
                                                onCheckedChange={(checked) =>
                                                    updateSetting(`delivery.workingHours.${day}.closed`, !checked)
                                                }
                                            />
                                            {!hours.closed && (
                                                <>
                                                    <Input
                                                        type="time"
                                                        value={hours.open}
                                                        onChange={(e) => updateSetting(`delivery.workingHours.${day}.open`, e.target.value)}
                                                        className="w-24 bg-gray-700 border-gray-600"
                                                    />
                                                    <span>to</span>
                                                    <Input
                                                        type="time"
                                                        value={hours.close}
                                                        onChange={(e) => updateSetting(`delivery.workingHours.${day}.close`, e.target.value)}
                                                        className="w-24 bg-gray-700 border-gray-600"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-6">
                    <Card className="p-6 bg-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-500" />
                            Payment Configuration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        value={settings.payment.currency}
                                        onValueChange={(value) => updateSetting('payment.currency', value)}
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                            <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                                    <Input
                                        id="tax-rate"
                                        type="number"
                                        step="0.1"
                                        value={settings.payment.taxRate}
                                        onChange={(e) => updateSetting('payment.taxRate', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="cash-on-delivery"
                                        checked={settings.payment.allowCashOnDelivery}
                                        onCheckedChange={(checked) => updateSetting('payment.allowCashOnDelivery', checked)}
                                    />
                                    <Label htmlFor="cash-on-delivery">Allow Cash on Delivery</Label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="stripe-public-key">Stripe Public Key</Label>
                                    <Input
                                        id="stripe-public-key"
                                        type="password"
                                        value={settings.payment.stripePublicKey}
                                        onChange={(e) => updateSetting('payment.stripePublicKey', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                                    <Input
                                        id="stripe-secret-key"
                                        type="password"
                                        value={settings.payment.stripeSecretKey}
                                        onChange={(e) => updateSetting('payment.stripeSecretKey', e.target.value)}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="p-6 bg-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-500" />
                            Notification Settings
                        </h3>

                        <div className="space-y-6">
                            {/* Email Settings */}
                            <div>
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    Email Notifications
                                </h4>

                                <div className="flex items-center space-x-2 mb-4">
                                    <Switch
                                        id="email-enabled"
                                        checked={settings.notifications.email.enabled}
                                        onCheckedChange={(checked) => updateSetting('notifications.email.enabled', checked)}
                                    />
                                    <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                                </div>

                                {settings.notifications.email.enabled && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="smtp-host">SMTP Host</Label>
                                            <Input
                                                id="smtp-host"
                                                value={settings.notifications.email.smtpHost}
                                                onChange={(e) => updateSetting('notifications.email.smtpHost', e.target.value)}
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="smtp-port">SMTP Port</Label>
                                            <Input
                                                id="smtp-port"
                                                type="number"
                                                value={settings.notifications.email.smtpPort}
                                                onChange={(e) => updateSetting('notifications.email.smtpPort', Number(e.target.value))}
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="smtp-user">SMTP Username</Label>
                                            <Input
                                                id="smtp-user"
                                                value={settings.notifications.email.smtpUser}
                                                onChange={(e) => updateSetting('notifications.email.smtpUser', e.target.value)}
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="smtp-password">SMTP Password</Label>
                                            <Input
                                                id="smtp-password"
                                                type="password"
                                                value={settings.notifications.email.smtpPassword}
                                                onChange={(e) => updateSetting('notifications.email.smtpPassword', e.target.value)}
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Loyalty Settings */}
                <TabsContent value="loyalty" className="space-y-6">
                    <Card className="p-6 bg-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-500" />
                            Loyalty Program
                        </h3>

                        <div className="flex items-center space-x-2 mb-6">
                            <Switch
                                id="loyalty-enabled"
                                checked={settings.loyalty.enabled}
                                onCheckedChange={(checked) => updateSetting('loyalty.enabled', checked)}
                            />
                            <Label htmlFor="loyalty-enabled">Enable Loyalty Program</Label>
                        </div>

                        {settings.loyalty.enabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="points-per-ringgit">Points per Ringgit Spent</Label>
                                        <Input
                                            id="points-per-ringgit"
                                            type="number"
                                            value={settings.loyalty.pointsPerRinggit}
                                            onChange={(e) => updateSetting('loyalty.pointsPerRinggit', Number(e.target.value))}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="points-to-ringgit">Points Required for 1 Ringgit</Label>
                                        <Input
                                            id="points-to-ringgit"
                                            type="number"
                                            value={settings.loyalty.pointsToRinggit}
                                            onChange={(e) => updateSetting('loyalty.pointsToRinggit', Number(e.target.value))}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="welcome-points">Welcome Bonus Points</Label>
                                        <Input
                                            id="welcome-points"
                                            type="number"
                                            value={settings.loyalty.welcomePoints}
                                            onChange={(e) => updateSetting('loyalty.welcomePoints', Number(e.target.value))}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="referral-points">Referral Bonus Points</Label>
                                        <Input
                                            id="referral-points"
                                            type="number"
                                            value={settings.loyalty.referralPoints}
                                            onChange={(e) => updateSetting('loyalty.referralPoints', Number(e.target.value))}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="p-6 bg-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" />
                            Security Settings
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="email-verification"
                                    checked={settings.security.requireEmailVerification}
                                    onCheckedChange={(checked) => updateSetting('security.requireEmailVerification', checked)}
                                />
                                <Label htmlFor="email-verification">Require Email Verification</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="phone-verification"
                                    checked={settings.security.requirePhoneVerification}
                                    onCheckedChange={(checked) => updateSetting('security.requirePhoneVerification', checked)}
                                />
                                <Label htmlFor="phone-verification">Require Phone Verification</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="social-login"
                                    checked={settings.security.allowSocialLogin}
                                    onCheckedChange={(checked) => updateSetting('security.allowSocialLogin', checked)}
                                />
                                <Label htmlFor="social-login">Allow Social Login</Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                                    <Input
                                        id="session-timeout"
                                        type="number"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => updateSetting('security.sessionTimeout', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                                    <Input
                                        id="max-login-attempts"
                                        type="number"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={(e) => updateSetting('security.maxLoginAttempts', Number(e.target.value))}
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
