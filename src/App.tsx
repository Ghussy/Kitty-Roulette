import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Name from './pages/Game'
import Scene3D from './components/Scene3D'

function App() {
  return (
    <>
      <div className="canvas-container">
        <Scene3D />
      </div>
      <Name />
    </>
  )
}

export default App
