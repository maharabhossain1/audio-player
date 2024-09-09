'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CrossIcon, PauseIcon, PlayCircleIcon, SkipNextIcon, SkipPreviousIcon } from '@/icons';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import CustomAudioProgress from './custom-audio-progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type AudioComponentProps = {
  audioUrl: string;
};

const AudioComponent: React.FC<AudioComponentProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [buffered, setBuffered] = useState<Array<{ start: number; end: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Playback failed', error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((newTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const volume = newVolume[0] ?? 1;
    if (typeof volume === 'number' && isFinite(volume)) {
      audio.volume = Math.max(0, Math.min(1, volume));
      setVolume(volume);
    }
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const skipTime = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const newTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
      audio.currentTime = newTime;
    },
    [duration]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateBuffered = () => {
      const bufferedRanges: Array<{ start: number; end: number }> = [];
      for (let i = 0; i < audio.buffered.length; i++) {
        bufferedRanges.push({
          start: audio.buffered.start(i),
          end: audio.buffered.end(i),
        });
      }
      setBuffered(bufferedRanges);
    };

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onProgress = updateBuffered;
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('progress', onProgress);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('progress', onProgress);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [audioUrl]);

  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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

      <CustomAudioProgress
        currentTime={currentTime}
        duration={duration}
        buffered={buffered}
        onSeek={handleSeek}
      />

      <div className="flex items-center justify-between">
        <div className="min-w-12 text-xs text-neutral-500">{formatTime(currentTime)}</div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-max w-max rounded-full p-1"
            onClick={() => skipTime(-10)}
          >
            <SkipPreviousIcon className="text-2xl" />
          </Button>
          <Button
            onClick={togglePlayPause}
            className="h-max w-max rounded-full bg-neutral-600 p-1"
            disabled={isLoading}
          >
            {isPlaying ? (
              <PauseIcon className="text-2xl" />
            ) : (
              <PlayCircleIcon className="text-2xl" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="h-max w-max rounded-full p-1"
            onClick={() => skipTime(10)}
          >
            <SkipNextIcon className="text-2xl" />
          </Button>
        </div>
        <div className="min-w-12 text-end text-xs text-neutral-500">{formatTime(duration)}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label htmlFor="volume" className="mr-2">
            Volume:
          </label>
          <Slider
            id="volume"
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="playback-rate" className="mr-2">
            Speed:
          </label>
          <Select
            value={playbackRate.toString()}
            onValueChange={value => handlePlaybackRateChange(Number(value))}
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
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default AudioComponent;
