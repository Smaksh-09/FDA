"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, CheckCircle, QrCode } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onPaymentComplete: () => void
}

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onPaymentComplete
}: PaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isComplete) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, isComplete])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300)
      setIsProcessing(false)
      setIsComplete(false)
    }
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setIsComplete(true)
    
    // Auto-close and trigger completion after success animation
    setTimeout(() => {
      onPaymentComplete()
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="bg-white border-2 border-black w-full max-w-md relative"
          style={{ boxShadow: '8px 8px 0px #000' }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>

          {/* Header */}
          <div className="bg-black border-b-2 border-black p-6 pb-4">
            <h2 className="text-2xl font-extrabold text-lime-400 text-center">
              [ SCAN TO COMPLETE PAYMENT ]
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isComplete ? (
              <>
                {/* QR Code Display */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '4px 4px 0px #000' }}>
                    {/* Mock QR Code - in a real app, this would be a generated QR */}
                    <div className="w-48 h-48 bg-gray-100 border-2 border-black flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-black mx-auto mb-2" />
                        <div className="text-xs text-black font-bold">
                          SCAN WITH UPI APP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <div className="text-black font-bold mb-4 text-center">
                    [ PAYMENT INSTRUCTIONS ]
                  </div>
                  <div className="space-y-3 text-sm text-black">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-lime-400 border border-black flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>Open any UPI app (GPay, PhonePe, etc.)</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-lime-400 border border-black flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>Scan the QR code above</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-lime-400 border border-black flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>Pay the total amount: <span className="font-bold">₹{totalAmount.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-black border-2 border-black px-4 py-2 text-lime-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-sm">
                      Complete payment in {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Confirm Payment Button */}
                <motion.button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing || timeLeft === 0}
                  whileHover={!isProcessing && timeLeft > 0 ? { x: 2, y: 2 } : {}}
                  whileTap={!isProcessing && timeLeft > 0 ? { scale: 0.98 } : {}}
                  className={`w-full py-4 font-extrabold text-lg border-2 transition-all ${
                    isProcessing || timeLeft === 0
                      ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                      : 'bg-lime-400 text-black border-black hover:bg-white cursor-pointer'
                  }`}
                  style={{ 
                    boxShadow: !isProcessing && timeLeft > 0 ? '4px 4px 0px #000' : '2px 2px 0px #999' 
                  }}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      [ PROCESSING... ]
                    </motion.div>
                  ) : timeLeft === 0 ? (
                    '[ TIME EXPIRED ]'
                  ) : (
                    '[ I HAVE PAID, CONFIRM ORDER ]'
                  )}
                </motion.button>

                {timeLeft === 0 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setTimeLeft(300)}
                      className="text-sm bg-black text-lime-400 border border-black px-3 py-1 hover:bg-gray-800 transition-colors"
                    >
                      [ RESTART TIMER ]
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Payment Success */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <CheckCircle className="w-24 h-24 text-lime-400 mx-auto" />
                </motion.div>
                <div className="text-2xl font-extrabold text-black mb-2">
                  PAYMENT SUCCESSFUL!
                </div>
                <div className="text-black mb-4">
                  Your order has been confirmed and sent to the restaurant.
                </div>
                <div className="text-sm text-black">
                  You will be redirected automatically...
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
