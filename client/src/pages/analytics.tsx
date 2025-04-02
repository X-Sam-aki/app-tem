import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, BarChart2, UserCheck, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedVideo, setSelectedVideo] = useState('all');
  
  // Fetch videos for the selector
  const { data: videos, isLoading: isLoadingVideos } = useQuery({
    queryKey: ['/api/videos'],
    retry: false,
  });
  
  // Fetch stats for the dashboard
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/stats'],
    retry: false,
  });
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/videos', selectedVideo, 'analytics'],
    enabled: selectedVideo !== 'all',
    retry: false,
  });
  
  const isLoading = isLoadingVideos || isLoadingStats || isLoadingAnalytics;
  
  // Mock chart data based on time range
  // In a real implementation, this would come from API
  const viewsData = [
    { name: 'Jan 1', views: 400 },
    { name: 'Jan 2', views: 300 },
    { name: 'Jan 3', views: 500 },
    { name: 'Jan 4', views: 280 },
    { name: 'Jan 5', views: 590 },
    { name: 'Jan 6', views: 320 },
    { name: 'Jan 7', views: 600 }
  ];
  
  const engagementData = [
    { name: 'Likes', value: stats?.totalLikes || 0, color: '#3B82F6' },
    { name: 'Comments', value: stats?.totalComments || 0, color: '#10B981' },
    { name: 'Shares', value: stats?.totalShares || 0, color: '#6366F1' }
  ];
  
  const demographicData = [
    { name: '18-24', value: 30, color: '#3B82F6' },
    { name: '25-34', value: 40, color: '#10B981' },
    { name: '35-44', value: 20, color: '#6366F1' },
    { name: '45+', value: 10, color: '#EC4899' }
  ];
  
  const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#EC4899', '#F59E0B'];
  
  const statCards = [
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      change: '+12%',
      positive: true
    },
    {
      title: 'Avg. Watch Time',
      value: '1:24',
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      change: '+8%',
      positive: true
    },
    {
      title: 'Subscribers',
      value: stats?.subscribers || 0,
      icon: <UserCheck className="h-8 w-8 text-indigo-600" />,
      change: '+5%',
      positive: true
    }
  ];
  
  const engagementCards = [
    {
      title: 'Likes',
      value: stats?.totalLikes || 0,
      icon: <ThumbsUp className="h-6 w-6 text-primary" />,
      change: '+15%',
      positive: true
    },
    {
      title: 'Comments',
      value: stats?.totalComments || 0,
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      change: '+7%',
      positive: true
    },
    {
      title: 'Shares',
      value: stats?.totalShares || 0,
      icon: <Share2 className="h-6 w-6 text-indigo-600" />,
      change: '+23%',
      positive: true
    }
  ];
  
  if (isLoading) {
    return (
      <AppLayout title="Analytics">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout title="Analytics">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-auto">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto">
          <Select
            value={selectedVideo}
            onValueChange={setSelectedVideo}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select video" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Videos</SelectItem>
              {videos?.map((video) => (
                <SelectItem key={video.id} value={video.id.toString()}>
                  {video.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-slate-900 mr-2">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</h3>
                    <span className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Views Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={viewsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {engagementCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-slate-100 rounded-full">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <div className="flex items-center">
                        <h3 className="text-xl font-bold text-slate-900 mr-2">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</h3>
                        <span className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Engagement Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Engagement Rate by Video</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={videos?.slice(0, 5).map(v => ({ name: v.title.substring(0, 20) + '...', rate: Math.random() * 10 + 1 })) || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" name="Engagement Rate %" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Audience Demographics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Top Traffic Sources</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'YouTube Search', value: 45 },
                        { name: 'Suggested Videos', value: 30 },
                        { name: 'External', value: 15 },
                        { name: 'Direct', value: 10 }
                      ]}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" name="Percentage" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Revenue Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Jan', revenue: 400 },
                      { name: 'Feb', revenue: 300 },
                      { name: 'Mar', revenue: 550 },
                      { name: 'Apr', revenue: 480 },
                      { name: 'May', revenue: 690 },
                      { name: 'Jun', revenue: 820 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Revenue by Product</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Wireless Earbuds', value: 250 },
                        { name: 'Smart Watch', value: 420 },
                        { name: 'Phone Charger', value: 180 },
                        { name: 'Bluetooth Speaker', value: 340 },
                        { name: 'Power Bank', value: 290 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Conversion Rate</h3>
                <div className="h-80 flex flex-col justify-center items-center">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-4xl font-bold text-primary">5.8%</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Converted', value: 5.8 },
                            { name: 'Not Converted', value: 94.2 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          startAngle={90}
                          endAngle={-270}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#3B82F6" />
                          <Cell fill="#E2E8F0" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-slate-600 mt-4">
                    Avg. conversion rate across all videos
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-2">
                    +1.2% from previous period
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Analytics;
