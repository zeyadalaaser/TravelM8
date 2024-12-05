import * as React from "react"
import { cn } from "@/lib/utils"

export interface ArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right"
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
}

const Arrow = React.forwardRef<HTMLButtonElement, ArrowProps>(
  ({ className, direction, size = "md", variant = "light", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
          {
            " text-gray-800 hover:bg-gray-100": variant === "light",
            "bg-gray-800 text-white hover:bg-gray-700": variant === "dark",
          },
          {
            "h-10 w-10": size === "sm",
            "h-12 w-12": size === "md",
            "h-14 w-14": size === "lg",
          },
          className
        )}
        {...props}
      >
        <span className="sr-only">
          {direction === "left" ? "Previous" : "Next"}
        </span>
        <svg
          className={cn(
            "w-6 h-6 transition-transform duration-300 ease-in-out",
            {
              "rotate-180": direction === "left",
              "-translate-x-1 group-hover:translate-x-0": direction === "right",
              "translate-x-1 group-hover:translate-x-0": direction === "left",
            }
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100",
            {
              "left-0": direction === "right",
              "right-0": direction === "left",
            }
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full",
              {
                "bg-gray-200": variant === "light",
                "bg-gray-600": variant === "dark",
              }
            )}
          />
        </div>
      </button>
    )
  }
)
Arrow.displayName = "Arrow"

export { Arrow }
