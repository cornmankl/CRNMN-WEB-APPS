import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Users,
    Package,
    TrendingUp,
    Settings,
    Bell,
    MapPin,
    Clock,
    DollarSign,
    ShoppingCart,
    Star,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    Plus,
    Filter,
    Search,
    Download,
    RefreshCw,
    Zap,
    Brain,
    Shield,
    Database,
    Server,
    Globe
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AdminMetrics {
    totalOrders: number;
    totalRevenue: number;
    activeCustomers: number;
    avgDeliveryTime: number;
    customerSatisfaction: number;
    lowStockItems: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalDrivers: number;
    activeDrivers: number;
    avgOrderValue: number;
    conversionRate: number;
    repeatCustomerRate: number;
}

interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderTime: string;
    estimatedDelivery: string;
    actualDelivery?: string;
    driverName?: string;
    driverPhone?: string;
    deliveryAddress: string;
    specialInstructions?: string;
    rating?: number;
    feedback?: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    minStock: number;
    maxStock: number;
    isActive: boolean;
    image: string;
    rating: number;
    totalOrders: number;
    lastRestocked?: string;
    supplier?: string;
    cost: number;
    profitMargin: number;
}

interface Driver {
    id: string;
    name: string;
    phone: string;
    email: string;
    licenseNumber: string;
    vehicleType: string;
    vehicleNumber: string;
    isActive: boolean;
    rating: number;
    totalDeliveries: number;
    currentLocation?: {
        lat: number;
        lng: number;
    };
    lastActive: string;
    status: 'available' | 'busy' | 'offline';
}

