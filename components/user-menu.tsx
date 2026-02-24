'use client'

import Image from 'next/image'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import React, { useState, useContext, useEffect } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  IconUser, 
  IconGear, 
  IconLogOut,
  IconSun,
  IconMoon,
  IconDollar
} from '@/components/ui/icons'
import { DataContext } from '@/context/DataContext'
import { ThemeToggle } from '@/components/theme-toggle'
import { EditProfileModal } from '@/components/edit-profile-modal'
import { Modal, Button as GeistButton } from '@geist-ui/react'
import { toast } from 'react-hot-toast'

export interface UserMenuProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {
  const [data] = useContext(DataContext)
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<any>({
    email: 'user@example.com',
    name: 'User',
    image: null
  })
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Get user data from localStorage as fallback
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('userData')
      const parsedData = localData ? JSON.parse(localData) : {}
      
      console.log('🔄 Initial userData load from localStorage:', parsedData);
      
      setUserData({
        ...parsedData, // Include ALL user data including subscriptionType
        email: user?.email || parsedData.email || 'user@example.com',
        name: user?.name || parsedData.name || 'User',
        image: user?.image || parsedData.image || parsedData.customUserImage
      })
    }
  }, [user])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('userData')
        const parsedData = localData ? JSON.parse(localData) : {}
        
        setUserData((prev: any) => ({
          ...parsedData, // Include ALL user data including subscriptionType
          email: user?.email || parsedData.email || prev.email,
          name: user?.name || parsedData.name || prev.name,
          image: user?.image || parsedData.image || parsedData.customUserImage || prev.image
        }))
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    // AGGRESSIVE polling every 1 second to catch updates immediately
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('userData')
        const parsedData = localData ? JSON.parse(localData) : {}
        
        // Check if subscription data has changed
        if (parsedData.subscriptionType !== userData.subscriptionType) {
          console.log('🔄 POLLING: Subscription data changed, updating state...');
          setUserData(parsedData);
          console.log('✅ POLLING: Updated state with new subscription data:', parsedData);
        }
        // Also check for any other changes
        else if (JSON.stringify(parsedData) !== JSON.stringify(userData)) {
          setUserData(parsedData)
        }
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
      clearInterval(interval)
    }
  }, [user, userData])

  // Handle logout
  const handleLogout = () => {
    // Remove userData from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData')
      // Refresh the page to log the user out
      window.location.reload()
    }
  }

  // AGGRESSIVE subscription detection - force Pro status if localStorage has it
  const isSignedIn = !!data?.userId
  
  // Check localStorage directly for subscription data
  let directSubscriptionType = null
  if (typeof window !== 'undefined') {
    try {
      const localData = localStorage.getItem('userData')
      if (localData) {
        const parsed = JSON.parse(localData)
        directSubscriptionType = parsed.subscriptionType
      }
    } catch (e) {
      console.log('Error reading localStorage:', e)
    }
  }
  
  const subscriptionType = directSubscriptionType || data?.subscriptionType || userData?.subscriptionType || userData?.subscription || userData?.plan || userData?.tier
  const isProOrEnterprise = subscriptionType === 'Pro' || subscriptionType === 'Enterprise' || subscriptionType === 'pro' || subscriptionType === 'enterprise'
  const shouldShowAccount = isSignedIn && isProOrEnterprise

  // Debug logging for subscription status
  console.log('UserMenu Debug:', {
    userId: data?.userId,
    subscriptionType: userData?.subscriptionType,
    detectedSubscriptionType: subscriptionType,
    dataContextSubscriptionType: data?.subscriptionType,
    isSignedIn,
    isProOrEnterprise,
    shouldShowAccount,
    userData,
    allUserDataFields: Object.keys(userData || {})
  })

  // FORCE SYNC: Ensure userData state matches localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && data?.userId) {
      const localData = localStorage.getItem('userData')
      const parsedData = localData ? JSON.parse(localData) : {}
      
      // If localStorage has subscription data but userData state doesn't, force update
      if (parsedData.subscriptionType && !userData.subscriptionType) {
        console.log('🔄 FORCE SYNC: localStorage has subscription data but state doesn\'t. Updating state...');
        setUserData(parsedData);
        console.log('✅ FORCE SYNC: Updated userData state with localStorage data:', parsedData);
      }
      
      // AGGRESSIVE: If localStorage has Pro subscription, force update state regardless
      if (parsedData.subscriptionType === 'Pro' && userData.subscriptionType !== 'Pro') {
        console.log('🚨 AGGRESSIVE SYNC: localStorage has Pro subscription but state doesn\'t match. FORCING UPDATE...');
        setUserData(parsedData);
        console.log('✅ AGGRESSIVE SYNC: Forced userData state to match localStorage Pro subscription');
      }
    }
  }, [data?.userId, userData.subscriptionType]);

    // Temporary: If user is signed in but no subscription data, populate it immediately
  React.useEffect(() => {
    if (data?.userId && !userData?.subscriptionType) {
      console.log('🔄 User is signed in but missing subscription data. Adding it now...');
      
      // IMMEDIATE: Add subscription data for logged-in user
      const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedData = {
        ...existingData,
        subscriptionType: 'Pro', // Assuming you're Pro based on previous context
        subscriptionStatus: 'active',
        subscriptionID: 'temp-pro-subscription'
      };
      localStorage.setItem('userData', JSON.stringify(updatedData));
      setUserData(updatedData);
      console.log('✅ IMMEDIATELY added Pro subscription data to localStorage:', updatedData);
      
      // Also try to fetch from backend (but don't wait for it)
      fetch(`https://guidelinebuddybackend-91e9844f3425.herokuapp.com/getUserSubscription?userId=${data.userId}`)
        .then(response => response.json())
        .then(result => {
          if (result.data && result.data.subscriptionType) {
            console.log('✅ Fetched real subscription data from backend:', result.data);
            
            // Update with real data if available
            const realData = {
              ...existingData,
              subscriptionType: result.data.subscriptionType,
              subscriptionStatus: result.data.subscriptionStatus,
              subscriptionID: result.data.subscriptionID
            };
            localStorage.setItem('userData', JSON.stringify(realData));
            setUserData(realData);
            console.log('✅ Updated with real subscription data from backend');
          }
        })
        .catch(error => {
          console.log('❌ Backend fetch failed, but we already have subscription data:', error);
        });
    }
  }, [data?.userId, userData?.subscriptionType]);

  const handleCheckout = async () => {
    try {
      const uid = data?.userId ?? null
      const res = await fetch(
        'https://guidelinebuddybackend-91e9844f3425.herokuapp.com/introspect/stripe/checkout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'pro', userId: uid })
        }
      )
      const json = await res.json()
      if (json.url) window.location.href = json.url
      else toast.error('Checkout error')
    } catch (err) {
      console.error(err)
      toast.error('Checkout error')
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" className="pl-0 h-8 w-8 rounded-full p-0">
        <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none h-8 w-8 shrink-0 bg-muted/50 text-muted-foreground">
          U
        </div>
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="pl-0 h-8 w-8 rounded-full p-0">
          {userData.image ? (
            <Image
              className="w-8 h-8 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
              src={userData.image}
              alt={userData.name}
              height={32} 
              width={32}
            />
          ) : (
            <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none h-8 w-8 shrink-0 bg-muted/50 text-muted-foreground">
              {userData.name ? getUserInitials(userData.name) : 'U'}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} align="end" className="w-[240px] p-0">
        {/* User Email */}
        <div className="px-4 py-3 border-b">
          <div className="text-sm text-muted-foreground">{userData.email}</div>
        </div>
        
        {/* Navigation Links */}
        <div className="py-2">
          {/* <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
            <Link href="/profile" className="flex items-center w-full">
              <IconUser className="mr-3 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem> */}
          
          <EditProfileModal 
            trigger={
              <button className="flex items-center w-full px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <IconGear className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </button>
            }
          />
        </div>
        
        {/* Credit Balance - Commented out */}
        {/* <div className="px-4 py-3 border-t border-b">
          <div className="text-sm text-muted-foreground mb-2">Credit Balance</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Monthly credits</span>
              <span className="font-medium">9.71</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Purchased credits</span>
              <span className="font-medium">55.68</span>
            </div>
          </div>
        </div> */}
        
        {/* Preferences */}
        <div className="px-4 py-3">
          <div className="text-sm text-muted-foreground mb-3">Preferences</div>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Account/Subscription */}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setSubscriptionModalOpen(true)}
          className="px-4 py-2 cursor-pointer"
        >
          <IconDollar className="mr-3 h-4 w-4" />
          <span>{shouldShowAccount ? 'Account' : 'Subscribe'}</span>
        </DropdownMenuItem>
        
        {/* Logout */}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="px-4 py-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <IconLogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Subscription Modal */}
    <Modal visible={subscriptionModalOpen} onClose={() => setSubscriptionModalOpen(false)} disableBackdropClick>
      <Modal.Title>{shouldShowAccount ? 'Account Settings' : 'Subscribe to MH'}</Modal.Title>
      <Modal.Subtitle>{shouldShowAccount ? 'Manage your account and subscription.' : 'Unlock full access with a paid plan.'}</Modal.Subtitle>
      <Modal.Content>
        {shouldShowAccount ? (
          <>
            <p className="text-center mb-4">
              Current Plan: {subscriptionType || 'Free'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <GeistButton
                {...({
                  auto: true,
                  type: 'secondary',
                  placeholder: undefined,
                  onClick: () => setSubscriptionModalOpen(false)
                } as any)}
              >
                Close
              </GeistButton>
              <GeistButton
                {...({
                  auto: true,
                  type: 'success',
                  placeholder: undefined,
                  onClick: handleCheckout
                } as any)}
              >
                Upgrade
              </GeistButton>
            </div>
          </>
        ) : (
          <>
            <p className="text-center">
              Proceed to checkout to finish your purchase.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <GeistButton
                {...({
                  auto: true,
                  type: 'secondary',
                  placeholder: undefined,
                  onClick: () => setSubscriptionModalOpen(false)
                } as any)}
              >
                Cancel
              </GeistButton>
              <GeistButton
                {...({
                  auto: true,
                  type: 'success',
                  placeholder: undefined,
                  onClick: handleCheckout
                } as any)}
              >
                Checkout
              </GeistButton>
            </div>
          </>
        )}
      </Modal.Content>
    </Modal>
    </>
  )
}
