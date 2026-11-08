"use client"

import Link from "next/link"
import { useState, type FormEvent, type SVGProps } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { markNewsletterSubscribed } from "@/lib/newsletter"
import { defaultWhatsAppMessage, getWhatsAppHref } from "@/lib/whatsapp"
import type { NavSection } from "@/lib/navigation"
import { cn } from "@/lib/utils"

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.8a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
    </svg>
  )
}

function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

const whatsappHref = getWhatsAppHref(defaultWhatsAppMessage) ?? "https://wa.me/"

const socialLinks = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@teeshogs",
    icon: TikTokIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/teeshogs",
    icon: InstagramIcon,
  },
  {
    label: "Email",
    href: "mailto:hello@teeshogs.com",
    icon: EmailIcon,
  },
  {
    label: "WhatsApp",
    href: whatsappHref,
    icon: WhatsAppIcon,
  },
] as const

function flattenNavItems(items: NavSection["items"]) {
  const flat: { label: string; href: string }[] = []
  for (const item of items) {
    flat.push({ label: item.label, href: item.href })
    for (const child of item.children ?? []) {
      flat.push({ label: `— ${child.label}`, href: child.href })
    }
  }
  return flat
}

export function Footer({ nav }: { nav: NavSection[] }) {
  const shopLinks = flattenNavItems(
    nav.find((section) => section.label === "Shop")?.items ?? []
  )
  const helpLinks = nav.find((section) => section.label === "Contact Us")?.items ?? []
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubscribe = async (event: FormEvent) => {
    event.preventDefault()
    const value = email.trim()
    if (!value) {
      toast.error("Enter your email to subscribe")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "footer" }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        alreadySubscribed?: boolean
      }
      if (!res.ok) {
        toast.error(data.error || "Could not subscribe")
        return
      }
      markNewsletterSubscribed()
      setEmail("")
      toast.success(
        data.alreadySubscribed
          ? "You're already on the list — welcome back."
          : "You're subscribed. Watch your inbox for new drops."
      )
    } catch {
      toast.error("Could not subscribe. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <BrandLogo
              variant="onDark"
              className="mb-4"
              imageClassName="h-12 sm:h-14 md:h-14"
            />
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Authentic African prints — adire, kampala, and more — plus fashion accessories for men,
              women, and children.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={item.label}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-none border border-zinc-700 bg-zinc-900 text-zinc-100 transition-colors duration-200",
                    "hover:border-zinc-100 hover:bg-zinc-100 hover:text-zinc-950",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-100">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-zinc-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-100">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-zinc-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-100">
              Stay in Touch
            </h3>
            <p className="mb-4 text-sm text-zinc-400">
              Subscribe for early access to new collections and exclusive offers.
            </p>
            <form className="flex gap-2" onSubmit={onSubscribe}>
              <Input
                placeholder="Your email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-400"
              />
              <Button
                type="submit"
                className="shrink-0 bg-zinc-100 text-zinc-950 hover:bg-white"
                disabled={submitting}
              >
                {submitting ? "…" : "Join"}
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-10 bg-zinc-800" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-zinc-500 md:flex-row">
          <p>© 2026 Teeshogs. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-zinc-100">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-zinc-100">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-zinc-100">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
