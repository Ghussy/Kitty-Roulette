import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'
import { useRef } from 'react'
import { Vector3 } from 'three'

function Cylinder({ isPointingAtCamera }) {
  const { camera } = useThree()
  const cylinderRef = useRef()

  // Adjust the cylinder's rotation in each frame
  useFrame(() => {
    if (!cylinderRef.current) return

    // Get the direction to the camera or away from the camera
    const cylinderPosition = new Vector3(0, 0, 0)
    const cameraPosition = camera.position.clone()
    const direction = new Vector3()

    if (isPointingAtCamera) {
      // Aim at the camera
      direction.subVectors(cameraPosition, cylinderPosition).normalize()
    } else {
      // Aim away from the camera
      direction.subVectors(cylinderPosition, cameraPosition).normalize()
    }

    // Update rotation to point in the calculated direction
    cylinderRef.current.lookAt(direction.add(cylinderPosition))
  })

  return (
    <mesh ref={cylinderRef} position={[0, 0, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 2]} />
      <meshStandardMaterial color={isPointingAtCamera ? 'lightblue' : 'pink'} />
    </mesh>
  )
}

export default function Scene3D() {
  const [isPointingAtCamera, setIsPointingAtCamera] = useState(false)

  return (
    <>
      <Canvas>
        <Cylinder isPointingAtCamera={isPointingAtCamera} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls />
      </Canvas>

      {/* Static button at the bottom */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => setIsPointingAtCamera(!isPointingAtCamera)}
          style={{
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            background: 'lightblue',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {isPointingAtCamera ? 'Point Away' : 'Point At Me'}
        </button>
      </div>
    </>
  )
}
