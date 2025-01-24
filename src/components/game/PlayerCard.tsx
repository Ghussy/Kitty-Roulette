import { Item, Player } from '@/lib/game/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
  // console.log(items);
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
        <div className="flex gap-2 flex-wrap">
          {items.map((item, index) => (
            <Button
              key={index}
              onClick={() => onUseItem(item)}
              disabled={disabled}
              variant="secondary"
              size="sm"
            >
              {item === 'magnifyingGlass' ? '🔍' : 
               item === 'handcuffs' ? '⛓️' : '🚬'}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 