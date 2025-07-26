import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react'
import type { Campaign } from '@/types/campaign'

interface CampaignChartsProps {
  campaigns: Campaign[]
  companyName: string
}

export function CampaignCharts({ campaigns, companyName }: CampaignChartsProps) {
  // Calculate platform performance
  const platformStats = campaigns.reduce((acc, campaign) => {
    if (!acc[campaign.platform]) {
      acc[campaign.platform] = {
        count: 0,
        totalEngagement: 0,
        totalReach: 0,
        totalROI: 0,
        totalBudget: 0
      }
    }
    acc[campaign.platform].count++
    acc[campaign.platform].totalEngagement += campaign.engagementRate
    acc[campaign.platform].totalReach += campaign.reach
    acc[campaign.platform].totalROI += campaign.roi
    acc[campaign.platform].totalBudget += campaign.budget
    return acc
  }, {} as Record<string, any>)

  const platformPerformance = Object.entries(platformStats).map(([platform, stats]) => ({
    platform,
    avgEngagement: stats.totalEngagement / stats.count,
    totalReach: stats.totalReach,
    avgROI: stats.totalROI / stats.count,
    campaignCount: stats.count,
    totalBudget: stats.totalBudget
  })).sort((a, b) => b.avgEngagement - a.avgEngagement)

  // Calculate monthly trends (mock data based on campaign dates)
  const monthlyTrends = campaigns.reduce((acc, campaign) => {
    const month = new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { engagement: 0, reach: 0, campaigns: 0 }
    }
    acc[month].engagement += campaign.engagementRate
    acc[month].reach += campaign.reach
    acc[month].campaigns++
    return acc
  }, {} as Record<string, any>)

  const trendData = Object.entries(monthlyTrends).map(([month, data]) => ({
    month,
    avgEngagement: data.engagement / data.campaigns,
    totalReach: data.reach,
    campaigns: data.campaigns
  })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

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

  const maxEngagement = Math.max(...platformPerformance.map(p => p.avgEngagement))
  const maxReach = Math.max(...platformPerformance.map(p => p.totalReach))

  return (
    <div className="space-y-6">
      {/* Platform Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Platform Performance</span>
          </CardTitle>
          <CardDescription>
            Engagement rates and reach across different social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformPerformance.map((platform) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPlatformColor(platform.platform)}`} />
                    <span className="font-medium capitalize">{platform.platform}</span>
                    <Badge variant="secondary" className="text-xs">
                      {platform.campaignCount} campaigns
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-muted-foreground">
                      {platform.avgEngagement.toFixed(1)}% engagement
                    </span>
                    <span className="text-muted-foreground">
                      {formatNumber(platform.totalReach)} reach
                    </span>
                  </div>
                </div>
                
                {/* Engagement Rate Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Engagement Rate</span>
                    <span>{platform.avgEngagement.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(platform.avgEngagement / maxEngagement) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Reach Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Reach</span>
                    <span>{formatNumber(platform.totalReach)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(platform.totalReach / maxReach) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ROI and Budget */}
                <div className="flex justify-between text-xs">
                  <span className="text-green-600 font-medium">
                    {platform.avgROI.toFixed(1)}x ROI
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(platform.totalBudget)} budget
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance Trends</span>
          </CardTitle>
          <CardDescription>
            Monthly engagement and reach trends for {companyName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendData.map((trend, index) => {
              const prevTrend = trendData[index - 1]
              const engagementChange = prevTrend ? trend.avgEngagement - prevTrend.avgEngagement : 0
              const reachChange = prevTrend ? trend.totalReach - prevTrend.totalReach : 0
              
              return (
                <div key={trend.month} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium w-20">{trend.month}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {trend.campaigns} campaigns
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium">{trend.avgEngagement.toFixed(1)}%</div>
                      <div className="flex items-center space-x-1 text-xs">
                        {engagementChange > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : engagementChange < 0 ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : null}
                        <span className={`${engagementChange > 0 ? 'text-green-500' : engagementChange < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {engagementChange > 0 ? '+' : ''}{engagementChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatNumber(trend.totalReach)}</div>
                      <div className="flex items-center space-x-1 text-xs">
                        {reachChange > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : reachChange < 0 ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : null}
                        <span className={`${reachChange > 0 ? 'text-green-500' : reachChange < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {reachChange > 0 ? '+' : ''}{formatNumber(reachChange)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Top Performing Campaigns</span>
          </CardTitle>
          <CardDescription>
            Highest engagement campaigns with key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns
              .sort((a, b) => b.engagementRate - a.engagementRate)
              .slice(0, 5)
              .map((campaign, index) => (
                <div key={campaign.id} className="flex items-center space-x-4 p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getPlatformColor(campaign.platform)}`} />
                      <h4 className="font-medium text-sm truncate">{campaign.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{campaign.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{campaign.engagementRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">{formatNumber(campaign.reach)} reach</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}