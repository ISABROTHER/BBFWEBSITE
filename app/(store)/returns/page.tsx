export default function ReturnsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Return & Refund Policy</h1>
        <p className="text-muted-foreground mb-8">Simple, fair, and hassle-free returns</p>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          {[
            { title: 'Return Window', content: 'You have 15 days from the delivery date to return any item. Simply contact our support team to initiate the process.' },
            { title: 'Eligible Items', content: 'Items must be in original condition with all accessories, packaging, and documentation included. Products with physical damage not present on delivery may not be eligible.' },
            { title: 'How to Return', content: 'Contact support with your tracking code and email/phone. We\'ll provide a return label and instructions. Once we receive and inspect the item, we\'ll process your refund.' },
            { title: 'Refund Timeline', content: 'Refunds are issued to your original payment method within 5-10 business days after we receive the return. For COD orders, a bank transfer refund will be arranged.' },
            { title: 'Exchanges', content: 'Want a different variant, color, or model? We offer easy exchanges within the 15-day window. Contact support to arrange.' },
            { title: 'Non-Returnable Items', content: 'Opened software, digital products, and items marked as final sale are not eligible for return. Refurbished items have a separate 90-day NovaMobile warranty.' },
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
