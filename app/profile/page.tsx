'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('userData')
    if (data) {
      try {
        const user = JSON.parse(data)
        setName(user.name || '')
        setEmail(user.email || '')
        setImage(user.image || '')
      } catch {
        // ignore malformed localStorage
      }
    }
  }, [])

  const handleSave = () => {
    const data = localStorage.getItem('userData')
    const user = data ? JSON.parse(data) : {}
    const updated = { ...user, name, email, image }
    localStorage.setItem('userData', JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-md p-4 mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <Input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" />
      <Button onClick={handleSave}>Save</Button>
      {saved && <p className="text-sm text-green-600">Saved!</p>}
    </div>
  )
}
