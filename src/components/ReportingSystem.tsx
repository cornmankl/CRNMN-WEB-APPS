import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Clock, 
  Star, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  Zap
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';

interface ReportData {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
    orderGrowth: number;
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
      growth: number;
    }>;
    dailyRevenue: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerGrowth: number;
    averageOrderFrequency: number;
    customerLifetimeValue: number;
    topCustomers: Array<{
      name: string;
      email: string;
      totalOrders: number;
      totalSpent: number;
      lastOrder: string;
    }>;
    customerSegments: Array<{
      segment: string;
      count: number;
      percentage: number;
      averageValue: number;
    }>;
  };
  operations: {
    totalDrivers: number;
    activeDrivers: number;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    driverEfficiency: number;
    deliveryZones: Array<{
      zone: string;
      orders: number;
      averageTime: number;
      satisfaction: number;
    }>;
    peakHours: Array<{
      hour: string;
      orders: number;
      revenue: number;
    }>;
  };
  inventory: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    inventoryValue: number;
    turnoverRate: number;
    topSellingProducts: Array<{
      name: string;
      sold: number;
      revenue: number;
      stock: number;
    }>;
    slowMovingProducts: Array<{
      name: string;
      sold: number;
      stock: number;
      daysInStock: number;
    }>;
  };
  financial: {
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    costBreakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    monthlyProfit: Array<{
      month: string;
      revenue: number;
      costs: number;
      profit: number;
    }>;
  };
}

interface ReportFilters {
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  category?: string;
  driver?: string;
  product?: string;
}

