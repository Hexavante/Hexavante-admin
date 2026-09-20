"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { themeUi } from "@/lib/theme-ui";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", themeUi.inputFocus)}>
        <input
          type={type}
          className={cn(
            "hx-input w-full transition-smooth",
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

Input.displayName = "Input";

export { Input };
