import { Item } from '@/lib/game/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Lock, Cigarette } from 'lucide-react' // Import icons

interface ItemsDisplayProps {
  items: Item[]
  onUseItem: (item: Item) => void
  disabled: boolean
  reloadCount: number
}

export function ItemsDisplay({ items, onUseItem, disabled, reloadCount }: ItemsDisplayProps) {
  if (reloadCount === 0) {
    return null // Don't show items before first reload
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4">
          {items.includes('magnifyingGlass') && (
            <Button
              onClick={() => onUseItem('magnifyingGlass')}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Look at Round
            </Button>
          )}
          {items.includes('handcuffs') && (
            <Button
              onClick={() => onUseItem('handcuffs')}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Handcuffs
            </Button>
          )}
          {items.includes('cigarette') && (
            <Button
              onClick={() => onUseItem('cigarette')}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Cigarette className="w-4 h-4" />
              Cigarette
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 