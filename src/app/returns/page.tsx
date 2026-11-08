import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo/Breadcrumbs"
import { JsonLd } from "@/components/seo/JsonLd"
import { createPageMetadata, helpBreadcrumbJsonLd } from "@/lib/seo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = createPageMetadata({
  title: "Returns & Exchanges",
  description:
    "Return or exchange unworn Teeshogs items within 30 days with tags attached.",
  path: "/returns",
})

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Help", href: "/help" },
  { name: "Returns & Exchanges" },
]

export default function ReturnsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={helpBreadcrumbJsonLd("Returns & Exchanges", "/returns")} />
      <Breadcrumbs items={breadcrumbItems} />
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Help</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        Returns & Exchanges
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Changed your mind? You have 30 days to return or exchange unworn items with tags attached.
        Reach out to our team to start a return.
      </p>
      <ul className="mt-8 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li>30-day return window from delivery</li>
        <li>Items must be unworn with tags attached</li>
        <li>Contact us with your order number to start the process</li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/contact">Start a return</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/faqs">Read FAQs</Link>
        </Button>
      </div>
    </div>
  )
}
