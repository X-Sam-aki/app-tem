import { useContext } from 'react';
import { ProgressContext } from '@/contexts/ProgressContext';

export const useProgress = () => {
  const progressContext = useContext(ProgressContext);

  if (!progressContext) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }

  const { currentStep, setCurrentStep, progress, setProgress, steps } = progressContext;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setProgress(Math.round((nextStepIndex / (steps.length - 1)) * 100));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      setProgress(Math.round((prevStepIndex / (steps.length - 1)) * 100));
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      setProgress(Math.round((step / (steps.length - 1)) * 100));
    }
  };

  return {
    currentStep,
    progress,
    steps,
    nextStep,
    prevStep,
    goToStep,
  };
};
