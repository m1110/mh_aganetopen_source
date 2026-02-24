'use client'

import { useState, useRef, useEffect } from 'react'
import { uploadImage, updateUserProfile } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

interface EditProfileModalProps {
  trigger?: React.ReactNode
}

export function EditProfileModal({ trigger }: EditProfileModalProps) {
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    imageFile: null as File | null
  })

  // Load current user data from localStorage on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem('userData')
    if (userDataString) {
      const userData = JSON.parse(userDataString)
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }))
    }
  }, [])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Check if image is square
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    }).then(({ width, height }) => {
      if (width !== height) {
        alert('Please upload a square image (same width and height)')
        return null
      }
      if (width > 1024 || height > 1024) {
        alert('Please upload an image that is 1024x1024 pixels or smaller')
        return null
      }
      return file
    })
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validFile = await handleImageUpload(file)
    if (!validFile) return

    setFormData(prev => ({ ...prev, imageFile: validFile }))
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(validFile)
  }

  const handleSave = async () => {
    try {
      setIsImageUploading(true)
      
      // Get current user ID from localStorage
      const userDataString = localStorage.getItem('userData')
      const userData = userDataString ? JSON.parse(userDataString) : null
      const userId = userData?.userId
      
      if (!userId) {
        alert('User not found. Please log in again.')
        return
      }

      const updates: any = {}
      
      // Handle image upload
      if (formData.imageFile) {
        const imageUrl = await uploadImage(formData.imageFile, userId)
        updates.customUserImage = imageUrl
      }
      
      // Handle name and email updates
      if (formData.name.trim()) {
        updates.preferredName = formData.name.trim()
      }
      
      if (formData.email.trim()) {
        updates.preferredEmail = formData.email.trim()
      }
      
      // Update user profile in Firestore
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(userId, updates)
        
        // Update localStorage with the new profile data
        const userDataString = localStorage.getItem('userData')
        if (userDataString) {
          const userData = JSON.parse(userDataString)
          const updatedUserData = {
            ...userData,
            ...updates
          }
          localStorage.setItem('userData', JSON.stringify(updatedUserData))
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('profileUpdated'))
        }
        
        alert('Profile updated successfully!')
        
        // Reset form
        setFormData({ name: '', email: '', imageFile: null })
        setImagePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsImageUploading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Edit Profile</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>Update your profile information below.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full object-cover border"
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a square image (1024x1024 or smaller)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              className="w-full border rounded px-3 py-2" 
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border rounded px-3 py-2" 
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isImageUploading}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isImageUploading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 