export const NEWSLETTER_STORAGE_KEY = "teeshogs_newsletter_prompt"
/** Re-show popup this many days after dismiss (not after successful subscribe). */
export const NEWSLETTER_RESHOW_DAYS = 14
/** Delay before first show so the page can settle. */
export const NEWSLETTER_SHOW_DELAY_MS = 2500

export type NewsletterPromptState = {
  dismissedAt: number | null
  subscribedAt: number | null
}

export function readNewsletterPromptState(): NewsletterPromptState {
  if (typeof window === "undefined") {
    return { dismissedAt: null, subscribedAt: null }
  }
  try {
    const raw = window.localStorage.getItem(NEWSLETTER_STORAGE_KEY)
    if (!raw) return { dismissedAt: null, subscribedAt: null }
    const parsed = JSON.parse(raw) as Partial<NewsletterPromptState>
    return {
      dismissedAt: typeof parsed.dismissedAt === "number" ? parsed.dismissedAt : null,
      subscribedAt: typeof parsed.subscribedAt === "number" ? parsed.subscribedAt : null,
    }
  } catch {
    return { dismissedAt: null, subscribedAt: null }
  }
}

export function writeNewsletterPromptState(state: NewsletterPromptState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(state))
}

export function shouldShowNewsletterPrompt(now = Date.now()) {
  const state = readNewsletterPromptState()
  if (state.subscribedAt) return false
  if (!state.dismissedAt) return true
  const elapsedDays = (now - state.dismissedAt) / (1000 * 60 * 60 * 24)
  return elapsedDays >= NEWSLETTER_RESHOW_DAYS
}

export function markNewsletterDismissed() {
  const state = readNewsletterPromptState()
  writeNewsletterPromptState({
    ...state,
    dismissedAt: Date.now(),
  })
}

export function markNewsletterSubscribed() {
  const now = Date.now()
  writeNewsletterPromptState({
    dismissedAt: now,
    subscribedAt: now,
  })
}
