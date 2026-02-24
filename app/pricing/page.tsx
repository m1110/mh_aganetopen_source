'use client'

import { Button } from '@/components/ui/button'
import { IconDollar } from '@/components/ui/icons'

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that works best for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-muted-foreground">Perfect for getting started</p>
          </div>
          <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              10 conversations per month
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Basic support
            </li>
          </ul>
          <Button variant="outline" className="w-full">Get Started</Button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-6 space-y-4 border-blue-500">
          <div>
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-muted-foreground">For power users</p>
          </div>
          <div className="text-3xl font-bold">$19<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Unlimited conversations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Priority support
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Advanced features
            </li>
          </ul>
          <Button className="w-full bg-blue-500 hover:bg-blue-600">Subscribe</Button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <p className="text-muted-foreground">For teams and organizations</p>
          </div>
          <div className="text-3xl font-bold">Custom</div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Everything in Pro
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Team management
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Custom integrations
            </li>
          </ul>
          <Button variant="outline" className="w-full">Contact Sales</Button>
        </div>
      </div>
    </div>
  )
} 