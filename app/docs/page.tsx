'use client'

import { IconBook } from '@/components/ui/icons'

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground mt-2">Learn how to use MH effectively</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <IconBook className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Getting Started</h2>
          </div>
          <div className="space-y-2">
            <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
              <h3 className="font-medium">Quick Start Guide</h3>
              <p className="text-sm text-muted-foreground">Learn the basics in 5 minutes</p>
            </a>
            <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
              <h3 className="font-medium">Installation</h3>
              <p className="text-sm text-muted-foreground">Set up MH on your system</p>
            </a>
            <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
              <h3 className="font-medium">First Conversation</h3>
              <p className="text-sm text-muted-foreground">Start your first chat</p>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Features</h2>
          <div className="space-y-2">
            <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
              <h3 className="font-medium">Conversation Management</h3>
              <p className="text-sm text-muted-foreground">Organize and manage your chats</p>
            </a>
            <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
              <h3 className="font-medium">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </a>
            <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
              <h3 className="font-medium">API Reference</h3>
              <p className="text-sm text-muted-foreground">Integrate with our API</p>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/community" className="block p-4 border rounded-lg hover:bg-muted text-center">
            <h3 className="font-medium">Community Forum</h3>
            <p className="text-sm text-muted-foreground">Ask questions and share tips</p>
          </a>
          <a href="#" className="block p-4 border rounded-lg hover:bg-muted text-center">
            <h3 className="font-medium">Support</h3>
            <p className="text-sm text-muted-foreground">Get help from our team</p>
          </a>
          <a href="#" className="block p-4 border rounded-lg hover:bg-muted text-center">
            <h3 className="font-medium">Feedback</h3>
            <p className="text-sm text-muted-foreground">Share your thoughts with us</p>
          </a>
        </div>
      </div>
    </div>
  )
} 