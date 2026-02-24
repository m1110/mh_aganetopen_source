'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { ServerActionResult } from '@/lib/types'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { IconSpinner } from '@/components/ui/icons'

interface ClearHistoryProps {
  clearChats: () => ServerActionResult<void>
}

export function ClearHistory({ clearChats }: ClearHistoryProps) {
  const [isPending, startTransition] = React.useTransition()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const router = useRouter()

  const handleClear = async () => {
    const result = await clearChats()
    
    if (result && 'error' in result) {
      toast.error(result.error)
      return
    }

    setIsDialogOpen(false)
    router.refresh()
    toast.success('Conversation history cleared')
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={event => {
            event.preventDefault()
            startTransition(() => {
              handleClear()
            })
          }}
          className={cn(
            buttonVariants(),
            'bg-red-600 focus:ring-red-600',
            {
              'cursor-not-allowed opacity-60': isPending
            }
          )}
        >
          Clear history
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your chat history and remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={event => {
              event.preventDefault()
              startTransition(() => {
                handleClear()
              })
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
