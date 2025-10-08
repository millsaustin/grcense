import { jsx as _jsx } from "react/jsx-runtime";
import { Inter } from "next/font/google";
import "@grcense/ui/styles.css";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
    title: "GRCense",
    description: "Governance, Risk, and Compliance platform starter"
};
export default function RootLayout({ children }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: inter.className, children: children }) }));
}
