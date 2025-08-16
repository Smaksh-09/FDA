"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypingTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export default function TypingText({ text, speed = 100, className = '', onComplete }: TypingTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-1 h-8 bg-black ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
    </motion.span>
  )
}
