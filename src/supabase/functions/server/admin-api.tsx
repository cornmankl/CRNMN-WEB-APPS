import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method, url } = req
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const segments = path.split('/').filter(Boolean)
    const endpoint = segments[segments.length - 1]

    // Verify admin access
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Route handlers
    switch (endpoint) {
      case 'dashboard-metrics':
        return await handleDashboardMetrics(supabase, req)
      case 'orders':
        return await handleOrders(supabase, req)
      case 'products':
        return await handleProducts(supabase, req)
      case 'settings':
        return await handleSettings(supabase, req)
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleDashboardMetrics(supabase: any, req: Request) {
  const { data: orders } = await supabase.from('orders').select('*')
  const { data: products } = await supabase.from('products').select('*')
  const { data: profiles } = await supabase.from('profiles').select('*').eq('is_admin', false)

  const metrics = {
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0,
    activeCustomers: profiles?.length || 0,
    avgDeliveryTime: 18,
    customerSatisfaction: 4.8,
    lowStockItems: products?.filter((p: any) => p.stock <= p.min_stock).length || 0,
    pendingOrders: orders?.filter((o: any) => o.status === 'pending').length || 0,
    completedOrders: orders?.filter((o: any) => o.status === 'delivered').length || 0,
    cancelledOrders: orders?.filter((o: any) => o.status === 'cancelled').length || 0
  }

  return new Response(JSON.stringify(metrics), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleOrders(supabase: any, req: Request) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles!orders_customer_id_fkey(full_name, phone)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return new Response(JSON.stringify(orders), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleProducts(supabase: any, req: Request) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return new Response(JSON.stringify(products), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleSettings(supabase: any, req: Request) {
  const method = req.method

  if (method === 'GET') {
    const { data: settings, error } = await supabase.from('settings').select('*')
    if (error) throw error

    const settingsObj = settings?.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value
      return acc
    }, {}) || {}

    return new Response(JSON.stringify(settingsObj), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (method === 'PUT') {
    const body = await req.json()
    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase.from('settings').upsert(updates)
    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}