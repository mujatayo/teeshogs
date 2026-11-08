"use server"

import { revalidatePath } from "next/cache"
import { isNewsletterStatus } from "@/lib/newsletter-subscribers"
import { createSupabaseServerClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: "Not authenticated", supabase }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    return { ok: false as const, error: "Not authorized", supabase }
  }

  return { ok: true as const, supabase }
}

export type NewsletterActionResult = { ok: true } | { ok: false; error: string }

export async function updateNewsletterStatus(
  id: string,
  status: string
): Promise<NewsletterActionResult> {
  if (!id?.trim()) return { ok: false, error: "Missing subscriber id" }
  if (!isNewsletterStatus(status)) return { ok: false, error: "Invalid status" }

  const auth = await requireAdmin()
  if (!auth.ok) return { ok: false, error: auth.error }

  const { error } = await auth.supabase
    .from("newsletter_subscribers")
    .update({ status })
    .eq("id", id)

  if (error) return { ok: false, error: error.message }

  revalidatePath("/admin/newsletters")
  return { ok: true }
}

export async function deleteNewsletterSubscriber(
  id: string
): Promise<NewsletterActionResult> {
  if (!id?.trim()) return { ok: false, error: "Missing subscriber id" }

  const auth = await requireAdmin()
  if (!auth.ok) return { ok: false, error: auth.error }

  const { error } = await auth.supabase.from("newsletter_subscribers").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/admin/newsletters")
  return { ok: true }
}
