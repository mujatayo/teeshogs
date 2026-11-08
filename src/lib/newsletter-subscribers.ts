export const NEWSLETTER_SOURCES = ["popup", "footer", "checkout", "other"] as const
export const NEWSLETTER_STATUSES = ["subscribed", "unsubscribed"] as const

export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number]
export type NewsletterStatus = (typeof NEWSLETTER_STATUSES)[number]

export type NewsletterSubscriber = {
  id: string
  email: string
  source: NewsletterSource | string
  status: NewsletterStatus | string
  created_at: string
  updated_at: string
}

export type NewsletterSubscriberStats = {
  total: number
  subscribed: number
  unsubscribed: number
  fromPopup: number
  fromFooter: number
}

const SOURCE_LABELS: Record<NewsletterSource, string> = {
  popup: "Popup",
  footer: "Footer",
  checkout: "Checkout",
  other: "Other",
}

const STATUS_LABELS: Record<NewsletterStatus, string> = {
  subscribed: "Subscribed",
  unsubscribed: "Unsubscribed",
}

export function isNewsletterSource(value: string): value is NewsletterSource {
  return (NEWSLETTER_SOURCES as readonly string[]).includes(value)
}

export function isNewsletterStatus(value: string): value is NewsletterStatus {
  return (NEWSLETTER_STATUSES as readonly string[]).includes(value)
}

export function newsletterSourceLabel(source: string) {
  if (isNewsletterSource(source)) return SOURCE_LABELS[source]
  return source
}

export function newsletterStatusLabel(status: string) {
  if (isNewsletterStatus(status)) return STATUS_LABELS[status]
  return status
}

export function newsletterStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "subscribed") return "default"
  if (status === "unsubscribed") return "secondary"
  return "outline"
}

export function computeNewsletterStats(
  subscribers: NewsletterSubscriber[]
): NewsletterSubscriberStats {
  return {
    total: subscribers.length,
    subscribed: subscribers.filter((item) => item.status === "subscribed").length,
    unsubscribed: subscribers.filter((item) => item.status === "unsubscribed").length,
    fromPopup: subscribers.filter((item) => item.source === "popup").length,
    fromFooter: subscribers.filter((item) => item.source === "footer").length,
  }
}
