"use client"

import { useState } from 'react'
import { Plus, Trash2, MapPin, Star } from 'lucide-react'
import { SavedAddress } from '../../account/types'

interface AddressesTabProps {
  addresses: SavedAddress[]
  onAddressUpdate: (addresses: SavedAddress[]) => void
}

interface AddressFormData {
  title: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function AddressesTab({ addresses, onAddressUpdate }: AddressesTabProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AddressFormData>({
    title: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleAddNew = () => {
    setIsAddingNew(true)
    setEditingId(null)
    setFormData({
      title: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0 // First address is default
    })
  }

  // Editing removed by requirement

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.street.trim() || !formData.city.trim() || 
        !formData.state.trim() || !formData.pincode.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.pincode.trim(),
          country: 'India',
          isDefault: formData.isDefault,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to save address')
      }
      const listRes = await fetch('/api/addresses', { credentials: 'include', cache: 'no-store' })
      const data = await listRes.json()
      const updated = (data.addresses || []).map((a: any) => ({
        id: a.id,
        title: a.isDefault ? 'Default' : 'Saved Address',
        fullAddress: `${a.street}, ${a.city}, ${a.state} ${a.zipCode}`,
        street: a.street,
        city: a.city,
        state: a.state,
        pincode: a.zipCode,
        isDefault: a.isDefault,
        createdAt: new Date(),
      }))
      onAddressUpdate(updated)
      resetForm()
    } catch (e: any) {
      alert(e.message || 'Failed to save address')
    }
  }

  const handleDelete = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId)
      onAddressUpdate(updatedAddresses)
    }
  }

  const setAsDefault = async (addressId: string) => {
    try {
      const res = await fetch(`/api/addresses/${addressId}/default`, { method: 'PATCH', credentials: 'include' })
      if (!res.ok) throw new Error('Failed to set default address')
      const listRes = await fetch('/api/addresses', { credentials: 'include', cache: 'no-store' })
      const data = await listRes.json()
      const updated = (data.addresses || []).map((a: any) => ({
        id: a.id,
        title: a.isDefault ? 'Default' : 'Saved Address',
        fullAddress: `${a.street}, ${a.city}, ${a.state} ${a.zipCode}`,
        street: a.street,
        city: a.city,
        state: a.state,
        pincode: a.zipCode,
        isDefault: a.isDefault,
        createdAt: new Date(),
      }))
      onAddressUpdate(updated)
    } catch (e: any) {
      alert(e.message || 'Failed to set default address')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          SAVED ADDRESSES
        </h2>
        <button
          onClick={handleAddNew}
          disabled={isAddingNew || editingId !== null}
          className="px-6 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1 transition-all duration-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          [+ ADD NEW ADDRESS]
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-white border-2 border-black p-6 neobrutalist-shadow">
          <h3 className="font-bold text-black text-lg mb-4">
            {isAddingNew ? 'ADD NEW ADDRESS' : 'EDIT ADDRESS'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Address Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="e.g., Home, Office, etc."
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="e.g., 400001"
              />
            </div>

            {/* Street */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="House/Flat number, Building name, Street"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="e.g., Mumbai"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="e.g., Maharashtra"
              />
            </div>

            {/* Default checkbox */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-2 border-black focus:outline-none focus:ring-0"
                />
                <span className="font-bold text-black text-sm">Set as default address</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow transition-all"
            >
              [SAVE]
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors"
            >
              [CANCEL]
            </button>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="bg-black border-2 border-black text-white p-4 relative group">
            {/* Default Badge */}
            {address.isDefault && (
              <div className="absolute -top-2 -left-2 bg-[#39FF14] text-black px-2 py-1 text-xs font-bold border-2 border-black">
                <Star className="w-3 h-3 inline mr-1" fill="currentColor" />
                DEFAULT
              </div>
            )}

            {/* Address Content */}
            <div className="mb-4">
              <h3 className="font-bold text-[#39FF14] text-lg mb-2">{address.title}</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                <p className="font-normal text-white text-sm leading-relaxed">
                  {address.fullAddress}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(address.id)}
                  disabled={isAddingNew || editingId !== null}
                  className="p-2 bg-white border border-white text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => setAsDefault(address.id)}
                  className="text-xs font-bold text-gray-300 hover:text-[#39FF14] transition-colors"
                >
                  SET DEFAULT
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {addresses.length === 0 && !isAddingNew && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-bold text-black text-lg mb-2">No saved addresses</h3>
            <p className="text-gray-600 font-normal mb-4">
              Add your first address to get started with faster checkout
            </p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow-active transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              [ADD YOUR FIRST ADDRESS]
            </button>
          </div>
        )}
      </div>

      {/* Address Summary */}
      {addresses.length > 0 && (
        <div className="bg-white border-2 border-black p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-black">
              TOTAL ADDRESSES: {addresses.length}
            </span>
            <span className="font-normal text-gray-600">
              DEFAULT: {addresses.find(addr => addr.isDefault)?.title || 'None'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
