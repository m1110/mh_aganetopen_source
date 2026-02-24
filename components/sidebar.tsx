'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { IconSidebar } from '@/components/ui/icons'
import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'
import { ClearHistory } from '@/components/clear-history'
import { clearChats } from '@/app/actions'

export interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children, open, onOpenChange }: SidebarProps & { open: boolean, onOpenChange: (open: boolean) => void })  {
  const [data, setData] = useContext(DataContext);

  const handleNewConversation = () => {
    setData({ ...data, newConversation: true, messages: [], conversationId: undefined });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0 hover:bg-gray-200">
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0 bg-background shadow-lg">
        <SheetHeader className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </SheetHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex gap-2 w-full">
            <Button onClick={handleNewConversation} className="bg-blue-500 text-white hover:bg-blue-600">New Chat</Button>
            {/* <ClearHistory clearChats={clearChats} /> */}
          </div>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  )
}
