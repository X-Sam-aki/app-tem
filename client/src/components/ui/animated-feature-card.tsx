import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AnimatedFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  animationDelay?: number;
}

const AnimatedFeatureCard: React.FC<AnimatedFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color = 'dark-green',
  action,
  animationDelay = 0,
}) => {
  return (
    <Card 
      className="shadow-hover hover-scale slide-up-on-hover border-light-green overflow-hidden fade-in"
      style={{ 
        animationDelay: `${animationDelay}ms`,
        position: 'relative'
      }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent to-light-green/10 z-0"
      />
      
      <div className="relative z-10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-${color}/10 float-animation`} style={{ animationDelay: `${animationDelay + 200}ms` }}>
              <Icon className={`h-6 w-6 text-${color}`} />
            </div>
            <CardTitle className="text-lg font-semibold text-dark-green">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-dark-green/80">
            {description}
          </CardDescription>
        </CardContent>
        {action && (
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-light-green text-dark-green hover:bg-light-green/20 hover:text-dark-green"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          </CardFooter>
        )}
      </div>
    </Card>
  );
};

export default AnimatedFeatureCard;