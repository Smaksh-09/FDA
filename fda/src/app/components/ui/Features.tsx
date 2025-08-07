"use client"

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import AppWireframe from './Wireframe'

const features = [
  "No Hidden Fees",
  "Live Order Tracking", 
  "Discover Local Gems",
  "Real-Time Food Videos"
]

export default function Features() {
  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why ReelBites?
        </motion.h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Features List */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#39FF14] border-2 border-white flex items-center justify-center">
                  <Check className="w-5 h-5 text-black font-bold" strokeWidth={3} />
                </div>
                <span className="text-2xl md:text-3xl font-bold">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - App Wireframe */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <AppWireframe />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
