"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useUserStore()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Check for success message from registration
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in to continue.')
    }
  }, [searchParams])

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

    // Client-side validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Login successful - fetch user data and update store
        try {
          const userResponse = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include'
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUser(userData)
          }
        } catch (error) {
          console.error('Failed to fetch user data after login:', error)
        }
        
        // Redirect to dashboard or home
        router.push('/') // You can change this to a dashboard route
      } else {
        // Handle errors from backend
        if (response.status === 401) {
          setErrors({ general: 'Invalid email or password' })
        } else if (response.status === 400) {
          setErrors({ general: 'Please check your email and password' })
        } else {
          setErrors({ general: data.error || 'Login failed. Please try again.' })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-2">
            ReelBites.
          </h1>
          <p className="text-lg font-bold text-black">
            Raw. Fast. Food.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white border-2 border-black p-8 neobrutalist-shadow">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            Welcome Back
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-[#39FF14] border-2 border-black p-3 mb-4">
              <p className="text-black font-bold text-sm">{successMessage}</p>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-100 border-2 border-black p-3 mb-4">
              <p className="text-black font-bold text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 ${
                    errors.email ? 'border-red-500' : 'border-black'
                  } bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm font-bold mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 ${
                    errors.password ? 'border-red-500' : 'border-black'
                  } bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm font-bold mt-1">{errors.password}</p>
              )}
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
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-4 border-black border-t-transparent animate-spin inline-block mr-2"></div>
                  Signing In
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm font-bold text-black hover:text-[#39FF14] transition-colors underline"
              onClick={(e) => {
                e.preventDefault()
                // TODO: Implement forgot password functionality
                alert('Forgot password functionality not implemented yet')
              }}
            >
              Forgot your password?
            </a>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-black font-normal">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="font-bold text-black hover:text-[#39FF14] transition-colors underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm font-bold text-black hover:text-[#39FF14] transition-colors underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback component
function LoginPageFallback() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-2">
            ReelBites.
          </h1>
          <p className="text-lg font-bold text-black">
            Raw. Fast. Food.
          </p>
        </div>

        {/* Loading Form Card */}
        <div className="bg-white border-2 border-black p-8 neobrutalist-shadow">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            Welcome Back
          </h2>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#39FF14] border-t-transparent animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-normal">Loading</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  )
}
