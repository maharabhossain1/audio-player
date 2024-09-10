'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = (audioUrl: string) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [buffered, setBuffered] = useState<Array<{ start: number; end: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    const stopAudio = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
    }, []);

    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch((error) => {
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

        const volumeValue = newVolume[0] ?? 1;
        if (typeof volumeValue === 'number' && isFinite(volumeValue)) {
            audio.volume = Math.max(0, Math.min(1, volumeValue));
            setVolume(volumeValue);
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

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;
        audio.playbackRate = playbackRate;
    }, [volume, playbackRate]);

    return {
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
        stopAudio,
    };
};