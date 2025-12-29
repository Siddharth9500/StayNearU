import * as React from "react"

const Badge = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border-transparent bg-slate-200 text-slate-900 hover:bg-slate-300",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-slate-950"
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
