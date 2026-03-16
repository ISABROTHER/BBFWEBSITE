export default function PrivacyPolicyPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 1, 2026</p>
        <div className="prose max-w-none space-y-6 text-sm text-muted-foreground leading-relaxed">
          {[
            { title: 'Information We Collect', content: 'When you place an order, we collect your name, email address, phone number, and shipping address. We also collect device information and browsing data for analytics purposes. We do not require account creation — your information is only used to process and fulfill your orders.' },
            { title: 'How We Use Your Information', content: 'We use your information solely to process orders, provide order tracking, send order confirmations, and offer customer support. We do not sell, rent, or share your personal data with third parties for marketing purposes.' },
            { title: 'Order Tracking', content: 'Your tracking code and order information are tied to the email or phone number you provide at checkout. This information is used to verify your identity when tracking your order — no account or password is needed.' },
            { title: 'Data Security', content: 'All data transmissions are encrypted using SSL/TLS. Payment card information is processed by certified payment processors and never stored on our servers.' },
            { title: 'Cookies', content: 'We use cookies to maintain your shopping cart session and improve your browsing experience. You can disable cookies in your browser settings, though some features may not work correctly.' },
            { title: 'Contact Us', content: 'For privacy-related questions, contact us at privacy@novamobile.com or call +1 (555) 019-9000.' },
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
