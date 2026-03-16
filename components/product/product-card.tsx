'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import RatingStars from '@/components/ui/rating-stars'
import { cn } from '@/lib/utils'

interface Props {
  product: Product
  view?: 'grid' | 'list'
}

export default function ProductCard({ product, view = 'grid' }: Props) {
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleWishlist, isWishlisted } = useUIStore()
  const wishlisted = isWishlisted(product.id)

  const defaultVariant = product.variants[0]
  const price = defaultVariant?.salePrice ?? defaultVariant?.price ?? product.basePrice
  const originalPrice = defaultVariant?.price ?? product.basePrice
  const hasDiscount = price < originalPrice
  const discountPct = hasDiscount ? calculateDiscount(originalPrice, price) : 0

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!defaultVariant) return
    setAdding(true)
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.thumbnail,
      brand: product.brand,
      storage: defaultVariant.storage,
      color: defaultVariant.color,
      colorHex: defaultVariant.colorHex,
      condition: defaultVariant.condition,
      price: defaultVariant.price,
      salePrice: defaultVariant.salePrice,
      quantity: 1,
      stock: defaultVariant.stock,
    })
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdding(false), 600)
  }

  if (view === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div className="flex gap-4 p-4">
          <Link href={`/product/${product.slug}`} className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
            <img
              src={imgError ? 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?w=200' : product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            {product.isNew && <span className="badge-new absolute top-1.5 left-1.5">New</span>}
            {hasDiscount && (
              <span className="badge-sale absolute top-1.5 right-1.5">-{discountPct}%</span>
            )}
          </Link>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-foreground/80 transition-colors">{product.name}</h3>
              </Link>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.shortDescription}</p>
              <RatingStars rating={product.rating} count={product.reviewCount} className="mt-2" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold">{formatPrice(price)}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through ml-2">{formatPrice(originalPrice)}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding || defaultVariant?.stock === 0}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-40"
              >
                <ShoppingCart className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-2xl border border-border hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-secondary overflow-hidden">
          <img
            src={imgError ? 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?w=400' : product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <span className="badge-new">New</span>}
            {product.isBestseller && !product.isNew && <span className="badge-bestseller">Hot</span>}
            {hasDiscount && <span className="badge-sale">-{discountPct}%</span>}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id) }}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all',
              wishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white/80 text-muted-foreground opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
          </button>
          {defaultVariant?.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground bg-white px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-foreground/80 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.shortDescription}</p>

        <RatingStars rating={product.rating} count={product.reviewCount} className="mb-3" />

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-base sm:text-lg font-bold text-foreground">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={adding || defaultVariant?.stock === 0}
            className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-all disabled:opacity-40"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}