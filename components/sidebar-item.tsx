'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useContext, useEffect } from 'react'
import { DataContext } from '../context/DataContext'
import { buttonVariants } from '@/components/ui/button'
import { IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { migrateConversationToV2, isV2ConversationsEnabled } from '../lib/conversation-api'
import { toast } from 'react-hot-toast'

interface SidebarItemProps {
  chat: Chat
  children: React.ReactNode;
  setMessages: (messages: any[]) => void;
  messages: any;
  onRemove: (conversationId: string) => void; // Add this prop
}

export function SidebarItem({ chat, children, setMessages, messages, onRemove }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === chat.path
  const [data, setData] = useContext(DataContext);

  useEffect(() => {
    console.log(`📢 data`, data)
  }, [data, setData])

  // get local storage data
  const localData = localStorage.getItem('userData');
  const parsedData = JSON.parse(localData || '{}');
  console.log(`📢 parsedData`, parsedData)
  const userId = parsedData.userId

  if (!chat?.conversationId) return null

  const handleConversationClick = async () => {
    setMessages([...chat.messages]) // new array reference
    setData({...data, messages: chat.messages, conversationId: chat.conversationId, userId: userId})
    
    // Migrate V1 conversation to V2 if V2 is enabled and this is a V1 conversation
    if (isV2ConversationsEnabled() && chat.version !== 'v2') {
      try {
        console.log(`🔄 Auto-migrating V1 conversation ${chat.conversationId} to V2`);
        await migrateConversationToV2(chat.conversationId, userId, chat.messages);
        console.log(`✅ Successfully migrated conversation ${chat.conversationId} to V2`);
        
        // Update the chat object to mark it as migrated
        chat.version = 'v2';
        
        // Update localStorage to reflect the migration
        const updatedLocalData = localStorage.getItem('userData');
        if (updatedLocalData) {
          const updatedData = JSON.parse(updatedLocalData);
          if (updatedData.conversations && updatedData.conversations[chat.conversationId]) {
            updatedData.conversations[chat.conversationId].version = 'v2';
            localStorage.setItem('userData', JSON.stringify(updatedData));
          }
        }
      } catch (error) {
        console.error(`❌ Failed to migrate conversation ${chat.conversationId} to V2:`, error);
        // Don't show error to user as the conversation still works
      }
    }
  }

  return (
    <div className="relative flex items-center justify-between p-2 hover:bg-gray-100 text-xs">
      <div className="flex items-center">
        <div className="mr-2 flex h-6 w-6 items-center justify-center">
          {chat.sharePath ? (
            <Tooltip delayDuration={1000}>
              <TooltipTrigger
                tabIndex={-1}
                className="focus:bg-muted focus:ring-1 focus:ring-ring"
              >
                <IconUsers className="mr-2" />
              </TooltipTrigger>
              <TooltipContent>This is a shared chat.</TooltipContent>
            </Tooltip>
          ) : (
            <IconMessage className="mr-2" />
          )}
        </div>
        <div
          className="relative flex-1 select-none cursor-pointer"
          title={chat.messages[chat.messages.length - 1].content}
          onClick={handleConversationClick}
          style={{ maxWidth: '295px', whiteSpace: 'normal', overflow: 'hidden' }}
        >
          <span className="block overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {chat.messages[chat.messages.length - 1].content}
          </span>
        </div>
      </div>
      <button
        className="ml-4 text-red-500 hover:underline" 
        onClick={() => onRemove(chat.conversationId)}
      >
        Remove
      </button>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </div>
  )
}
