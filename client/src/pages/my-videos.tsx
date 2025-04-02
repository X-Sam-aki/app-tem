import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Film, Search, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyVideos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos'],
    retry: false,
  });
  
  // Filter videos based on search term and status
  const filteredVideos = videos?.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Group videos by status for tabs
  const draftVideos = filteredVideos.filter(video => video.status === 'draft');
  const publishedVideos = filteredVideos.filter(video => video.status === 'published');
  const processingVideos = filteredVideos.filter(video => video.status === 'processing');
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-slate-100 text-slate-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  const renderVideoList = (videoList: any[]) => {
    if (videoList.length === 0) {
      return (
        <div className="text-center py-12">
          <Film className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No videos found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm ? 'Try a different search term' : 'Create your first video to get started'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={() => window.location.href = '/create-video'}>
                Create New Video
              </Button>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {videoList.map(video => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video bg-slate-200 relative">
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Film className="h-12 w-12" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge 
                  className={getStatusBadgeColor(video.status)}
                  variant="outline"
                >
                  {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                </Badge>
              </div>
              {video.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity">
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full"
                  >
                    <Film className="h-6 w-6 text-primary" />
                  </a>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-slate-900 truncate">{video.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-500">
                  {video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy') : 'N/A'}
                </span>
                {video.status === 'published' && video.youtubeVideoId && (
                  <a 
                    href={`https://www.youtube.com/shorts/${video.youtubeVideoId}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    YouTube <ArrowUpRight className="ml-1 h-3 w-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <AppLayout title="My Videos">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Videos</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                All ({filteredVideos.length})
              </TabsTrigger>
              <TabsTrigger value="published">
                Published ({publishedVideos.length})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Drafts ({draftVideos.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({processingVideos.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {renderVideoList(filteredVideos)}
            </TabsContent>
            <TabsContent value="published" className="mt-4">
              {renderVideoList(publishedVideos)}
            </TabsContent>
            <TabsContent value="drafts" className="mt-4">
              {renderVideoList(draftVideos)}
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              {renderVideoList(processingVideos)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default MyVideos;
