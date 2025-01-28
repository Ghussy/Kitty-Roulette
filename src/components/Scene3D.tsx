import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Gun } from './Scene'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { useSpring, animated } from '@react-spring/three'
import { Shell } from './Shell'

export default function Scene3D({ currentTurn }: { currentTurn: 'player1' | 'player2' }) {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null)
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [isPointedAtViewer, setIsPointedAtViewer] = useState(true)
  const [startPosition, setStartPosition] = useState<'left' | 'front'>('left')
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1')

  // spring animation for rotation
  const { rotation } = useSpring({
    rotation: [0, currentTurn === 'player1' ? Math.PI : 0, 0], // Flip based on the turn
    config: {
      mass: 1,
      tension: 180,
      friction: 12,
    },
  })

  const handleSetAnimations = (animations: string[]) => {
    setAvailableAnimations(animations)
    if (animations.length > 0 && !currentAnimation) {
      setCurrentAnimation(animations[0])
    }
  }

  useEffect(() => {
    setIsPointedAtViewer(currentPlayer === 'player1')
  }, [currentPlayer])

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0.5, 2],
          fov: 45,
        }}
        style={{
          width: '100vw',
          height: '75vh',
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <animated.group rotation={rotation}>
          {/* <Shell position={[0, -0.5, 0]} scale={.02} /> */}
          <Gun
            position={[0, -0.5, 0]}
            rotation={[0, 0, 0]} // Base rotation is now handled by the animated group
            scale={.8}
            currentAnimation={currentAnimation}
            onSetAnimations={handleSetAnimations}
          />
        </animated.group>
      </Canvas>
      <div className="flex justify-center gap-2 mt-2">
        <Button
          onClick={() => setIsPointedAtViewer(!isPointedAtViewer)}
          variant="outline"
        >
          {isPointedAtViewer ? 'Point Away' : 'Point At Me'}
        </Button>
        <Button
          onClick={() => setStartPosition(startPosition === 'left' ? 'front' : 'left')}
          variant="outline"
        >
          Position: {startPosition === 'left' ? 'Left' : 'Front'}
        </Button>
      </div>
      <div>
        {availableAnimations.map((animation) => (
          <button
            key={animation}
            onClick={() => setCurrentAnimation(animation)}
            style={{
              margin: '0.5em',
              padding: '0.5em 1em',
              backgroundColor: currentAnimation === animation ? '#4caf50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {animation}
          </button>
        ))}
      </div>
    </>
  )
}
