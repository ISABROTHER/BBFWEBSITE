import { Order, TrackingEvent } from '@/types'

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

let ordersStore: Order[] = [...sampleOrders]

export function getOrderByTrackingCode(trackingCode: string, identifier: string): Order | undefined {
  const code = trackingCode.toUpperCase().trim()
  const id = identifier.toLowerCase().trim()
  return ordersStore.find(o => {
    const matchesCode = o.trackingCode.toUpperCase() === code
    const matchesEmail = o.shippingAddress.email.toLowerCase() === id
    const matchesPhone = o.shippingAddress.phone.replace(/\D/g, '') === id.replace(/\D/g, '')
    return matchesCode && (matchesEmail || matchesPhone)
  })
}

export function saveOrder(order: Order): void {
  ordersStore.push(order)
}

export function getAllOrders(): Order[] {
  return [...ordersStore]
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.find(o => o.id === id)
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  const order = ordersStore.find(o => o.id === orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date().toISOString()
  }
}
