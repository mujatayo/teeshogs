import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Breadcrumbs } from "@/components/seo/Breadcrumbs"
import { JsonLd } from "@/components/seo/JsonLd"
import { helpHubLinks } from "@/lib/help-content"
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Help",
  description:
    "Browse Teeshogs FAQs, size guidance, shipping details, and returns — or reach out for personal order help.",
  path: "/help",
})

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Help" },
]

export default function HelpPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Help", path: "/help" },
        ])}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Help</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">How can we help?</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Browse FAQs, size guidance, shipping details, and returns — or reach out if you need a
        personal assist with your order.
      </p>

      <ul className="mt-10 divide-y border-y">
        {helpHubLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-start justify-between gap-4 py-5 transition-colors hover:text-foreground"
            >
              <span>
                <span className="block text-base font-medium text-foreground">{link.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{link.description}</span>
              </span>
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
