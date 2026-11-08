import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  name: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.name}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className="size-3.5 shrink-0 opacity-60" /> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-foreground">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-foreground" : undefined}>
                  {item.name}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
