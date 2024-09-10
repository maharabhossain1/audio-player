import { PauseIcon, PlayCircleIcon, SkipNextIcon, SkipPreviousIcon, StopIcon } from '@/icons';
import { Button } from './ui/button';
import { memo } from 'react';

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlayPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onStop: () => void;
  currentTime: number;
  duration: number;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isLoading,
  onTogglePlayPause,
  onSkipBackward,
  onSkipForward,
  onStop,
  currentTime,
  duration,
}) => {
  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="min-w-12 text-xs text-neutral-500">{formatTime(currentTime)}</div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="h-max w-max rounded-full p-1"
          onClick={onSkipBackward}
          aria-label="Skip 10 seconds backward"
        >
          <SkipPreviousIcon className="text-2xl" />
        </Button>
        <Button
          onClick={onTogglePlayPause}
          className="h-max w-max rounded-full bg-neutral-600 p-1"
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon className="text-2xl" /> : <PlayCircleIcon className="text-2xl" />}
        </Button>
        <Button
          variant="ghost"
          className="h-max w-max rounded-full p-1"
          onClick={onSkipForward}
          aria-label="Skip 10 seconds forward"
        >
          <SkipNextIcon className="text-2xl" />
        </Button>
        <Button
          variant="ghost"
          className="h-max w-max rounded-full p-1"
          onClick={onStop}
          aria-label="Stop audio"
        >
          <StopIcon className="text-2xl" />
        </Button>
      </div>
      <div className="min-w-12 text-end text-xs text-neutral-500">{formatTime(duration)}</div>
    </div>
  );
};

export default memo(AudioControls);
