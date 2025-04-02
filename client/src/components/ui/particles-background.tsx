import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

interface ParticlesBackgroundProps {
  id?: string;
}

const ParticlesBackground = ({ id = 'tsparticles' }: ParticlesBackgroundProps) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {typeof window !== 'undefined' && (
        <Particles
          id={id}
          init={particlesInit}
          options={{
            fpsLimit: 60,
            particles: {
              color: {
                value: ['#f5f5e6', '#8bbc81', '#2E7D32', '#e67e22'],
              },
              links: {
                color: '#2E7D32',
                distance: 150,
                enable: true,
                opacity: 0.15,
                width: 1,
              },
              move: {
                direction: 'none',
                enable: true,
                outModes: {
                  default: 'out',
                },
                random: true,
                speed: 0.6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 40,
              },
              opacity: {
                value: 0.4,
                animation: {
                  enable: true,
                  speed: 0.2,
                  minimumValue: 0.1,
                },
              },
              shape: {
                type: ['circle', 'triangle'],
              },
              size: {
                value: { min: 1, max: 4 },
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0.5,
                },
              },
            },
            detectRetina: true,
            background: {
              color: {
                value: 'transparent',
              },
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: 'grab',
                },
                onClick: {
                  enable: true,
                  mode: 'push',
                },
              },
              modes: {
                grab: {
                  distance: 140,
                  links: {
                    opacity: 0.8,
                    color: '#e67e22',
                  },
                },
                push: {
                  quantity: 4,
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ParticlesBackground;