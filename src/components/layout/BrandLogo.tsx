"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  priority?: boolean
  /**
   * On dark surfaces, keep the real Teeshogs mark and sit it on a light plate
   * (white/black asset files in /public are still the old Teepha brand).
   */
  variant?: "default" | "onDark"
}

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  variant = "default",
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        variant === "onDark" && "rounded-sm bg-white px-2.5 py-1.5",
        className
      )}
      aria-label="Teeshogs Clothier home"
    >
      <Image
        src="/teeshogs-logo.jpg"
        alt="Teeshogs Clothier"
        width={280}
        height={72}
        priority={priority}
        className={cn("h-9 w-auto object-contain sm:h-10 md:h-11", imageClassName)}
      />
    </Link>
  )
}
