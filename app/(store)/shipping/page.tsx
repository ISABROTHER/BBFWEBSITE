export default function ShippingPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Shipping Policy</h1>
        <p className="text-muted-foreground mb-8">Fast, reliable delivery with real-time tracking</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Standard Shipping', days: '3–7 Business Days', price: 'Free over $99, $15 otherwise', icon: '📦' },
            { title: 'Express Shipping', days: '1–3 Business Days', price: '$25', icon: '⚡' },
            { title: 'Same-Day', days: 'Select Cities Only', price: '$35', icon: '🚀' },
          ].map((tier) => (
            <div key={tier.title} className="bg-white rounded-2xl border border-border p-5 text-center">
              <p className="text-3xl mb-2">{tier.icon}</p>
              <h3 className="font-semibold mb-1">{tier.title}</h3>
              <p className="text-sm text-muted-foreground">{tier.days}</p>
              <p className="text-sm font-medium mt-2">{tier.price}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          {[
            { title: 'Order Processing', content: 'Orders placed before 2 PM EST are processed same day. Orders placed after 2 PM or on weekends are processed the next business day.' },
            { title: 'Tracking Your Order', content: 'Every order receives a unique NovaMobile tracking code. Use it on our Track Order page — no account required — to see real-time status updates.' },
            { title: 'Delivery Areas', content: 'We currently ship to all 50 US states. International shipping to Canada, UK, and Australia is available at checkout.' },
            { title: 'Delivery Issues', content: 'If your order is delayed beyond the estimated date, contact our support team with your tracking code. We\'ll investigate and resolve the issue promptly.' },
          ].map(({ title, content }) => (
            <div key={title} className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-foreground mb-2">{title}</h2>
              <p>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
