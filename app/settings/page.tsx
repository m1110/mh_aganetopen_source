'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme-toggle'
import { IconUser, IconSettings, IconMoon, IconSun } from '@/components/ui/icons'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const localData = localStorage.getItem('userData')
    if (localData) {
      try {
        const user = JSON.parse(localData)
        setName(user.name || '')
        setEmail(user.email || '')
        setImage(user.image || '')
      } catch {
        // ignore malformed localStorage
      }
    }
  }, [])

  const handleSave = () => {
    const localData = localStorage.getItem('userData')
    const user = localData ? JSON.parse(localData) : {}
    const updated = { ...user, name, email, image }
    localStorage.setItem('userData', JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <IconUser className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter your name" 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="image">Profile Image URL</Label>
                <Input 
                  id="image"
                  value={image} 
                  onChange={e => setImage(e.target.value)} 
                  placeholder="Enter image URL" 
                  className="mt-1"
                />
              </div>
              
              <Button onClick={handleSave} className="mt-4">
                Save Changes
              </Button>
              
              {saved && (
                <p className="text-sm text-green-600">Settings saved successfully!</p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <IconSettings className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Theme</Label>
                <div className="mt-2 flex items-center space-x-2">
                  <ThemeToggle />
                  <span className="text-sm text-muted-foreground">Light/Dark mode</span>
                </div>
              </div>
              
              <div>
                <Label>Language</Label>
                <div className="mt-2">
                  <select className="w-full p-2 border rounded-md">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Balance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Credit Balance</h3>
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm">Monthly credits</span>
                <span className="font-medium">9.71</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Purchased credits</span>
                <span className="font-medium">55.68</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Purchase Credits
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 