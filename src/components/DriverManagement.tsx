import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  Navigation,
  Calendar,
  DollarSign,
  Award,
  Shield,
  Activity,
  Zap
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleType: 'motorcycle' | 'car' | 'van';
  vehicleNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  insuranceExpiry: string;
  isVerified: boolean;
  isAvailable: boolean;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  averageDeliveryTime: number;
  completionRate: number;
  lastActive: string;
  status: 'available' | 'busy' | 'offline' | 'on_break';
  currentOrder?: {
    id: string;
    customerName: string;
    address: string;
    estimatedTime: number;
  };
  documents: {
    license: string;
    insurance: string;
    vehicle: string;
    backgroundCheck: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bankAccount: string;
  joinDate: string;
  lastDelivery: string;
  performance: {
    onTimeDeliveries: number;
    lateDeliveries: number;
    cancelledDeliveries: number;
    customerComplaints: number;
    customerPraise: number;
  };
}

interface DeliveryRoute {
  id: string;
  driverId: string;
  driverName: string;
  orders: Array<{
    id: string;
    customerName: string;
    address: string;
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  totalDistance: number;
  estimatedDuration: number;
  startTime: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('drivers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDrivers(),
        loadRoutes()
      ]);
    } catch (error) {
      console.error('Error loading driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    // Mock data - replace with actual API calls
    const mockDrivers: Driver[] = [
      {
        id: 'DRV-001',
        name: 'Ali Hassan',
        phone: '+60123456788',
        email: 'ali.hassan@thefmsmkt.com',
        licenseNumber: 'D1234567',
        licenseExpiry: '2025-12-31',
        vehicleType: 'motorcycle',
        vehicleNumber: 'ABC1234',
        vehicleModel: 'Honda Wave 125',
        vehicleColor: 'Red',
        insuranceExpiry: '2025-06-30',
        isVerified: true,
        isAvailable: true,
        currentLocation: {
          lat: 3.1390,
          lng: 101.6869,
          address: 'Jalan Ampang, Kuala Lumpur'
        },
        rating: 4.9,
        totalDeliveries: 234,
        totalEarnings: 12500.00,
        averageDeliveryTime: 18,
        completionRate: 98.5,
        lastActive: '2024-01-21T14:45:00Z',
        status: 'busy',
        currentOrder: {
          id: 'ORD-001',
          customerName: 'Ahmad Rahman',
          address: '123 Jalan Ampang, KL',
          estimatedTime: 8
        },
        documents: {
          license: 'verified',
          insurance: 'verified',
          vehicle: 'verified',
          backgroundCheck: 'verified'
        },
        emergencyContact: {
          name: 'Siti Aminah',
          phone: '+60198765433',
          relationship: 'Wife'
        },
        bankAccount: '1234567890',
        joinDate: '2023-01-15',
        lastDelivery: '2024-01-21T14:30:00Z',
        performance: {
          onTimeDeliveries: 230,
          lateDeliveries: 4,
          cancelledDeliveries: 2,
          customerComplaints: 1,
          customerPraise: 45
        }
      },
      {
        id: 'DRV-002',
        name: 'Siti Aminah',
        phone: '+60198765433',
        email: 'siti.aminah@thefmsmkt.com',
        licenseNumber: 'D2345678',
        licenseExpiry: '2025-08-15',
        vehicleType: 'motorcycle',
        vehicleNumber: 'DEF5678',
        vehicleModel: 'Yamaha Y15ZR',
        vehicleColor: 'Blue',
        insuranceExpiry: '2025-03-20',
        isVerified: true,
        isAvailable: true,
        currentLocation: {
          lat: 3.1390,
          lng: 101.6869,
          address: 'Jalan Bukit Bintang, KL'
        },
        rating: 4.7,
        totalDeliveries: 189,
        totalEarnings: 9800.00,
        averageDeliveryTime: 22,
        completionRate: 96.8,
        lastActive: '2024-01-21T14:30:00Z',
        status: 'available',
        documents: {
          license: 'verified',
          insurance: 'verified',
          vehicle: 'verified',
          backgroundCheck: 'verified'
        },
        emergencyContact: {
          name: 'Ahmad Yusuf',
          phone: '+60123456789',
          relationship: 'Brother'
        },
        bankAccount: '0987654321',
        joinDate: '2023-03-20',
        lastDelivery: '2024-01-21T13:45:00Z',
        performance: {
          onTimeDeliveries: 183,
          lateDeliveries: 6,
          cancelledDeliveries: 3,
          customerComplaints: 2,
          customerPraise: 38
        }
      },
      {
        id: 'DRV-003',
        name: 'Ahmad Yusuf',
        phone: '+60123456789',
        email: 'ahmad.yusuf@thefmsmkt.com',
        licenseNumber: 'D3456789',
        licenseExpiry: '2024-11-30',
        vehicleType: 'car',
        vehicleNumber: 'GHI9012',
        vehicleModel: 'Perodua Myvi',
        vehicleColor: 'White',
        insuranceExpiry: '2025-01-15',
        isVerified: false,
        isAvailable: false,
        currentLocation: {
          lat: 3.1390,
          lng: 101.6869,
          address: 'Jalan Puchong, Selangor'
        },
        rating: 4.5,
        totalDeliveries: 156,
        totalEarnings: 8200.00,
        averageDeliveryTime: 25,
        completionRate: 94.2,
        lastActive: '2024-01-21T12:00:00Z',
        status: 'offline',
        documents: {
          license: 'pending',
          insurance: 'verified',
          vehicle: 'verified',
          backgroundCheck: 'verified'
        },
        emergencyContact: {
          name: 'Fatimah Ali',
          phone: '+60198765432',
          relationship: 'Sister'
        },
        bankAccount: '1122334455',
        joinDate: '2023-06-10',
        lastDelivery: '2024-01-20T18:30:00Z',
        performance: {
          onTimeDeliveries: 147,
          lateDeliveries: 9,
          cancelledDeliveries: 5,
          customerComplaints: 3,
          customerPraise: 28
        }
      }
    ];
    setDrivers(mockDrivers);
  };

  const loadRoutes = async () => {
    const mockRoutes: DeliveryRoute[] = [
      {
        id: 'ROUTE-001',
        driverId: 'DRV-001',
        driverName: 'Ali Hassan',
        orders: [
          {
            id: 'ORD-001',
            customerName: 'Ahmad Rahman',
            address: '123 Jalan Ampang, KL',
            estimatedTime: 8,
            priority: 'high'
          },
          {
            id: 'ORD-002',
            customerName: 'Sarah Lim',
            address: '456 Jalan Bukit Bintang, KL',
            estimatedTime: 15,
            priority: 'medium'
          }
        ],
        totalDistance: 12.5,
        estimatedDuration: 35,
        startTime: '2024-01-21T15:00:00Z',
        status: 'in_progress'
      }
    ];
    setRoutes(mockRoutes);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-900/20';
      case 'busy': return 'text-yellow-400 bg-yellow-900/20';
      case 'offline': return 'text-red-400 bg-red-900/20';
      case 'on_break': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'busy': return <Clock className="w-4 h-4" />;
      case 'offline': return <XCircle className="w-4 h-4" />;
      case 'on_break': return <Activity className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle': return <Car className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      case 'van': return <Car className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableDrivers = drivers.filter(driver => driver.status === 'available').length;
  const busyDrivers = drivers.filter(driver => driver.status === 'busy').length;
  const offlineDrivers = drivers.filter(driver => driver.status === 'offline').length;
  const totalEarnings = drivers.reduce((sum, driver) => sum + driver.totalEarnings, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
        <span className="ml-2">Loading drivers...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-green-500" />
            Driver Management
          </h1>
          <p className="text-gray-400">Manage your delivery drivers and track their performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={loadDriverData}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Total Drivers</p>
              <p className="text-2xl font-bold text-white">{drivers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-400">Available</p>
              <p className="text-2xl font-bold text-white">{availableDrivers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Busy</p>
              <p className="text-2xl font-bold text-white">{busyDrivers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">RM {totalEarnings.toFixed(0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search drivers..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="on_break">On Break</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} className="p-6 bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{driver.name}</h4>
                      <p className="text-gray-400 text-sm">{driver.phone}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(driver.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(driver.status)}
                      {driver.status.replace('_', ' ')}
                    </div>
                  </Badge>
                </div>

                {/* Driver Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    {getVehicleIcon(driver.vehicleType)}
                    <span className="text-sm text-gray-400">
                      {driver.vehicleType} • {driver.vehicleNumber}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{driver.rating}</span>
                    <span className="text-gray-400 text-sm">({driver.totalDeliveries} deliveries)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">{driver.currentLocation.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">
                      Last active: {new Date(driver.lastActive).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <p className="text-xs text-gray-400">Completion Rate</p>
                    <p className="text-lg font-semibold text-green-400">{driver.completionRate}%</p>
                  </div>
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <p className="text-xs text-gray-400">Avg Time</p>
                    <p className="text-lg font-semibold text-blue-400">{driver.averageDeliveryTime}min</p>
                  </div>
                </div>

                {/* Current Order */}
                {driver.currentOrder && (
                  <div className="mb-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <p className="text-sm font-medium text-yellow-400">Current Order</p>
                    <p className="text-sm text-white">{driver.currentOrder.customerName}</p>
                    <p className="text-xs text-gray-400">ETA: {driver.currentOrder.estimatedTime}min</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedDriver(driver);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Track
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6">
          <Card className="p-6 bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-500" />
              Active Delivery Routes
            </h3>
            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{route.driverName}</h4>
                      <p className="text-sm text-gray-400">
                        {route.orders.length} orders • {route.totalDistance}km • {route.estimatedDuration}min
                      </p>
                    </div>
                    <Badge className={
                      route.status === 'in_progress' ? 'bg-yellow-600' :
                      route.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                    }>
                      {route.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {route.orders.map((order, index) => (
                      <div key={order.id} className="flex items-center gap-3 p-2 bg-gray-600 rounded">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{order.customerName}</p>
                          <p className="text-xs text-gray-400">{order.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{order.estimatedTime}min</p>
                          <Badge className={
                            order.priority === 'high' ? 'bg-red-600' :
                            order.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                          }>
                            {order.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {drivers
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((driver, index) => (
                    <div key={driver.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-gray-400">{driver.totalDeliveries} deliveries</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{driver.rating}</span>
                        </div>
                        <p className="text-sm text-gray-400">{driver.completionRate}% completion</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Average Rating</span>
                    <span className="text-sm text-white">
                      {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
                    </span>
                  </div>
                  <Progress 
                    value={(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length) * 20} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Average Completion Rate</span>
                    <span className="text-sm text-white">
                      {(drivers.reduce((sum, d) => sum + d.completionRate, 0) / drivers.length).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={drivers.reduce((sum, d) => sum + d.completionRate, 0) / drivers.length} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Average Delivery Time</span>
                    <span className="text-sm text-white">
                      {(drivers.reduce((sum, d) => sum + d.averageDeliveryTime, 0) / drivers.length).toFixed(0)}min
                    </span>
                  </div>
                  <Progress 
                    value={100 - (drivers.reduce((sum, d) => sum + d.averageDeliveryTime, 0) / drivers.length)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6 bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Document Verification
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">Driver</th>
                    <th className="text-left p-3">License</th>
                    <th className="text-left p-3">Insurance</th>
                    <th className="text-left p-3">Vehicle</th>
                    <th className="text-left p-3">Background Check</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-gray-700">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-gray-400">{driver.phone}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={
                          driver.documents.license === 'verified' ? 'bg-green-600' : 'bg-yellow-600'
                        }>
                          {driver.documents.license}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={
                          driver.documents.insurance === 'verified' ? 'bg-green-600' : 'bg-yellow-600'
                        }>
                          {driver.documents.insurance}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={
                          driver.documents.vehicle === 'verified' ? 'bg-green-600' : 'bg-yellow-600'
                        }>
                          {driver.documents.vehicle}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={
                          driver.documents.backgroundCheck === 'verified' ? 'bg-green-600' : 'bg-yellow-600'
                        }>
                          {driver.documents.backgroundCheck}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={driver.isVerified ? 'bg-green-600' : 'bg-red-600'}>
                          {driver.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
