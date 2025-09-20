import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    Users,
    Package,
    TrendingUp,
    Wifi,
    WifiOff,
    Server,
    Database,
    Zap,
    Bell,
    Eye,
    RefreshCw
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface SystemStatus {
    online: boolean;
    lastUpdate: string;
    uptime: string;
    responseTime: number;
    errorRate: number;
    activeUsers: number;
    totalRequests: number;
    databaseConnections: number;
    memoryUsage: number;
    cpuUsage: number;
}

interface Alert {
    id: string;
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
    resolved: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

interface LiveOrder {
    id: string;
    customerName: string;
    status: string;
    location: {
        lat: number;
        lng: number;
    };
    driverName: string;
    estimatedTime: number;
    lastUpdate: string;
}

interface DriverLocation {
    id: string;
    name: string;
    status: 'available' | 'busy' | 'offline';
    location: {
        lat: number;
        lng: number;
    };
    lastActive: string;
    currentOrder?: string;
}

export function RealTimeMonitoring() {
    const [systemStatus, setSystemStatus] = useState<SystemStatus>({
        online: true,
        lastUpdate: new Date().toISOString(),
        uptime: '99.9%',
        responseTime: 120,
        errorRate: 0.1,
        activeUsers: 0,
        totalRequests: 0,
        databaseConnections: 0,
        memoryUsage: 0,
        cpuUsage: 0
    });

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
    const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
    const [isConnected, setIsConnected] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        // Simulate real-time data updates
        const interval = setInterval(() => {
            updateSystemStatus();
            updateLiveOrders();
            updateDriverLocations();
            setLastRefresh(new Date());
        }, 5000); // Update every 5 seconds

        // Initial load
        loadInitialData();

        return () => clearInterval(interval);
    }, []);

    const loadInitialData = async () => {
        try {
            // Simulate API calls
            await Promise.all([
                loadSystemStatus(),
                loadAlerts(),
                loadLiveOrders(),
                loadDriverLocations()
            ]);
        } catch (error) {
            console.error('Error loading monitoring data:', error);
            setIsConnected(false);
        }
    };

    const loadSystemStatus = async () => {
        // Mock system status data
        setSystemStatus({
            online: true,
            lastUpdate: new Date().toISOString(),
            uptime: '99.9%',
            responseTime: Math.floor(Math.random() * 200) + 50,
            errorRate: Math.random() * 0.5,
            activeUsers: Math.floor(Math.random() * 100) + 50,
            totalRequests: Math.floor(Math.random() * 1000) + 5000,
            databaseConnections: Math.floor(Math.random() * 20) + 10,
            memoryUsage: Math.floor(Math.random() * 30) + 40,
            cpuUsage: Math.floor(Math.random() * 20) + 10
        });
    };

    const loadAlerts = async () => {
        // Mock alerts data
        const mockAlerts: Alert[] = [
            {
                id: '1',
                type: 'warning',
                title: 'High Memory Usage',
                message: 'Server memory usage is at 85%',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                resolved: false,
                severity: 'medium'
            },
            {
                id: '2',
                type: 'error',
                title: 'Database Connection Failed',
                message: 'Failed to connect to primary database',
                timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
                resolved: true,
                severity: 'high'
            },
            {
                id: '3',
                type: 'info',
                title: 'New Driver Registered',
                message: 'Ali Hassan has completed registration',
                timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                resolved: false,
                severity: 'low'
            }
        ];
        setAlerts(mockAlerts);
    };

    const loadLiveOrders = async () => {
        // Mock live orders data
        const mockOrders: LiveOrder[] = [
            {
                id: 'ORD-001',
                customerName: 'Ahmad Rahman',
                status: 'in_transit',
                location: { lat: 3.1390, lng: 101.6869 },
                driverName: 'Ali Hassan',
                estimatedTime: 8,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'ORD-002',
                customerName: 'Sarah Lim',
                status: 'preparing',
                location: { lat: 3.1390, lng: 101.6869 },
                driverName: 'Siti Aminah',
                estimatedTime: 15,
                lastUpdate: new Date().toISOString()
            }
        ];
        setLiveOrders(mockOrders);
    };

    const loadDriverLocations = async () => {
        // Mock driver locations data
        const mockDrivers: DriverLocation[] = [
            {
                id: 'DRV-001',
                name: 'Ali Hassan',
                status: 'busy',
                location: { lat: 3.1390, lng: 101.6869 },
                lastActive: new Date().toISOString(),
                currentOrder: 'ORD-001'
            },
            {
                id: 'DRV-002',
                name: 'Siti Aminah',
                status: 'available',
                location: { lat: 3.1390, lng: 101.6869 },
                lastActive: new Date().toISOString()
            },
            {
                id: 'DRV-003',
                name: 'Ahmad Yusuf',
                status: 'offline',
                location: { lat: 3.1390, lng: 101.6869 },
                lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            }
        ];
        setDriverLocations(mockDrivers);
    };

    const updateSystemStatus = () => {
        setSystemStatus(prev => ({
            ...prev,
            responseTime: Math.floor(Math.random() * 200) + 50,
            errorRate: Math.random() * 0.5,
            activeUsers: Math.floor(Math.random() * 100) + 50,
            totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
            memoryUsage: Math.floor(Math.random() * 30) + 40,
            cpuUsage: Math.floor(Math.random() * 20) + 10,
            lastUpdate: new Date().toISOString()
        }));
    };

    const updateLiveOrders = () => {
        setLiveOrders(prev => prev.map(order => ({
            ...order,
            estimatedTime: Math.max(0, order.estimatedTime - 1),
            lastUpdate: new Date().toISOString()
        })));
    };

    const updateDriverLocations = () => {
        setDriverLocations(prev => prev.map(driver => ({
            ...driver,
            location: {
                lat: driver.location.lat + (Math.random() - 0.5) * 0.001,
                lng: driver.location.lng + (Math.random() - 0.5) * 0.001
            },
            lastActive: new Date().toISOString()
        })));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'text-green-400';
            case 'busy': return 'text-yellow-400';
            case 'offline': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'error': return 'text-red-400 bg-red-900/20';
            case 'warning': return 'text-yellow-400 bg-yellow-900/20';
            case 'info': return 'text-blue-400 bg-blue-900/20';
            case 'success': return 'text-green-400 bg-green-900/20';
            default: return 'text-gray-400 bg-gray-900/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-8 h-8 text-green-500" />
                        Real-Time Monitoring
                    </h1>
                    <p className="text-gray-400">Live system status and monitoring</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <Wifi className="w-5 h-5 text-green-500" />
                        ) : (
                            <WifiOff className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm text-gray-400">
                            Last updated: {lastRefresh.toLocaleTimeString()}
                        </span>
                    </div>
                    <Button
                        onClick={loadInitialData}
                        disabled={!isConnected}
                        variant="outline"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gray-800">
                    <div className="flex items-center gap-3">
                        <Server className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-400">System Status</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${systemStatus.online ? 'bg-green-500' : 'bg-red-500'}`} />
                                <p className="text-lg font-semibold text-white">
                                    {systemStatus.online ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-gray-800">
                    <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-400">Response Time</p>
                            <p className="text-lg font-semibold text-white">{systemStatus.responseTime}ms</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-gray-800">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-purple-500" />
                        <div>
                            <p className="text-sm text-gray-400">Active Users</p>
                            <p className="text-lg font-semibold text-white">{systemStatus.activeUsers}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-gray-800">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-400">Total Requests</p>
                            <p className="text-lg font-semibold text-white">{systemStatus.totalRequests.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-gray-800">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-500" />
                        System Performance
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">CPU Usage</span>
                                <span className="text-sm text-white">{systemStatus.cpuUsage}%</span>
                            </div>
                            <Progress value={systemStatus.cpuUsage} className="h-2" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Memory Usage</span>
                                <span className="text-sm text-white">{systemStatus.memoryUsage}%</span>
                            </div>
                            <Progress value={systemStatus.memoryUsage} className="h-2" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Error Rate</span>
                                <span className="text-sm text-white">{systemStatus.errorRate.toFixed(2)}%</span>
                            </div>
                            <Progress value={systemStatus.errorRate} className="h-2" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gray-800">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-yellow-500" />
                        Recent Alerts
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        <AnimatePresence>
                            {alerts.map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold">{alert.title}</h4>
                                                <Badge
                                                    className={
                                                        alert.severity === 'critical' ? 'bg-red-600' :
                                                            alert.severity === 'high' ? 'bg-orange-600' :
                                                                alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                                                    }
                                                >
                                                    {alert.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-300">{alert.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {alert.resolved ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>
            </div>

            {/* Live Orders and Drivers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-gray-800">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-500" />
                        Live Orders
                    </h3>

                    <div className="space-y-3">
                        {liveOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">{order.id}</h4>
                                    <Badge className="bg-blue-600">{order.status.replace('_', ' ')}</Badge>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{order.customerName}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Driver: {order.driverName}</span>
                                    <span className="text-green-400">ETA: {order.estimatedTime}min</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 bg-gray-800">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        Driver Locations
                    </h3>

                    <div className="space-y-3">
                        {driverLocations.map((driver) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">{driver.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${driver.status === 'available' ? 'bg-green-500' :
                                                driver.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} />
                                        <span className={`text-sm ${getStatusColor(driver.status)}`}>
                                            {driver.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">
                                    <p>Location: {driver.location.lat.toFixed(4)}, {driver.location.lng.toFixed(4)}</p>
                                    {driver.currentOrder && (
                                        <p>Current Order: {driver.currentOrder}</p>
                                    )}
                                    <p>Last Active: {new Date(driver.lastActive).toLocaleTimeString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