export function AdminDashboardEnhanced() {
    const [metrics, setMetrics] = useState<AdminMetrics>({
        totalOrders: 0,
        totalRevenue: 0,
        activeCustomers: 0,
        avgDeliveryTime: 0,
        customerSatisfaction: 0,
        lowStockItems: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        avgOrderValue: 0,
        conversionRate: 0,
        repeatCustomerRate: 0
    });

    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('today');

    // Load data on component mount
    useEffect(() => {
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Simulate API calls - replace with actual Supabase queries
            await Promise.all([
                loadMetrics(),
                loadOrders(),
                loadProducts(),
                loadDrivers()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMetrics = async () => {
        // Mock data - replace with actual Supabase queries
        setMetrics({
            totalOrders: 1247,
            totalRevenue: 45680.50,
            activeCustomers: 892,
            avgDeliveryTime: 18,
            customerSatisfaction: 4.8,
            lowStockItems: 3,
            pendingOrders: 12,
            completedOrders: 1180,
            cancelledOrders: 55,
            totalDrivers: 15,
            activeDrivers: 8,
            avgOrderValue: 36.70,
            conversionRate: 23.5,
            repeatCustomerRate: 67.8
        });
    };

    const loadOrders = async () => {
        // Mock data - replace with actual Supabase queries
        setOrders([
            {
                id: 'ORD-001',
                customerName: 'Ahmad Rahman',
                customerPhone: '+60123456789',
                items: [
                    { name: 'CORNMAN Classic Cup', quantity: 2, price: 7.90 },
                    { name: 'Chocolate Delight', quantity: 1, price: 9.50 }
                ],
                total: 25.30,
                status: 'preparing',
                paymentStatus: 'paid',
                orderTime: '2024-01-21T14:30:00Z',
                estimatedDelivery: '2024-01-21T15:00:00Z',
                deliveryAddress: '123 Jalan Ampang, Kuala Lumpur',
                specialInstructions: 'Ring doorbell twice',
                rating: 5,
                feedback: 'Excellent service!'
            },
            {
                id: 'ORD-002',
                customerName: 'Sarah Lim',
                customerPhone: '+60198765432',
                items: [
                    { name: 'Susu Pekat Classic', quantity: 3, price: 8.50 }
                ],
                total: 25.50,
                status: 'delivered',
                paymentStatus: 'paid',
                orderTime: '2024-01-21T13:15:00Z',
                estimatedDelivery: '2024-01-21T13:45:00Z',
                actualDelivery: '2024-01-21T13:42:00Z',
                driverName: 'Ali Hassan',
                driverPhone: '+60123456788',
                deliveryAddress: '456 Jalan Bukit Bintang, Kuala Lumpur',
                rating: 4
            }
        ]);
    };

    const loadProducts = async () => {
        // Mock data - replace with actual Supabase queries
        setProducts([
            {
                id: 'PROD-001',
                name: 'CORNMAN Classic Cup',
                description: 'Sweet corn + butter + cheese',
                price: 7.90,
                category: 'Classic',
                stock: 45,
                minStock: 20,
                maxStock: 100,
                isActive: true,
                image: '/images/classic-cup.jpg',
                rating: 4.8,
                totalOrders: 234,
                lastRestocked: '2024-01-20',
                supplier: 'Fresh Corn Supplier',
                cost: 3.50,
                profitMargin: 55.7
            },
            {
                id: 'PROD-002',
                name: 'Chocolate Delight',
                description: 'Sweet corn with rich chocolate sauce',
                price: 9.50,
                category: 'Dessert',
                stock: 8,
                minStock: 15,
                maxStock: 80,
                isActive: true,
                image: '/images/chocolate-delight.jpg',
                rating: 4.6,
                totalOrders: 156,
                lastRestocked: '2024-01-18',
                supplier: 'Chocolate Co.',
                cost: 4.20,
                profitMargin: 55.8
            }
        ]);
    };

    const loadDrivers = async () => {
        // Mock data - replace with actual Supabase queries
        setDrivers([
            {
                id: 'DRV-001',
                name: 'Ali Hassan',
                phone: '+60123456788',
                email: 'ali.hassan@thefmsmkt.com',
                licenseNumber: 'D1234567',
                vehicleType: 'Motorcycle',
                vehicleNumber: 'ABC1234',
                isActive: true,
                rating: 4.9,
                totalDeliveries: 234,
                currentLocation: { lat: 3.1390, lng: 101.6869 },
                lastActive: '2024-01-21T14:45:00Z',
                status: 'available'
            },
            {
                id: 'DRV-002',
                name: 'Siti Aminah',
                phone: '+60198765433',
                email: 'siti.aminah@thefmsmkt.com',
                licenseNumber: 'D2345678',
                vehicleType: 'Motorcycle',
                vehicleNumber: 'DEF5678',
                isActive: true,
                rating: 4.7,
                totalDeliveries: 189,
                lastActive: '2024-01-21T14:30:00Z',
                status: 'busy'
            }
        ]);
    };

    const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus as any } : order
        ));
    };

    const handleProductStockUpdate = (productId: string, newStock: number) => {
        setProducts(prev => prev.map(product =>
            product.id === productId ? { ...product, stock: newStock } : product
        ));
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const lowStockProducts = products.filter(product => product.stock <= product.minStock);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400">THEFMSMKT Management System</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={loadDashboardData}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                    <Card className="p-4 bg-gray-800">
                        <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-400">Total Orders</p>
                                <p className="text-2xl font-bold text-white">{metrics.totalOrders.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gray-800">
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-green-500" />
                            <div>
                                <p className="text-sm text-gray-400">Revenue</p>
                                <p className="text-2xl font-bold text-white">RM {metrics.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gray-800">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-purple-500" />
                            <div>
                                <p className="text-sm text-gray-400">Customers</p>
                                <p className="text-2xl font-bold text-white">{metrics.activeCustomers}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gray-800">
                        <div className="flex items-center gap-3">
                            <Clock className="w-8 h-8 text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-400">Avg Delivery</p>
                                <p className="text-2xl font-bold text-white">{metrics.avgDeliveryTime}min</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gray-800">
                        <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-yellow-500" />
                            <div>
                                <p className="text-sm text-gray-400">Satisfaction</p>
                                <p className="text-2xl font-bold text-white">{metrics.customerSatisfaction}/5</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gray-800">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <div>
                                <p className="text-sm text-gray-400">Low Stock</p>
                                <p className="text-2xl font-bold text-white">{metrics.lowStockItems}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="drivers">Drivers</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <Card className="p-6 bg-gray-800">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-green-500" />
                                    Recent Orders
                                </h3>
                                <div className="space-y-3">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-sm text-gray-400">{order.id} • RM {order.total}</p>
                                            </div>
                                            <Badge
                                                className={
                                                    order.status === 'delivered' ? 'bg-green-600' :
                                                        order.status === 'preparing' ? 'bg-yellow-600' :
                                                            order.status === 'cancelled' ? 'bg-red-600' : 'bg-blue-600'
                                                }
                                            >
                                                {order.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Low Stock Alert */}
                            <Card className="p-6 bg-gray-800">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    Low Stock Alert
                                </h3>
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-400">Stock: {product.stock} / Min: {product.minStock}</p>
                                            </div>
                                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                                Restock
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                    <SelectItem value="picked_up">Picked Up</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Card className="p-6 bg-gray-800">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left p-3">Order ID</th>
                                            <th className="text-left p-3">Customer</th>
                                            <th className="text-left p-3">Items</th>
                                            <th className="text-left p-3">Total</th>
                                            <th className="text-left p-3">Status</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-700">
                                                <td className="p-3 font-mono text-sm">{order.id}</td>
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{order.customerName}</p>
                                                        <p className="text-sm text-gray-400">{order.customerPhone}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm">
                                                        {order.items.map((item, index) => (
                                                            <p key={index}>{item.quantity}x {item.name}</p>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-3 font-semibold">RM {order.total}</td>
                                                <td className="p-3">
                                                    <Badge
                                                        className={
                                                            order.status === 'delivered' ? 'bg-green-600' :
                                                                order.status === 'preparing' ? 'bg-yellow-600' :
                                                                    order.status === 'cancelled' ? 'bg-red-600' : 'bg-blue-600'
                                                        }
                                                    >
                                                        {order.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Products Tab */}
                    <TabsContent value="products" className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Product Management</h3>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </div>

                        <Card className="p-6 bg-gray-800">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left p-3">Product</th>
                                            <th className="text-left p-3">Category</th>
                                            <th className="text-left p-3">Price</th>
                                            <th className="text-left p-3">Stock</th>
                                            <th className="text-left p-3">Status</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b border-gray-700">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-medium">{product.name}</p>
                                                            <p className="text-sm text-gray-400">{product.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">{product.category}</td>
                                                <td className="p-3 font-semibold">RM {product.price}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={product.stock <= product.minStock ? 'text-red-400' : 'text-white'}>
                                                            {product.stock}
                                                        </span>
                                                        {product.stock <= product.minStock && (
                                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge className={product.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                                                        {product.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Drivers Tab */}
                    <TabsContent value="drivers" className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Driver Management</h3>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Driver
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drivers.map((driver) => (
                                <Card key={driver.id} className="p-6 bg-gray-800">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-semibold text-lg">{driver.name}</h4>
                                            <p className="text-gray-400">{driver.phone}</p>
                                        </div>
                                        <Badge
                                            className={
                                                driver.status === 'available' ? 'bg-green-600' :
                                                    driver.status === 'busy' ? 'bg-yellow-600' : 'bg-gray-600'
                                            }
                                        >
                                            {driver.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Vehicle:</span>
                                            <span>{driver.vehicleType} - {driver.vehicleNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Rating:</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span>{driver.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Deliveries:</span>
                                            <span>{driver.totalDeliveries}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Last Active:</span>
                                            <span>{new Date(driver.lastActive).toLocaleTimeString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Track
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card className="p-6 bg-gray-800">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-500" />
                                System Settings
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg">Business Settings</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Business Name</label>
                                            <Input
                                                defaultValue="THEFMSMKT"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Business Phone</label>
                                            <Input
                                                defaultValue="+60123456789"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Business Address</label>
                                            <Input
                                                defaultValue="123 Jalan Ampang, Kuala Lumpur"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg">Delivery Settings</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Delivery Radius (km)</label>
                                            <Input
                                                defaultValue="15"
                                                type="number"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Delivery Fee (RM)</label>
                                            <Input
                                                defaultValue="3.00"
                                                type="number"
                                                step="0.01"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Free Delivery Threshold (RM)</label>
                                            <Input
                                                defaultValue="25.00"
                                                type="number"
                                                step="0.01"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <Button variant="outline">Cancel</Button>
                                <Button className="bg-green-600 hover:bg-green-700">Save Settings</Button>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
