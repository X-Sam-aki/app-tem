import { useQuery } from '@tanstack/react-query';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useLocation } from 'wouter';

const RecentVideos = () => {
  const [, navigate] = useLocation();
  
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Videos</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-16 rounded" />
                        <div className="ml-4">
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // If there are no videos, display a message
  if (!videos || videos.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Videos</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-slate-600 mb-4">You haven't created any videos yet.</p>
            <button 
              onClick={() => navigate('/create-video')}
              className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90"
            >
              Create Your First Video
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to determine engagement icon and color
  const getEngagementInfo = (engagement: number) => {
    if (engagement > 7) {
      return { 
        icon: <ArrowUp className="h-4 w-4 text-green-500 mr-1" />, 
        color: 'text-green-500' 
      };
    } else if (engagement > 4) {
      return { 
        icon: <ArrowRight className="h-4 w-4 text-yellow-500 mr-1" />, 
        color: 'text-yellow-500' 
      };
    } else {
      return { 
        icon: <ArrowDown className="h-4 w-4 text-red-500 mr-1" />, 
        color: 'text-red-500' 
      };
    }
  };

  // Helper function to determine status badge color
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

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Videos</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Video
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {videos.slice(0, 5).map((video) => {
                // Get video analytics or use defaults
                const analytics = { views: 0, engagement: 5 };
                const engagementInfo = getEngagementInfo(analytics.engagement);
                
                return (
                  <tr key={video.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16 bg-slate-200 rounded overflow-hidden">
                          {video.thumbnailUrl ? (
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title}
                              className="h-10 w-16 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-16 flex items-center justify-center text-slate-400">
                              No thumbnail
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{video.title}</div>
                          <div className="text-sm text-slate-500">YouTube</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{analytics.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {engagementInfo.icon}
                        <span className={`text-sm ${engagementInfo.color}`}>{analytics.engagement.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(video.status)}`}>
                        {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/videos/${video.id}`)}
                        className="text-primary hover:text-primary/80"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RecentVideos;
