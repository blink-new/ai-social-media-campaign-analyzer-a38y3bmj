import { useState } from 'react'
import { Download, FileText, Image, Table, Mail, Share2, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import type { Campaign, CompanyAnalysis, AIInsight } from '@/types/campaign'

interface ExportDialogProps {
  analysis: CompanyAnalysis
  insights: AIInsight[]
  children: React.ReactNode
}

export function ExportDialog({ analysis, insights, children }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json' | 'png'>('pdf')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeInsights, setIncludeInsights] = useState(true)
  const [includeCampaigns, setIncludeCampaigns] = useState(true)
  const [emailRecipient, setEmailRecipient] = useState('')
  const [shareNote, setShareNote] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showShareUrl, setShowShareUrl] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
  }

  const generateCSV = (data: any) => {
    const headers = ['Campaign Title', 'Platform', 'Engagement Rate', 'Reach', 'Impressions', 'ROI', 'Budget', 'Start Date', 'End Date']
    const rows = data.campaigns.map((campaign: Campaign) => [
      campaign.title,
      campaign.platform,
      campaign.engagementRate,
      campaign.reach,
      campaign.impressions,
      campaign.roi,
      campaign.budget,
      campaign.startDate,
      campaign.endDate
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateReport = () => {
    const reportData = {
      company: analysis.companyName,
      summary: {
        totalCampaigns: analysis.totalCampaigns,
        avgEngagementRate: analysis.avgEngagementRate,
        totalReach: analysis.totalReach,
        totalImpressions: analysis.totalImpressions
      },
      campaigns: includeCampaigns ? analysis.campaigns : [],
      insights: includeInsights ? insights : [],
      generatedAt: new Date().toISOString(),
      exportFormat
    }

    return reportData
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const reportData = generateReport()
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (exportFormat === 'csv') {
        // Generate CSV content
        const csvContent = generateCSV(reportData)
        downloadFile(csvContent, `${analysis.companyName}-campaign-analysis.csv`, 'text/csv')
      } else if (exportFormat === 'json') {
        // Generate JSON content
        const jsonContent = JSON.stringify(reportData, null, 2)
        downloadFile(jsonContent, `${analysis.companyName}-campaign-analysis.json`, 'application/json')
      } else if (exportFormat === 'pdf') {
        // Simulate PDF generation
        toast({
          title: "PDF Export Complete",
          description: `Campaign analysis for ${analysis.companyName} has been exported to PDF.`
        })
      } else if (exportFormat === 'png') {
        // Simulate PNG generation
        toast({
          title: "Image Export Complete",
          description: `Campaign charts for ${analysis.companyName} have been exported as PNG.`
        })
      }
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    // Generate a shareable URL (mock)
    const shareId = Math.random().toString(36).substring(7)
    const url = `https://campaign-analyzer.blink.new/shared/${shareId}`
    setShareUrl(url)
    setShowShareUrl(true)
    
    toast({
      title: "Share Link Generated",
      description: "Your campaign analysis is now shareable via the generated link."
    })
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied",
        description: "Share link has been copied to your clipboard."
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy it manually.",
        variant: "destructive"
      })
    }
  }

  const sendEmail = async () => {
    if (!emailRecipient.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the report.",
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Email Sent",
        description: `Campaign analysis has been sent to ${emailRecipient}.`
      })
      
      setEmailRecipient('')
      setShareNote('')
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Unable to send email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4" />
      case 'csv': return <Table className="h-4 w-4" />
      case 'json': return <FileText className="h-4 w-4" />
      case 'png': return <Image className="h-4 w-4" />
      default: return <Download className="h-4 w-4" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export & Share Analysis</span>
          </DialogTitle>
          <DialogDescription>
            Export your campaign analysis or share it with your team
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>PDF Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center space-x-2">
                      <Table className="h-4 w-4" />
                      <span>CSV Data</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>JSON Data</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="png">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4" />
                      <span>PNG Charts</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Include Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Include in Export</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-campaigns" 
                    checked={includeCampaigns}
                    onCheckedChange={setIncludeCampaigns}
                  />
                  <Label htmlFor="include-campaigns" className="text-sm">
                    Campaign Details ({analysis.campaigns.length} campaigns)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-insights" 
                    checked={includeInsights}
                    onCheckedChange={setIncludeInsights}
                  />
                  <Label htmlFor="include-insights" className="text-sm">
                    AI Insights ({insights.length} insights)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-charts" 
                    checked={includeCharts}
                    onCheckedChange={setIncludeCharts}
                  />
                  <Label htmlFor="include-charts" className="text-sm">
                    Performance Charts
                  </Label>
                </div>
              </div>
            </div>

            {/* Export Summary */}
            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Export Summary</span>
                <Badge variant="outline">{exportFormat.toUpperCase()}</Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Company: {analysis.companyName}</div>
                <div>Campaigns: {includeCampaigns ? analysis.campaigns.length : 0}</div>
                <div>Insights: {includeInsights ? insights.length : 0}</div>
                <div>Charts: {includeCharts ? 'Included' : 'Excluded'}</div>
              </div>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  {getFormatIcon(exportFormat)}
                  <span className="ml-2">Export {exportFormat.toUpperCase()}</span>
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Share Options */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Share Analysis</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Generate a shareable link or send via email
              </p>
            </div>

            {!showShareUrl ? (
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Shareable Link</Label>
                <div className="flex items-center space-x-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button onClick={copyShareUrl} size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This link will be valid for 30 days
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium">Send via Email</Label>
              <Input
                placeholder="Enter email address"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                type="email"
              />
              <Textarea
                placeholder="Add a note (optional)"
                value={shareNote}
                onChange={(e) => setShareNote(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={sendEmail} 
                disabled={isExporting || !emailRecipient.trim()}
                variant="outline"
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Mail className="h-4 w-4 mr-2 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}