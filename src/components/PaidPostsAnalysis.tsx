import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  MousePointer,
  Star,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react'
import { PaidPost, Comment } from '../types/campaign'

interface PaidPostsAnalysisProps {
  companyName: string
  paidPosts: PaidPost[]
}

const PaidPostsAnalysis: React.FC<PaidPostsAnalysisProps> = ({ companyName, paidPosts }) => {
  const [selectedPost, setSelectedPost] = useState<PaidPost | null>(null)
  const [commentFilter, setCommentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')

  const getSentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const filteredComments = selectedPost?.comments.filter(comment => 
    commentFilter === 'all' || comment.sentiment === commentFilter
  ) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Top Performing Paid Posts</h2>
          <p className="text-gray-600 mt-1">Analyze {companyName}'s highest-engagement paid social content and audience reactions</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {paidPosts.length} Posts Analyzed
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paidPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {post.platform}
                </Badge>
                <Badge className={`${post.roi > 200 ? 'bg-green-100 text-green-800' : post.roi > 100 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {post.roi}% ROI
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {post.imageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>{formatNumber(post.impressions)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-green-500" />
                  <span>{post.ctr.toFixed(1)}% CTR</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <span>${formatNumber(post.spend)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span>{formatNumber(post.engagement)} eng.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {formatNumber(post.metrics.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {formatNumber(post.metrics.comments)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {formatNumber(post.metrics.shares)}
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPost(post)}
                    >
                      View Comments
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {post.platform}
                        </Badge>
                        {post.title}
                      </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="comments" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="comments">Comments ({post.comments.length})</TabsTrigger>
                        <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
                        <TabsTrigger value="insights">Audience Insights</TabsTrigger>
                      </TabsList>

                      <TabsContent value="comments" className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium">Filter by sentiment:</span>
                          <div className="flex gap-2">
                            <Button
                              variant={commentFilter === 'all' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCommentFilter('all')}
                            >
                              All
                            </Button>
                            <Button
                              variant={commentFilter === 'positive' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCommentFilter('positive')}
                              className="text-green-600"
                            >
                              Positive
                            </Button>
                            <Button
                              variant={commentFilter === 'negative' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCommentFilter('negative')}
                              className="text-red-600"
                            >
                              Negative
                            </Button>
                            <Button
                              variant={commentFilter === 'neutral' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCommentFilter('neutral')}
                              className="text-gray-600"
                            >
                              Neutral
                            </Button>
                          </div>
                        </div>

                        <ScrollArea className="h-96">
                          <div className="space-y-4">
                            {filteredComments.map((comment) => (
                              <div key={comment.id} className="flex gap-3 p-4 rounded-lg border">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={comment.authorAvatar} />
                                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{comment.author}</span>
                                    {comment.verified && (
                                      <CheckCircle className="h-4 w-4 text-blue-500" />
                                    )}
                                    {comment.isInfluencer && (
                                      <Star className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <Badge variant="outline" className={`text-xs ${getSentimentColor(comment.sentiment)}`}>
                                      {getSentimentIcon(comment.sentiment)}
                                      <span className="ml-1 capitalize">{comment.sentiment}</span>
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatNumber(comment.followerCount)} followers
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                  
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {formatNumber(comment.likes)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {formatNumber(comment.replies)} replies
                                    </span>
                                    <span>{comment.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="sentiment" className="space-y-4">
                        <div className="grid gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Comment Sentiment Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                    <span>Positive</span>
                                  </div>
                                  <span className="font-medium">{post.commentSentiment.positive}%</span>
                                </div>
                                <Progress value={post.commentSentiment.positive} className="h-2" />
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Minus className="h-4 w-4 text-gray-500" />
                                    <span>Neutral</span>
                                  </div>
                                  <span className="font-medium">{post.commentSentiment.neutral}%</span>
                                </div>
                                <Progress value={post.commentSentiment.neutral} className="h-2" />
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <ThumbsDown className="h-4 w-4 text-red-500" />
                                    <span>Negative</span>
                                  </div>
                                  <span className="font-medium">{post.commentSentiment.negative}%</span>
                                </div>
                                <Progress value={post.commentSentiment.negative} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Top Comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {post.topComments.slice(0, 3).map((comment) => (
                                  <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={comment.authorAvatar} />
                                      <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{comment.author}</span>
                                        <Badge variant="outline" className={`text-xs ${getSentimentColor(comment.sentiment)}`}>
                                          {getSentimentIcon(comment.sentiment)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-700">{comment.content}</p>
                                      <span className="text-xs text-gray-500">{formatNumber(comment.likes)} likes</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="insights" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Top Demographics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {post.audienceInsights.topDemographics.map((demo, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm">{demo}</span>
                                    <Badge variant="secondary">{Math.floor(Math.random() * 30 + 10)}%</Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Top Locations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {post.audienceInsights.topLocations.map((location, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm">{location}</span>
                                    <Badge variant="secondary">{Math.floor(Math.random() * 25 + 5)}%</Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="md:col-span-2">
                            <CardHeader>
                              <CardTitle className="text-lg">Engagement by Age Group</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {Object.entries(post.audienceInsights.engagementByAge).map(([age, engagement]) => (
                                  <div key={age} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">{age}</span>
                                      <span className="text-sm text-gray-600">{engagement}% engagement</span>
                                    </div>
                                    <Progress value={engagement} className="h-2" />
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PaidPostsAnalysis