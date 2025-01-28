import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Gun } from './Scene'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { useSpring, animated } from '@react-spring/three'

export default function Scene3D() {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null)
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [isPointedAtViewer, setIsPointedAtViewer] = useState(true)
  const [startPosition, setStartPosition] = useState<'left' | 'front'>('left')

  // spring animation for rotation
  const { rotation } = useSpring({
    rotation: [0, isPointedAtViewer 
      ? (startPosition === 'left' ? Math.PI + Math.PI/2 : Math.PI) 
      : (startPosition === 'left' ? Math.PI/2 : 0), 
    0],
    config: {
      mass: 1,
      tension: 180,
      friction: 12,
    }
  })

  const handleSetAnimations = (animations: string[]) => {
    setAvailableAnimations(animations)
    if (animations.length > 0 && !currentAnimation) {
      setCurrentAnimation(animations[0])
    }
  }

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
        <animated.group rotation-y={rotation}>
          <Gun
            position={[0, -0.5, 0]}
            rotation={[0, 0, 0]}
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
