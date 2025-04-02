import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CreateVideo from "@/pages/create-video";
import MyVideos from "@/pages/my-videos";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import PremiumFeatures from "@/pages/premium-features";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/create-video">
        {() => (
          <ProtectedRoute>
            <CreateVideo />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/my-videos">
        {() => (
          <ProtectedRoute>
            <MyVideos />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/analytics">
        {() => (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/premium-features">
        {() => (
          <ProtectedRoute>
            <PremiumFeatures />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProgressProvider>
          <Router />
          <Toaster />
        </ProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
