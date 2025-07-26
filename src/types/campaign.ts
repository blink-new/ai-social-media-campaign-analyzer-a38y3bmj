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