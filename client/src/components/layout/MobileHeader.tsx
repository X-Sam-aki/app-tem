import { useLocation } from 'wouter';
import { Menu, Video, Plus } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileHeader = ({ title, isMenuOpen, toggleMenu }: MobileHeaderProps) => {
  const [, navigate] = useLocation();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">Shortify</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/create-video')}
            className="p-2 rounded-md text-white bg-primary hover:bg-primary/90"
            aria-label="Create new video"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="px-4 py-2 border-t border-slate-100">
        <h1 className="text-lg font-medium text-slate-900">{title}</h1>
      </div>
    </div>
  );
};

export default MobileHeader;
