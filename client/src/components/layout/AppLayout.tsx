import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import ParticlesBackground from '@/components/ui/particles-background';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  showCreateButton?: boolean;
}

const AppLayout = ({ children, title, showCreateButton = true }: AppLayoutProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Background particles */}
      <ParticlesBackground id="background-particles" />
      
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile header */}
      <MobileHeader 
        title={title} 
        isMenuOpen={isMobileMenuOpen} 
        toggleMenu={toggleMobileMenu} 
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Page header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-light-green hidden md:block">
          <div className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-dark-green">{title}</h1>
            {showCreateButton && (
              <div>
                <button 
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-dark-green to-accent-orange text-white font-medium btn-hover-effect pulse-on-hover shadow-lg"
                  onClick={() => navigate('/create-video')}
                >
                  Create New Video
                </button>
              </div>
            )}
          </div>
        </header>
        
        {/* Mobile sidebar menu (shows when menu button is clicked) */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
            <div className="h-full w-64 bg-gradient-to-br from-light-green to-dark-green" onClick={e => e.stopPropagation()}>
              <Sidebar isMobile={true} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 pt-16 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
