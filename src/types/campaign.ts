export interface Campaign {
  id: string
  companyName: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  title: string
  description: string
  imageUrl?: string
  videoUrl?: string
  engagementRate: number
  reach: number
  impressions: number
  clicks: number
  shares: number
  comments: number
  likes: number
  ctr: number // Click-through rate
  cpm: number // Cost per mille
  roi: number // Return on investment
  budget: number
  startDate: string
  endDate: string
  objective: string
  targetAudience: string
  createdAt: string
  updatedAt: string
}

export interface CompanyAnalysis {
  companyName: string
  totalCampaigns: number
  avgEngagementRate: number
  totalReach: number
  totalImpressions: number
  bestPerformingCampaign: Campaign
  campaigns: Campaign[]
}

export interface AIInsight {
  id: string
  type: 'performance' | 'audience' | 'content' | 'timing' | 'budget'
  title: string
  description: string
  recommendation: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

export interface Comment {
  id: string
  author: string
  authorAvatar: string
  content: string
  likes: number
  replies: number
  timestamp: string
  sentiment: 'positive' | 'negative' | 'neutral'
  verified: boolean
  followerCount: number
  isInfluencer: boolean
}

export interface PaidPost {
  id: string
  campaignId: string
  title: string
  content: string
  imageUrl: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  adType: 'image' | 'video' | 'carousel' | 'story' | 'collection'
  targetAudience: string
  budget: number
  spend: number
  impressions: number
  clicks: number
  conversions: number
  engagement: number
  ctr: number
  cpm: number
  cpc: number
  roi: number
  createdAt: string
  metrics: {
    likes: number
    shares: number
    comments: number
    saves: number
    reactions: number
  }
  comments: Comment[]
  topComments: Comment[]
  commentSentiment: {
    positive: number
    negative: number
    neutral: number
  }
  audienceInsights: {
    topDemographics: string[]
    engagementByAge: { [key: string]: number }
    topLocations: string[]
  }
}