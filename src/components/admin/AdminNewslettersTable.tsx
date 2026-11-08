"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Copy, Mail, Search, Trash2 } from "lucide-react"
import {
  deleteNewsletterSubscriber,
  updateNewsletterStatus,
} from "@/app/admin/newsletters/actions"
import {
  computeNewsletterStats,
  newsletterSourceLabel,
  newsletterStatusLabel,
  newsletterStatusVariant,
  type NewsletterSubscriber,
} from "@/lib/newsletter-subscribers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
  subscribers: NewsletterSubscriber[]
}

export function AdminNewslettersTable({ subscribers }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [source, setSource] = useState("all")
  const [pending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const stats = useMemo(() => computeNewsletterStats(subscribers), [subscribers])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return subscribers.filter((subscriber) => {
      const matchesStatus = status === "all" || subscriber.status === status
      const matchesSource = source === "all" || subscriber.source === source
      const matchesQuery = !needle || subscriber.email.toLowerCase().includes(needle)
      return matchesStatus && matchesSource && matchesQuery
    })
  }, [subscribers, query, status, source])

  const cards = [
    { title: "All emails", value: stats.total, detail: "Collected from the storefront" },
    { title: "Subscribed", value: stats.subscribed, detail: "Active list members" },
    { title: "Unsubscribed", value: stats.unsubscribed, detail: "Opted out" },
    {
      title: "Popup / Footer",
      value: `${stats.fromPopup} / ${stats.fromFooter}`,
      detail: "Signup source split",
    },
  ]

  const onStatusChange = (id: string, next: string) => {
    startTransition(async () => {
      const result = await updateNewsletterStatus(id, next)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(`Marked as ${newsletterStatusLabel(next)}`)
      router.refresh()
    })
  }

  const onDelete = () => {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    startTransition(async () => {
      const result = await deleteNewsletterSubscriber(id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Subscriber removed")
      router.refresh()
    })
  }

  const onCopyEmails = async () => {
    const emails = filtered
      .filter((item) => item.status === "subscribed")
      .map((item) => item.email)
    if (emails.length === 0) {
      toast.error("No subscribed emails in the current filter")
      return
    }
    try {
      await navigator.clipboard.writeText(emails.join(", "))
      toast.success(`Copied ${emails.length} email${emails.length === 1 ? "" : "s"}`)
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Mail className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums">{card.value}</div>
              <CardDescription className="mt-1">{card.detail}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search email..."
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="subscribed">Subscribed</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="popup">Popup</SelectItem>
            <SelectItem value="footer">Footer</SelectItem>
            <SelectItem value="checkout">Checkout</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={onCopyEmails} className="shrink-0">
          <Copy className="size-4" />
          Copy emails
        </Button>
      </div>

      <div className="overflow-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No subscribers match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {newsletterSourceLabel(subscriber.source)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={newsletterStatusVariant(subscriber.status)}>
                      {newsletterStatusLabel(subscriber.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(subscriber.created_at).toLocaleString("en-NG")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Select
                        value={subscriber.status}
                        onValueChange={(next) => onStatusChange(subscriber.id, next)}
                        disabled={pending}
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subscribed">Subscribed</SelectItem>
                          <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${subscriber.email}`}
                        disabled={pending}
                        onClick={() => setDeleteId(subscriber.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the email from the newsletter list. They can subscribe again
              later from the storefront.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
