'use client'

import { useState, useEffect } from 'react'
import { StartScreen } from './StartScreen'
import { RoundDisplay } from '@/components/game/RoundDisplay'
import { Round, Player, Item } from '@/lib/game/types'
import { PlayerCard } from '@/components/game/PlayerCard'
import { ITEMS } from '@/lib/game/items-logic'


export default function BuckshotRoulette() {
  const [gameStarted, setGameStarted] = useState(false)
  const [player1Health, setPlayer1Health] = useState(6)
  const [player2Health, setPlayer2Health] = useState(6)
  const [currentTurn, setCurrentTurn] = useState<Player>('player1')
  const [shotgun, setShotgun] = useState<Round[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [visibleRounds, setVisibleRounds] = useState<Round[]>([])
  const [player1Items, setPlayer1Items] = useState<Item[]>([])
  const [player2Items, setPlayer2Items] = useState<Item[]>([])
  const [isReloading, setIsReloading] = useState(false)
  const [skipNextTurn, setSkipNextTurn] = useState<Player | null>(null)
  const [glitterActive, setGlitterActive] = useState(false)


  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    setPlayer1Health(6)
    setPlayer2Health(6)
    setCurrentTurn('player1')
    setGameOver(false)
    setMessage('')
    setPlayer1Items([])
    setPlayer2Items([])
    reloadShotgun()
  }

  const giveRandomItems = (numItems: number) => {
    const availableItems = Object.keys(ITEMS) as Item[]

    // Give items to player1
    const player1NewItems = Array(numItems).fill(null).map(() =>
      availableItems[Math.floor(Math.random() * availableItems.length)]
    )
    setPlayer1Items(currentItems => [...currentItems, ...player1NewItems])

    // Give items to player2
    const player2NewItems = Array(numItems).fill(null).map(() =>
      availableItems[Math.floor(Math.random() * availableItems.length)]
    )
    setPlayer2Items(currentItems => [...currentItems, ...player2NewItems])
  }

  const reloadShotgun = () => {
    setIsReloading(true)
    const nextReloadCount = reloadCount + 1
    setReloadCount(nextReloadCount)

    // Decide how many items to give based on reload count
    let numberOfItems
    switch (nextReloadCount) {
      case 1:
        numberOfItems = 0
        break
      case 2:
        numberOfItems = 1
        break
      default:
        numberOfItems = 2
    }

    giveRandomItems(numberOfItems)

    // Decide how many bullets to load for this reload.
    let numberOfShells
    let numberOfLive
    switch (nextReloadCount) {
      case 1:
        numberOfShells = 3
        numberOfLive = 1
        break
      case 2:
        numberOfShells = 4
        numberOfLive = 2
        break
      default:
        numberOfShells = 6
        numberOfLive = 3
    }

    // Build the new shotgun array
    const newShotgun: Round[] = []
    for (let i = 0; i < numberOfLive; i++) {
      newShotgun.push('live')
    }
    for (let i = 0; i < numberOfShells - numberOfLive; i++) {
      newShotgun.push('blank')
    }

    // Show the rounds before shuffling
    setVisibleRounds([...newShotgun])

    // Shuffle after a delay
    setTimeout(() => {
      // Shuffle the rounds
      for (let i = newShotgun.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[newShotgun[i], newShotgun[j]] = [newShotgun[j], newShotgun[i]]
      }
      setShotgun(newShotgun)
      setVisibleRounds([])
      setIsReloading(false)
    }, 2000)
  }

  const handleShot = (shooter: Player, target: Player) => {
    if (shotgun.length === 0) return

    const round = shotgun[0]
    const newShotgun = shotgun.slice(1)
    setShotgun(newShotgun)

    if (round === 'live') {
      const damage = glitterActive ? 2 : 1
      if (target === 'player1') {
        setPlayer1Health(h => h - damage)
      } else {
        setPlayer2Health(h => h - damage)
      }
      setMessage(`💥 Hit for ${damage} damage!`)
      setGlitterActive(false) // Reset glitter after use

      // If the shooter shot themselves, move to the next player
      if (shooter !== target) {
        const nextPlayer = currentTurn === 'player1' ? 'player2' : 'player1'
        setCurrentTurn(nextPlayer)
      } else {
        // If the shooter shot themselves, move to the next player even though they took damage
        const nextPlayer = currentTurn === 'player1' ? 'player2' : 'player1'
        setCurrentTurn(nextPlayer)
      }
    } else {
      setMessage('Click! It was a blank.')
      setGlitterActive(false) // Reset glitter on miss too

      // If the player shot themselves with a blank, they get another turn
      if (shooter === target) {
        setCurrentTurn(shooter)  // The shooter gets another turn if it's a blank
      } else {
        // If it's a blank but the opponent is shot, move to the next player
        const nextPlayer = currentTurn === 'player1' ? 'player2' : 'player1'
        setCurrentTurn(nextPlayer)
      }
    }

    if (newShotgun.length === 0) reloadShotgun()
  }

  const useItem = (item: Item) => {
    if (gameOver) return

    const itemData = ITEMS[item]
    itemData.action({
      shotgun,
      setShotgun,
      currentPlayer: currentTurn,
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
    } else if (player2Health <= 0) {
      setGameOver(true)
      setMessage('Player 1 Wins!')
    }
  }, [player1Health, player2Health])

  if (!gameStarted) {
    return <StartScreen onStartGame={() => setGameStarted(true)} />
  }

  return (
    <div className="container mx-auto p-4">
      <RoundDisplay
        visibleRounds={visibleRounds}
        currentShotgun={shotgun}
        isReloading={isReloading}
      />
      <div className="flex gap-4 justify-center">
        <PlayerCard
          player="player1"
          health={player1Health}
          items={player1Items}
          isCurrentTurn={currentTurn === 'player1'}
          onShootSelf={() => handleShot('player1', 'player1')}
          onShootOpponent={() => handleShot('player1', 'player2')}
          onUseItem={useItem}
          disabled={currentTurn !== 'player1' || gameOver || isReloading}
        />
        <PlayerCard
          player="player2"
          health={player2Health}
          items={player2Items}
          isCurrentTurn={currentTurn === 'player2'}
          onShootSelf={() => handleShot('player2', 'player2')}
          onShootOpponent={() => handleShot('player2', 'player1')}
          onUseItem={useItem}
          disabled={currentTurn !== 'player2' || gameOver || isReloading}
        />
      </div>
      <div className="text-center mt-4 text-xl">
        {message}
      </div>
    </div>
  )
}

