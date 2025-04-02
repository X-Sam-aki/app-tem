import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, 
  Maximize, SkipForward, SkipBack, 
  Loader, Download, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  onEnded?: () => void;
  showControls?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  showPip?: boolean;
  loop?: boolean;
}

const AnimatedVideoPlayer: React.FC<AnimatedVideoPlayerProps> = ({
  src,
  poster,
  title,
  autoPlay = false,
  className,
  onEnded,
  showControls = true,
  allowDownload = false,
  allowShare = false,
  showPip = false,
  loop = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onLoadedData = () => setIsLoading(false);
    const onEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => setVolume(video.volume);
    
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('volumechange', onVolumeChange);
    
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('volumechange', onVolumeChange);
    };
  }, [onEnded]);
  
  // Handle auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    
    const showControlsTemporarily = () => {
      setIsControlsVisible(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (isPlaying && !isHovering) {
        controlsTimeoutRef.current = setTimeout(() => {
          setIsControlsVisible(false);
        }, 3000);
      }
    };
    
    const video = videoRef.current;
    if (!video) return;
    
    video.addEventListener('mousemove', showControlsTemporarily);
    
    return () => {
      video.removeEventListener('mousemove', showControlsTemporarily);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isHovering, showControls]);
  
  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };
  
  // Seek to position
  const handleSeek = (values: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = values[0];
    setCurrentTime(values[0]);
  };
  
  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  
  // Change volume
  const handleVolumeChange = (values: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = values[0];
    setVolume(values[0]);
    
    if (values[0] === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (!document.fullscreenElement) {
      video.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };
  
  // Skip forward/backward
  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime += seconds;
    setCurrentTime(video.currentTime);
  };
  
  // Format time (seconds -> MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Download video
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = title || 'video';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Share video
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Shared Video',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg group shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <Loader className="w-12 h-12 text-accent-orange animate-spin" />
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        className="w-full h-full object-contain bg-black"
        onClick={togglePlay}
      />
      
      {/* Play/pause overlay */}
      {!isLoading && !isControlsVisible && (
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={togglePlay}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-16 h-16 rounded-full bg-black/40 text-white hover:bg-black/60 hover:scale-110 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>
      )}
      
      {/* Controls */}
      {showControls && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3",
            "transition-all duration-300 transform",
            isControlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          {/* Video title */}
          {title && (
            <div className="text-white font-medium text-sm mb-2 line-clamp-1">{title}</div>
          )}
          
          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          
          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                onClick={() => skipTime(-10)}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                onClick={() => skipTime(10)}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-1 group/volume">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                
                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer w-16 ml-2"
                  />
                </div>
              </div>
              
              <span className="text-white/80 text-xs ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            {/* Right controls */}
            <div className="flex items-center space-x-2">
              {allowDownload && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              
              {allowShare && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-white hover:bg-white/10 rounded-full"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedVideoPlayer;