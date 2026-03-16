import { Banner } from '@/types'

export const banners: Banner[] = [
  {
    id: 'ban1',
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light. So Pro.',
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1280',
    cta: 'Shop Now',
    ctaLink: '/product/apple-iphone-15-pro-max',
    bgColor: 'from-slate-900 to-slate-700',
    textColor: 'text-white',
    isActive: true,
    order: 1,
  },
  {
    id: 'ban2',
    title: 'Galaxy S24 Ultra',
    subtitle: 'AI-powered. Epic camera. Now with S Pen.',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1280',
    cta: 'Explore',
    ctaLink: '/product/samsung-galaxy-s24-ultra',
    bgColor: 'from-blue-900 to-blue-700',
    textColor: 'text-white',
    isActive: true,
    order: 2,
  },
  {
    id: 'ban3',
    title: 'Trade In & Save',
    subtitle: 'Get up to $500 off your next phone with trade-in',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1280',
    cta: 'Learn More',
    ctaLink: '/deals',
    bgColor: 'from-emerald-800 to-emerald-600',
    textColor: 'text-white',
    isActive: true,
    order: 3,
  },
]

export function getActiveBanners(): Banner[] {
  return banners.filter(b => b.isActive).sort((a, b) => a.order - b.order)
}
