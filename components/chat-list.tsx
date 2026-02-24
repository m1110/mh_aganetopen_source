'use client'

import { type Message } from 'ai'
import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { useEffect, useState } from 'react'

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  const [userImage, setUserImage] = useState<string | undefined>()

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData')
    if (userDataString) {
      const userData = JSON.parse(userDataString)
      // Check for custom user image first, then fall back to regular image
      setUserImage(userData.customUserImage || userData.image)
    }
  }, [])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const userDataString = localStorage.getItem('userData')
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        setUserImage(userData.customUserImage || userData.image)
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate)
  }, [])

  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} userImage={userImage} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
