import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cream">
      <Card className="w-full max-w-md mx-4 border-light-green shadow-lg">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-accent-orange" />
            <h1 className="text-2xl font-bold text-dark-green">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-dark-green">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-6 flex justify-end">
            <a 
              href="/" 
              className="px-4 py-2 rounded-md bg-gradient-to-r from-dark-green to-accent-orange text-white font-medium"
            >
              Return Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
