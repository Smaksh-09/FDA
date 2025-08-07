"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GridItemProps {
  children: React.ReactNode
  mousePosition: { x: number; y: number }
  className?: string
  isPermanentActive?: boolean
}

export default function GridItem({ children, mousePosition, className = '', isPermanentActive = false }: GridItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [itemCenter, setItemCenter] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      setItemCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
  }, [])

  useEffect(() => {
    if (isPermanentActive) {
      setIsActive(true)
      return
    }

    const distance = Math.sqrt(
      Math.pow(mousePosition.x - itemCenter.x, 2) + 
      Math.pow(mousePosition.y - itemCenter.y, 2)
    )
    
    setIsActive(distance < 150)
  }, [mousePosition, itemCenter, isPermanentActive])

  return (
    <motion.div
      ref={itemRef}
      className={`relative ${className}`}
      animate={{
        scale: isActive ? 1.02 : 1,
        zIndex: isActive ? 20 : 1,
      }}
      transition={{
        type: "tween",
        duration: 0.1,
      }}
    >
      <div className={`h-full transition-all duration-100 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
        {typeof children === 'object' && children !== null && 'type' in children
          ? (() => {
              const childElement = children as React.ReactElement;
              // Only pass isActive to custom components, not to DOM elements
              const isCustomComponent = typeof childElement.type === 'function';
              if (isCustomComponent) {
                return React.cloneElement(childElement as any, Object.assign({}, childElement.props, { isActive }));
              }
              return childElement;
            })()
          : children}
      </div>
    </motion.div>
  )
}
