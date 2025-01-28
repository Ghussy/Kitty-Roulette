'use client'

import { useState, useEffect } from 'react'
import { StartScreen } from './StartScreen'
import { RoundDisplay } from '@/components/game/RoundDisplay'
import { Round, Player, Item } from '@/lib/game/types'
import { PlayerCard } from '@/components/game/PlayerCard'
import { ITEMS } from '@/lib/game/items-logic'
import ShellScene  from '@/components/ShellScene'

interface GameProps {
  className?: string;
}

export default function BuckshotRoulette({ className }: GameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [player1Health, setPlayer1Health] = useState(6)
  const [player2Health, setPlayer2Health] = useState(6)
  const [currentTurn, setCurrentTurn] = useState<Player | ''>('')
  const [shotgun, setShotgun] = useState<Round[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [player1Items, setPlayer1Items] = useState<Item[]>([])
  const [player2Items, setPlayer2Items] = useState<Item[]>([])
  const [isReloading, setIsReloading] = useState(false)
  const [skipNextTurn, setSkipNextTurn] = useState<Player | null>(null)
  const [glitterActive, setGlitterActive] = useState(false)

  // New states for shell animation
  const [shellsVisible, setShellsVisible] = useState(false)
  const [shellsExiting, setShellsExiting] = useState(false)
  const [activeShells, setActiveShells] = useState<boolean[]>([])

  const resetGame = () => {
    setPlayer1Health(6)
    setPlayer2Health(6)
    setCurrentTurn('')
    setGameOver(false)
    setMessage('')
    setPlayer1Items([])
    setPlayer2Items([])
    reloadShotgun()
  }

  const giveRandomItems = (numItems: number) => {
    const availableItems = Object.keys(ITEMS) as Item[]
    
    // Give items to player1, respecting 8-item cap
    const player1RemainingSlots = 8 - player1Items.length
    const player1ItemsToGive = Math.min(numItems, player1RemainingSlots)
    if (player1ItemsToGive > 0) {
      const player1NewItems = Array(player1ItemsToGive).fill(null).map(() => 
        availableItems[Math.floor(Math.random() * availableItems.length)]
      )
      setPlayer1Items(currentItems => [...currentItems, ...player1NewItems])
    }
    
    // Give items to player2, respecting 8-item cap
    const player2RemainingSlots = 8 - player2Items.length
    const player2ItemsToGive = Math.min(numItems, player2RemainingSlots)
    if (player2ItemsToGive > 0) {
      const player2NewItems = Array(player2ItemsToGive).fill(null).map(() => 
        availableItems[Math.floor(Math.random() * availableItems.length)]
      )
      setPlayer2Items(currentItems => [...currentItems, ...player2NewItems])
    }
  }

  const reloadShotgun = (maintainTurn?: Player) => {
    setIsReloading(true)
    const nextReloadCount = reloadCount + 1
    setReloadCount(nextReloadCount)

    // Determine shell count based on reload count
    let numberOfShells
    switch (nextReloadCount) {
      case 1:
        numberOfShells = 3  // First round: 3 shells (1 live, 2 blank)
        break
      case 2:
        numberOfShells = 4  // Second round: 4 shells (2 live, 2 blank)
        giveRandomItems(2)
        break
      default:
        numberOfShells = Math.floor(Math.random() * 7) + 2  // 2 to 8 shells after that
        const randomItemCount = Math.floor(Math.random() * 4)
        if (randomItemCount > 0) {
          giveRandomItems(randomItemCount)
        }
    }
    
    const numberOfLive = Math.floor(numberOfShells / 2)
    const numberOfBlanks = numberOfShells - numberOfLive
    
    const newShells = [
      ...Array(numberOfLive).fill(true),
      ...Array(numberOfBlanks).fill(false)
    ]
    
    console.log(`Reload ${nextReloadCount}: Creating ${numberOfShells} shells (${numberOfLive} live, ${numberOfBlanks} blank)`)
    
    setActiveShells(newShells)
    setShellsVisible(true)
    setShellsExiting(false)

    setTimeout(() => {
      for (let i = newShells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newShells[i], newShells[j]] = [newShells[j], newShells[i]]
      }
      const finalShells = newShells.map(live => live ? 'live' : 'blank')
      console.log('Shuffled shells:', finalShells)
      setShotgun(finalShells)
      
      setShellsExiting(true)
      setIsReloading(false)
      setCurrentTurn(maintainTurn || 'player1')
    }, 2000)
  }

  const handleShellAnimationComplete = () => {
    if (shellsExiting) {
      setShellsVisible(false)
      setShellsExiting(false)
    }
  }

  const handleShot = (shooter: Player, target: Player) => {
    if (shotgun.length === 0) return
    
    setShellsExiting(true)
    
    const round = shotgun[0]
    const newShotgun = shotgun.slice(1)
    console.log(`Shot fired: ${round} shell used, ${newShotgun.length} shells remaining`)
    console.log('Remaining shells:', newShotgun)
    
    setShotgun(newShotgun)

    if (round === 'live') {
      const damage = glitterActive ? 2 : 1
      if (target === 'player1') {
        setPlayer1Health(h => h - damage)
      } else {
        setPlayer2Health(h => h - damage)
      }
      setMessage(`💥 Hit for ${damage} damage!`)
      setGlitterActive(false)
      
      // Change turns after a hit
      const nextPlayer = shooter === 'player1' ? 'player2' : 'player1'
      if (skipNextTurn === nextPlayer) {
        setSkipNextTurn(null)
      } else {
        setCurrentTurn(nextPlayer)
      }
    } else {
      setMessage('Click! It was a blank.')
      setGlitterActive(false)
      
      // Only change turns if shooting opponent
      if (shooter !== target) {
        const nextPlayer = shooter === 'player1' ? 'player2' : 'player1'
        if (skipNextTurn === nextPlayer) {
          setSkipNextTurn(null)
        } else {
          setCurrentTurn(nextPlayer)
        }
      }
    }

    // If this was the last shell, reload but maintain turn if it was a self-shot blank
    if (newShotgun.length === 0) {
      const maintainTurn = round === 'blank' && shooter === target
      reloadShotgun(maintainTurn ? shooter : undefined)
    }
  }


  const useItem = (item: Item) => {
    if (gameOver) return

    const itemData = ITEMS[item]
    itemData.action({
      shotgun,
      setShotgun,
      currentPlayer: currentTurn || 'player1',
      opponent: currentTurn === 'player1' ? 'player2' : 'player1',
      player1Health,
      player2Health,
      setPlayer1Health,
      setPlayer2Health,
      player1Items,
      player2Items,
      setPlayer1Items,
      setPlayer2Items,
      setMessage,
      setCurrentTurn,
      setSkipNextTurn,
      reloadShotgun,
    })

    // Remove only one instance of the used item
    if (currentTurn === 'player1') {
      setPlayer1Items(items => {
        const index = items.indexOf(item)
        return [...items.slice(0, index), ...items.slice(index + 1)]
      })
    } else {
      setPlayer2Items(items => {
        const index = items.indexOf(item)
        return [...items.slice(0, index), ...items.slice(index + 1)]
      })
    }

    if (item === 'turnUpTheMusic') {
      setSkipNextTurn(currentTurn === 'player1' ? 'player2' : 'player1')
    } else if (item === 'glitter') {
      setGlitterActive(true)
    }
  }

  useEffect(() => {
    if (player1Health <= 0) {
      setGameOver(true)
      setMessage('Player 2 Wins!')
      setGameStarted(false)
    } else if (player2Health <= 0) {
      setGameOver(true)
      setMessage('Player 1 Wins!')
      setGameStarted(false)
    }
  }, [player1Health, player2Health])

  if (!gameStarted) {
    return <StartScreen 
      onStartGame={() => {
        setGameStarted(true)
        resetGame()
      }}
      gameOver={gameOver}
      winner={gameOver ? (player1Health <= 0 ? 'Player 2' : 'Player 1') : undefined}
    />
  }

  return (
    <div className={`min-h-screen w-screen flex flex-col md:flex-row md:items-center justify-between ${className || ''}`}>
      {/* Player 2 */}
      <div className="w-full md:w-1/4 rotate-180 md:rotate-0 z-20">
        <PlayerCard
          player="player2"
          health={player2Health}
          items={player2Items}
          isCurrentTurn={!isReloading && currentTurn === 'player2'}
          onShootSelf={() => handleShot('player2', 'player2')}
          onShootOpponent={() => handleShot('player2', 'player1')}
          onUseItem={useItem}
          disabled={currentTurn !== 'player2' || gameOver || isReloading}
        />
      </div>

      {/* Shell scene at the bottom */}
        <div className="absolute inset-0 z-0">
          <ShellScene 
            shellCount={shotgun.length}
            isVisible={shellsVisible}
            isExiting={shellsExiting}
            shells={activeShells}
            onAnimationComplete={handleShellAnimationComplete}
          />
        </div>

      {/* Round display absolutely positioned in middle */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <RoundDisplay message={message} />
        </div>

      {/* Player 1 */}
      <div className="w-full md:w-1/4 z-20">
        <PlayerCard
          player="player1"
          health={player1Health}
          items={player1Items}
          isCurrentTurn={!isReloading && currentTurn === 'player1'}
          onShootSelf={() => handleShot('player1', 'player1')}
          onShootOpponent={() => handleShot('player1', 'player2')}
          onUseItem={useItem}
          disabled={currentTurn !== 'player1' || gameOver || isReloading}
        />
      </div>
    </div>
  )
}

