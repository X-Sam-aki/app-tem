import AppLayout from '@/components/layout/AppLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentVideos from '@/components/dashboard/RecentVideos';
import VideoCreationWorkflow from '@/components/video-creation/VideoCreationWorkflow';
import FeatureTooltip from '@/components/ui/feature-tooltip';
import AnimatedSkeleton from '@/components/ui/animated-skeleton';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout title="Dashboard">
      {isLoading ? (
        <div className="space-y-6">
          {/* Skeleton Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <AnimatedSkeleton key={i} variant="card" className="h-24" />
            ))}
          </div>
          
          {/* Skeleton Recent Videos */}
          <div className="mt-8">
            <AnimatedSkeleton variant="line" className="w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedSkeleton variant="video" />
              <AnimatedSkeleton variant="video" />
            </div>
          </div>
          
          {/* Skeleton Create Video */}
          <div className="mt-8">
            <AnimatedSkeleton variant="line" className="w-1/3 mb-4" />
            <AnimatedSkeleton variant="rectangle" className="h-52" />
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-medium text-white">Performance Overview</h2>
            <FeatureTooltip 
              title="Performance Metrics" 
              description="Track your content's performance with key metrics like views, engagement rate, and conversion data."
            />
          </div>
          <StatsOverview />
          
          {/* Recent Videos */}
          <div className="mt-8 flex items-center mb-2">
            <h2 className="text-lg font-medium text-white">Recent Videos</h2>
            <FeatureTooltip 
              title="Video Library" 
              description="Access all your created videos, check their stats, and manage their distribution."
            />
          </div>
          <RecentVideos />
          
          {/* Create New Video Section */}
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-medium text-white">Create a New Video</h2>
              <FeatureTooltip 
                title="Video Creation" 
                description="Transform product URLs into engaging YouTube Shorts with just a few clicks."
              />
            </div>
            <div className="card-gradient rounded-xl p-6 btn-hover-effect">
              <VideoCreationWorkflow />
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;
