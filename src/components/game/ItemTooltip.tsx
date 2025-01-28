interface ItemTooltipProps {
  name: string
  description: string
  children: React.ReactNode
}

export function ItemTooltip({ name, description, children }: ItemTooltipProps) {
  return (
    <div className="group relative block w-full">
      {children}
      <div className="invisible group-hover:visible absolute z-10 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg -top-20 left-1/2 -translate-x-1/2">
        <div>{description}</div>
      </div>
    </div>
  )
} 