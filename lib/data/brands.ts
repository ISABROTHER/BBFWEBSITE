import { Brand } from '@/types'

export const brands: Brand[] = [
  { id: 'b1', name: 'Apple', slug: 'apple', logo: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?w=100', featured: true },
  { id: 'b2', name: 'Samsung', slug: 'samsung', logo: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?w=100', featured: true },
  { id: 'b3', name: 'Google', slug: 'google', logo: 'https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?w=100', featured: true },
  { id: 'b4', name: 'OnePlus', slug: 'oneplus', logo: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?w=100', featured: false },
  { id: 'b5', name: 'Sony', slug: 'sony', logo: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=100', featured: false },
  { id: 'b6', name: 'Xiaomi', slug: 'xiaomi', logo: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?w=100', featured: false },
]

export function getBrandById(id: string): Brand | undefined {
  return brands.find(b => b.id === id)
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find(b => b.slug === slug)
}
