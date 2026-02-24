import * as React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { EditProfileModal } from '@/components/edit-profile-modal'
import { Zap } from '@geist-ui/icons'

export async function Header() {
  const session = await auth()
  // Add state for sidebar open/close
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <Sidebar open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
            <SidebarList userId={session?.user?.id} />
          </React.Suspense>
          <SidebarFooter>
            {/* <ThemeToggle />
            <EditProfileModal /> */}
          </SidebarFooter>
        </Sidebar>
        <div className="flex items-center">
          <span className="ml-4 font-bold text-lg">MH</span>
        </div>
      </div>
      <div className="flex items-center">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <Zap scale={2} />
          </Link>
        )}
      </div>
    </header>
  )
}
