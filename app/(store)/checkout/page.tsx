'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, CreditCard, Banknote, Smartphone, ChevronDown, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { saveOrder } from '@/lib/data'
import { generateOrderNumber, generateTrackingCode, formatPrice, getEstimatedDelivery } from '@/lib/utils'
import type { Order, ShippingAddress } from '@/types'

const addressSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone required'),
  address1: z.string().min(5, 'Required'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Required'),
  postalCode: z.string().min(4, 'Required'),
  country: z.string().min(2, 'Required'),
})

const checkoutSchema = z.object({
  shipping: addressSchema,
  sameAsBilling: z.boolean(),
  paymentMethod: z.enum(['cod', 'card', 'bank_transfer', 'mobile_payment']),
  notes: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex accepted' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Banknote, desc: 'Direct bank transfer' },
  { id: 'mobile_payment', label: 'Mobile Payment', icon: Smartphone, desc: 'Apple Pay, Google Pay' },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-1">{message}</p>
}

function inputClass(hasError?: boolean) {
  return `w-full px-4 py-3 rounded-xl border ${hasError ? 'border-red-400' : 'border-border'} text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-white transition-colors`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, coupon, getSubtotal, getDiscount, getShipping, getTax, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { sameAsBilling: true, paymentMethod: 'cod' },
  })

  const paymentMethod = watch('paymentMethod')

  async function onSubmit(data: CheckoutForm) {
    if (items.length === 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const orderNumber = generateOrderNumber()
    const trackingCode = generateTrackingCode()

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingCode,
      items: items.map(i => ({
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        image: i.image,
        brand: i.brand,
        storage: i.storage,
        color: i.color,
        condition: i.condition,
        price: i.salePrice ?? i.price,
        quantity: i.quantity,
        subtotal: (i.salePrice ?? i.price) * i.quantity,
      })),
      shippingAddress: data.shipping,
      paymentMethod: {
        type: data.paymentMethod,
        label: paymentMethods.find(p => p.id === data.paymentMethod)?.label || data.paymentMethod,
      },
      status: 'pending',
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: getSubtotal(),
      shippingFee: getShipping(),
      tax: getTax(),
      discount: getDiscount(),
      couponCode: coupon?.code,
      total: getTotal(),
      notes: data.notes,
      estimatedDelivery: getEstimatedDelivery(5),
      trackingEvents: [
        {
          id: `te-${Date.now()}`,
          orderId: `ord-${Date.now()}`,
          status: 'pending',
          message: 'Order placed successfully',
          timestamp: new Date().toISOString(),
          isCompleted: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveOrder(order)
    clearCart()

    router.push(`/order-success?order=${orderNumber}&tracking=${trackingCode}`)
  }

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotal()

  return (
    <div className="py-8 sm:py-12">
      <div className="section-container">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-5">Contact & Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">First Name *</label>
                    <input {...register('shipping.firstName')} placeholder="John" className={inputClass(!!errors.shipping?.firstName)} />
                    <FieldError message={errors.shipping?.firstName?.message} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Last Name *</label>
                    <input {...register('shipping.lastName')} placeholder="Doe" className={inputClass(!!errors.shipping?.lastName)} />
                    <FieldError message={errors.shipping?.lastName?.message} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
                    <input {...register('shipping.email')} type="email" placeholder="john@example.com" className={inputClass(!!errors.shipping?.email)} />
                    <FieldError message={errors.shipping?.email?.message} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
                    <input {...register('shipping.phone')} type="tel" placeholder="+1 555-0123" className={inputClass(!!errors.shipping?.phone)} />
                    <FieldError message={errors.shipping?.phone?.message} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">Address *</label>
                    <input {...register('shipping.address1')} placeholder="123 Main Street" className={inputClass(!!errors.shipping?.address1)} />
                    <FieldError message={errors.shipping?.address1?.message} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">Apartment, suite, etc. (optional)</label>
                    <input {...register('shipping.address2')} placeholder="Apt 4B" className={inputClass()} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City *</label>
                    <input {...register('shipping.city')} placeholder="New York" className={inputClass(!!errors.shipping?.city)} />
                    <FieldError message={errors.shipping?.city?.message} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">State / Province *</label>
                    <input {...register('shipping.state')} placeholder="NY" className={inputClass(!!errors.shipping?.state)} />
                    <FieldError message={errors.shipping?.state?.message} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Postal Code *</label>
                    <input {...register('shipping.postalCode')} placeholder="10001" className={inputClass(!!errors.shipping?.postalCode)} />
                    <FieldError message={errors.shipping?.postalCode?.message} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Country *</label>
                    <input {...register('shipping.country')} placeholder="United States" className={inputClass(!!errors.shipping?.country)} />
                    <FieldError message={errors.shipping?.country?.message} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-foreground bg-slate-50' : 'border-border hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.id}
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === method.id ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
                      }`}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-background" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-emerald-500" />
                    Card details are processed securely. We don't store your card information.
                  </motion.div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-3">Order Notes (optional)</h2>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Special instructions, delivery notes..."
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 leading-snug">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.storage} {item.color && `· ${item.color}`} · x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold flex-shrink-0">
                        {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600' : ''}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Secure Guest Checkout</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No account required. Your data is safe and encrypted.</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full py-4 rounded-2xl bg-foreground text-background font-bold text-base hover:bg-foreground/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  `Place Order · ${formatPrice(total)}`
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
