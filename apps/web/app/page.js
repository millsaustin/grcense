import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card } from "@grcense/ui";
export default function Home() {
    return (_jsx("main", { className: "min-h-screen bg-background text-foreground", children: _jsxs("div", { className: "container mx-auto flex flex-col gap-12 px-6 py-20", children: [_jsxs("section", { className: "space-y-6 text-center", children: [_jsx("span", { className: "inline-flex items-center rounded-full border border-border px-4 py-1 text-sm font-medium", children: "GRCense \u2022 Governance, Risk & Compliance" }), _jsx("h1", { className: "text-4xl font-semibold tracking-tight md:text-6xl", children: "Build trust faster with a modern GRC toolkit" }), _jsx("p", { className: "mx-auto max-w-3xl text-lg text-muted-foreground", children: "Launch compliant products quicker, manage risk collaboratively, and stay audit-ready with a developer-friendly platform starter." }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-4", children: [_jsx(Button, { asChild: true, children: _jsxs(Link, { href: "/docs/overview", children: ["Explore the docs", _jsx(ArrowRight, { className: "ml-2 h-4 w-4", "aria-hidden": "true" })] }) }), _jsx(Button, { variant: "outline", asChild: true, children: _jsx(Link, { href: "https://github.com/", target: "_blank", children: "View on GitHub" }) })] })] }), _jsx("section", { className: "grid gap-6 md:grid-cols-3", children: CARDS.map((card) => (_jsx(Card, { className: "h-full", children: _jsxs("div", { className: "space-y-3", children: [_jsx(card.icon, { className: "h-10 w-10 text-primary" }), _jsx("h2", { className: "text-xl font-semibold", children: card.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: card.description })] }) }, card.title))) })] }) }));
}
const CARDS = [
    {
        title: "Unified Workflows",
        description: "Automate evidence collection, map controls, and centralize assessments with ready-to-extend primitives.",
        icon: ArrowRight
    },
    {
        title: "API-first Integrations",
        description: "Connect your risk data sources and share compliance status across your org via typed APIs.",
        icon: ArrowRight
    },
    {
        title: "Composable UI",
        description: "Leverage shared UI primitives so your product, dashboard, and admin tools feel cohesive.",
        icon: ArrowRight
    }
];
