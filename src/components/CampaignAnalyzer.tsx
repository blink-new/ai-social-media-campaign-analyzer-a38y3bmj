import { useState, useEffect } from 'react'
import { Search, TrendingUp, Users, Eye, MousePointer, Share2, MessageCircle, Heart, DollarSign, Calendar, Target, Sparkles, Building2, BarChart3, Filter, Download, RefreshCw, PieChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { blink } from '@/blink/client'
import { CampaignCharts } from './CampaignCharts'
import { ExportDialog } from './ExportDialog'
import PaidPostsAnalysis from './PaidPostsAnalysis'
import type { Campaign, CompanyAnalysis, AIInsight, PaidPost } from '@/types/campaign'

export function CampaignAnalyzer() {
  const [companyName, setCompanyName] = useState('')
  const [competitorMode, setCompetitorMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [paidPosts, setPaidPosts] = useState<PaidPost[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [sortBy, setSortBy] = useState<'engagement' | 'reach' | 'roi'>('engagement')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  const analyzeCampaigns = async () => {
    if (!companyName.trim()) return

    setLoading(true)
    try {
      // Generate mock data using AI for demonstration
      const { object: mockAnalysis } = await blink.ai.generateObject({
        prompt: `Generate realistic social media campaign analysis data for ${companyName}${competitorMode ? ' and its main competitors' : ''}. Include 8-12 campaigns with realistic metrics, engagement rates, and performance data. Make the data varied and realistic for a ${competitorMode ? 'competitive analysis' : 'company analysis'}.`,
        schema: {
          type: 'object',
          properties: {
            companyName: { type: 'string' },
            totalCampaigns: { type: 'number' },
            avgEngagementRate: { type: 'number' },
            totalReach: { type: 'number' },
            totalImpressions: { type: 'number' },
            campaigns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  companyName: { type: 'string' },
                  platform: { type: 'string', enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'] },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  imageUrl: { type: 'string' },
                  engagementRate: { type: 'number' },
                  reach: { type: 'number' },
                  impressions: { type: 'number' },
                  clicks: { type: 'number' },
                  shares: { type: 'number' },
                  comments: { type: 'number' },
                  likes: { type: 'number' },
                  ctr: { type: 'number' },
                  cpm: { type: 'number' },
                  roi: { type: 'number' },
                  budget: { type: 'number' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  objective: { type: 'string' },
                  targetAudience: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        }
      })

      // Generate AI insights
      const { object: aiInsights } = await blink.ai.generateObject({
        prompt: `Based on the campaign analysis for ${companyName}, generate 5-7 actionable AI insights covering performance optimization, audience targeting, content strategy, timing, and budget allocation. Make them specific and actionable.`,
        schema: {
          type: 'object',
          properties: {
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['performance', 'audience', 'content', 'timing', 'budget'] },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  recommendation: { type: 'string' },
                  impact: { type: 'string', enum: ['high', 'medium', 'low'] },
                  confidence: { type: 'number' }
                }
              }
            }
          }
        }
      })

      const analysisData = mockAnalysis as CompanyAnalysis
      analysisData.bestPerformingCampaign = analysisData.campaigns.reduce((best, current) => 
        current.engagementRate > best.engagementRate ? current : best
      )

      setAnalysis(analysisData)
      setInsights(aiInsights.insights)

      // Generate paid posts data
      const { object: paidPostsData } = await blink.ai.generateObject({
        prompt: `Generate 6-8 top-performing paid social media posts for ${companyName} with realistic engagement metrics, detailed comments from users (including influencers and verified accounts), and sentiment analysis. Include diverse ad types and platforms.`,
        schema: {
          type: 'object',
          properties: {
            paidPosts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  campaignId: { type: 'string' },
                  title: { type: 'string' },
                  content: { type: 'string' },
                  imageUrl: { type: 'string' },
                  platform: { type: 'string', enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'] },
                  adType: { type: 'string', enum: ['image', 'video', 'carousel', 'story', 'collection'] },
                  targetAudience: { type: 'string' },
                  budget: { type: 'number' },
                  spend: { type: 'number' },
                  impressions: { type: 'number' },
                  clicks: { type: 'number' },
                  conversions: { type: 'number' },
                  engagement: { type: 'number' },
                  ctr: { type: 'number' },
                  cpm: { type: 'number' },
                  cpc: { type: 'number' },
                  roi: { type: 'number' },
                  createdAt: { type: 'string' },
                  metrics: {
                    type: 'object',
                    properties: {
                      likes: { type: 'number' },
                      shares: { type: 'number' },
                      comments: { type: 'number' },
                      saves: { type: 'number' },
                      reactions: { type: 'number' }
                    }
                  },
                  comments: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        author: { type: 'string' },
                        authorAvatar: { type: 'string' },
                        content: { type: 'string' },
                        likes: { type: 'number' },
                        replies: { type: 'number' },
                        timestamp: { type: 'string' },
                        sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
                        verified: { type: 'boolean' },
                        followerCount: { type: 'number' },
                        isInfluencer: { type: 'boolean' }
                      }
                    }
                  },
                  topComments: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        author: { type: 'string' },
                        authorAvatar: { type: 'string' },
                        content: { type: 'string' },
                        likes: { type: 'number' },
                        replies: { type: 'number' },
                        timestamp: { type: 'string' },
                        sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
                        verified: { type: 'boolean' },
                        followerCount: { type: 'number' },
                        isInfluencer: { type: 'boolean' }
                      }
                    }
                  },
                  commentSentiment: {
                    type: 'object',
                    properties: {
                      positive: { type: 'number' },
                      negative: { type: 'number' },
                      neutral: { type: 'number' }
                    }
                  },
                  audienceInsights: {
                    type: 'object',
                    properties: {
                      topDemographics: { type: 'array', items: { type: 'string' } },
                      engagementByAge: { type: 'object' },
                      topLocations: { type: 'array', items: { type: 'string' } }
                    }
                  }
                }
              }
            }
          }
        }
      })

      setPaidPosts(paidPostsData.paidPosts)
    } catch (error) {
      console.error('Error analyzing campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
  }

  const getPlatformColor = (platform: string) => {
    const colors = {
      facebook: 'bg-blue-500',
      instagram: 'bg-pink-500',
      twitter: 'bg-sky-500',
      linkedin: 'bg-blue-700',
      tiktok: 'bg-black',
      youtube: 'bg-red-500'
    }
    return colors[platform as keyof typeof colors] || 'bg-gray-500'
  }

  const getInsightIcon = (type: string) => {
    const icons = {
      performance: TrendingUp,
      audience: Users,
      content: MessageCircle,
      timing: Calendar,
      budget: DollarSign
    }
    const Icon = icons[type as keyof typeof icons] || Sparkles
    return <Icon className="h-4 w-4" />
  }

  const filteredAndSortedCampaigns = analysis?.campaigns
    .filter(campaign => filterPlatform === 'all' || campaign.platform === filterPlatform)
    .sort((a, b) => {
      switch (sortBy) {
        case 'engagement':
          return b.engagementRate - a.engagementRate
        case 'reach':
          return b.reach - a.reach
        case 'roi':
          return b.roi - a.roi
        default:
          return 0
      }
    }) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Analyze Campaigns</span>
                </CardTitle>
                <CardDescription>
                  Enter a company name to analyze their top-performing social media campaigns
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {analysis && (
                  <ExportDialog analysis={analysis} insights={insights}>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </ExportDialog>
                )}
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter company name (e.g., Nike, Apple, Coca-Cola)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeCampaigns()}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={analyzeCampaigns} 
                disabled={loading || !companyName.trim()}
                size="lg"
                className="px-8"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="competitor-mode"
                checked={competitorMode}
                onCheckedChange={setCompetitorMode}
              />
              <Label htmlFor="competitor-mode" className="text-sm">
                Include competitor analysis
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.totalCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all platforms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.avgEngagementRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Engagement rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analysis.totalReach)}</div>
                  <p className="text-xs text-muted-foreground">
                    People reached
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analysis.totalImpressions)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total views
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="campaigns" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="paid-posts">Paid Posts</TabsTrigger>
                <TabsTrigger value="charts">Analytics</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Campaigns List */}
                  <div className="lg:col-span-2">
                    <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Campaign Performance</CardTitle>
                        <CardDescription>
                          Top-performing campaigns for {analysis.companyName}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="reach">Reach</SelectItem>
                            <SelectItem value="roi">ROI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredAndSortedCampaigns.map((campaign) => (
                        <Dialog key={campaign.id}>
                          <DialogTrigger asChild>
                            <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                                  <div className={`w-3 h-3 rounded-full ${getPlatformColor(campaign.platform)}`} />
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5"
                                >
                                  {campaign.platform}
                                </Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{campaign.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">{campaign.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs font-medium">{campaign.engagementRate.toFixed(1)}%</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs">{formatNumber(campaign.reach)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3 text-green-600" />
                                    <span className="text-xs">{campaign.roi.toFixed(1)}x</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getPlatformColor(campaign.platform)}`} />
                                <span>{campaign.title}</span>
                              </DialogTitle>
                              <DialogDescription>{campaign.description}</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                              </TabsList>
                              <TabsContent value="overview" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Engagement Rate</Label>
                                    <div className="flex items-center space-x-2">
                                      <Progress value={campaign.engagementRate * 10} className="flex-1" />
                                      <span className="text-sm font-medium">{campaign.engagementRate.toFixed(1)}%</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">ROI</Label>
                                    <div className="flex items-center space-x-2">
                                      <Progress value={Math.min(campaign.roi * 20, 100)} className="flex-1" />
                                      <span className="text-sm font-medium">{campaign.roi.toFixed(1)}x</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold text-primary">{formatNumber(campaign.reach)}</div>
                                    <div className="text-xs text-muted-foreground">Reach</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-accent">{formatNumber(campaign.impressions)}</div>
                                    <div className="text-xs text-muted-foreground">Impressions</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">{formatNumber(campaign.clicks)}</div>
                                    <div className="text-xs text-muted-foreground">Clicks</div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="metrics" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-sm">Likes</span>
                                      <span className="font-medium">{formatNumber(campaign.likes)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Comments</span>
                                      <span className="font-medium">{formatNumber(campaign.comments)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Shares</span>
                                      <span className="font-medium">{formatNumber(campaign.shares)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">CTR</span>
                                      <span className="font-medium">{campaign.ctr.toFixed(2)}%</span>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-sm">CPM</span>
                                      <span className="font-medium">{formatCurrency(campaign.cpm)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Budget</span>
                                      <span className="font-medium">{formatCurrency(campaign.budget)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Duration</span>
                                      <span className="font-medium">
                                        {Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">ROI</span>
                                      <span className="font-medium text-green-600">{campaign.roi.toFixed(1)}x</span>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="details" className="space-y-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium">Objective</Label>
                                    <p className="text-sm text-muted-foreground mt-1">{campaign.objective}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Target Audience</Label>
                                    <p className="text-sm text-muted-foreground mt-1">{campaign.targetAudience}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Start Date</Label>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(campaign.startDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">End Date</Label>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(campaign.endDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

                  {/* AI Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>AI Insights</span>
                      </CardTitle>
                      <CardDescription>
                        Actionable recommendations based on campaign analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {insights.map((insight) => (
                          <div key={insight.id} className="p-3 rounded-lg border bg-card/50">
                            <div className="flex items-start space-x-3">
                              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                {getInsightIcon(insight.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-sm">{insight.title}</h4>
                                  <Badge 
                                    variant={insight.impact === 'high' ? 'default' : insight.impact === 'medium' ? 'secondary' : 'outline'}
                                    className="text-xs"
                                  >
                                    {insight.impact}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                                <p className="text-xs font-medium text-primary">{insight.recommendation}</p>
                                <div className="flex items-center space-x-1 mt-2">
                                  <div className="text-xs text-muted-foreground">Confidence:</div>
                                  <Progress value={insight.confidence} className="flex-1 h-1" />
                                  <div className="text-xs font-medium">{insight.confidence}%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="paid-posts" className="space-y-0">
                <PaidPostsAnalysis companyName={analysis.companyName} paidPosts={paidPosts} />
              </TabsContent>

              <TabsContent value="charts" className="space-y-0">
                <CampaignCharts campaigns={analysis.campaigns} companyName={analysis.companyName} />
              </TabsContent>

              <TabsContent value="insights" className="space-y-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {insights.map((insight) => (
                    <Card key={insight.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-primary/10 text-primary">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant={insight.impact === 'high' ? 'default' : insight.impact === 'medium' ? 'secondary' : 'outline'}
                              >
                                {insight.impact} impact
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {insight.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                        <div className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
                          <p className="text-sm font-medium text-primary">{insight.recommendation}</p>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Confidence Level</span>
                            <span>{insight.confidence}%</span>
                          </div>
                          <Progress value={insight.confidence} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to analyze campaigns</h3>
            <p className="text-muted-foreground mb-4">
              Enter a company name above to discover their top-performing social media campaigns
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Performance metrics</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>AI insights</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>Competitive analysis</span>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}