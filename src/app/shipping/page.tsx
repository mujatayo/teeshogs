import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo/Breadcrumbs"
import { JsonLd } from "@/components/seo/JsonLd"
import { createPageMetadata, helpBreadcrumbJsonLd } from "@/lib/seo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = createPageMetadata({
  title: "Shipping & Delivery",
  description:
    "Free shipping on Teeshogs orders over ₦150,000. Most orders process within 1–2 business days with tracked Fez delivery across Nigeria.",
  path: "/shipping",
})

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Help", href: "/help" },
  { name: "Shipping & Delivery" },
]

export default function ShippingPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={helpBreadcrumbJsonLd("Shipping & Delivery", "/shipping")} />
      <Breadcrumbs items={breadcrumbItems} />
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Help</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        Shipping & Delivery
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        We offer free shipping on orders over ₦150,000. Most orders are processed within 1–2
        business days and delivered nationwide with Fez tracked shipping.
      </p>
      <ul className="mt-8 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li>Local delivery zones and Fez nationwide options at checkout</li>
        <li>Tracking details sent after your order ships</li>
        <li>Free shipping threshold: ₦150,000</li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/shop">Shop the collection</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/faqs">Read FAQs</Link>
        </Button>
      </div>
    </div>
  )
}
