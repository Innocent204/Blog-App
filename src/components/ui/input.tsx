import * as React from "react";

import { cn } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          error ? "border-destructive ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/50" : "",
          className,
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };
