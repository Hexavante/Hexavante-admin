"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { themeUi } from "@/lib/theme-ui";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", themeUi.inputFocus)}>
        <textarea
          className={cn(
            "hx-textarea min-h-[80px] w-full transition-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
