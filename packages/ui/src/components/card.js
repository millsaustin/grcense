import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/cn";
export const Card = React.forwardRef(({ className, children, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn(
      "rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40",
      className
    ),
    ...props,
    children: children
  })
);
Card.displayName = "Card";
export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn("mb-4 space-y-1", className),
    ...props,
    children: children
  })
);
CardHeader.displayName = "CardHeader";
export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) =>
  _jsx("h3", {
    ref: ref,
    className: cn("text-xl font-semibold leading-none", className),
    ...props,
    children: children
  })
);
CardTitle.displayName = "CardTitle";
export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) =>
  _jsx("p", {
    ref: ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props,
    children: children
  })
);
CardDescription.displayName = "CardDescription";
export const CardContent = React.forwardRef(({ className, children, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn("space-y-4", className),
    ...props,
    children: children
  })
);
CardContent.displayName = "CardContent";
export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) =>
  _jsx("div", {
    ref: ref,
    className: cn("mt-4 flex items-center justify-end gap-2", className),
    ...props,
    children: children
  })
);
CardFooter.displayName = "CardFooter";
