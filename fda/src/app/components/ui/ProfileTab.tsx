"use client"

import React, { useState } from 'react'
import { User, Mail } from 'lucide-react'
import { UserProfile } from '../../account/types'

interface ProfileTabProps {
  profile: UserProfile
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void
}

interface FormData {
  name: string
  email: string
}

interface FormErrors {
  name?: string
  general?: string
}

export default function ProfileTab({ profile, onProfileUpdate }: ProfileTabProps) {
  const [formData, setFormData] = useState<FormData>({
    name: profile.name || '',
    email: profile.email || ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Update form data when profile changes (fixes loading issue)
  React.useEffect(() => {
    setFormData({
      name: profile.name || '',
      email: profile.email || ''
    })
  }, [profile.name, profile.email])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update profile
      const updatedFields: Partial<UserProfile> = {
        name: formData.name.trim(),
        updatedAt: new Date()
      }
      
      onProfileUpdate(updatedFields)
      
      setSuccessMessage('Profile updated successfully!')
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
      
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-black p-8 neobrutalist-shadow max-w-2xl">
      <h2 className="text-2xl font-bold text-black mb-6">
        PROFILE SETTINGS
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-[#39FF14] border-2 border-black p-3 mb-6">
          <p className="text-black font-bold text-sm">{successMessage}</p>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="bg-red-100 border-2 border-black p-3 mb-6">
          <p className="text-black font-bold text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-black mb-2">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 border-2 ${
                errors.name ? 'border-red-500' : 'border-black'
              } bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-400 bg-gray-100 text-gray-600 font-normal cursor-not-allowed"
              disabled
              readOnly
            />
          </div>
          <p className="text-gray-600 text-xs font-normal mt-1">
            Email address cannot be changed. Contact support if needed.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 border-2 border-black font-bold text-lg transition-all duration-100 ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#39FF14] text-black hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1'
          }`}
        >
          {isLoading ? 'SAVING CHANGES...' : '[ SAVE CHANGES ]'}
        </button>
      </form>

      {/* Account Info */}
      <div className="mt-8 pt-6 border-t-2 border-black">
        <h3 className="font-bold text-black text-sm mb-3">ACCOUNT INFORMATION</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-black">Member Since:</span>
            <p className="font-normal text-gray-600">{profile.createdAt.toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <span className="font-bold text-black">Last Updated:</span>
            <p className="font-normal text-gray-600">{profile.updatedAt.toLocaleDateString('en-IN')}</p>
          </div>
          {profile.phone && (
            <div>
              <span className="font-bold text-black">Phone:</span>
              <p className="font-normal text-gray-600">{profile.phone}</p>
            </div>
          )}
          <div>
            <span className="font-bold text-black">Account ID:</span>
            <p className="font-normal text-gray-600 font-mono">{profile.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
