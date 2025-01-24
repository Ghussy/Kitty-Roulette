import { Item, Player } from '@/lib/game/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ItemTooltip } from './ItemTooltip'
import { ITEMS } from '@/lib/game/items-logic'

interface PlayerCardProps {
  player: Player
  health: number
  items: Item[]
  isCurrentTurn: boolean
  onShootSelf: () => void
  onShootOpponent: () => void
  onUseItem: (item: Item) => void
  disabled: boolean
}

export function PlayerCard({
  player,
  health,
  items,
  isCurrentTurn,
  onShootSelf,
  onShootOpponent,
  onUseItem,
  disabled
}: PlayerCardProps) {
    console.log(items);
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className={`text-2xl font-bold text-center ${
          isCurrentTurn ? 'text-green-600' : ''
        }`}>
          {player === 'player1' ? 'Player 1' : 'Player 2'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-2xl">
          {'❤️'.repeat(health)}{'🖤'.repeat(6 - health)}
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onShootSelf} 
            disabled={disabled}
            variant="destructive"
          >
            Shoot Self
          </Button>
          <Button 
            onClick={onShootOpponent} 
            disabled={disabled}
            variant="destructive"
          >
            Shoot Opponent
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          {items.map((item, index) => {
            const itemData = ITEMS[item]
            return (
              <ItemTooltip 
                key={`${item}-${index}`}
                name={itemData.name}
                description={itemData.description}
              >
                <button
                  onClick={() => onUseItem(item)}
                  disabled={disabled}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {itemData.name}
                </button>
              </ItemTooltip>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 