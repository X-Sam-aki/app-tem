import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Home, 
  PlusSquare, 
  Film, 
  BarChart3, 
  Settings, 
  LogOut,
  Video
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
      <div className="flex flex-col w-64 border-r border-slate-200 bg-white">
        <div className="flex items-center h-16 px-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Shortify</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-6 space-y-1 overflow-y-auto">
          <button
            onClick={() => handleNavigation('/')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/') 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5 mr-3 text-slate-500" />
            Dashboard
          </button>
          
          <button
            onClick={() => handleNavigation('/create-video')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/create-video') 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PlusSquare className="w-5 h-5 mr-3 text-slate-500" />
            Create Video
          </button>
          
          <button
            onClick={() => handleNavigation('/my-videos')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/my-videos') 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Film className="w-5 h-5 mr-3 text-slate-500" />
            My Videos
          </button>
          
          <button
            onClick={() => handleNavigation('/analytics')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/analytics') 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3 text-slate-500" />
            Analytics
          </button>
          
          <button
            onClick={() => handleNavigation('/settings')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/settings') 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5 mr-3 text-slate-500" />
            Settings
          </button>
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || user.username} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-slate-600">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900">{user?.name || user?.username}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button 
              onClick={() => logout()}
              className="ml-auto text-slate-500 hover:text-slate-700"
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
