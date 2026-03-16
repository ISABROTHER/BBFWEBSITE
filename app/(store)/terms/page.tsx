export default function TermsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 1, 2026</p>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using the NovaMobile website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.' },
            { title: '2. Guest Checkout', content: 'NovaMobile offers guest checkout. You are not required to create an account to purchase products. Your order information is linked to your tracking code and the email/phone provided at checkout.' },
            { title: '3. Product Information', content: 'We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free. Prices are subject to change without notice.' },
            { title: '4. Orders and Payment', content: 'By placing an order, you represent that you are of legal age. We reserve the right to refuse or cancel orders at any time. Payment is required before orders are processed.' },
            { title: '5. Shipping and Delivery', content: 'Delivery times are estimates. NovaMobile is not responsible for delays caused by carriers, customs, or other factors outside our control.' },
            { title: '6. Returns and Refunds', content: 'Products may be returned within 15 days of delivery in original condition. Refunds are processed within 5-10 business days after we receive the returned item.' },
            { title: '7. Limitation of Liability', content: 'NovaMobile is not liable for indirect, incidental, or consequential damages arising from the use or inability to use our products or services.' },
            { title: '8. Contact', content: 'For questions about these Terms, contact us at legal@novamobile.com.' },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-base font-semibold text-foreground mb-2">{title}</h2>
              <p>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
