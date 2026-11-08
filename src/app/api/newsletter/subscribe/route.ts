import { NextResponse } from "next/server"
import { z } from "zod"
import { createSupabasePublicClient } from "@/lib/supabase/public"

const bodySchema = z.object({
  email: z.string().trim().email().max(200),
  source: z.enum(["popup", "footer", "checkout", "other"]).default("popup"),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
    }

    const email = parsed.data.email.trim().toLowerCase()
    const source = parsed.data.source
    const supabase = createSupabasePublicClient()

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      source,
      status: "subscribed",
    })

    if (error) {
      if (/duplicate|unique/i.test(error.message)) {
        return NextResponse.json({ ok: true, alreadySubscribed: true })
      }
      return NextResponse.json(
        {
          error:
            error.message.includes("newsletter_subscribers") || error.code === "42P01"
              ? "Newsletter signup is not ready yet. Run the newsletter_subscribers migration, then try again."
              : error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not subscribe"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
