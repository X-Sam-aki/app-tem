import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Eye, ThumbsUp, Share2, MessageSquare, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

type CreatorDashboardProps = {
  isPremium: boolean;
};

const demoEngagementData = [
  { name: "Jan", views: 1200, likes: 450, comments: 120, shares: 80 },
  { name: "Feb", views: 1800, likes: 520, comments: 140, shares: 95 },
  { name: "Mar", views: 2400, likes: 780, comments: 210, shares: 130 },
  { name: "Apr", views: 2000, likes: 600, comments: 180, shares: 110 },
  { name: "May", views: 2800, likes: 910, comments: 245, shares: 160 },
  { name: "Jun", views: 3200, likes: 1050, comments: 290, shares: 190 },
];

const demoRetentionData = [
  { name: "0%", retention: 100 },
  { name: "25%", retention: 82 },
  { name: "50%", retention: 65 },
  { name: "75%", retention: 48 },
  { name: "100%", retention: 35 },
];

const demoTrafficData = [
  { name: "Direct", value: 45 },
  { name: "Search", value: 25 },
  { name: "Referral", value: 15 },
  { name: "Social", value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function CreatorDashboard({ isPremium = false }: CreatorDashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <Card className="w-full mb-6 border-muted-foreground/20">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">📊</span> Personalized Creator Dashboard
            {!isPremium && <span className="ml-2 text-xs bg-amber-600/20 text-amber-500 px-2 py-0.5 rounded-full">Premium</span>}
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        <CardDescription>
          Track and analyze your content performance and audience engagement
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent className={`${!isPremium ? 'opacity-70 pointer-events-none' : ''}`}>
          {!isPremium && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-b-lg">
              <Button variant="premium" onClick={() => window.location.href = '/premium-features'}>
                Upgrade to Premium
              </Button>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Performance Overview</h3>
                <p className="text-sm text-muted-foreground">Track how your videos are performing</p>
              </div>
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="1m">Last month</SelectItem>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">13.4K</p>
                    </div>
                    <Eye className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-green-500 mt-2">↑ 12% from previous period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">32%</p>
                    </div>
                    <ThumbsUp className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-red-500 mt-2">↓ 3% from previous period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold">1,185</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-green-500 mt-2">↑ 18% from previous period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shares</p>
                      <p className="text-2xl font-bold">765</p>
                    </div>
                    <Share2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-green-500 mt-2">↑ 24% from previous period</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="engagement">
              <TabsList className="mb-4">
                <TabsTrigger value="engagement" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Engagement</span>
                </TabsTrigger>
                <TabsTrigger value="retention" className="flex items-center gap-1">
                  <LineChartIcon className="h-4 w-4" />
                  <span>Retention</span>
                </TabsTrigger>
                <TabsTrigger value="traffic" className="flex items-center gap-1">
                  <PieChartIcon className="h-4 w-4" />
                  <span>Traffic Sources</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="engagement" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoEngagementData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                    <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
                    <Bar dataKey="comments" fill="#ffc658" name="Comments" />
                    <Bar dataKey="shares" fill="#ff8042" name="Shares" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="retention" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoRetentionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Audience Retention %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="traffic" className="h-64">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demoTrafficData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {demoTrafficData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="flex flex-col justify-center">
                    <h4 className="font-medium mb-3">Traffic Breakdown</h4>
                    <div className="space-y-2">
                      {demoTrafficData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Creator dashboard statistics help you understand your audience and optimize your content strategy for better engagement and conversion rates.</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}