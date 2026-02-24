'use client'

import { IconUsers } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <p className="text-muted-foreground mt-2">Connect with other MH users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Discussions</h2>
            <Button>Start New Topic</Button>
          </div>

          <div className="space-y-4">
            {/* Discussion Item */}
            <div className="border rounded-lg p-4 hover:bg-muted/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">How to optimize conversation prompts?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    I&apos;ve been using MH for a while now and I&apos;m looking for tips on how to write better prompts...
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>by User123</span>
                    <span>2 hours ago</span>
                    <span>5 replies</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-muted/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  S
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Feature request: Export conversations</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    It would be great to have the ability to export conversations in different formats...
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>by Seeker456</span>
                    <span>1 day ago</span>
                    <span>12 replies</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-muted/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Welcome new users!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Welcome to all the new MH users! Feel free to introduce yourself...
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>by Admin</span>
                    <span>3 days ago</span>
                    <span>25 replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <div className="space-y-2">
              <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
                <div className="font-medium">General Discussion</div>
                <div className="text-sm text-muted-foreground">15 topics</div>
              </a>
              <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
                <div className="font-medium">Tips & Tricks</div>
                <div className="text-sm text-muted-foreground">8 topics</div>
              </a>
              <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
                <div className="font-medium">Feature Requests</div>
                <div className="text-sm text-muted-foreground">12 topics</div>
              </a>
              <a href="#" className="block p-3 border rounded-lg hover:bg-muted">
                <div className="font-medium">Bug Reports</div>
                <div className="text-sm text-muted-foreground">3 topics</div>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community Stats</h3>
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Total Members</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span>Active Topics</span>
                <span className="font-medium">38</span>
              </div>
              <div className="flex justify-between">
                <span>Total Posts</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 