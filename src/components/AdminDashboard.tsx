import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  MessageSquare,
  Calendar,
  MapPin,
  Settings,
  Brain,
  Zap
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

interface AIInsight {
  type: 'warning' | 'success' | 'info' | 'prediction';
  title: string;
  description: string;
  action?: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

interface AdminMetrics {
  totalOrders: number;
  revenue: number;
  activeCustomers: number;
  avgDeliveryTime: number;
  customerSatisfaction: number;
  lowStockItems: number;
}

export function AdminDashboard({ user }: { user: any }) {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalOrders: 1247,
    revenue: 45680.50,
    activeCustomers: 892,
    avgDeliveryTime: 18,
    customerSatisfaction: 4.8,
    lowStockItems: 3
  });

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      type: 'warning',
      title: 'Inventory Alert',
      description: 'Chocolate variant running low. Recommend restocking within 2 days.',
      action: 'Reorder 500 units',
      confidence: 94,
      priority: 'high'
    },
    {
      type: 'prediction',
      title: 'Demand Forecast',
      description: 'Weekend traffic expected to increase by 35% based on historical data.',
      confidence: 87,
      priority: 'medium'
    },
    {
      type: 'success',
      title: 'Optimization Success',
      description: 'Delivery route optimization reduced avg delivery time by 12%.',
      confidence: 100,
      priority: 'low'
    },
    {
      type: 'info',
      title: 'Customer Behavior',
      description: 'Peak ordering time: 7-9PM. Consider promotional campaigns.',
      action: 'Create evening promo',
      confidence: 91,
      priority: 'medium'
    }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI admin assistant. How can I help you manage THEFMSMKT today?' },
    { role: 'user', content: 'Show me today\'s sales performance' },
    { role: 'assistant', content: 'Today\'s sales are up 23% compared to yesterday. Total revenue: RM 3,247. Top seller: Chocolate variant (67 orders). Would you like me to generate a detailed report?' }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages(prev => [...prev, 
      { role: 'user', content: newMessage },
      { role: 'assistant', content: 'Processing your request... This would connect to your AI backend service.' }
    ]);
    setNewMessage('');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'prediction': return <Brain className="w-5 h-5 text-blue-500" />;
      default: return <Zap className="w-5 h-5 text-[var(--neon-green)]" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--brand-black)] flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-[var(--neutral-400)]">Admin privileges required to access this dashboard.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-black)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                AI Admin <span className="text-[var(--neon-green)]">Dashboard</span>
              </h1>
              <p className="text-[var(--neutral-400)]">
                Intelligent management for THEFMSMKT operations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-[var(--neon-green)]" />
              <span className="px-3 py-1 bg-[var(--neon-green)]/10 text-[var(--neon-green)] rounded-full text-sm">
                AI Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[var(--neon-green)]" />
              <div>
                <p className="text-sm text-[var(--neutral-400)]">Total Orders</p>
                <p className="text-2xl font-bold text-white">{metrics.totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-[var(--neutral-400)]">Revenue</p>
                <p className="text-2xl font-bold text-white">RM {metrics.revenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-[var(--neutral-400)]">Active Customers</p>
                <p className="text-2xl font-bold text-white">{metrics.activeCustomers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-[var(--neutral-400)]">Avg Delivery</p>
                <p className="text-2xl font-bold text-white">{metrics.avgDeliveryTime}min</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-[var(--neutral-400)]">Satisfaction</p>
                <p className="text-2xl font-bold text-white">{metrics.customerSatisfaction}/5</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-[var(--neutral-400)]">Low Stock</p>
                <p className="text-2xl font-bold text-white">{metrics.lowStockItems}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {aiInsights.map((insight, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{insight.title}</h3>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-[var(--neutral-400)] mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[var(--neutral-500)]">Confidence:</span>
                          <Progress value={insight.confidence} className="w-20" />
                          <span className="text-sm text-[var(--neutral-400)]">{insight.confidence}%</span>
                        </div>
                        {insight.action && (
                          <Button size="sm" className="bg-[var(--neon-green)] text-black">
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bot className="w-8 h-8 text-[var(--neon-green)]" />
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-sm text-[var(--neutral-400)]">Ask questions about your business operations</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-[var(--neon-green)] text-black'
                          : 'bg-[var(--neutral-800)] text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your AI assistant..."
                  className="flex-1 p-3 bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg focus:border-[var(--neon-green)] focus:outline-none"
                />
                <Button onClick={handleSendMessage} className="bg-[var(--neon-green)] text-black">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-white mb-4">Real-time Orders</h3>
                <div className="space-y-3">
                  {[
                    { id: '#ORD-2024-001', customer: 'Sarah A.', status: 'preparing', time: '2 min ago' },
                    { id: '#ORD-2024-002', customer: 'Ahmad R.', status: 'out_for_delivery', time: '5 min ago' },
                    { id: '#ORD-2024-003', customer: 'Lisa T.', status: 'delivered', time: '8 min ago' }
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-[var(--neutral-800)] rounded-lg">
                      <div>
                        <p className="font-medium text-white">{order.id}</p>
                        <p className="text-sm text-[var(--neutral-400)]">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                          order.status === 'out_for_delivery' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-sm text-[var(--neutral-500)]">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-white mb-4">Inventory Alerts</h3>
                <div className="space-y-3">
                  {[
                    { item: 'Chocolate Variant', stock: 23, threshold: 50, status: 'low' },
                    { item: 'Cheddar Cheese', stock: 67, threshold: 50, status: 'ok' },
                    { item: 'Susu Pekat', stock: 12, threshold: 30, status: 'critical' }
                  ].map((item) => (
                    <div key={item.item} className="p-3 bg-[var(--neutral-800)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{item.item}</span>
                        <Badge className={
                          item.status === 'critical' ? 'bg-red-500/10 text-red-400' :
                          item.status === 'low' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-green-500/10 text-green-400'
                        }>
                          {item.stock} units
                        </Badge>
                      </div>
                      <Progress value={(item.stock / item.threshold) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-white mb-4">Automated Tasks</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Inventory Reordering', status: 'active', nextRun: '2 hours' },
                    { name: 'Customer Feedback Analysis', status: 'active', nextRun: '6 hours' },
                    { name: 'Promotional Campaign Optimization', status: 'paused', nextRun: 'Manual' },
                    { name: 'Delivery Route Optimization', status: 'active', nextRun: '30 minutes' }
                  ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[var(--neutral-800)] rounded-lg">
                      <div>
                        <p className="font-medium text-white">{task.name}</p>
                        <p className="text-sm text-[var(--neutral-400)]">Next run: {task.nextRun}</p>
                      </div>
                      <Badge className={task.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-white mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-[var(--neon-green)]" />
                      <span className="font-medium text-white">Smart Pricing</span>
                    </div>
                    <p className="text-sm text-[var(--neutral-300)] mb-3">
                      Adjust Chocolate variant price by +5% during peak hours to maximize revenue.
                    </p>
                    <Button size="sm" className="bg-[var(--neon-green)] text-black">
                      Apply Recommendation
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-white">Demand Forecast</span>
                    </div>
                    <p className="text-sm text-[var(--neutral-300)] mb-3">
                      Prepare 40% more inventory for weekend rush based on historical patterns.
                    </p>
                    <Button size="sm" variant="outline" className="border-blue-500/20 text-blue-400">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
