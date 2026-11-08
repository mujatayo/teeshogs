export type HelpLink = {
  title: string
  description: string
  href: string
}

export type FaqItem = {
  question: string
  answer: string
}

export const helpHubLinks: HelpLink[] = [
  {
    title: "FAQs",
    description: "Quick answers on sizing, fabrics, orders, and care.",
    href: "/faqs",
  },
  {
    title: "Size Guide",
    description: "Find your best fit across ready-to-wear and sets.",
    href: "/size-guide",
  },
  {
    title: "Shipping & Delivery",
    description: "Processing times, Fez tracking, and free shipping threshold.",
    href: "/shipping",
  },
  {
    title: "Returns & Exchanges",
    description: "How to return or exchange unworn items within 30 days.",
    href: "/returns",
  },
  {
    title: "Contact Us",
    description: "Need a personal assist? Message the Teeshogs team.",
    href: "/contact",
  },
]

export const faqItems: FaqItem[] = [
  {
    question: "What kinds of African prints does Teeshogs sell?",
    answer:
      "Teeshogs focuses on authentic African prints such as adire and kampala, plus ready-to-wear and fashion accessories for men, women, and children.",
  },
  {
    question: "How do I choose the right size?",
    answer:
      "Use our Size Guide for measurements across ready-to-wear and sets. If you are between sizes, we usually recommend sizing up for comfort. Still unsure? Contact us with your measurements.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Most orders are processed within 1–2 business days. Delivery across Nigeria is handled with tracked Fez shipping. Orders over ₦150,000 qualify for free shipping.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. Once your order ships with Fez, tracking details appear on your order confirmation and status emails. You can also contact support with your order number.",
  },
  {
    question: "What is your returns policy?",
    answer:
      "You have 30 days to return or exchange unworn items with tags attached. Start a return by contacting our team with your order number and the items you want to send back.",
  },
  {
    question: "How should I care for adire and kampala pieces?",
    answer:
      "Wash gently in cool water, preferably by hand or on a delicate cycle. Avoid harsh bleach, and dry away from direct harsh sun to help preserve print colour and fabric quality.",
  },
  {
    question: "Do you ship outside Nigeria?",
    answer:
      "Checkout currently supports Nigerian delivery zones and Fez nationwide shipping. For international requests, contact us and we will advise what is possible for your destination.",
  },
  {
    question: "How can I contact Teeshogs?",
    answer:
      "Email hello@teeshogs.com or use the Contact page. Include your order number if your question is about an existing purchase so we can help faster.",
  },
]
