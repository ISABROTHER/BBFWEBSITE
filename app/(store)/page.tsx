import HeroSection from '@/components/home/hero-section'
import CategoryGrid from '@/components/home/category-grid'
import FeaturedProducts from '@/components/home/featured-products'
import PromoBanner from '@/components/home/promo-banner'
import WhyChooseUs from '@/components/home/why-choose-us'
import BrandsSection from '@/components/home/brands-section'
import TestimonialsSection from '@/components/home/testimonials-section'
import FAQSection from '@/components/home/faq-section'
import NewsletterSection from '@/components/home/newsletter-section'

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <WhyChooseUs />
      <BrandsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
    </div>
  )
}
