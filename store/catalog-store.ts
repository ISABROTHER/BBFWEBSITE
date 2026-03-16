'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import type { Product, Category, Brand, Coupon, Banner, Testimonial, FAQ } from '@/types'

interface CatalogState {
  products: Product[]
  categories: Category[]
  brands: Brand[]
  coupons: Coupon[]
  banners: Banner[]
  testimonials: Testimonial[]
  faqs: FAQ[]
  loaded: boolean
  load: () => Promise<void>
}

function mapProduct(r: Record<string, unknown>): Product {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    brand: r.brand as string,
    brandId: r.brand_id as string,
    categoryId: r.category_id as string,
    categorySlug: r.category_slug as string,
    description: r.description as string,
    shortDescription: r.short_description as string,
    images: r.images as string[],
    thumbnail: r.thumbnail as string,
    variants: r.variants as Product['variants'],
    basePrice: r.base_price as number,
    baseSalePrice: r.base_sale_price as number | undefined,
    rating: r.rating as number,
    reviewCount: r.review_count as number,
    specs: r.specs as Product['specs'],
    inBox: r.in_box as string[],
    features: r.features as string[],
    tags: r.tags as string[],
    isFeatured: r.is_featured as boolean,
    isNew: r.is_new as boolean,
    isBestseller: r.is_bestseller as boolean,
    isVisible: r.is_visible as boolean,
    stock: r.stock as number,
    warranty: r.warranty as string,
    returnPolicy: r.return_policy as string,
    shipping: r.shipping as string,
    metaTitle: r.meta_title as string | undefined,
    metaDescription: r.meta_description as string | undefined,
    createdAt: r.created_at as string,
  }
}

function mapCategory(r: Record<string, unknown>): Category {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    icon: r.icon as string,
    image: r.image as string,
    description: r.description as string,
    featured: r.featured as boolean,
    parentId: r.parent_id as string | undefined,
  }
}

function mapBrand(r: Record<string, unknown>): Brand {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    logo: r.logo as string,
    featured: r.featured as boolean,
  }
}

function mapCoupon(r: Record<string, unknown>): Coupon {
  return {
    id: r.id as string,
    code: r.code as string,
    type: r.type as Coupon['type'],
    value: r.value as number,
    minOrder: r.min_order as number,
    maxDiscount: r.max_discount as number | undefined,
    usageLimit: r.usage_limit as number,
    usedCount: r.used_count as number,
    expiresAt: r.expires_at as string,
    isActive: r.is_active as boolean,
    description: r.description as string,
  }
}

function mapBanner(r: Record<string, unknown>): Banner {
  return {
    id: r.id as string,
    title: r.title as string,
    subtitle: r.subtitle as string,
    image: r.image as string,
    mobileImage: r.mobile_image as string | undefined,
    cta: r.cta as string,
    ctaLink: r.cta_link as string,
    bgColor: r.bg_color as string,
    textColor: r.text_color as string,
    isActive: r.is_active as boolean,
    order: r.order as number,
  }
}

function mapTestimonial(r: Record<string, unknown>): Testimonial {
  return {
    id: r.id as string,
    author: r.author as string,
    avatar: r.avatar as string | undefined,
    location: r.location as string,
    rating: r.rating as number,
    text: r.text as string,
    product: r.product as string | undefined,
    date: r.date as string,
  }
}

function mapFAQ(r: Record<string, unknown>): FAQ {
  return {
    id: r.id as string,
    question: r.question as string,
    answer: r.answer as string,
    category: r.category as string,
    order: r.order as number,
  }
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  categories: [],
  brands: [],
  coupons: [],
  banners: [],
  testimonials: [],
  faqs: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return

    const [
      { data: productsData },
      { data: categoriesData },
      { data: brandsData },
      { data: couponsData },
      { data: bannersData },
      { data: testimonialsData },
      { data: faqsData },
    ] = await Promise.all([
      supabase.from('products').select('*').eq('is_visible', true).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('brands').select('*').order('name'),
      supabase.from('coupons').select('*').order('code'),
      supabase.from('banners').select('*').eq('is_active', true).order('order'),
      supabase.from('testimonials').select('*').order('date', { ascending: false }),
      supabase.from('faqs').select('*').order('order'),
    ])

    set({
      products: (productsData ?? []).map(r => mapProduct(r as Record<string, unknown>)),
      categories: (categoriesData ?? []).map(r => mapCategory(r as Record<string, unknown>)),
      brands: (brandsData ?? []).map(r => mapBrand(r as Record<string, unknown>)),
      coupons: (couponsData ?? []).map(r => mapCoupon(r as Record<string, unknown>)),
      banners: (bannersData ?? []).map(r => mapBanner(r as Record<string, unknown>)),
      testimonials: (testimonialsData ?? []).map(r => mapTestimonial(r as Record<string, unknown>)),
      faqs: (faqsData ?? []).map(r => mapFAQ(r as Record<string, unknown>)),
      loaded: true,
    })
  },
}))
