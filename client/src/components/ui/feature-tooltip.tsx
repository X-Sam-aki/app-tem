import React, { useState, ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface FeatureTooltipProps {
  title: string;
  description: string;
  children?: ReactNode;
  iconClassName?: string;
}

const FeatureTooltip = ({
  title,
  description,
  children,
  iconClassName = 'text-white/60 hover:text-white transition-colors',
}: FeatureTooltipProps) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen} delayDuration={100}>
        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
          {children || (
            <span className="inline-flex items-center">
              <InfoIcon className={`h-4 w-4 ml-1 ${iconClassName}`} />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          className="bg-black/80 backdrop-blur-sm border-purple-400/20 p-4 rounded-lg shadow-xl max-w-xs"
        >
          <div className="space-y-1">
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-white/80 leading-relaxed">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureTooltip;