"use client"

import { motion } from 'framer-motion'

export default function FinalCTA() {
  return (
    <section className="bg-[#39FF14] py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <motion.h2 
          className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to Bite?
        </motion.h2>

        {/* CTA Button */}
        <motion.button
          className="bg-black text-white border-2 border-black px-12 py-6 text-2xl md:text-3xl font-bold neobrutalist-shadow hover:neobrutalist-shadow-active transition-all duration-100"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "6px 6px 0px #000"
          }}
          whileTap={{ scale: 0.98 }}
        >
          Sign Up Now - It's Free
        </motion.button>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center mt-12 space-x-8">
          <motion.div
            className="w-4 h-4 bg-black border-2 border-black"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-6 h-6 bg-black border-2 border-black"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-4 h-4 bg-black border-2 border-black"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  )
}
