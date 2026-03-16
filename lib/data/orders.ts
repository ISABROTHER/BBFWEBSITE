import { Order } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const sampleOrders: Order[] = [
  {
    id: 'ord1',
    orderNumber: 'ORD-123456-ABC',
    trackingCode: 'NVM-2026-AB12CD',
    items: [
      {
        productId: 'p1',
        variantId: 'v1-1',
        name: 'iPhone 15 Pro Max',
        image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Apple',
        storage: '256GB',
        color: 'Natural Titanium',
        price: 1099,
        quantity: 1,
        subtotal: 1099,
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-0123',
      address1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
    },
    paymentMethod: { type: 'card', label: 'Credit Card' },
    status: 'shipped',
    paymentStatus: 'paid',
    subtotal: 1099,
    shippingFee: 0,
    tax: 87.92,
    discount: 0,
    total: 1186.92,
    courierName: 'FedEx',
    courierTrackingNumber: 'FX123456789',
    estimatedDelivery: '2026-03-20',
    trackingEvents: [
      { id: 'te1', orderId: 'ord1', status: 'pending', message: 'Order placed successfully', timestamp: '2026-03-14T10:00:00Z', isCompleted: true },
      { id: 'te2', orderId: 'ord1', status: 'payment_confirmed', message: 'Payment confirmed', timestamp: '2026-03-14T10:30:00Z', isCompleted: true },
      { id: 'te3', orderId: 'ord1', status: 'processing', message: 'Order is being processed', timestamp: '2026-03-14T12:00:00Z', isCompleted: true },
      { id: 'te4', orderId: 'ord1', status: 'packed', message: 'Order packed and ready for pickup', timestamp: '2026-03-15T09:00:00Z', isCompleted: true },
      { id: 'te5', orderId: 'ord1', status: 'shipped', message: 'Shipped via FedEx', location: 'New York Distribution Center', timestamp: '2026-03-15T14:00:00Z', isCompleted: true },
      { id: 'te6', orderId: 'ord1', status: 'out_for_delivery', message: 'Out for delivery', location: 'New York, NY', timestamp: '', isCompleted: false },
      { id: 'te7', orderId: 'ord1', status: 'delivered', message: 'Delivered', timestamp: '', isCompleted: false },
    ],
    createdAt: '2026-03-14T10:00:00Z',
    updatedAt: '2026-03-15T14:00:00Z',
  },
]

function mapOrderRow(r: Record<string, unknown>): Order {
  return {
    id: r.id as string,
    orderNumber: r.order_number as string,
    trackingCode: r.tracking_code as string,
    items: r.items as Order['items'],
    shippingAddress: r.shipping_address as Order['shippingAddress'],
    billingAddress: r.billing_address as Order['billingAddress'],
    paymentMethod: r.payment_method as Order['paymentMethod'],
    status: r.status as Order['status'],
    paymentStatus: r.payment_status as Order['paymentStatus'],
    subtotal: r.subtotal as number,
    shippingFee: r.shipping_fee as number,
    tax: r.tax as number,
    discount: r.discount as number,
    couponCode: r.coupon_code as string | undefined,
    total: r.total as number,
    notes: r.notes as string | undefined,
    courierName: r.courier_name as string | undefined,
    courierTrackingNumber: r.courier_tracking_number as string | undefined,
    estimatedDelivery: r.estimated_delivery as string | undefined,
    trackingEvents: (r.tracking_events as Order['trackingEvents']) ?? [],
    adminNotes: r.admin_notes as string | undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }
}

export async function getOrderByTrackingCode(trackingCode: string, identifier: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase.rpc('find_order_by_tracking', {
      p_tracking_code: trackingCode.toUpperCase().trim(),
      p_identifier: identifier.toLowerCase().trim(),
    })
    if (error || !data || data.length === 0) return null
    return mapOrderRow(data[0] as Record<string, unknown>)
  } catch {
    return null
  }
}

export async function saveOrder(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      tracking_code: order.trackingCode,
      items: order.items,
      shipping_address: order.shippingAddress,
      billing_address: order.billingAddress ?? null,
      payment_method: order.paymentMethod,
      status: order.status,
      payment_status: order.paymentStatus,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      tax: order.tax,
      discount: order.discount,
      coupon_code: order.couponCode ?? null,
      total: order.total,
      notes: order.notes ?? null,
      estimated_delivery: order.estimatedDelivery ?? null,
      tracking_events: order.trackingEvents,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data) return sampleOrders
    return data.map(r => mapOrderRow(r as Record<string, unknown>))
  } catch {
    return sampleOrders
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error || !data) return null
    return mapOrderRow(data as Record<string, unknown>)
  } catch {
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
  } catch {
  }
}
