import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  Truck,
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

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  profitMargin: number;
  lastRestocked: string;
  supplier: string;
  sku: string;
  barcode: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  totalValue: number;
  monthlySales: number;
  turnoverRate: number;
  lastUpdated: string;
}

interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'waste' | 'return' | 'transfer';
  quantity: number;
  reason: string;
  reference: string;
  user: string;
  timestamp: string;
  notes: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  totalOrders: number;
  lastOrder: string;
  isActive: boolean;
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadInventory(),
        loadInventoryLogs(),
        loadSuppliers()
      ]);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    // Mock data - replace with actual API calls
    const mockInventory: InventoryItem[] = [
      {
        id: 'INV-001',
        productId: 'PROD-001',
        productName: 'CORNMAN Classic Cup',
        category: 'Classic',
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        reorderPoint: 25,
        unitCost: 3.50,
        sellingPrice: 7.90,
        profitMargin: 55.7,
        lastRestocked: '2024-01-20',
        supplier: 'Fresh Corn Supplier',
        sku: 'CC-001',
        barcode: '1234567890123',
        location: 'A-01-01',
        status: 'in_stock',
        totalValue: 157.50,
        monthlySales: 234,
        turnoverRate: 5.2,
        lastUpdated: '2024-01-21T10:30:00Z'
      },
      {
        id: 'INV-002',
        productId: 'PROD-002',
        productName: 'Chocolate Delight',
        category: 'Dessert',
        currentStock: 8,
        minStock: 15,
        maxStock: 80,
        reorderPoint: 20,
        unitCost: 4.20,
        sellingPrice: 9.50,
        profitMargin: 55.8,
        lastRestocked: '2024-01-18',
        supplier: 'Chocolate Co.',
        sku: 'CD-001',
        barcode: '1234567890124',
        location: 'A-01-02',
        status: 'low_stock',
        totalValue: 33.60,
        monthlySales: 156,
        turnoverRate: 19.5,
        lastUpdated: '2024-01-21T10:30:00Z'
      },
      {
        id: 'INV-003',
        productId: 'PROD-003',
        productName: 'Susu Pekat Classic',
        category: 'Traditional',
        currentStock: 0,
        minStock: 10,
        maxStock: 60,
        reorderPoint: 15,
        unitCost: 2.80,
        sellingPrice: 8.50,
        profitMargin: 67.1,
        lastRestocked: '2024-01-15',
        supplier: 'Traditional Foods Ltd',
        sku: 'SPC-001',
        barcode: '1234567890125',
        location: 'A-02-01',
        status: 'out_of_stock',
        totalValue: 0,
        monthlySales: 89,
        turnoverRate: 0,
        lastUpdated: '2024-01-21T10:30:00Z'
      }
    ];
    setInventory(mockInventory);
  };

  const loadInventoryLogs = async () => {
    const mockLogs: InventoryLog[] = [
      {
        id: 'LOG-001',
        productId: 'PROD-001',
        productName: 'CORNMAN Classic Cup',
        type: 'in',
        quantity: 50,
        reason: 'Restock',
        reference: 'PO-2024-001',
        user: 'Admin User',
        timestamp: '2024-01-20T14:30:00Z',
        notes: 'Monthly restock from supplier'
      },
      {
        id: 'LOG-002',
        productId: 'PROD-002',
        productName: 'Chocolate Delight',
        type: 'out',
        quantity: 5,
        reason: 'Order Fulfillment',
        reference: 'ORD-001',
        user: 'System',
        timestamp: '2024-01-21T09:15:00Z',
        notes: 'Order processed'
      },
      {
        id: 'LOG-003',
        productId: 'PROD-003',
        productName: 'Susu Pekat Classic',
        type: 'waste',
        quantity: 2,
        reason: 'Expired',
        reference: 'WASTE-001',
        user: 'Staff',
        timestamp: '2024-01-21T08:00:00Z',
        notes: 'Items past expiration date'
      }
    ];
    setLogs(mockLogs);
  };

  const loadSuppliers = async () => {
    const mockSuppliers: Supplier[] = [
      {
        id: 'SUP-001',
        name: 'Fresh Corn Supplier',
        contact: 'Ahmad Rahman',
        email: 'ahmad@freshcorn.com',
        phone: '+60123456789',
        address: '123 Jalan Tani, Selangor',
        rating: 4.8,
        totalOrders: 45,
        lastOrder: '2024-01-20',
        isActive: true
      },
      {
        id: 'SUP-002',
        name: 'Chocolate Co.',
        contact: 'Sarah Lim',
        email: 'sarah@chocolateco.com',
        phone: '+60198765432',
        address: '456 Jalan Coklat, KL',
        rating: 4.5,
        totalOrders: 23,
        lastOrder: '2024-01-18',
        isActive: true
      }
    ];
    setSuppliers(mockSuppliers);
  };

  const handleStockAdjustment = (itemId: string, adjustment: number, reason: string) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            currentStock: Math.max(0, item.currentStock + adjustment),
            status: getUpdatedStatus(item.currentStock + adjustment, item.minStock),
            lastUpdated: new Date().toISOString()
          }
        : item
    ));

    // Add to logs
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const newLog: InventoryLog = {
        id: `LOG-${Date.now()}`,
        productId: item.productId,
        productName: item.productName,
        type: adjustment > 0 ? 'in' : 'out',
        quantity: Math.abs(adjustment),
        reason,
        reference: `ADJ-${Date.now()}`,
        user: 'Admin User',
        timestamp: new Date().toISOString(),
        notes: `Stock adjustment: ${adjustment > 0 ? '+' : ''}${adjustment}`
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const getUpdatedStatus = (currentStock: number, minStock: number): 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' => {
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= minStock) return 'low_stock';
    return 'in_stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-400 bg-green-900/20';
      case 'low_stock': return 'text-yellow-400 bg-yellow-900/20';
      case 'out_of_stock': return 'text-red-400 bg-red-900/20';
      case 'discontinued': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="w-4 h-4" />;
      case 'low_stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out_of_stock': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock');
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = inventory.length;
  const inStockItems = inventory.filter(item => item.status === 'in_stock').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
        <span className="ml-2">Loading inventory...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-green-500" />
            Inventory Management
          </h1>
          <p className="text-gray-400">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={loadInventoryData}
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
            Add Product
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-white">{totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-400">In Stock</p>
              <p className="text-2xl font-bold text-white">{inStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-white">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">RM {totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Low Stock Alert
              </h3>
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-400">Stock: {item.currentStock} / Min: {item.minStock}</p>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Selling Products */}
            <Card className="p-6 bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Selling Products
              </h3>
              <div className="space-y-3">
                {inventory
                  .sort((a, b) => b.monthlySales - a.monthlySales)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-400">{item.monthlySales} sold this month</p>
                      </div>
                      <Badge className="bg-green-600">{item.turnoverRate.toFixed(1)}x</Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
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
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Classic">Classic</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Traditional">Traditional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Card className="p-6 bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">SKU</th>
                    <th className="text-left p-3">Stock</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Value</th>
                    <th className="text-left p-3">Sales</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-400">{item.category}</p>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-sm">{item.sku}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={item.currentStock <= item.minStock ? 'text-red-400' : 'text-white'}>
                            {item.currentStock}
                          </span>
                          <span className="text-gray-400">/ {item.maxStock}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              item.currentStock <= item.minStock ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(item.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status.replace('_', ' ')}
                          </div>
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold">RM {item.totalValue.toFixed(2)}</td>
                      <td className="p-3">
                        <div className="text-sm">
                          <p>{item.monthlySales} this month</p>
                          <p className="text-gray-400">{item.turnoverRate.toFixed(1)}x turnover</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowAdjustModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
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

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="p-6 bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Inventory Logs
            </h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.type === 'in' ? 'bg-green-900/20 text-green-400' :
                      log.type === 'out' ? 'bg-red-900/20 text-red-400' :
                      log.type === 'adjustment' ? 'bg-blue-900/20 text-blue-400' :
                      'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {log.type === 'in' ? <Plus className="w-5 h-5" /> :
                       log.type === 'out' ? <Minus className="w-5 h-5" /> :
                       <Edit className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{log.productName}</p>
                      <p className="text-sm text-gray-400">{log.reason} • {log.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {log.type === 'in' ? '+' : log.type === 'out' ? '-' : '±'}{log.quantity}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Suppliers</h3>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-6 bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{supplier.name}</h4>
                    <p className="text-gray-400">{supplier.contact}</p>
                  </div>
                  <Badge className={supplier.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                    {supplier.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{supplier.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orders:</span>
                    <span>{supplier.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Order:</span>
                    <span>{supplier.lastOrder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
