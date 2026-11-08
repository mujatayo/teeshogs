import type { FaqItem } from "@/lib/help-content"

type FaqListProps = {
  items: FaqItem[]
}

export function FaqList({ items }: FaqListProps) {
  return (
    <div className="mt-10 divide-y border-y">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="cursor-pointer list-none pr-8 text-base font-medium leading-snug marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-4">
              {item.question}
              <span className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
