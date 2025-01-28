import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StartScreenProps {
  onStartGame: (reloadTime: number) => void
  gameOver?: boolean
  winner?: 'Player 1' | 'Player 2'
}

export function StartScreen({ onStartGame, gameOver, winner }: StartScreenProps) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {gameOver ? 'Game Over!' : 'Buckshot Roulette'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            {gameOver 
              ? `${winner} Wins!` 
              : 'A deadly game of chance. Do you dare to play?'}
          </p>
          {gameOver ? (
            <div className="space-y-4">
              <Button onClick={() => onStartGame(2000)} className="w-full">
                Play Again (Quick)
              </Button>
              <Button onClick={() => onStartGame(4000)} className="w-full">
                Play Again (Normal)
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button onClick={() => onStartGame(2000)} className="w-full">
                Quick Game
              </Button>
              <Button onClick={() => onStartGame(4000)} className="w-full">
                Normal Game
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 