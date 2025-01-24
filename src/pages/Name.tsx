'use client'

import { useState, useEffect } from 'react'
import { StartScreen } from './StartScreen'
import { RoundDisplay } from '@/components/game/RoundDisplay'
import { Round, Player, Item } from '@/lib/game/types'
import { PlayerCard } from '@/components/game/PlayerCard'

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

  const addItems = (number: number) => {
    const items: Item[] = ['cigarette', 'handcuffs', 'magnifyingGlass'];
    const getRandomItem = () => items[Math.floor(Math.random() * items.length)]

    const player1Items = Array.from({ length: number }, getRandomItem);
    const player2Items = Array.from({ length: number }, getRandomItem);

    setPlayer1Items(player1Items)
    setPlayer2Items(player2Items)
  }

  const reloadShotgun = () => {
    setIsReloading(true)
    const nextReloadCount = reloadCount + 1
    setReloadCount(nextReloadCount)
  
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
        addItems(2);
        break
      default:
        numberOfShells = 6
        numberOfLive = 3
        addItems(3);
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
      if (target === 'player1') {
        setPlayer1Health(h => h - 1)
      } else {
        setPlayer2Health(h => h - 1)
      }
      setMessage(`${round === 'live' ? '💥 Hit!' : '🚫 Miss!'}`)
    } else {
      setMessage('Click! It was a blank.')
    }

    setCurrentTurn(currentTurn === 'player1' ? 'player2' : 'player1')
    if (newShotgun.length === 0) reloadShotgun()
  }

  const lookAtRound = () => {
    if (shotgun.length === 0) return
    
    setMessage(`The next round is ${shotgun[0]}`)
    setCurrentTurn('player1')
  }

  const useItem = (item: Item) => {
    // Items can be used on player's turn but don't end the turn
    if (currentTurn !== 'player1' || gameOver) return

    switch (item) {
      case 'magnifyingGlass':
        if (shotgun.length > 0) {
          setMessage(`Next round is: ${shotgun[0] === 'live' ? 'Live' : 'Blank'}`)
          setPlayer1Items(items => items.filter(i => i !== 'magnifyingGlass')) // Remove after use
        } else {
          setMessage('No rounds to look at!')
        }
        break;
      // Add other item cases here
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

