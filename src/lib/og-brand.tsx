import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/seo"

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const

export const ogImageAlt = `${siteConfig.name} — ${siteConfig.tagline}`
export const ogImageContentType = "image/png"

async function loadLogoDataUrl() {
  try {
    const bytes = await readFile(join(process.cwd(), "public", "teeshogs-logo-black.png"))
    return `data:image/png;base64,${bytes.toString("base64")}`
  } catch {
    return null
  }
}

/** Shared 1200×630 social share card for Open Graph / Twitter. */
export async function createTeeshogsOgImage() {
  const logoSrc = await loadLogoDataUrl()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#18181b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Teeshogs"
              width={220}
              height={56}
              style={{
                objectFit: "contain",
                // Light plate so the black logo stays readable on dark bg
                backgroundColor: "#ffffff",
                padding: "10px 16px",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Teeshogs
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#a1a1aa",
              letterSpacing: "0.04em",
            }}
          >
            teeshogs.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            African prints for the whole family
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#d4d4d8",
              maxWidth: 860,
            }}
          >
            Adire, kampala, and fashion accessories for men, women, and children.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #3f3f46",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>
            {siteConfig.tagline}
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "#fafafa",
              color: "#18181b",
              fontSize: 22,
              fontWeight: 600,
              padding: "12px 22px",
            }}
          >
            Shop the collection
          </div>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
    }
  )
}
