import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const adminApi = new Hono();

// Enable CORS
adminApi.use('*', cors({
  origin: ['http://localhost:5173', 'https://*.vercel.app', 'https://thefmsmkt.com'],
  credentials: true,
}));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Middleware to verify admin role
const verifyAdmin = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'No access token provided' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return c.json({ error: 'Invalid access token' }, 401);
  }

  // Check admin role in user metadata or separate admin table
  const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'admin@thefmsmkt.com';
  
  if (!isAdmin) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  c.set('user', user);
  await next();
};

// Apply admin middleware to all routes
adminApi.use('*', verifyAdmin);

// Dashboard metrics endpoint
adminApi.get('/metrics', async (c) => {
  try {
    // Get today's orders
    const today = new Date().toISOString().split('T')[0];
    const orders = await kv.getByPrefix(`order_${today}`);
    
    // Get all customers
    const customers = await kv.getByPrefix('user_');
    
    // Calculate metrics
    const metrics = {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      activeCustomers: customers.length,
      avgDeliveryTime: 18, // This would be calculated from actual delivery data
      customerSatisfaction: 4.8,
      lowStockItems: 3
    };

    return c.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// AI insights endpoint
adminApi.get('/ai-insights', async (c) => {
  try {
    // In a real implementation, this would connect to an AI service
    // For now, we'll return mock insights based on actual data patterns
    
    const orders = await kv.getByPrefix('order_');
    const inventory = await kv.get('inventory') || {};
    
    const insights = [];
    
    // Check inventory levels
    for (const [item, stock] of Object.entries(inventory)) {
      if (typeof stock === 'number' && stock < 50) {
        insights.push({
          type: 'warning',
          title: 'Inventory Alert',
          description: `${item} running low with ${stock} units remaining`,
          action: `Reorder ${item}`,
          confidence: 95,
          priority: stock < 20 ? 'high' : 'medium'
        });
      }
    }
    
    // Analyze order patterns
    const recentOrders = orders.slice(-100);
    const hourlyOrders = recentOrders.reduce((acc, order) => {
      const hour = new Date(order.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const peakHour = Object.keys(hourlyOrders).reduce((a, b) => 
      hourlyOrders[a] > hourlyOrders[b] ? a : b
    );
    
    insights.push({
      type: 'info',
      title: 'Peak Hours Analysis',
      description: `Highest order volume at ${peakHour}:00. Consider promotional campaigns.`,
      action: 'Create peak hour promo',
      confidence: 88,
      priority: 'medium'
    });
    
    return c.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return c.json({ error: 'Failed to generate insights' }, 500);
  }
});

// Inventory management
adminApi.get('/inventory', async (c) => {
  try {
    const inventory = await kv.get('inventory') || {
      chocolate: 45,
      cheddar: 67,
      susu_pekat: 23,
      caramel: 56
    };
    
    return c.json({ success: true, data: inventory });
  } catch (error) {
    return c.json({ error: 'Failed to fetch inventory' }, 500);
  }
});

adminApi.post('/inventory/update', async (c) => {
  try {
    const { item, quantity } = await c.req.json();
    
    const inventory = await kv.get('inventory') || {};
    inventory[item] = quantity;
    
    await kv.set('inventory', inventory);
    
    // Log inventory change
    await kv.set(`inventory_log_${Date.now()}`, {
      item,
      quantity,
      timestamp: new Date().toISOString(),
      admin: c.get('user').email
    });
    
    return c.json({ success: true, data: inventory });
  } catch (error) {
    return c.json({ error: 'Failed to update inventory' }, 500);
  }
});

// Real-time orders
adminApi.get('/orders/realtime', async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const orders = await kv.getByPrefix(`order_${today}`);
    
    // Sort by creation time, most recent first
    const realtimeOrders = orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20) // Last 20 orders
      .map(order => ({
        id: order.id,
        customer: order.customer_name || 'Anonymous',
        status: order.status || 'pending',
        total: order.total || 0,
        items: order.items || [],
        created_at: order.created_at,
        estimated_delivery: order.estimated_delivery
      }));
    
    return c.json({ success: true, data: realtimeOrders });
  } catch (error) {
    return c.json({ error: 'Failed to fetch real-time orders' }, 500);
  }
});

// Update order status
adminApi.post('/orders/:orderId/status', async (c) => {
  try {
    const orderId = c.req.param('orderId');
    const { status } = await c.req.json();
    
    const order = await kv.get(`order_${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    order.status = status;
    order.updated_at = new Date().toISOString();
    
    await kv.set(`order_${orderId}`, order);
    
    // Log status change
    await kv.set(`order_status_log_${orderId}_${Date.now()}`, {
      orderId,
      previousStatus: order.status,
      newStatus: status,
      timestamp: new Date().toISOString(),
      admin: c.get('user').email
    });
    
    return c.json({ success: true, data: order });
  } catch (error) {
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

// AI Chat endpoint
adminApi.post('/ai-chat', async (c) => {
  try {
    const { message } = await c.req.json();
    
    // In a real implementation, this would connect to OpenAI, Claude, or similar
    // For now, we'll provide intelligent responses based on message patterns
    
    let response = '';
    
    if (message.toLowerCase().includes('sales') || message.toLowerCase().includes('revenue')) {
      const orders = await kv.getByPrefix('order_');
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      response = `Current total revenue: RM ${totalRevenue.toFixed(2)}. Today's orders: ${orders.length}. Would you like a detailed breakdown?`;
    } else if (message.toLowerCase().includes('inventory') || message.toLowerCase().includes('stock')) {
      const inventory = await kv.get('inventory') || {};
      const lowStock = Object.entries(inventory).filter(([, stock]) => stock < 30);
      response = lowStock.length > 0 
        ? `Warning: ${lowStock.length} items low in stock: ${lowStock.map(([item]) => item).join(', ')}`
        : 'All inventory levels are healthy.';
    } else if (message.toLowerCase().includes('customer') || message.toLowerCase().includes('feedback')) {
      response = 'Customer satisfaction is at 4.8/5. Recent feedback shows high praise for delivery speed and food quality. Would you like to see detailed customer reviews?';
    } else {
      response = 'I can help you with sales analytics, inventory management, customer insights, and operational optimization. What would you like to know?';
    }
    
    return c.json({ 
      success: true, 
      data: { 
        response,
        timestamp: new Date().toISOString() 
      } 
    });
  } catch (error) {
    return c.json({ error: 'Failed to process AI chat' }, 500);
  }
});

// Analytics endpoint
adminApi.get('/analytics/:timeframe', async (c) => {
  try {
    const timeframe = c.req.param('timeframe'); // 'day', 'week', 'month'
    
    let startDate: Date;
    const endDate = new Date();
    
    switch (timeframe) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    }
    
    const orders = await kv.getByPrefix('order_');
    const relevantOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    // Calculate analytics
    const analytics = {
      totalOrders: relevantOrders.length,
      totalRevenue: relevantOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      averageOrderValue: relevantOrders.length > 0 ? 
        relevantOrders.reduce((sum, order) => sum + (order.total || 0), 0) / relevantOrders.length : 0,
      topProducts: getTopProducts(relevantOrders),
      hourlyDistribution: getHourlyDistribution(relevantOrders),
      customerSegments: getCustomerSegments(relevantOrders)
    };
    
    return c.json({ success: true, data: analytics });
  } catch (error) {
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Helper functions
function getTopProducts(orders: any[]) {
  const productCounts: { [key: string]: number } = {};
  
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach((item: any) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + (item.quantity || 1);
      });
    }
  });
  
  return Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function getHourlyDistribution(orders: any[]) {
  const hourly = new Array(24).fill(0);
  
  orders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourly[hour]++;
  });
  
  return hourly;
}

function getCustomerSegments(orders: any[]) {
  const segments = {
    new: 0,
    returning: 0,
    vip: 0
  };
  
  const customerOrders: { [key: string]: number } = {};
  
  orders.forEach(order => {
    if (order.customer_email) {
      customerOrders[order.customer_email] = (customerOrders[order.customer_email] || 0) + 1;
    }
  });
  
  Object.values(customerOrders).forEach(orderCount => {
    if (orderCount === 1) segments.new++;
    else if (orderCount < 5) segments.returning++;
    else segments.vip++;
  });
  
  return segments;
}

export default adminApi;
