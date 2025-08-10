"use client"

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { UploadCloud, X, Play } from 'lucide-react'
import { UploadState, MenuItem } from '../../restaurant/types'

interface UploadReelPanelProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuItem[]
  onUploadComplete: (reel: any) => void
}

export default function UploadReelPanel({ isOpen, onClose, menuItems, onUploadComplete }: UploadReelPanelProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    step: 'file-selection',
    selectedFile: null,
    linkedMenuItemId: null,
    caption: '',
    progress: 0,
    isUploading: false,
    isComplete: false
  })
  // Additional required state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, reset } = useForm<{ linkedMenuItemId: string; caption: string }>({
    defaultValues: { linkedMenuItemId: '', caption: '' }
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setUploadState(prev => ({
        ...prev,
        step: 'menu-linking',
        selectedFile: file
      }))
      setVideoFile(file)
    } else {
      alert('Please select a valid video file')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const onSubmit = handleSubmit(async ({ linkedMenuItemId, caption }) => {
    setError(null)
    if (!videoFile) {
      setError('Please select a video file first.')
      return
    }

    // Begin upload
    setIsUploading(true)
    setUploadProgress(5)
    setUploadState(prev => ({ ...prev, step: 'uploading', isUploading: true, progress: 5 }))

    try {
      // Step A: Get signature
      const sigRes = await fetch('/api/reels/upload-signature', { method: 'POST', credentials: 'include' })
      if (!sigRes.ok) throw new Error('Failed to obtain upload signature.')
      const { signature, timestamp } = await sigRes.json()

      // Step B: Upload to Cloudinary
      const fd = new FormData()
      fd.append('file', videoFile)
      fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '')
      fd.append('timestamp', String(timestamp))
      fd.append('signature', signature)
      if (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER) {
        fd.append('folder', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER)
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) throw new Error('Missing Cloudinary cloud name')

      const uploadResp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: fd
      })
      if (!uploadResp.ok) throw new Error('Video upload failed.')
      const uploadJson = await uploadResp.json()

      setUploadProgress(60)
      setUploadState(prev => ({ ...prev, progress: 60 }))

      // Step C: Confirm with backend
      const createRes = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ videoUrl: uploadJson.secure_url, caption, foodItemId: linkedMenuItemId })
      })
      if (!createRes.ok) throw new Error('Failed to create reel on server.')
      const newReel = await createRes.json()

      setUploadProgress(100)
      setUploadState(prev => ({ ...prev, progress: 100, isUploading: false, isComplete: true }))
      setIsUploading(false)

      onUploadComplete(newReel)

      // Reset and close
      reset()
      setVideoFile(null)
      setError(null)
      setTimeout(() => handleClose(), 800)
    } catch (e: any) {
      console.error(e)
      const msg = e?.message || 'Upload failed. Please try again.'
      setError(msg)
      setIsUploading(false)
      setUploadState(prev => ({ ...prev, isUploading: false, step: 'menu-linking' }))
    }
  })

  const handleClose = () => {
    setUploadState({
      step: 'file-selection',
      selectedFile: null,
      linkedMenuItemId: null,
      caption: '',
      progress: 0,
      isUploading: false,
      isComplete: false
    })
    onClose()
  }

  const availableMenuItems = menuItems.filter(item => item.isAvailable)

  return (
    <div className="w-full bg-black border-2 border-black text-white p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#39FF14]">
          UPLOAD NEW REEL
        </h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-800 transition-colors"
          disabled={uploadState.isUploading}
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Step 1: File Selection */}
      {uploadState.step === 'file-selection' && (
        <div className="space-y-6">
          <div
            className="border-2 border-dashed border-white p-12 text-center cursor-pointer hover:border-[#39FF14] transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-16 h-16 text-white mx-auto mb-4" />
            <p className="text-xl font-bold text-white mb-2">
              DRAG VIDEO FILE HERE OR CLICK TO BROWSE
            </p>
            <p className="text-sm text-gray-300">
              Supports MP4, MOV, AVI files up to 100MB
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Step 2: Menu Linking */}
      {uploadState.step === 'menu-linking' && uploadState.selectedFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Preview */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">VIDEO PREVIEW</h3>
            <div className="bg-gray-800 border-2 border-white p-4 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-white mx-auto mb-2" />
                <p className="text-white font-bold">{uploadState.selectedFile.name}</p>
                <p className="text-gray-300 text-sm">
                  {(uploadState.selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
          </div>

          {/* Menu Item Linking */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">LINK TO MENU ITEM</h3>
            
            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-700 font-bold text-sm">
                {error}
              </div>
            )}

            {/* Menu Item Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-white mb-2">
                Select Menu Item:
              </label>
              <select
                {...register('linkedMenuItemId', { required: true })}
                value={watch('linkedMenuItemId')}
                onChange={(e) => {
                  setValue('linkedMenuItemId', e.target.value)
                  setUploadState(prev => ({ ...prev, linkedMenuItemId: e.target.value || null }))
                }}
                className="w-full px-3 py-2 bg-white border-2 border-black text-black font-bold focus:outline-none focus:border-[#39FF14]"
              >
                <option value="">-- Select a menu item --</option>
                {availableMenuItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ₹{item.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Caption Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-white mb-2">
                Caption (Optional):
              </label>
              <textarea
                {...register('caption')}
                value={watch('caption')}
                onChange={(e) => setValue('caption', e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-black text-black font-normal focus:outline-none focus:border-[#39FF14] h-24 resize-none"
                placeholder="Add a compelling caption for your reel..."
                maxLength={200}
              />
              <p className="text-xs text-gray-300 mt-1">
                {watch('caption')?.length || 0}/200 characters
              </p>
            </div>

            {/* Start Upload Button */}
            <button
              onClick={onSubmit}
              disabled={!watch('linkedMenuItemId') || isUploading}
              className={`w-full py-3 px-4 border-2 border-black font-bold text-lg transition-all ${
                watch('linkedMenuItemId') && !isUploading
                  ? 'bg-[#39FF14] text-black hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isUploading ? '[UPLOADING…]' : '[START UPLOAD]'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Upload Progress */}
      {uploadState.step === 'uploading' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {uploadState.isComplete ? 'UPLOAD COMPLETE' : 'UPLOADING REEL...'}
            </h3>
            
            {/* Progress Bar */}
            <div className="w-full bg-white border-2 border-black h-8 mb-4">
              <div
                className="h-full bg-[#39FF14] transition-all duration-300 ease-out flex items-center justify-center"
                style={{ width: `${uploadProgress}` + '%' }}
              >
                {uploadProgress > 15 && (
                  <span className="text-black font-bold text-sm">
                    {Math.round(uploadProgress)}%
                  </span>
                )}
              </div>
            </div>

            {uploadState.isComplete ? (
              <div className="bg-[#39FF14] border-2 border-black p-4">
                <p className="text-black font-bold text-xl">
                  UPLOAD COMPLETE. REEL IS LIVE.
                </p>
                <p className="text-black font-normal text-sm mt-2">
                  Your reel has been published and is now visible to customers.
                </p>
              </div>
            ) : (
              <p className="text-white font-normal">
                Please wait while your reel is being processed and uploaded...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
