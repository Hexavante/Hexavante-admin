"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-4 w-4 rounded border-slate-600 text-sky-500 focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          className,
        )}
        {...props}
      />
    );
  },
);
Checkbox.displayName = "Checkbox";