import React from 'react';
import { Item, Player } from '@/lib/game/types'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  const heartColor = player === 'player1' ? '💜 ' : '💗 ';

  return (
    <Card className="w-full max-w-md h-[45vh] bg-transparent rounded-[2rem] p-4 relative border-0">
      {/* Hearts */}
      <div className={`absolute bottom-3 left-0 right-0 flex flex-col items-center gap-4 text-2xl ${!isCurrentTurn
          ? 'motion-translate-y-in-[100%]'
          : 'motion-translate-y-out-[70%]'
        }`}>
        <div className="flex justify-center gap-1">
          {heartColor.repeat(health)}
        </div>
        <div className="flex justify-center gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="w-8 h-10 rounded-lg bg-gray-800/30 shadow-inner flex items-center justify-center text-sm"
            >
              {/* {item ? ITEMS[item as keyof typeof ITEMS].emoji : ''} */}
              {item ? (
                React.createElement(ITEMS[item as keyof typeof ITEMS].icon, {
                  className: "w-6 h-6" // Fixed icon size here
                })
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4 mb-4">
        {/* Left side - First 4 items */}
        <div
          className={`space-y-[2vh] flex flex-col items-center w-[25%] h-full ${isCurrentTurn
              ? 'motion-delay-[0.50s] motion-opacity-in-0 motion-translate-x-in-[-115%] motion-blur-in-md'
              : 'motion-opacity-out-0 motion-delay-[0.10s] motion-translate-x-out-[-125%] motion-blur-out-md'
            }`}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={index}
              onClick={() => items[index] && onUseItem(items[index])}
              disabled={disabled || !items[index] || !isCurrentTurn}
              className="w-[5rem] h-[5rem] flex items-center justify-center bg-gray-800 rounded-2xl shadow-lg disabled:opacity-50"
            >
              {items[index] ? (
                React.createElement(ITEMS[items[index] as keyof typeof ITEMS].icon, {
                  className: "w-8 h-8 text-white" // Icon size fixed here
                })
              ) : (
                '\u00A0' // Non-breaking space for empty buttons
              )}
            </button>
          ))}
        </div>

        {/* Middle - Shoot controls */}
        <div className="space-y-4 flex flex-col items-center">
          <Button
            onClick={onShootOpponent}
            disabled={disabled || !isCurrentTurn}
            className={`w-full h-32 bg-gray-800 hover:bg-gray-700 rounded-2xl shadow-lg text-2xl font-normal disabled:opacity-50 ${isCurrentTurn
                ? 'motion-delay-[1.00s] motion-opacity-in-0 motion-scale-in motion-blur-in-md'
                : 'motion-opacity-out-0 motion-scale-out-0 motion-blur-out-md'
              }`}
          >
            Shoot
            <br />
            Opp
          </Button>
          <Button
            onClick={onShootSelf}
            disabled={disabled || !isCurrentTurn}
            className={`w-full h-32 bg-gray-800 hover:bg-gray-700 rounded-2xl shadow-lg text-2xl font-normal disabled:opacity-50 ${isCurrentTurn
                ? 'motion-delay-[1.00s] motion-opacity-in-0 motion-scale-in motion-blur-in-md'
                : 'motion-opacity-out-0 motion-scale-out-0 motion-blur-out-md'
              }`}
          >
            Shoot
            <br />
            Self
          </Button>
        </div>

        {/* Right side - Last 4 items */}
        <div
          className={`space-y-[2vh] flex flex-col items-center w-[25%] h-full ${isCurrentTurn
              ? 'motion-delay-[0.50s] motion-opacity-in-0 motion-translate-x-in-[115%] motion-blur-in-md'
              : 'motion-opacity-out-0 motion-delay-[0.10s] motion-translate-x-out-[-125%] motion-blur-out-md'
            }`}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={index + 4}
              onClick={() => items[index + 4] && onUseItem(items[index + 4])}
              disabled={disabled || !items[index + 4] || !isCurrentTurn}
              className="w-[5rem] h-[5rem] flex items-center justify-center bg-gray-800 rounded-2xl shadow-lg disabled:opacity-50"
            >
              {items[index + 4] ? (
                React.createElement(ITEMS[items[index + 4] as keyof typeof ITEMS].icon, {
                  className: "w-8 h-8 text-white" // Icon size fixed here
                })
              ) : (
                '\u00A0' // Non-breaking space for empty buttons
              )}
            </button>
          ))}
        </div>
      </div>
    </Card>

  )
}