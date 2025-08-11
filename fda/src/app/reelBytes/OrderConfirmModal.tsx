"use client"

import { useEffect, useState } from 'react'
import { X, MapPin, IndianRupee } from 'lucide-react'
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

  useEffect(() => {
    if (!isOpen) return
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

  if (!isOpen) return null

  const total = reel.foodItem.price

  const handleConfirm = async () => {
    if (!selectedAddressId) {
      setError('Please select an address')
      return
    }
    setIsSubmitting(true)
    setError(null)
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
      onClose()
      alert('Order placed!')
    } catch (e: any) {
      setError(e.message || 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white border-2 border-black w-full max-w-lg mx-4 neobrutalist-shadow">
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between">
          <h2 className="text-black font-bold text-xl">CONFIRM ORDER</h2>
          <button onClick={onClose} className="p-2 bg-white border-2 border-black text-black hover:bg-gray-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Item Summary */}
          <div className="bg-[#F5F5F5] border-2 border-black p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-black">{reel.foodItem.name}</p>
                <p className="text-gray-700 font-normal text-sm">{reel.restaurant.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-black" />
                <span className="font-bold text-black">{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Address Selection */}
          <div className="bg-white border-2 border-black p-3">
            <h3 className="font-bold text-black text-sm mb-2">DELIVERY ADDRESS</h3>
            {addresses.length === 0 ? (
              <p className="text-gray-600 text-sm">No addresses found. Please add one in your profile.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {addresses.map((addr) => (
                  <label key={addr.id} className="flex items-start gap-2 p-2 border-2 border-black bg-[#F5F5F5]">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-black" />
                        <span className="font-bold text-black text-sm">
                          {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                        </span>
                      </div>
                      <span className="text-xs font-normal text-gray-600">{addr.country}</span>
                    </div>
                    {addr.isDefault && (
                      <span className="text-xs font-bold text-black">DEFAULT</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="border-2 border-black bg-red-100 text-black p-2 font-bold">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-2 border-black text-black font-bold hover:bg-gray-50"
            disabled={isSubmitting}
          >
            [CANCEL]
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1"
            disabled={isSubmitting || !selectedAddressId}
          >
            [CONFIRM ORDER]
          </button>
        </div>
      </div>
    </div>
  )
}


