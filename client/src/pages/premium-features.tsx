import { AdvancedFeatures } from "@/components/video-creation/AdvancedFeatures";
import AppLayout from "@/components/layout/AppLayout";

export default function PremiumFeatures() {
  return (
    <AppLayout title="Premium Features">
      <div className="flex flex-col gap-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Premium Features
          </h2>
          <p className="text-muted-foreground">
            Upgrade to access advanced features and take your affiliate marketing to the next level
          </p>
        </div>
        
        <div className="grid gap-6">
          <AdvancedFeatures />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about premium features? <a href="#" className="text-primary hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}