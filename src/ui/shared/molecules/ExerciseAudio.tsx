import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ExerciseAudioProps {
  audioUrl?: string | null;
  exerciseName: string;
  className?: string;
  autoPlay?: boolean;
}

export const ExerciseAudio: React.FC<ExerciseAudioProps> = ({
  audioUrl,
  exerciseName,
  className = '',
  autoPlay = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // No audio URL provided - show unavailable message
  if (!audioUrl) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-3 text-base-content/60">
          <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
            <VolumeX className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Audio Currently Unavailable</p>
            <p className="text-xs opacity-70">
              Audio for {exerciseName} is not available at this time
            </p>
          </div>
        </div>
      </div>
    );
  }

  const containerClasses = `
    bg-base-100 
    border 
    border-base-300 
    rounded-xl 
    p-4 
    shadow-sm
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play().catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeToggle = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Error state
  if (hasError) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-3 text-base-content/60">
          <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
            <VolumeX className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Audio unavailable</p>
            <p className="text-xs opacity-70">
              Could not load audio for {exerciseName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="btn btn-circle btn-sm btn-primary"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        {/* Progress and Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-base-content/70 mb-1">
            <span className="font-medium truncate max-w-[150px]">
              {exerciseName}
            </span>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full bg-base-300 rounded-full h-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="bg-primary h-2 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Volume Control */}
        <button
          onClick={handleVolumeToggle}
          className="btn btn-ghost btn-xs"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
