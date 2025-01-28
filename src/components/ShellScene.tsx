import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useTrail, animated } from '@react-spring/three'
import { Shell } from './Shell'

interface ShellSceneProps {
  shellCount: number;
  isVisible: boolean;
  isExiting: boolean;
  shells: boolean[];
  onAnimationComplete?: () => void;
}

export default function ShellScene({
  isVisible,
  isExiting,
  shells,
  onAnimationComplete 
}: ShellSceneProps) {
  const [time, setTime] = useState(0)
  const [displayedShells, setDisplayedShells] = useState(shells)
  
  const trail = useTrail(shells.length, {
    from: { scale: [0.5, 0.5, 0.5], y: 0, x: 10, rotation: 0 },
    to: async (next) => {
      if (isVisible && shells.length > 0 && !isExiting) {
        await next({ 
          scale: [1.0, 1.0, 1.0], 
          y: 0, 
          x: 0,
          rotation: -Math.PI * 2,
          config: {
            mass: 1,
            tension: 180,
            friction: 20
          }
        })
        onAnimationComplete?.()
      }
      if (isExiting) {
        await next({ 
          y: -4,
          x: 0,
          scale: [0.5, 0.5, 0.5],
          rotation: -Math.PI * 4,
          config: {
            mass: 1,
            tension: 120,
            friction: 14
          }
        })
        onAnimationComplete?.()
      }
    },
    config: {
      mass: 2,
      tension: 200,
      friction: 25
    }
  })

  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setTime(t => t + 0.02)
    }, 16)
    
    return () => clearInterval(interval)
  }, [isVisible])

  useEffect(() => {
    if (!isExiting) {
      setDisplayedShells(shells)
    }
  }, [shells, isExiting])

  return (
    <Canvas
      camera={{
        position: [0, 0.8, 2.5],
        fov: 50,
      }}
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      
      {trail.map((props, index) => {
        const spacing = 0.3
        const totalWidth = (shells.length - 1) * spacing
        const startY = totalWidth / 2
        const baseY = startY - (index * spacing)
        const floatOffset = isExiting ? 0 : Math.sin(time + index * 0.5) * 0.03
        const idleRotation = isExiting ? 0 : Math.sin(time * 0.5 + index * 0.2) * 0.1
        
        return (
          <animated.group 
            key={index}
            position-y={props.y.to(y => y + baseY + floatOffset)}
            position-x={props.x}
            scale={props.scale.to((x, y, z) => [x, y, z])}
            rotation-z={props.rotation.to(r => r + idleRotation)}
          >
            <Shell 
              isLive={displayedShells[index]}
              rotation={[0, 0, 0]}
              scale={.06}
            />
          </animated.group>
        )
      })}
    </Canvas>
  )
} 