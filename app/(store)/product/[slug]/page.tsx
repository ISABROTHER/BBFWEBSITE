'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Zap, Heart, Share2, Shield, Truck, RotateCcw,
  ChevronDown, Star, MapPin, ChevronLeft, ChevronRight, Package
} from 'lucide-react'
import { toast } from 'sonner'
import { getProductBySlug, getRelatedProducts } from '@/lib/data'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { formatPrice, calculateDiscount, getEstimatedDelivery } from '@/lib/utils'
import RatingStars from '@/components/ui/rating-stars'
import PriceBlock from '@/components/product/price-block'
import ProductCard from '@/components/product/product-card'
import type { ProductVariant } from '@/types'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const productData = getProductBySlug(params.slug)
  if (!productData) notFound()
  const product = productData!

  const related = getRelatedProducts(product.id, product.categorySlug, 4)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [selectedImage, setSelectedImage] = useState(0)
  const [expandSpec, setExpandSpec] = useState(false)
  const [expandFaq, setExpandFaq] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [locationInput, setLocationInput] = useState('')
  const [deliveryInfo, setDeliveryInfo] = useState('')
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleWishlist, isWishlisted, addRecentlyViewed } = useUIStore()

  const wishlisted = isWishlisted(product.id)
  const price = selectedVariant.salePrice ?? selectedVariant.price
  const originalPrice = selectedVariant.price
  const hasDiscount = selectedVariant.salePrice !== undefined && selectedVariant.salePrice < originalPrice
  const discount = hasDiscount ? calculateDiscount(originalPrice, selectedVariant.salePrice!) : 0
  const inStock = selectedVariant.stock > 0

  const uniqueStorages = Array.from(new Set(product.variants.map(v => v.storage).filter(Boolean)))
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean)))
  const conditions = Array.from(new Set(product.variants.map(v => v.condition).filter(Boolean)))

  const specGroups = product.specs.reduce((acc, spec) => {
    if (!acc[spec.group]) acc[spec.group] = []
    acc[spec.group].push(spec)
    return acc
  }, {} as Record<string, typeof product.specs>)

  function handleAddToCart() {
    if (!inStock) return
    setAdding(true)
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.thumbnail,
      brand: product.brand,
      storage: selectedVariant.storage,
      color: selectedVariant.color,
      colorHex: selectedVariant.colorHex,
      condition: selectedVariant.condition,
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      quantity,
      stock: selectedVariant.stock,
    })
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdding(false), 600)
  }

  function selectVariantByStorage(storage: string) {
    const v = product.variants.find(v => v.storage === storage && v.color === selectedVariant.color)
      || product.variants.find(v => v.storage === storage)
    if (v) setSelectedVariant(v)
  }

  function selectVariantByColor(color: string) {
    const v = product.variants.find(v => v.color === color && v.storage === selectedVariant.storage)
      || product.variants.find(v => v.color === color)
    if (v) setSelectedVariant(v)
  }

  function selectVariantByCondition(condition: string) {
    const v = product.variants.find(v => v.condition === condition && v.color === selectedVariant.color)
      || product.variants.find(v => v.condition === condition)
    if (v) setSelectedVariant(v)
  }

  function checkDelivery() {
    if (!locationInput.trim()) return
    setDeliveryInfo(`Standard delivery to ${locationInput} by ${getEstimatedDelivery(5)}. Free on this order.`)
  }

  const monthlyEMI = Math.round(price / 12)

  return (
    <div className="py-6 sm:py-10">
      <div className="section-container">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug}`} className="hover:text-foreground capitalize">
            {product.categorySlug.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.isNew && <span className="badge-new">New</span>}
                {product.isBestseller && <span className="badge-bestseller">Best Seller</span>}
                {hasDiscount && <span className="badge-sale">-{discount}%</span>}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === i ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <RatingStars rating={product.rating} size="md" showValue count={product.reviewCount} />
                <span className="text-xs text-muted-foreground">SKU: {selectedVariant.sku}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
              <PriceBlock price={originalPrice} salePrice={selectedVariant.salePrice} size="xl" showSavings />
              <p className="text-xs text-muted-foreground">
                Or from <span className="font-semibold text-foreground">${monthlyEMI}/mo</span> for 12 months — 0% interest
              </p>
            </div>

            {uniqueStorages.length > 1 && (
              <div>
                <p className="text-sm font-semibold mb-2">Storage</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueStorages.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => selectVariantByStorage(storage!)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedVariant.storage === storage
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-slate-400 bg-white'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {uniqueColors.length > 1 && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Color: <span className="font-normal text-muted-foreground">{selectedVariant.color}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {uniqueColors.map((color) => {
                    const v = product.variants.find(v => v.color === color)
                    return (
                      <button
                        key={color}
                        onClick={() => selectVariantByColor(color!)}
                        title={color}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedVariant.color === color
                            ? 'border-foreground scale-110 shadow-md'
                            : 'border-transparent hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: v?.colorHex || '#ccc' }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {conditions.length > 1 && (
              <div>
                <p className="text-sm font-semibold mb-2">Condition</p>
                <div className="flex gap-2">
                  {conditions.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => selectVariantByCondition(cond!)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all capitalize ${
                        selectedVariant.condition === cond
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-slate-400 bg-white'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold">Qty:</p>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors text-lg font-medium"
                >
                  –
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(selectedVariant.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {inStock ? `${selectedVariant.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!inStock || adding}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-foreground bg-white text-foreground font-semibold hover:bg-foreground hover:text-background transition-all disabled:opacity-40 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </motion.button>
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all text-sm"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </Link>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  wishlisted ? 'border-red-400 bg-red-50 text-red-500' : 'border-border hover:border-slate-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, title: product.warranty, sub: 'Official warranty' },
                { icon: Truck, title: product.shipping, sub: 'Fast shipping' },
                { icon: RotateCcw, title: product.returnPolicy, sub: 'Easy returns' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={sub} className="bg-slate-50 rounded-2xl p-3 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-[11px] font-semibold leading-tight">{title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Check Delivery
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter city or zip code"
                  className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-white"
                />
                <button onClick={checkDelivery} className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
                  Check
                </button>
              </div>
              {deliveryInfo && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> {deliveryInfo}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Product Description</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            </div>

            {product.features.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {product.inBox.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" /> In the Box
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.inBox.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 rounded-xl px-3 py-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => setExpandSpec(!expandSpec)}
              className="w-full flex items-center justify-between px-6 py-5"
            >
              <h2 className="text-lg font-bold">Technical Specifications</h2>
              <motion.div animate={{ rotate: expandSpec ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandSpec && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4">
                    {Object.entries(specGroups).map(([group, specs]) => (
                      <div key={group}>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{group}</h3>
                        <div className="bg-slate-50 rounded-xl overflow-hidden">
                          {specs.map((spec, i) => (
                            <div key={spec.label} className={`flex px-4 py-3 ${i !== 0 ? 'border-t border-border' : ''}`}>
                              <span className="text-sm text-muted-foreground w-1/2">{spec.label}</span>
                              <span className="text-sm font-medium w-1/2">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-xl font-bold">Related Products</h2>
              <Link href={`/category/${product.categorySlug}`} className="text-sm text-muted-foreground hover:text-foreground">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 lg:hidden z-30 safe-bottom">
        <div className="px-4 py-3 bg-white/95 backdrop-blur-xl border-t border-border">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-lg font-bold">{formatPrice(price)}</p>
              {hasDiscount && <p className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</p>}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-semibold text-sm disabled:opacity-40"
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
