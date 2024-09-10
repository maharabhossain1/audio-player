'use client';

import { CrossIcon } from '@/icons';
import { Button } from './ui/button';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import AudioProgress from './audio-progress';
import AudioControls from './audio-controls';
import VolumeControl from './volume-control';
import PlaybackSpeedControl from './playback-speed-control';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    buffered,
    isLoading,
    audioRef,
    togglePlayPause,
    handleSeek,
    handleVolumeChange,
    handlePlaybackRateChange,
    skipTime,
  } = useAudioPlayer(audioUrl);

  return (
    <div className="min-w-96 space-y-6 rounded-xl border border-neutral-300 p-4 shadow">
      <div className="flex justify-between">
        <div>
          <h1 id="audio-title" className="font-semibold">
            Audio Player
          </h1>
          <p className="text-xs text-neutral-600">Now Playing: {audioUrl}</p>
        </div>
        <Button variant="ghost" className="h-max w-max p-0">
          <CrossIcon className="text-2xl" />
        </Button>
      </div>

      <AudioProgress
        currentTime={currentTime}
        duration={duration}
        buffered={buffered}
        onSeek={handleSeek}
      />

      <AudioControls
        isPlaying={isPlaying}
        isLoading={isLoading}
        onTogglePlayPause={togglePlayPause}
        onSkipBackward={() => skipTime(-10)}
        onSkipForward={() => skipTime(10)}
        currentTime={currentTime}
        duration={duration}
      />

      <div className="flex items-center justify-between">
        <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        <PlaybackSpeedControl
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
