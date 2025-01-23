export type Round = 'live' | 'blank'
export type Player = 'player1' | 'player2'
export type Item = 'magnifyingGlass' | 'handcuffs' | 'cigarette'

export interface GameState {
  playerHealth: number
  computerHealth: number
  currentTurn: Player
  shotgun: Round[]
  gameOver: boolean
  message: string
  reloadCount: number
  visibleRounds: Round[]
  items: Item[]
} 