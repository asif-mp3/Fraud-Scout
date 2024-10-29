import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // For validation: error state
  success?: boolean; // For validation: success state
  loading?: boolean; // For loading state
  iconLeft?: React.ReactNode; // For icons before the input text
  iconRight?: React.ReactNode; // For icons after the input text
  size?: "small" | "medium" | "large"; // To support different sizes
  isTextarea?: boolean; // To support multi-line inputs
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, loading, iconLeft, iconRight, size = "medium", isTextarea, ...props }, ref) => {
    const baseStyles = cn(
      "flex w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      {
        "h-8 text-sm": size === "small",
        "h-10 text-base": size === "medium",
        "h-12 text-lg": size === "large",
        "border-red-500 focus-visible:ring-red-500": error,
        "border-green-500 focus-visible:ring-green-500": success,
        "border-input focus-visible:ring-ring": !error && !success,
        "hover:bg-gray-100 focus-visible:ring-2": !loading,
        "relative bg-opacity-60": loading, // Loading spinner background styling
      },
      className
    );

    const wrapperStyles = cn("relative flex items-center", {
      "cursor-not-allowed opacity-50": props.disabled,
    });

    const iconPadding = cn({
      "pl-10": iconLeft, // Padding for left icon
      "pr-10": iconRight, // Padding for right icon
    });

    return (
      <div className={wrapperStyles}>
        {iconLeft && <div className="absolute left-3 text-gray-500">{iconLeft}</div>}
        {!isTextarea ? (
          <input
            type={type}
            className={cn(baseStyles, iconPadding)}
            ref={ref}
            {...props}
          />
        ) : (
          <textarea
            className={cn(baseStyles, "resize-none")} // Resizable text area
            ref={ref as any}
            rows={3}
            {...props}
          />
        )}
        {iconRight && <div className="absolute right-3 text-gray-500">{iconRight}</div>}
        {loading && (
          <div className="absolute right-3 animate-spin">
            {/* Loading spinner */}
            <svg
              className="h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v2m0 12v2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05l-1.414-1.414m12.728 12.728l-1.414-1.414M6.05 17.95l-1.414-1.414"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
