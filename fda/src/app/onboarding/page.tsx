"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, MapPin, FileText, Image, AlertCircle } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading, setUser } = useUserStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    imageUrl: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = 'Restaurant name must be at least 3 characters long'
    }
    
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    }
    
    if (!formData.address.trim() || formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters long'
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...formData,
        imageUrl: formData.imageUrl || undefined
      }

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        // Update user role in the store
        if (user) {
          setUser({
            ...user,
            role: 'RESTAURANT_OWNER'
          })
        }
        
        // Redirect to restaurant dashboard
        router.push('/restaurant')
      } else {
        const errorData = await response.json()
        if (errorData.error) {
          setErrors({ general: errorData.error })
        } else {
          setErrors({ general: 'Failed to create restaurant. Please try again.' })
        }
      }
    } catch (error) {
      console.error('Error creating restaurant:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect logic in effect to avoid setState during render
  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace('/auth/login')
      return
    }
    if (user.role === 'RESTAURANT_OWNER') {
      router.replace('/restaurant')
    }
  }, [isLoading, user, router])

  // While loading auth state or redirecting, render nothing/minimal skeleton
  if (isLoading || !user || user.role === 'RESTAURANT_OWNER') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      {/* Header Navigation */}
      <header className="max-w-4xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-black font-bold hover:text-[#39FF14] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="w-px h-6 bg-black"></div>
          <h1 className="text-2xl font-black text-black">ReelBites.</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6">
        {/* Onboarding Container */}
        <div className="bg-white border-4 border-black p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#39FF14] border-2 border-black mb-4">
              <Building2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">List Your Restaurant</h1>
            <p className="text-gray-600 font-normal">
              Join thousands of restaurant partners and start showcasing your delicious food through engaging reels.
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 font-normal text-sm">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Name */}
            <div>
              <label htmlFor="name" className="block text-black font-bold text-sm mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Restaurant Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-black'} bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors`}
                placeholder="Enter your restaurant name"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 font-normal">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-black font-bold text-sm mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Restaurant Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border-2 ${errors.description ? 'border-red-500' : 'border-black'} bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors resize-none`}
                placeholder="Describe your restaurant, cuisine type, specialties..."
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1 font-normal">{errors.description}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-black font-bold text-sm mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Restaurant Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${errors.address ? 'border-red-500' : 'border-black'} bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors`}
                placeholder="Enter complete address with pincode"
                disabled={isSubmitting}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1 font-normal">{errors.address}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-black font-bold text-sm mb-2">
                <Image className="w-4 h-4 inline mr-2" />
                Restaurant Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${errors.imageUrl ? 'border-red-500' : 'border-black'} bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors`}
                placeholder="https://example.com/restaurant-image.jpg"
                disabled={isSubmitting}
              />
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1 font-normal">{errors.imageUrl}</p>}
              <p className="text-gray-500 text-xs mt-1 font-normal">
                Add a high-quality image of your restaurant or signature dish
              </p>
            </div>

            {/* Terms Notice */}
            <div className="bg-gray-50 border-2 border-gray-300 p-4">
              <p className="text-gray-700 text-sm font-normal">
                By submitting this form, you agree to become a restaurant partner with ReelBites. 
                You'll be able to upload food reels, manage your menu, and receive orders through our platform.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#39FF14] border-2 border-black text-black font-bold text-lg hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'CREATING YOUR RESTAURANT...' : 'CREATE MY RESTAURANT'}
            </button>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-black border-2 border-black p-6 text-white">
          <h3 className="font-bold text-[#39FF14] text-xl mb-4">Why Partner With ReelBites?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">Reach More Customers</h4>
              <p className="text-gray-300 text-sm font-normal">
                Showcase your food through engaging reels and reach food lovers across your city.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Easy Management</h4>
              <p className="text-gray-300 text-sm font-normal">
                Manage orders, menu, and analytics all from one powerful dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Grow Your Business</h4>
              <p className="text-gray-300 text-sm font-normal">
                Increase revenue with our commission-friendly model and marketing support.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
