"use client"

import { useEffect, useState } from 'react'
import { X, MapPin, IndianRupee, Clock, QrCode, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reel } from './types'

type Address = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface OrderConfirmModalProps {
  reel: Reel
  isOpen: boolean
  onClose: () => void
}

export default function OrderConfirmModal({ reel, isOpen, onClose }: OrderConfirmModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep('address')
      setTimeLeft(300)
      setIsProcessing(false)
      setError(null)
      return
    }
    ;(async () => {
      try {
        const res = await fetch('/api/addresses', { cache: 'no-store', credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch addresses')
        const data = await res.json()
        setAddresses(data.addresses || [])
        const def = (data.addresses || []).find((a: Address) => a.isDefault)
        setSelectedAddressId(def?.id || (data.addresses?.[0]?.id ?? null))
      } catch (e: any) {
        setError(e.message || 'Failed to load addresses')
      }
    })()
  }, [isOpen])

  // Timer countdown for payment step
  useEffect(() => {
    if (step !== 'payment' || isProcessing) return

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
  }, [step, isProcessing])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  const total = reel.foodItem.price

  const handleConfirm = async () => {
    if (!selectedAddressId) {
      setError('Please select an address')
      return
    }
    setIsSubmitting(true)
    setError(null)
    
    // For direct order flow, proceed to payment step
    setStep('payment')
    setIsSubmitting(false)
  }

  const handlePaymentComplete = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelId: reel.id, addressId: selectedAddressId }),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}))
        throw new Error(msg.error || 'Failed to place order')
      }
      
      setStep('success')
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 3000)
      
    } catch (e: any) {
      setError(e.message || 'Failed to place order')
      setStep('address') // Go back to address step on error
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 backdrop-blur-md" onClick={step === 'payment' ? undefined : onClose} />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="relative bg-white border-2 border-black w-full max-w-lg"
          style={{ boxShadow: '8px 8px 0px #000' }}
        >
          {/* Header */}
          <div className="bg-black border-b-2 border-black p-4 flex items-center justify-between">
            <h2 className="text-lime-400 font-extrabold text-xl">
              {step === 'address' && '[ CONFIRM ORDER ]'}
              {step === 'payment' && '[ SCAN TO COMPLETE PAYMENT ]'}
              {step === 'success' && '[ ORDER CONFIRMED ]'}
            </h2>
            {step !== 'payment' && (
              <button onClick={onClose} className="p-2 hover:bg-gray-800 transition-colors">
                <X className="w-6 h-6 text-lime-400" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'address' && (
              <>
                {/* Item Summary */}
                <div className="bg-gray-100 border-2 border-black p-4 mb-4" style={{ boxShadow: '3px 3px 0px #000' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-black">{reel.foodItem.name}</p>
                      <p className="text-black font-normal text-sm">{reel.restaurant.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-black" />
                      <span className="font-extrabold text-black">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Address Selection */}
                <div className="mb-4">
                  <h3 className="font-extrabold text-black text-sm mb-3">[ DELIVERY ADDRESS ]</h3>
                  {addresses.length === 0 ? (
                    <p className="text-black text-sm">No addresses found. Please add one in your profile.</p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {addresses.map((addr) => (
                        <label key={addr.id} className="flex items-start gap-3 p-3 border-2 border-black bg-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-black" />
                              <span className="font-bold text-black text-sm">
                                {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                              </span>
                            </div>
                            <span className="text-xs font-normal text-black">{addr.country}</span>
                            {addr.isDefault && (
                              <span className="text-xs font-extrabold text-lime-400 ml-2">DEFAULT</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="border-2 border-black bg-red-100 text-black p-3 font-bold mb-4">{error}</div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-white border-2 border-black text-black font-extrabold hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    [ CANCEL ]
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 bg-lime-400 border-2 border-black text-black font-extrabold hover:bg-white transition-colors"
                    style={{ boxShadow: '4px 4px 0px #000' }}
                    disabled={isSubmitting || !selectedAddressId}
                  >
                    [ PROCEED TO PAY ]
                  </button>
                </div>
              </>
            )}

            {step === 'payment' && (
              <>
                {/* QR Code Display */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '4px 4px 0px #000' }}>
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
                      <div>Pay the total amount: <span className="font-bold">₹{total.toLocaleString('en-IN')}</span></div>
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
                <button
                  onClick={handlePaymentComplete}
                  disabled={isProcessing || timeLeft === 0}
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
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>PROCESSING...</span>
                    </div>
                  ) : timeLeft === 0 ? (
                    '[ TIME EXPIRED ]'
                  ) : (
                    '[ I HAVE PAID, CONFIRM ORDER ]'
                  )}
                </button>

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
            )}

            {step === 'success' && (
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
                  ORDER CONFIRMED!
                </div>
                <div className="text-black mb-4">
                  Your order for {reel.foodItem.name} has been placed successfully.
                </div>
                <div className="text-sm text-black">
                  Closing automatically...
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


