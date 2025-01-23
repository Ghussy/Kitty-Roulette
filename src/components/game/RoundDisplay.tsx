import { Round } from '@/lib/game/types'
import { Card, CardContent } from "@/components/ui/card"

interface RoundDisplayProps {
  visibleRounds: Round[]
  currentShotgun: Round[]
  isReloading: boolean
}

export function RoundDisplay({ visibleRounds, currentShotgun, isReloading }: RoundDisplayProps) {
  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardContent className="p-4">
        <div className="text-center text-2xl space-x-2 min-h-[2.5rem]">
          {isReloading && (
            <span className="text-xl text-gray-600">
              Reloading...
            </span>
          )}
          {isReloading ? (
            // Show visible rounds during reload
            visibleRounds.map((round, index) => (
              <span key={index} className="inline-block">
                {round === 'live' ? '💀' : '⚪'}
              </span>
            ))
          ) : (
            // Show current shotgun state when not reloading
            currentShotgun.map((_, index) => (
              <span key={index} className="inline-block opacity-50">
                🔘
              </span>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 