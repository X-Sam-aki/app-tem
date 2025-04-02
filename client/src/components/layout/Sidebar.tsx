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
      <div className="flex flex-col w-64 border-r border-white/20 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="flex items-center h-16 px-4 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-amber-500 flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Shortify</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-6 space-y-1 overflow-y-auto">
          <button
            onClick={() => handleNavigation('/')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/') 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <Home className={`w-5 h-5 mr-3 transition-transform ${isActive('/') ? 'text-white' : 'text-white/70'}`} />
            Dashboard
          </button>
          
          <button
            onClick={() => handleNavigation('/create-video')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/create-video') 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <PlusSquare className={`w-5 h-5 mr-3 transition-transform ${isActive('/create-video') ? 'text-white' : 'text-white/70'}`} />
            Create Video
          </button>
          
          <button
            onClick={() => handleNavigation('/my-videos')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/my-videos') 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <Film className={`w-5 h-5 mr-3 transition-transform ${isActive('/my-videos') ? 'text-white' : 'text-white/70'}`} />
            My Videos
          </button>
          
          <button
            onClick={() => handleNavigation('/analytics')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/analytics') 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <BarChart3 className={`w-5 h-5 mr-3 transition-transform ${isActive('/analytics') ? 'text-white' : 'text-white/70'}`} />
            Analytics
          </button>
          
          <button
            onClick={() => handleNavigation('/settings')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive('/settings') 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <Settings className={`w-5 h-5 mr-3 transition-transform ${isActive('/settings') ? 'text-white' : 'text-white/70'}`} />
            Settings
          </button>
          
          <div className="pt-6 mt-6 border-t border-white/20">
            <button
              onClick={() => handleNavigation('/premium-features')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/premium-features') 
                  ? 'bg-amber-500/30 text-amber-300 shadow-lg shadow-amber-500/20' 
                  : 'text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 hover:translate-x-1 pulse-on-hover'
              }`}
            >
              <Crown className={`w-5 h-5 mr-3 transition-transform ${isActive('/premium-features') ? 'text-amber-300' : 'text-amber-400'}`} />
              Premium Features
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || user.username} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || user?.username}</p>
              <p className="text-xs text-white/70">{user?.email}</p>
            </div>
            <button 
              onClick={() => logout()}
              className="ml-auto text-white/70 hover:text-white transition-all duration-200 hover:rotate-6"
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
