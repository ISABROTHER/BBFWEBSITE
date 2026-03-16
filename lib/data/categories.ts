import { Category } from '@/types'
import { useCatalogStore } from '@/store/catalog-store'

export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'iPhones',
    slug: 'iphones',
    icon: 'smartphone',
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The latest iPhones with cutting-edge technology',
    featured: true,
  },
  {
    id: 'cat2',
    name: 'Android Phones',
    slug: 'android-phones',
    icon: 'smartphone',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Premium Android flagships and budget-friendly options',
    featured: true,
  },
  {
    id: 'cat3',
    name: 'Tablets',
    slug: 'tablets',
    icon: 'tablet',
    image: 'https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Powerful tablets for work and entertainment',
    featured: true,
  },
  {
    id: 'cat4',
    name: 'Smartwatches',
    slug: 'smartwatches',
    icon: 'watch',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Stay connected with premium smartwatches',
    featured: true,
  },
  {
    id: 'cat5',
    name: 'Earbuds',
    slug: 'earbuds',
    icon: 'headphones',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Immersive audio with true wireless earbuds',
    featured: true,
  },
  {
    id: 'cat6',
    name: 'Cases',
    slug: 'cases',
    icon: 'shield',
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Protect your device in style',
    featured: false,
  },
  {
    id: 'cat7',
    name: 'Chargers',
    slug: 'chargers',
    icon: 'zap',
    image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Fast charging solutions for all devices',
    featured: false,
  },
  {
    id: 'cat8',
    name: 'Power Banks',
    slug: 'power-banks',
    icon: 'battery',
    image: 'https://images.pexels.com/photos/6804081/pexels-photo-6804081.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Never run out of battery on the go',
    featured: false,
  },
]

function getCategoryList(): Category[] {
  const { loaded, categories: sbCategories } = useCatalogStore.getState()
  return loaded && sbCategories.length > 0 ? sbCategories : categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategoryList().find(c => c.slug === slug)
}

export function getFeaturedCategories(): Category[] {
  return getCategoryList().filter(c => c.featured)
}
