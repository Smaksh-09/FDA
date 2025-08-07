"use client"

import { Eye, MousePointer, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: "1",
    icon: Eye,
    title: "Watch the Feed",
    description: "Browse through real food videos from local restaurants"
  },
  {
    number: "2", 
    icon: MousePointer,
    title: "Tap to Buy",
    description: "One tap ordering directly from the video feed"
  },
  {
    number: "3",
    icon: Truck,
    title: "Enjoy Your Meal",
    description: "Fast delivery straight to your door"
  }
]

export default function HowItWorks() {
  return (
    <section className="bg-[#F5F5F5] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-black text-black text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Order in Seconds.
        </motion.h2>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-black text-white border-2 border-black p-8 h-80 flex flex-col items-center justify-center text-center neobrutalist-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "6px 6px 0px #000"
              }}
            >
              {/* Large Number */}
              <div className="text-6xl font-black text-[#39FF14] mb-6">
                {step.number}
              </div>
              
              {/* Icon */}
              <step.icon className="w-12 h-12 text-white mb-6" strokeWidth={2} />
              
              {/* Title */}
              <h3 className="text-2xl font-bold mb-4">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-lg font-medium opacity-90">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
