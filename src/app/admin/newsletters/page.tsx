import type { Metadata } from "next"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { NewsletterSubscriber } from "@/lib/newsletter-subscribers"
import { AdminNewslettersTable } from "@/components/admin/AdminNewslettersTable"

export const metadata: Metadata = {
  title: "Newsletters | Teeshogs Admin",
}

export default async function AdminNewslettersPage() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000)

  const subscribers = (data as NewsletterSubscriber[] | null) ?? []

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Marketing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Newsletters</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Emails collected from the storefront popup and footer signup.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Could not load subscribers. Confirm the newsletter_subscribers migration is applied. (
          {error.message})
        </p>
      ) : (
        <AdminNewslettersTable subscribers={subscribers} />
      )}
    </div>
  )
}
