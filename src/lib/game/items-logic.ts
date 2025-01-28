import { Item, Player, Round } from './types'
// import Melody from "@/assets/Melody.svg?react"
import Boba from '@/assets/icons/boba.svg?react'
import Candy from '@/assets/icons/candy.svg?react'
import MagnifyingGlass from '@/assets/icons/magnifying-glass.svg?react'
import Purse from '@/assets/icons/purse.svg?react'
import Sparkles from '@/assets/icons/sparkles.svg?react'
import Speaker from '@/assets/icons/speaker.svg?react'

export interface ItemData {
  id: Item
  name: string
  description: string
  emoji: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  action: (params: ItemActionParams) => void
}

interface ItemActionParams {
  shotgun: Round[]
  setShotgun: (rounds: Round[]) => void
  currentPlayer: Player
  opponent: Player
  player1Health: number
  player2Health: number
  setPlayer1Health: (health: number) => void
  setPlayer2Health: (health: number) => void
  player1Items: Item[]
  player2Items: Item[]
  setPlayer1Items: (items: Item[] | ((items: Item[]) => Item[])) => void
  setPlayer2Items: (items: Item[] | ((items: Item[]) => Item[])) => void
  setMessage: (message: string) => void
  setCurrentTurn: (player: Player) => void
  setSkipNextTurn: (player: Player) => void
  reloadShotgun: () => void
}

export const ITEMS: Record<Item, ItemData> = {
  magnifyingGlass: {
    id: 'magnifyingGlass',
    name: 'Magnifying Glass',
    emoji: '🔍',
    icon: MagnifyingGlass,
    description: 'Peek at the next round in the shotgun',
    action: ({ shotgun, setMessage }) => {
      if (shotgun.length > 0) {
        setMessage(`Next round is: ${shotgun[0] === 'live' ? 'Live' : 'Blank'}`)
      } else {
        setMessage('No rounds to look at!')
      }
    }
  },
  stickyHand: {
    id: 'stickyHand',
    name: 'Sticky Hand',
    emoji: '✋',
    icon: Purse,
    description: 'Steal a random item from the opponent',
    action: ({ opponent, player1Items, player2Items, setPlayer1Items, setPlayer2Items, setMessage }) => {
      const opponentItems = opponent === 'player1' ? player1Items : player2Items
      const stealableItems = opponentItems.filter(item => item !== 'stickyHand')
      
      if (stealableItems.length === 0) {
        setMessage('No items to steal!')
        return
      }
      
      const randomIndex = Math.floor(Math.random() * stealableItems.length)
      const stolenItem = stealableItems[randomIndex]
      
      if (opponent === 'player1') {
        setPlayer1Items((items: Item[]) => items.filter(item => item !== stolenItem))
        setPlayer2Items((items: Item[]) => [...items, stolenItem])
      } else {
        setPlayer2Items((items: Item[]) => items.filter(item => item !== stolenItem))
        setPlayer1Items((items: Item[]) => [...items, stolenItem])
      }
      setMessage(`Stole a ${ITEMS[stolenItem].name}!`)
    }
  },
  boba: {
    id: 'boba',
    name: 'Boba',
    emoji: '🧋',
    icon: Boba,
    description: 'Eject the current round in the shotgun',
    action: ({ shotgun, setShotgun, setMessage, reloadShotgun }) => {
      if (shotgun.length > 0) {
        const [ejectedRound, ...remainingRounds] = shotgun
        setShotgun(remainingRounds)
        setMessage(`Ejected a ${ejectedRound === 'live' ? 'Live' : 'Blank'} round!`)
        
        // If we ejected the last round, trigger a reload
        if (remainingRounds.length === 0) {
          reloadShotgun()
        }
      } else {
        setMessage('No rounds to eject!')
      }
    }
  },
  candy: {
    id: 'candy',
    name: 'Candy',
    emoji: '🍬',
    icon: Candy,
    description: 'Restore one heart (up to the max)',
    action: ({ currentPlayer, player1Health, player2Health, setPlayer1Health, setPlayer2Health, setMessage }) => {
      const MAX_HEALTH = 6
      if (currentPlayer === 'player1' && player1Health < MAX_HEALTH) {
        setPlayer1Health(player1Health + 1)
        setMessage('Healed 1 heart!')
      } else if (currentPlayer === 'player2' && player2Health < MAX_HEALTH) {
        setPlayer2Health(player2Health + 1)
        setMessage('Healed 1 heart!')
      } else {
        setMessage('Already at max health!')
      }
    }
  },
  glitter: {
    id: 'glitter',
    name: 'Glitter',
    emoji: '✨',
    icon: Sparkles,
    description: 'Double the damage on the next successful shot',
    action: ({ setMessage }) => {
      // This will need additional game state to track damage multiplier
      setMessage('Next shot will deal double damage!')
    }
  },
  turnUpTheMusic: {
    id: 'turnUpTheMusic',
    name: 'Turn Up the Music',
    emoji: '🔊',
    icon: Speaker,
    description: "Force the opponent to skip their next turn",
    action: ({ opponent, setCurrentTurn, setMessage }) => {
      setCurrentTurn(opponent === 'player1' ? 'player2' : 'player1')
      setMessage('Opponent skips their next turn!')
    }
  }
} 