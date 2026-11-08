"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NEWSLETTER_SHOW_DELAY_MS,
  markNewsletterDismissed,
  markNewsletterSubscribed,
  shouldShowNewsletterPrompt,
} from "@/lib/newsletter"

const BLOCKED_PREFIXES = ["/admin", "/checkout", "/reset-password"]

export function NewsletterPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const blocked = BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  useEffect(() => {
    if (blocked) {
      setOpen(false)
      return
    }

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      if (shouldShowNewsletterPrompt()) setOpen(true)
    }, NEWSLETTER_SHOW_DELAY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [blocked, pathname])

  const dismiss = () => {
    markNewsletterDismissed()
    setOpen(false)
  }

  const onOpenChange = (next: boolean) => {
    if (!next) {
      dismiss()
      return
    }
    setOpen(true)
  }

  const onSubmit = async (event: React.FormEvent) => {
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
        body: JSON.stringify({ email: value, source: "popup" }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string; alreadySubscribed?: boolean }
      if (!res.ok) {
        toast.error(data.error || "Could not subscribe")
        return
      }

      markNewsletterSubscribed()
      setOpen(false)
      toast.success(
        data.alreadySubscribed
          ? "You're already on the list — welcome back."
          : "You're subscribed. Watch your inbox for new drops."
      )
      setEmail("")
    } catch {
      toast.error("Could not subscribe. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (blocked) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="overflow-hidden p-0 sm:max-w-2xl"
        onPointerDownOutside={(event) => {
          // Stay until dismissed via X / No thanks / Escape (Escape still closes Dialog).
          event.preventDefault()
        }}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <div className="grid sm:grid-cols-2">
          <div className="relative hidden min-h-[280px] sm:block">
            <img
              src="/hero-bg.webp"
              alt="Teeshogs African prints"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-white/80">Teeshogs</p>
              <p className="mt-2 text-lg font-semibold leading-snug">
                African prints, early access, exclusive offers
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-7">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Join the list
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed">
              Subscribe for new adire &amp; kampala drops, styling notes, and member-only offers.
            </DialogDescription>

            <div className="mt-4 overflow-hidden border sm:hidden">
              <img
                src="/hero-bg.webp"
                alt="Teeshogs African prints"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11"
                required
              />
              <Button type="submit" className="h-11 w-full" disabled={submitting}>
                {submitting ? "Subscribing…" : "Subscribe"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-full text-muted-foreground"
                onClick={dismiss}
                disabled={submitting}
              >
                No thanks
              </Button>
            </form>

            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              By subscribing you agree to receive marketing emails from Teeshogs. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
