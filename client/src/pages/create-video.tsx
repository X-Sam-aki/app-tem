import AppLayout from '@/components/layout/AppLayout';
import VideoCreationWorkflow from '@/components/video-creation/VideoCreationWorkflow';

const CreateVideo = () => {
  return (
    <AppLayout title="Create Video" showCreateButton={false}>
      <div className="max-w-4xl mx-auto">
        <p className="text-slate-600 mb-6">
          Create a new YouTube Short from a Temu product. Follow the steps below to extract product data, 
          customize your video, and publish it to YouTube.
        </p>
        
        <VideoCreationWorkflow />
      </div>
    </AppLayout>
  );
};

export default CreateVideo;
