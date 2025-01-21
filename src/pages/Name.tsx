'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Round = 'live' | 'blank'


export default function BuckshotRoulette() {
  const [playerHealth, setPlayerHealth] = useState(3)
  const [computerHealth, setComputerHealth] = useState(3)
  const [currentTurn, setCurrentTurn] = useState<'player' | 'computer'>('player')
  const [shotgun, setShotgun] = useState<Round[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    setPlayerHealth(3)
    setComputerHealth(3)
    setCurrentTurn('player')
    setGameOver(false)
    setMessage('')
    reloadShotgun()
  }

  const reloadShotgun = () => {
    const newShotgun: Round[] = []
    for (let i = 0; i < 6; i++) {
      newShotgun.push(Math.random() < 0.5 ? 'live' : 'blank')
    }
    setShotgun(newShotgun)
  }

  const shootSelf = () => {
    if (shotgun.length === 0) return
    
    const round = shotgun[0]
    const newShotgun = shotgun.slice(1)
    setShotgun(newShotgun)

    if (round === 'live') {
      setPlayerHealth(playerHealth - 1)
      setMessage('You shot yourself with a live round!')
    } else {
      setMessage('Click! It was a blank.')
    }

    if (newShotgun.length === 0) reloadShotgun()
    setCurrentTurn('computer')
  }

  const shootOpponent = () => {
    if (shotgun.length === 0) return
    
    const round = shotgun[0]
    const newShotgun = shotgun.slice(1)
    setShotgun(newShotgun)

    if (round === 'live') {
      setComputerHealth(computerHealth - 1)
      setMessage('You shot the computer with a live round!')
    } else {
      setMessage('Click! It was a blank.')
    }

    if (newShotgun.length === 0) reloadShotgun()
    setCurrentTurn('computer')
  }

  const lookAtRound = () => {
    if (shotgun.length === 0) return
    
    setMessage(`The next round is ${shotgun[0]}`)
    setCurrentTurn('computer')
  }

  const computerTurn = () => {
    if (shotgun.length === 0) return
    
    const action = Math.random()
    if (action < 0.4) {
      // Shoot player
      const round = shotgun[0]
      const newShotgun = shotgun.slice(1)
      setShotgun(newShotgun)

      if (round === 'live') {
        setPlayerHealth(playerHealth - 1)
        setMessage('The computer shot you with a live round!')
      } else {
        setMessage('Click! The computer shot a blank at you.')
      }

      if (newShotgun.length === 0) reloadShotgun()
    } else if (action < 0.8) {
      // Shoot self
      const round = shotgun[0]
      const newShotgun = shotgun.slice(1)
      setShotgun(newShotgun)

      if (round === 'live') {
        setComputerHealth(computerHealth - 1)
        setMessage('The computer shot itself with a live round!')
      } else {
        setMessage('Click! The computer shot a blank at itself.')
      }

      if (newShotgun.length === 0) reloadShotgun()
    } else {
      // Look at round
      setMessage('The computer looked at the next round.')
    }

    setCurrentTurn('player')
  }

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameOver(true)
      setMessage('Game Over! You lost.')
    } else if (computerHealth <= 0) {
      setGameOver(true)
      setMessage('Congratulations! You won!')
    } else if (currentTurn === 'computer') {
      const timer = setTimeout(() => {
        computerTurn()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [playerHealth, computerHealth, currentTurn])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Buckshot Roulette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div>Player Health: {playerHealth}</div>
          <div>Computer Health: {computerHealth}</div>
        </div>
        <div className="text-center">{message}</div>
        <div className="flex justify-center space-x-2">
          <Button onClick={shootSelf} disabled={currentTurn !== 'player' || gameOver}>
            Shoot Self
          </Button>
          <Button onClick={shootOpponent} disabled={currentTurn !== 'player' || gameOver}>
            Shoot Opponent
          </Button>
          <Button onClick={lookAtRound} disabled={currentTurn !== 'player' || gameOver}>
            Look at Round
          </Button>
        </div>
        {gameOver && (
          <Button onClick={resetGame} className="w-full">
            Play Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

