import { useQuery } from '@tanstack/react-query';
import { Eye, ThumbsUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <Skeleton className="flex-shrink-0 h-12 w-12 rounded-md" />
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsItems = [
    { 
      title: "Total Views", 
      value: stats?.totalViews.toLocaleString() || "0", 
      icon: <Eye className="h-6 w-6 text-primary" />, 
      color: "bg-primary-50" 
    },
    { 
      title: "Total Likes", 
      value: stats?.totalLikes.toLocaleString() || "0", 
      icon: <ThumbsUp className="h-6 w-6 text-green-600" />, 
      color: "bg-green-50" 
    },
    { 
      title: "Subscribers", 
      value: stats?.subscribers.toLocaleString() || "0", 
      icon: <Users className="h-6 w-6 text-yellow-600" />, 
      color: "bg-yellow-50" 
    },
    { 
      title: "Revenue", 
      value: stats?.revenue || "$0", 
      icon: <DollarSign className="h-6 w-6 text-purple-600" />, 
      color: "bg-purple-50" 
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {statsItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`rounded-md ${item.color} p-3`}>
                  {item.icon}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">{item.title}</dt>
                  <dd>
                    <div className="text-lg font-medium text-slate-900">{item.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
