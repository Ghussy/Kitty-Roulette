import { useEffect, useState } from 'react'

interface RoundDisplayProps {
  message?: string
}

export function RoundDisplay({ message }: RoundDisplayProps) {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (message) {
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!showMessage || !message) return null

  return (
    <div className="text-center text-lg font-medium font-display text-white whitespace-nowrap">
      {message}
    </div>
  )
} 