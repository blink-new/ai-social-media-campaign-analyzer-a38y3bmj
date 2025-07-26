import { useState, useEffect } from 'react'
import { CampaignAnalyzer } from '@/components/CampaignAnalyzer'
import { AccountManagement } from '@/components/AccountManagement'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { User, Settings } from 'lucide-react'
import { blink } from '@/blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAccountManagement, setShowAccountManagement] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Welcome to Campaign Analyzer</h1>
          <p className="text-muted-foreground mb-6">Sign in to start analyzing social media campaigns with AI</p>
          <Button onClick={() => blink.auth.login()}>
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (showAccountManagement) {
    return (
      <>
        <AccountManagement 
          user={user} 
          onClose={() => setShowAccountManagement(false)} 
        />
        <Toaster />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">AI Campaign Analyzer</h1>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.displayName || user.email}</p>
                  <p className="text-xs text-muted-foreground">Pro Plan</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAccountManagement(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <CampaignAnalyzer />
      </div>
      <Toaster />
    </>
  )
}

export default App