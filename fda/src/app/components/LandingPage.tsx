"use client"

import InteractiveGrid from './ui/InteractiveGrid'
import HowItWorks from './ui/HowItWorks'
import Features from './ui/Features'
import FinalCTA from './ui/Footer'
import Footer from './ui/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] overflow-hidden">
      <InteractiveGrid />
      <HowItWorks />
      <Features />
      <FinalCTA />
    </div>
  )
}
