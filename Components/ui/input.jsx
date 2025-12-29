import * as React from "react"

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
