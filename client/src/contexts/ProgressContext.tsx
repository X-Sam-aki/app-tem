import { createContext, useState, ReactNode } from 'react';

type Step = {
  id: string;
  label: string;
  description?: string;
};

type ProgressContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  progress: number;
  setProgress: (progress: number) => void;
  steps: Step[];
};

// Define default steps for video creation workflow
const defaultSteps: Step[] = [
  { id: 'product', label: 'Product', description: 'Enter product URL' },
  { id: 'customize', label: 'Customize', description: 'Customize your video' },
  { id: 'publish', label: 'Publish', description: 'Publish to YouTube' }
];

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps] = useState<Step[]>(defaultSteps);

  return (
    <ProgressContext.Provider value={{ currentStep, setCurrentStep, progress, setProgress, steps }}>
      {children}
    </ProgressContext.Provider>
  );
};
