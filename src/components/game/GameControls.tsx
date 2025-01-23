import { Button } from "@/components/ui/button"

interface GameControlsProps {
  onShootSelf: () => void
  onShootOpponent: () => void
  disabled: boolean
  gameOver: boolean
  onReset: () => void
}

export function GameControls({
  onShootSelf,
  onShootOpponent,
  disabled,
  gameOver,
  onReset
}: GameControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2">
        <Button onClick={onShootSelf} disabled={disabled}>
          Shoot Self
        </Button>
        <Button onClick={onShootOpponent} disabled={disabled}>
          Shoot Opponent
        </Button>
      </div>
      {gameOver && (
        <Button onClick={onReset} className="w-full">
          Play Again
        </Button>
      )}
    </div>
  )
} 