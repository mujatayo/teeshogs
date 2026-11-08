import type { Metadata } from "next"
import Link from "next/link"
import { FaqList } from "@/components/help/FaqList"
import { Breadcrumbs } from "@/components/seo/Breadcrumbs"
import { JsonLd } from "@/components/seo/JsonLd"
import { faqItems } from "@/lib/help-content"
import {
  createPageMetadata,
  faqPageJsonLd,
  helpBreadcrumbJsonLd,
} from "@/lib/seo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = createPageMetadata({
  title: "FAQs",
  description:
    "Find quick answers about Teeshogs African prints, sizing, shipping, returns, and fabric care.",
  path: "/faqs",
})

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Help", href: "/help" },
  { name: "FAQs" },
]

export default function FaqsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={[helpBreadcrumbJsonLd("FAQs", "/faqs"), faqPageJsonLd(faqItems)]} />
      <Breadcrumbs items={breadcrumbItems} />
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Help</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">FAQs</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Quick answers about African prints, sizing, orders, shipping, returns, and care.
      </p>

      <FaqList items={faqItems} />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/contact">Still need help?</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Shop the collection</Link>
        </Button>
      </div>
    </div>
  )
}
