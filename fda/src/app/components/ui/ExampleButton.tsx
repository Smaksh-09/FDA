"use client"

interface ExampleButtonProps {
  text: string
  variant: 'primary' | 'secondary'
  isActive?: boolean
  isPermanentActive?: boolean
}

export default function ExampleButton({ text, variant, isActive = false, isPermanentActive = false }: ExampleButtonProps) {
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

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${active ? '' : 'hover:bg-gray-50'}`}>
      {text}
    </button>
  )
}
