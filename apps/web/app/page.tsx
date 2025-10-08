import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card } from "@grcense/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto flex flex-col gap-12 px-6 py-20">
        <section className="space-y-6 text-center">
          <span className="inline-flex items-center rounded-full border border-border px-4 py-1 text-sm font-medium">
            GRCense • Governance, Risk & Compliance
          </span>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Build trust faster with a modern GRC toolkit
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Launch compliant products quicker, manage risk collaboratively, and stay
            audit-ready with a developer-friendly platform starter.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href="/docs/overview">
                Explore the docs
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com/" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <Card key={card.title} className="h-full">
              <div className="space-y-3">
                <card.icon className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

const CARDS = [
  {
    title: "Unified Workflows",
    description:
      "Automate evidence collection, map controls, and centralize assessments with ready-to-extend primitives.",
    icon: ArrowRight
  },
  {
    title: "API-first Integrations",
    description:
      "Connect your risk data sources and share compliance status across your org via typed APIs.",
    icon: ArrowRight
  },
  {
    title: "Composable UI",
    description:
      "Leverage shared UI primitives so your product, dashboard, and admin tools feel cohesive.",
    icon: ArrowRight
  }
] as const;
