import { useState, useEffect, useCallback } from 'react'
import { User, Settings, CreditCard, BarChart3, LogOut, Crown, Zap, Shield, Calendar, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { blink } from '@/blink/client'
import { toast } from '@/hooks/use-toast'

interface UserProfile {
  id: string
  email: string
  displayName: string
  company?: string
  role?: string
  phone?: string
  location?: string
  bio?: string
  avatar?: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  analysesUsed: number
  analysesLimit: number
  createdAt: string
  lastLogin: string
}

interface AnalysisHistory {
  id: string
  companyName: string
  analysisType: 'company' | 'competitor'
  campaignsFound: number
  createdAt: string
  status: 'completed' | 'processing' | 'failed'
}

export function AccountManagement({ user, onClose }: { user: any, onClose: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])
  const [editingProfile, setEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: '',
    company: '',
    role: '',
    phone: '',
    location: '',
    bio: ''
  })
  const [loading, setLoading] = useState(true)

  const loadUserData = useCallback(async () => {
    try {
      // Generate mock user profile data
      const mockProfile: UserProfile = {
        id: user.id,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        company: 'Acme Marketing Agency',
        role: 'Marketing Director',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Passionate about data-driven marketing strategies and social media analytics.',
        plan: 'pro',
        analysesUsed: 47,
        analysesLimit: 100,
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: new Date().toISOString()
      }

      // Generate mock analysis history
      const mockHistory: AnalysisHistory[] = [
        {
          id: '1',
          companyName: 'Nike',
          analysisType: 'competitor',
          campaignsFound: 12,
          createdAt: '2024-01-20T14:30:00Z',
          status: 'completed'
        },
        {
          id: '2',
          companyName: 'Apple',
          analysisType: 'company',
          campaignsFound: 8,
          createdAt: '2024-01-19T09:15:00Z',
          status: 'completed'
        },
        {
          id: '3',
          companyName: 'Tesla',
          analysisType: 'competitor',
          campaignsFound: 15,
          createdAt: '2024-01-18T16:45:00Z',
          status: 'completed'
        },
        {
          id: '4',
          companyName: 'Coca-Cola',
          analysisType: 'company',
          campaignsFound: 10,
          createdAt: '2024-01-17T11:20:00Z',
          status: 'completed'
        },
        {
          id: '5',
          companyName: 'McDonald\'s',
          analysisType: 'competitor',
          campaignsFound: 9,
          createdAt: '2024-01-16T13:10:00Z',
          status: 'completed'
        }
      ]

      setProfile(mockProfile)
      setAnalysisHistory(mockHistory)
      setEditForm({
        displayName: mockProfile.displayName,
        company: mockProfile.company || '',
        role: mockProfile.role || '',
        phone: mockProfile.phone || '',
        location: mockProfile.location || '',
        bio: mockProfile.bio || ''
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const handleSaveProfile = async () => {
    try {
      // In a real app, this would update the user profile in the database
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...editForm
        }
        setProfile(updatedProfile)
        setEditingProfile(false)
        toast({
          title: "Success",
          description: "Profile updated successfully"
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const handleLogout = () => {
    blink.auth.logout()
    onClose()
  }

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: { label: 'Free', color: 'bg-gray-500', icon: Shield },
      starter: { label: 'Starter', color: 'bg-blue-500', icon: Zap },
      pro: { label: 'Pro', color: 'bg-purple-500', icon: Crown },
      enterprise: { label: 'Enterprise', color: 'bg-gold-500', icon: Crown }
    }
    const badge = badges[plan as keyof typeof badges] || badges.free
    const Icon = badge.icon
    return (
      <Badge className={`${badge.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Failed to load profile data</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.displayName}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getPlanBadge(profile.plan)}
              <Badge variant="outline" className="text-xs">
                {profile.analysesUsed}/{profile.analysesLimit} analyses used
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </div>
                <Button
                  variant={editingProfile ? "default" : "outline"}
                  onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                >
                  {editingProfile ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  {editingProfile ? (
                    <Input
                      id="displayName"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">{profile.displayName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm p-2 bg-muted rounded text-muted-foreground">{profile.email}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  {editingProfile ? (
                    <Input
                      id="company"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">{profile.company || 'Not specified'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  {editingProfile ? (
                    <Input
                      id="role"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">{profile.role || 'Not specified'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {editingProfile ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">{profile.phone || 'Not specified'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {editingProfile ? (
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted rounded">{profile.location || 'Not specified'}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {editingProfile ? (
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{profile.bio || 'No bio provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-muted-foreground">{formatDate(profile.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last login</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(profile.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Track your campaign analysis usage and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Analyses Used</span>
                  <span className="text-sm text-muted-foreground">
                    {profile.analysesUsed} / {profile.analysesLimit}
                  </span>
                </div>
                <Progress value={(profile.analysesUsed / profile.analysesLimit) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{profile.analysesUsed}</div>
                    <div className="text-xs text-muted-foreground">Total Analyses</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{profile.analysesLimit - profile.analysesUsed}</div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{analysisHistory.length}</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <h4 className="font-medium text-primary mb-2">Upgrade Your Plan</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get more analyses, advanced features, and priority support with a Pro plan.
                </p>
                <Button size="sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>View your recent campaign analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisHistory.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{analysis.companyName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {analysis.analysisType}
                          </Badge>
                          <span>•</span>
                          <span>{analysis.campaignsFound} campaigns found</span>
                          <span>•</span>
                          <span>{formatDateTime(analysis.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={analysis.status === 'completed' ? 'default' : 
                               analysis.status === 'processing' ? 'secondary' : 'destructive'}
                    >
                      {analysis.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about your analyses</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Export</h4>
                    <p className="text-sm text-muted-foreground">Download your analysis data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Export Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <div className="p-4 border border-destructive/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Sign Out</h5>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}