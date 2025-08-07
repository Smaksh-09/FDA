"use client"

import Link from 'next/link'

interface ExampleButtonProps {
  text: string
  variant: 'primary' | 'secondary'
  isActive?: boolean
  isPermanentActive?: boolean
  href?: string
}

export default function ExampleButton({ text, variant, isActive = false, isPermanentActive = false, href }: ExampleButtonProps) {
  const active = isPermanentActive || isActive

  const baseClasses = "w-full h-full border-2 border-black font-bold text-lg transition-all duration-100 flex items-center justify-center"
  
  const variantClasses = {
    primary: active 
      ? "bg-[#39FF14] text-black neobrutalist-shadow-active" 
      : "bg-white text-black",
    secondary: active 
      ? "bg-[#0052FF] text-white neobrutalist-shadow-active" 
      : "bg-white text-black"
  }

  const className = `${baseClasses} ${variantClasses[variant]} ${active ? '' : 'hover:bg-gray-50'}`

  if (href) {
    return (
      <Link href={href} className={className}>
        {text}
      </Link>
    )
  }

  return (
    <button className={className}>
      {text}
    </button>
  )
}
