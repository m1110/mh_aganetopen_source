'use client'
import * as React from 'react'
import { nanoid } from '@/lib/utils'
import { Chat } from './chat'
import { GetServerSideProps } from 'next'
import { DataContext } from '../context/DataContext'
import { EditProfileModal } from '@/components/edit-profile-modal'
import { clearChats } from '@/app/actions'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'

import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import Link from 'next/link'
import { IconSeparator } from './ui/icons'

import { UserMenu } from '@/components/user-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
const runtime = 'edge'

export const getServerSideProps: GetServerSideProps = async context => {
  const { cam } = context.query
  console.log(`🚨 context`, context)
  if (cam) {
    console.log(cam)
  }

  const id = nanoid()

  return {
    props: {
      id,
      add: cam ? cam.toString() : null
    }
  }
}

interface DeciderProps {
  id: string
  cam: string | null
}

const Decider: React.FC<DeciderProps> = ({ id, cam }) => {

  const [data, setData] = React.useContext(DataContext)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
        <div className="flex items-center">
          <Sidebar open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList userId="D3fIxaIe3MIUiXMUWtUR" />
            </React.Suspense>
            <SidebarFooter>
              {/* <ThemeToggle />
              <EditProfileModal /> */}
            </SidebarFooter>
          </Sidebar>
          <div className="flex items-center">
            <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <UserMenu />
        </div>
      </header>

      <Chat id={id} />
    </>
  )
}

export default Decider
