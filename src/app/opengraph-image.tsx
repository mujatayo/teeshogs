import {
  createTeeshogsOgImage,
  ogImageAlt,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og-brand"

export const alt = ogImageAlt
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function OpenGraphImage() {
  return createTeeshogsOgImage()
}
