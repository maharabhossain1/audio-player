import { memo } from 'react';
import { Slider } from './ui/slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="volume" className="mr-2">
        Volume:
      </label>
      <Slider
        id="volume"
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={onVolumeChange}
        className="w-24"
        aria-label="Audio volume"
      />
    </div>
  );
};

export default memo(VolumeControl);
