import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo/Breadcrumbs"
import { JsonLd } from "@/components/seo/JsonLd"
import { createPageMetadata, helpBreadcrumbJsonLd } from "@/lib/seo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = createPageMetadata({
  title: "Size Guide",
  description:
    "Find your best Teeshogs fit across African print ready-to-wear, sets, and fashion for men, women, and children.",
  path: "/size-guide",
})

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Help", href: "/help" },
  { name: "Size Guide" },
]

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={helpBreadcrumbJsonLd("Size Guide", "/size-guide")} />
      <Breadcrumbs items={breadcrumbItems} />
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Help</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Size Guide</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Use our size guide to find your best fit across African print ready-to-wear, sets, and
        fashion for men, women, and children. When in doubt, size up for comfort.
      </p>
      <ul className="mt-8 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li>Compare your measurements with the size chart on each product when available</li>
        <li>Between sizes? Size up for a more relaxed fit</li>
        <li>Need help choosing? Contact us with your measurements</li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/shop">Shop the collection</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Ask for sizing help</Link>
        </Button>
      </div>
    </div>
  )
}
