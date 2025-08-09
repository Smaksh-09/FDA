"use client"

import { useState, useRef } from 'react'
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

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setUploadState(prev => ({
        ...prev,
        step: 'menu-linking',
        selectedFile: file
      }))
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

  const handleStartUpload = async () => {
    setUploadState(prev => ({
      ...prev,
      step: 'uploading',
      isUploading: true,
      progress: 0
    }))

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadState(prev => {
        const newProgress = prev.progress + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          return {
            ...prev,
            progress: 100,
            isUploading: false,
            isComplete: true
          }
        }
        return {
          ...prev,
          progress: newProgress
        }
      })
    }, 200)

    // Simulate completion after 3 seconds
    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadState(prev => ({
        ...prev,
        progress: 100,
        isUploading: false,
        isComplete: true
      }))
      
      // Create mock reel and call completion handler
      const newReel = {
        id: `reel-${Date.now()}`,
        videoUrl: URL.createObjectURL(uploadState.selectedFile!),
        thumbnailUrl: '/thumbnails/default-reel.jpg',
        caption: uploadState.caption,
        linkedMenuItem: menuItems.find(item => item.id === uploadState.linkedMenuItemId) || null,
        linkedMenuItemId: uploadState.linkedMenuItemId,
        restaurantId: '1',
        views: 0,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }
      
      setTimeout(() => {
        onUploadComplete(newReel)
        handleClose()
      }, 2000)
    }, 3000)
  }

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
            
            {/* Menu Item Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-white mb-2">
                Select Menu Item:
              </label>
              <select
                value={uploadState.linkedMenuItemId || ''}
                onChange={(e) => setUploadState(prev => ({
                  ...prev,
                  linkedMenuItemId: e.target.value || null
                }))}
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
                value={uploadState.caption}
                onChange={(e) => setUploadState(prev => ({
                  ...prev,
                  caption: e.target.value
                }))}
                className="w-full px-3 py-2 bg-white border-2 border-black text-black font-normal focus:outline-none focus:border-[#39FF14] h-24 resize-none"
                placeholder="Add a compelling caption for your reel..."
                maxLength={200}
              />
              <p className="text-xs text-gray-300 mt-1">
                {uploadState.caption.length}/200 characters
              </p>
            </div>

            {/* Start Upload Button */}
            <button
              onClick={handleStartUpload}
              disabled={!uploadState.linkedMenuItemId}
              className={`w-full py-3 px-4 border-2 border-black font-bold text-lg transition-all ${
                uploadState.linkedMenuItemId
                  ? 'bg-[#39FF14] text-black hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              [START UPLOAD]
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
                style={{ width: `${uploadState.progress}%` }}
              >
                {uploadState.progress > 15 && (
                  <span className="text-black font-bold text-sm">
                    {Math.round(uploadState.progress)}%
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
