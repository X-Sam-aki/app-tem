import AppLayout from '@/components/layout/AppLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentVideos from '@/components/dashboard/RecentVideos';
import VideoCreationWorkflow from '@/components/video-creation/VideoCreationWorkflow';

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      {/* Stats Overview */}
      <StatsOverview />
      
      {/* Recent Videos */}
      <RecentVideos />
      
      {/* Create New Video Section */}
      <div>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Create a New Video</h2>
        <VideoCreationWorkflow />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
