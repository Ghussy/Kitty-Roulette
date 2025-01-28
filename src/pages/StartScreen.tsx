import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StartScreenProps {
  onStartGame: () => void
}

export function StartScreen({ onStartGame }: StartScreenProps) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Buckshot Roulette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            A deadly game of chance. Do you dare to play?
          </p>
          <Button onClick={onStartGame} className="w-full">
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 