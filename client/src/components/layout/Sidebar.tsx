import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Home, 
  PlusSquare, 
  Film, 
  BarChart3, 
  Settings, 
  LogOut,
  Video,
  Sparkles,
  Crown
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const Sidebar = ({ isMobile = false, closeMobileMenu }: SidebarProps) => {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <div className={`${isMobile ? '' : 'hidden md:flex md:flex-shrink-0'}`}>
      <div className="flex flex-col w-64 border-r border-light-green bg-gradient-to-b from-light-green to-dark-green">
        <div className="flex items-center h-16 px-4 border-b border-light-green">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-accent-orange flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-cream">Shortify</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-6 space-y-1 overflow-y-auto">
          <button
            onClick={() => handleNavigation('/')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/') 
                ? 'bg-cream text-dark-green shadow-md' 
                : 'text-cream hover:bg-cream/20 hover:text-cream hover:translate-x-1'
            }`}
          >
            <Home className={`w-5 h-5 mr-3 transition-transform ${isActive('/') ? 'text-dark-green' : 'text-cream/70'}`} />
            Dashboard
          </button>
          
          <button
            onClick={() => handleNavigation('/create-video')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/create-video') 
                ? 'bg-cream text-dark-green shadow-md' 
                : 'text-cream hover:bg-cream/20 hover:text-cream hover:translate-x-1'
            }`}
          >
            <PlusSquare className={`w-5 h-5 mr-3 transition-transform ${isActive('/create-video') ? 'text-dark-green' : 'text-cream/70'}`} />
            Create Video
          </button>
          
          <button
            onClick={() => handleNavigation('/my-videos')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/my-videos') 
                ? 'bg-cream text-dark-green shadow-md' 
                : 'text-cream hover:bg-cream/20 hover:text-cream hover:translate-x-1'
            }`}
          >
            <Film className={`w-5 h-5 mr-3 transition-transform ${isActive('/my-videos') ? 'text-dark-green' : 'text-cream/70'}`} />
            My Videos
          </button>
          
          <button
            onClick={() => handleNavigation('/analytics')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/analytics') 
                ? 'bg-cream text-dark-green shadow-md' 
                : 'text-cream hover:bg-cream/20 hover:text-cream hover:translate-x-1'
            }`}
          >
            <BarChart3 className={`w-5 h-5 mr-3 transition-transform ${isActive('/analytics') ? 'text-dark-green' : 'text-cream/70'}`} />
            Analytics
          </button>
          
          <button
            onClick={() => handleNavigation('/settings')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/settings') 
                ? 'bg-cream text-dark-green shadow-md' 
                : 'text-cream hover:bg-cream/20 hover:text-cream hover:translate-x-1'
            }`}
          >
            <Settings className={`w-5 h-5 mr-3 transition-transform ${isActive('/settings') ? 'text-dark-green' : 'text-cream/70'}`} />
            Settings
          </button>
          
          <div className="pt-6 mt-6 border-t border-light-green/70">
            <button
              onClick={() => handleNavigation('/premium-features')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/premium-features') 
                  ? 'bg-accent-orange/80 text-cream shadow-lg shadow-accent-orange/20' 
                  : 'text-accent-orange hover:bg-accent-orange/20 hover:text-cream hover:translate-x-1 pulse-on-hover'
              }`}
            >
              <Crown className={`w-5 h-5 mr-3 transition-transform ${isActive('/premium-features') ? 'text-cream' : 'text-accent-orange'}`} />
              Premium Features
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-light-green/70">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-accent-orange/20 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || user.username} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-cream">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-cream">{user?.name || user?.username}</p>
              <p className="text-xs text-cream/70">{user?.email}</p>
            </div>
            <button 
              onClick={() => logout()}
              className="ml-auto text-cream/70 hover:text-accent-orange transition-all duration-200 hover:rotate-6"
              title="Log out"
            >
              <LogOut className="h-5 w-5 hover:scale-110" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