export function ReportingSystem() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: 'month'
  });

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData: ReportData = {
        sales: {
          totalRevenue: 45680.50,
          totalOrders: 1247,
          averageOrderValue: 36.70,
          revenueGrowth: 23.5,
          orderGrowth: 18.2,
          topProducts: [
            { name: 'CORNMAN Classic Cup', sales: 234, revenue: 1848.60, growth: 15.2 },
            { name: 'Chocolate Delight', sales: 156, revenue: 1482.00, growth: 8.7 },
            { name: 'Susu Pekat Classic', sales: 89, revenue: 756.50, growth: -2.1 }
          ],
          dailyRevenue: [
            { date: '2024-01-15', revenue: 1250.00, orders: 34 },
            { date: '2024-01-16', revenue: 1380.50, orders: 38 },
            { date: '2024-01-17', revenue: 1420.75, orders: 41 },
            { date: '2024-01-18', revenue: 1180.25, orders: 32 },
            { date: '2024-01-19', revenue: 1650.00, orders: 45 },
            { date: '2024-01-20', revenue: 1720.30, orders: 47 },
            { date: '2024-01-21', revenue: 1580.70, orders: 43 }
          ],
          monthlyRevenue: [
            { month: 'Jan 2024', revenue: 45680.50, orders: 1247 },
            { month: 'Dec 2023', revenue: 36980.25, orders: 1054 },
            { month: 'Nov 2023', revenue: 41250.75, orders: 1189 },
            { month: 'Oct 2023', revenue: 38920.00, orders: 1123 }
          ]
        },
        customers: {
          totalCustomers: 892,
          newCustomers: 156,
          returningCustomers: 736,
          customerGrowth: 21.3,
          averageOrderFrequency: 1.4,
          customerLifetimeValue: 51.20,
          topCustomers: [
            { name: 'Ahmad Rahman', email: 'ahmad@email.com', totalOrders: 23, totalSpent: 845.50, lastOrder: '2024-01-20' },
            { name: 'Sarah Lim', email: 'sarah@email.com', totalOrders: 18, totalSpent: 672.30, lastOrder: '2024-01-19' },
            { name: 'Mohamed Ali', email: 'mohamed@email.com', totalOrders: 15, totalSpent: 589.75, lastOrder: '2024-01-18' }
          ],
          customerSegments: [
            { segment: 'New Customers', count: 156, percentage: 17.5, averageValue: 28.50 },
            { segment: 'Regular Customers', count: 456, percentage: 51.1, averageValue: 42.30 },
            { segment: 'VIP Customers', count: 280, percentage: 31.4, averageValue: 78.90 }
          ]
        },
        operations: {
          totalDrivers: 15,
          activeDrivers: 12,
          averageDeliveryTime: 18,
          onTimeDeliveryRate: 96.8,
          driverEfficiency: 94.2,
          deliveryZones: [
            { zone: 'Kuala Lumpur City', orders: 456, averageTime: 15, satisfaction: 4.8 },
            { zone: 'Ampang', orders: 234, averageTime: 22, satisfaction: 4.6 },
            { zone: 'Puchong', orders: 189, averageTime: 25, satisfaction: 4.7 },
            { zone: 'Subang', orders: 156, averageTime: 28, satisfaction: 4.5 }
          ],
          peakHours: [
            { hour: '12:00-13:00', orders: 89, revenue: 3250.00 },
            { hour: '18:00-19:00', orders: 156, revenue: 5720.50 },
            { hour: '19:00-20:00', orders: 134, revenue: 4920.75 },
            { hour: '20:00-21:00', orders: 98, revenue: 3590.25 }
          ]
        },
        inventory: {
          totalProducts: 25,
          lowStockItems: 3,
          outOfStockItems: 1,
          inventoryValue: 12580.50,
          turnoverRate: 4.2,
          topSellingProducts: [
            { name: 'CORNMAN Classic Cup', sold: 234, revenue: 1848.60, stock: 45 },
            { name: 'Chocolate Delight', sold: 156, revenue: 1482.00, stock: 8 },
            { name: 'Susu Pekat Classic', sold: 89, revenue: 756.50, stock: 0 }
          ],
          slowMovingProducts: [
            { name: 'Premium Corn Special', sold: 12, stock: 45, daysInStock: 30 },
            { name: 'Spicy Corn Delight', sold: 8, stock: 38, daysInStock: 25 }
          ]
        },
        financial: {
          totalRevenue: 45680.50,
          totalCosts: 28950.25,
          grossProfit: 16730.25,
          netProfit: 12450.75,
          profitMargin: 27.2,
          costBreakdown: [
            { category: 'Food Costs', amount: 18250.00, percentage: 63.0 },
            { category: 'Delivery Costs', amount: 4560.50, percentage: 15.7 },
            { category: 'Staff Costs', amount: 3890.75, percentage: 13.4 },
            { category: 'Marketing', amount: 1250.00, percentage: 4.3 },
            { category: 'Other', amount: 1000.00, percentage: 3.6 }
          ],
          monthlyProfit: [
            { month: 'Jan 2024', revenue: 45680.50, costs: 28950.25, profit: 16730.25 },
            { month: 'Dec 2023', revenue: 36980.25, costs: 23450.75, profit: 13529.50 },
            { month: 'Nov 2023', revenue: 41250.75, costs: 26180.50, profit: 15070.25 },
            { month: 'Oct 2023', revenue: 38920.00, costs: 24750.25, profit: 14169.75 }
          ]
        }
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
    // Implement actual export logic here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <span className="ml-2">Failed to load report data</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-green-500" />
            Reports & Analytics
          </h1>
          <p className="text-gray-400">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={loadReportData}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => exportReport('pdf')}
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={() => exportReport('excel')}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gray-800">
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="date-range">Date Range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as any }))}
            >
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filters.dateRange === 'custom' && (
            <>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-gray-800">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">RM {reportData.sales.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{reportData.sales.revenueGrowth}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-800">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{reportData.sales.totalOrders.toLocaleString()}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{reportData.sales.orderGrowth}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-800">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold text-white">{reportData.customers.totalCustomers.toLocaleString()}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{reportData.customers.customerGrowth}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-800">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-400">Avg Delivery Time</p>
                  <p className="text-2xl font-bold text-white">{reportData.operations.averageDeliveryTime}min</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {reportData.operations.onTimeDeliveryRate}% on-time
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-500" />
                Revenue Trend
              </h3>
              <div className="space-y-3">
                {reportData.sales.dailyRevenue.slice(-7).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white">RM {day.revenue.toFixed(2)}</span>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(day.revenue / Math.max(...reportData.sales.dailyRevenue.map(d => d.revenue))) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Customer Segments
              </h3>
              <div className="space-y-3">
                {reportData.customers.customerSegments.map((segment, index) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{segment.segment}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white">{segment.count} ({segment.percentage}%)</span>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Products
              </h3>
              <div className="space-y-3">
                {reportData.sales.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.sales} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">RM {product.revenue.toFixed(2)}</p>
                      <p className={`text-sm ${product.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Peak Hours
              </h3>
              <div className="space-y-3">
                {reportData.operations.peakHours.map((hour, index) => (
                  <div key={hour.hour} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{hour.hour}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white">{hour.orders} orders</span>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(hour.orders / Math.max(...reportData.operations.peakHours.map(h => h.orders))) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Customers
              </h3>
              <div className="space-y-3">
                {reportData.customers.topCustomers.map((customer, index) => (
                  <div key={customer.email} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-400">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{customer.totalOrders} orders</p>
                      <p className="text-sm text-gray-400">RM {customer.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Customer Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">New Customers</span>
                  <span className="text-lg font-semibold text-white">{reportData.customers.newCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Returning Customers</span>
                  <span className="text-lg font-semibold text-white">{reportData.customers.returningCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Average Order Frequency</span>
                  <span className="text-lg font-semibold text-white">{reportData.customers.averageOrderFrequency}x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Customer Lifetime Value</span>
                  <span className="text-lg font-semibold text-white">RM {reportData.customers.customerLifetimeValue}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Delivery Zones
              </h3>
              <div className="space-y-3">
                {reportData.operations.deliveryZones.map((zone, index) => (
                  <div key={zone.zone} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{zone.zone}</p>
                      <p className="text-sm text-gray-400">{zone.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{zone.averageTime}min avg</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-400">{zone.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Driver Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Drivers</span>
                  <span className="text-lg font-semibold text-white">
                    {reportData.operations.activeDrivers}/{reportData.operations.totalDrivers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">On-Time Delivery Rate</span>
                  <span className="text-lg font-semibold text-white">{reportData.operations.onTimeDeliveryRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Driver Efficiency</span>
                  <span className="text-lg font-semibold text-white">{reportData.operations.driverEfficiency}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Average Delivery Time</span>
                  <span className="text-lg font-semibold text-white">{reportData.operations.averageDeliveryTime}min</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                Top Selling Products
              </h3>
              <div className="space-y-3">
                {reportData.inventory.topSellingProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.sold} sold</p>
                      <p className="text-sm text-gray-400">RM {product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Slow Moving Products
              </h3>
              <div className="space-y-3">
                {reportData.inventory.slowMovingProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.sold} sold</p>
                      <p className="text-sm text-gray-400">{product.daysInStock} days in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Financial Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Revenue</span>
                  <span className="text-lg font-semibold text-white">RM {reportData.financial.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Costs</span>
                  <span className="text-lg font-semibold text-white">RM {reportData.financial.totalCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Gross Profit</span>
                  <span className="text-lg font-semibold text-green-400">RM {reportData.financial.grossProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Net Profit</span>
                  <span className="text-lg font-semibold text-green-400">RM {reportData.financial.netProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Profit Margin</span>
                  <span className="text-lg font-semibold text-green-400">{reportData.financial.profitMargin}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                {reportData.financial.costBreakdown.map((cost, index) => (
                  <div key={cost.category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{cost.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white">RM {cost.amount.toLocaleString()}</span>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${cost.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
