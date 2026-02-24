'use client'
import { useState, useContext } from 'react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Modal, Button as GeistButton } from '@geist-ui/react'
import { toast } from 'react-hot-toast'
import { DataContext } from '@/context/DataContext'

export default function SubscribeButton() {
  const [open, setOpen] = useState(false)
  const [data] = useContext(DataContext)
  const [userData, setUserData] = useState<any>(null)

  // Get user data from localStorage to check subscription status
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('userData')
      const parsedData = localData ? JSON.parse(localData) : {}
      setUserData(parsedData)
    }
  }, [])

  // Listen for updates to userData in localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('userData')
        const parsedData = localData ? JSON.parse(localData) : {}
        setUserData(parsedData)
      }
    }

    // Listen for storage events (when localStorage is updated from other tabs/windows)
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events that might be fired when userData is updated
    window.addEventListener('userDataUpdated', handleStorageChange)
    
    // Poll for changes every 2 seconds to catch updates from the same tab
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('userData')
        const parsedData = localData ? JSON.parse(localData) : {}
        // Only update if the data has actually changed
        if (JSON.stringify(parsedData) !== JSON.stringify(userData)) {
          setUserData(parsedData)
        }
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userDataUpdated', handleStorageChange)
      clearInterval(interval)
    }
  }, [userData])

  // Check if user is signed in but not a pro/enterprise customer
  const isSignedIn = !!data?.userId
  const isProOrEnterprise = userData?.subscriptionType === 'Pro' || userData?.subscriptionType === 'Enterprise'
  const shouldShowAccount = isSignedIn && !isProOrEnterprise

  // Debug logging
  console.log('SubscribeButton Debug:', {
    userId: data?.userId,
    subscriptionType: userData?.subscriptionType,
    isSignedIn,
    isProOrEnterprise,
    shouldShowAccount,
    userData
  })

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

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        className="ml-2"
      >
        {shouldShowAccount ? 'Account' : 'Subscribe'}
      </Button>
      <Modal visible={open} onClose={() => setOpen(false)} disableBackdropClick>
        <Modal.Title>{shouldShowAccount ? 'Account Settings' : 'Subscribe to MH'}</Modal.Title>
        <Modal.Subtitle>{shouldShowAccount ? 'Manage your account and subscription.' : 'Unlock full access with a paid plan.'}</Modal.Subtitle>
        <Modal.Content>
          {shouldShowAccount ? (
            <>
              <p className="text-center mb-4">
                Current Plan: {userData?.subscriptionType || 'Free'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <GeistButton
                  {...({
                    auto: true,
                    type: 'secondary',
                    placeholder: undefined,
                    onClick: () => setOpen(false)
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
                    onClick: () => setOpen(false)
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
