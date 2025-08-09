"use client"

import Navbar from './ui/Navbar'
import InteractiveGrid from './ui/InteractiveGrid'
import HowItWorks from './ui/HowItWorks'
import Features from './ui/Features'
import FinalCTA from './ui/Footer'
import Footer from './ui/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] overflow-hidden">
      <Navbar />
      {/* Add top padding to account for fixed navbar (h-16 = 64px + 4px border = 68px) */}
      <div className="pt-[68px]">
        <InteractiveGrid />
        <HowItWorks />
        <Features />
        <FinalCTA />
      </div>
    </div>
  )
}
