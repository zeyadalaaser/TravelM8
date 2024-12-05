import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  // React Router for navigation

interface SeeAllButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  arrow?: boolean
  redirectTo: string  // The base URL to navigate to
  currency: string  // The dynamic currency parameter to append to the URL
}

const SeeAllButton = React.forwardRef<HTMLButtonElement, SeeAllButtonProps>(
  ({ className, children, arrow = true, redirectTo, currency, ...props }, ref) => {
    const navigate = useNavigate()  // React Router's navigate hook

    const handleClick = () => {
      // Add currency dynamically to the redirect URL
      const url = `${redirectTo}&currency=${currency}`
      navigate(url)  // Navigate to the updated URL with the currency parameter
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}  // Trigger navigation on click
        className={cn(
          "inline-flex items-center gap-2 text-[15px] font-medium text-blue-600 hover:text-blue-700 transition-colors",
          className
        )}
        {...props}
      >
        {children}
        {arrow && <ArrowRight className="w-4 h-4 stroke-[2]" />}
      </button>
    )
  }
)

SeeAllButton.displayName = "SeeAllButton"

export { SeeAllButton }
