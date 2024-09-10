import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PlaybackSpeedControlProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

const PlaybackSpeedControl: React.FC<PlaybackSpeedControlProps> = ({
  playbackRate,
  onPlaybackRateChange,
}) => {
  return (
    <div className="flex items-center">
      <label htmlFor="playback-rate" className="mr-2">
        Speed:
      </label>
      <Select
        value={playbackRate.toString()}
        onValueChange={value => onPlaybackRateChange(Number(value))}
        defaultValue="1"
      >
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Select speed" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0.5">0.5x</SelectItem>
          <SelectItem value="1">1x</SelectItem>
          <SelectItem value="1.5">1.5x</SelectItem>
          <SelectItem value="2">2x</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(PlaybackSpeedControl);
