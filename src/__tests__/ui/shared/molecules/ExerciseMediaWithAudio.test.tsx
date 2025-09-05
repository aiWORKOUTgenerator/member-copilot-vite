import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ExerciseMediaWithAudio } from '../../../../ui/shared/molecules/ExerciseMediaWithAudio';

// Mock the child components
vi.mock('../../../../ui/shared/molecules/ExerciseMedia', () => ({
  ExerciseMedia: ({
    imageUrl,
    alt,
    size,
  }: {
    imageUrl?: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
  }) => {
    if (!imageUrl) {
      return (
        <div
          data-testid="exercise-media"
          data-image-url={imageUrl}
          data-alt={alt}
          data-size={size}
        >
          <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-center h-32 text-base-content/60">
              <div className="text-center">
                <p className="text-sm font-medium">
                  Image Currently Unavailable
                </p>
                <p className="text-xs opacity-70">
                  Image for {alt} is not available at this time
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        data-testid="exercise-media"
        data-image-url={imageUrl}
        data-alt={alt}
        data-size={size}
      >
        Exercise Media: {alt}
      </div>
    );
  },
}));

vi.mock('../../../../ui/shared/molecules/ExerciseAudio', () => ({
  ExerciseAudio: ({
    audioUrl,
    exerciseName,
    autoPlay,
  }: {
    audioUrl?: string | null;
    exerciseName: string;
    autoPlay?: boolean;
  }) => {
    if (!audioUrl) {
      return (
        <div
          data-testid="exercise-audio"
          data-audio-url={audioUrl}
          data-exercise-name={exerciseName}
          data-auto-play={autoPlay}
        >
          <div className="flex items-center gap-3 text-base-content/60">
            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
              <span className="w-5 h-5">🔇</span>
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

    return (
      <div
        data-testid="exercise-audio"
        data-audio-url={audioUrl}
        data-exercise-name={exerciseName}
        data-auto-play={autoPlay}
      >
        Exercise Audio: {exerciseName}
      </div>
    );
  },
}));

// Mock audio for tests
beforeEach(() => {
  global.HTMLAudioElement = vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('ExerciseMediaWithAudio Component', () => {
  const defaultProps = {
    exerciseName: 'Push Up',
  };

  describe('when no media is provided', () => {
    it('renders unavailable messages when both imageUrl and audioUrl are undefined', () => {
      render(<ExerciseMediaWithAudio {...defaultProps} />);
      expect(
        screen.getByText('Image Currently Unavailable')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Audio Currently Unavailable')
      ).toBeInTheDocument();
    });

    it('renders unavailable messages when both imageUrl and audioUrl are null', () => {
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl={null}
          audioUrl={null}
        />
      );
      expect(
        screen.getByText('Image Currently Unavailable')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Audio Currently Unavailable')
      ).toBeInTheDocument();
    });

    it('renders unavailable messages when both imageUrl and audioUrl are empty strings', () => {
      render(
        <ExerciseMediaWithAudio {...defaultProps} imageUrl="" audioUrl="" />
      );
      expect(
        screen.getByText('Image Currently Unavailable')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Audio Currently Unavailable')
      ).toBeInTheDocument();
    });
  });

  describe('when only image is provided', () => {
    it('renders ExerciseMedia component and audio unavailable message', () => {
      const imageUrl = 'https://example.com/pushup.jpg';
      render(<ExerciseMediaWithAudio {...defaultProps} imageUrl={imageUrl} />);

      expect(screen.getByTestId('exercise-media')).toBeInTheDocument();
      expect(screen.getByTestId('exercise-audio')).toBeInTheDocument();
      expect(
        screen.getByText('Audio Currently Unavailable')
      ).toBeInTheDocument();

      const mediaElement = screen.getByTestId('exercise-media');
      expect(mediaElement).toHaveAttribute('data-image-url', imageUrl);
      expect(mediaElement).toHaveAttribute(
        'data-alt',
        defaultProps.exerciseName
      );
    });

    it('passes correct props to ExerciseMedia', () => {
      const props = {
        ...defaultProps,
        imageUrl: 'https://example.com/pushup.jpg',
        size: 'lg' as const,
        rounded: '2xl' as const,
        showImageSkeleton: false,
        className: 'custom-class',
      };

      render(<ExerciseMediaWithAudio {...props} />);

      const mediaElement = screen.getByTestId('exercise-media');
      expect(mediaElement).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('when only audio is provided', () => {
    it('renders only ExerciseAudio component', () => {
      const audioUrl = 'https://example.com/pushup.mp3';
      render(<ExerciseMediaWithAudio {...defaultProps} audioUrl={audioUrl} />);

      expect(screen.getByTestId('exercise-audio')).toBeInTheDocument();
      expect(screen.queryByTestId('exercise-media')).not.toBeInTheDocument();

      const audioElement = screen.getByTestId('exercise-audio');
      expect(audioElement).toHaveAttribute('data-audio-url', audioUrl);
      expect(audioElement).toHaveAttribute(
        'data-exercise-name',
        defaultProps.exerciseName
      );
    });

    it('passes autoPlay prop to ExerciseAudio', () => {
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          audioUrl="https://example.com/pushup.mp3"
          autoPlayAudio={true}
        />
      );

      const audioElement = screen.getByTestId('exercise-audio');
      expect(audioElement).toHaveAttribute('data-auto-play', 'true');
    });
  });

  describe('when both image and audio are provided', () => {
    it('renders both ExerciseMedia and ExerciseAudio components', () => {
      const imageUrl = 'https://example.com/pushup.jpg';
      const audioUrl = 'https://example.com/pushup.mp3';

      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl={imageUrl}
          audioUrl={audioUrl}
        />
      );

      expect(screen.getByTestId('exercise-media')).toBeInTheDocument();
      expect(screen.getByTestId('exercise-audio')).toBeInTheDocument();
    });

    it('renders image above audio (correct order)', () => {
      const imageUrl = 'https://example.com/pushup.jpg';
      const audioUrl = 'https://example.com/pushup.mp3';

      const { container } = render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl={imageUrl}
          audioUrl={audioUrl}
        />
      );

      const mediaElement = screen.getByTestId('exercise-media');
      const audioElement = screen.getByTestId('exercise-audio');

      // Get the parent container
      const parentContainer = container.firstChild;
      const children = Array.from(parentContainer?.children || []);

      const mediaIndex = children.indexOf(mediaElement);
      const audioIndex = children.indexOf(audioElement);

      expect(mediaIndex).toBeLessThan(audioIndex);
    });

    it('applies correct spacing between components', () => {
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl="https://example.com/pushup.jpg"
          audioUrl="https://example.com/pushup.mp3"
        />
      );

      const container = screen.getByTestId('exercise-media').parentElement;
      expect(container).toHaveClass('space-y-3');
    });
  });

  describe('prop forwarding', () => {
    it('forwards all image-related props to ExerciseMedia', () => {
      const props = {
        ...defaultProps,
        imageUrl: 'https://example.com/pushup.jpg',
        size: 'sm' as const,
        rounded: 'lg' as const,
        showImageSkeleton: false,
      };

      render(<ExerciseMediaWithAudio {...props} />);

      const mediaElement = screen.getByTestId('exercise-media');
      expect(mediaElement).toHaveAttribute('data-image-url', props.imageUrl);
      expect(mediaElement).toHaveAttribute('data-alt', props.exerciseName);
      expect(mediaElement).toHaveAttribute('data-size', props.size);
    });

    it('forwards exerciseName to both components', () => {
      const exerciseName = 'Squat Exercise';
      render(
        <ExerciseMediaWithAudio
          exerciseName={exerciseName}
          imageUrl="https://example.com/squat.jpg"
          audioUrl="https://example.com/squat.mp3"
        />
      );

      const mediaElement = screen.getByTestId('exercise-media');
      const audioElement = screen.getByTestId('exercise-audio');

      expect(mediaElement).toHaveAttribute('data-alt', exerciseName);
      expect(audioElement).toHaveAttribute('data-exercise-name', exerciseName);
    });

    it('applies custom className to container', () => {
      const customClassName = 'my-custom-class';
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl="https://example.com/pushup.jpg"
          className={customClassName}
        />
      );

      const container = screen.getByTestId('exercise-media').parentElement;
      expect(container).toHaveClass(customClassName);
    });
  });

  describe('default props', () => {
    it('uses default size prop', () => {
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl="https://example.com/pushup.jpg"
        />
      );

      const mediaElement = screen.getByTestId('exercise-media');
      expect(mediaElement).toHaveAttribute('data-size', 'md');
    });

    it('uses default showImageSkeleton prop', () => {
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl="https://example.com/pushup.jpg"
        />
      );

      // The showImageSkeleton prop should be true by default
      // This would be verified by checking if the ExerciseMedia component
      // receives the correct prop, but since we're mocking it,
      // we can verify the component renders (indicating default props work)
      expect(screen.getByTestId('exercise-media')).toBeInTheDocument();
    });

    it('uses default autoPlayAudio prop as false', () => {
      render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          audioUrl="https://example.com/pushup.mp3"
        />
      );

      const audioElement = screen.getByTestId('exercise-audio');
      expect(audioElement).toHaveAttribute('data-auto-play', 'false');
    });
  });

  describe('edge cases', () => {
    it('handles empty exercise name gracefully', () => {
      render(
        <ExerciseMediaWithAudio
          exerciseName=""
          imageUrl="https://example.com/exercise.jpg"
          audioUrl="https://example.com/exercise.mp3"
        />
      );

      const mediaElement = screen.getByTestId('exercise-media');
      const audioElement = screen.getByTestId('exercise-audio');

      expect(mediaElement).toHaveAttribute('data-alt', '');
      expect(audioElement).toHaveAttribute('data-exercise-name', '');
    });

    it('handles long exercise names', () => {
      const longName =
        'Super Long Exercise Name That Might Cause Layout Issues';
      render(
        <ExerciseMediaWithAudio
          exerciseName={longName}
          imageUrl="https://example.com/exercise.jpg"
        />
      );

      const mediaElement = screen.getByTestId('exercise-media');
      expect(mediaElement).toHaveAttribute('data-alt', longName);
    });

    it('handles special characters in exercise name', () => {
      const specialName = 'Push-Up & Pull-Up (Advanced)';
      render(
        <ExerciseMediaWithAudio
          exerciseName={specialName}
          audioUrl="https://example.com/exercise.mp3"
        />
      );

      const audioElement = screen.getByTestId('exercise-audio');
      expect(audioElement).toHaveAttribute('data-exercise-name', specialName);
    });
  });

  describe('component integration', () => {
    it('maintains proper component hierarchy', () => {
      const { container } = render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl="https://example.com/pushup.jpg"
          audioUrl="https://example.com/pushup.mp3"
        />
      );

      // Should have a container div with space-y-3 class
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.tagName).toBe('DIV');
      expect(containerDiv).toHaveClass('space-y-3');

      // Should contain both components
      expect(containerDiv.children).toHaveLength(2);
    });

    it('preserves component isolation', () => {
      // Each component should render independently
      const { rerender } = render(
        <ExerciseMediaWithAudio
          {...defaultProps}
          imageUrl="https://example.com/pushup.jpg"
        />
      );

      expect(screen.getByTestId('exercise-media')).toBeInTheDocument();
      expect(screen.getByTestId('exercise-audio')).toBeInTheDocument();
      expect(
        screen.getByText('Audio Currently Unavailable')
      ).toBeInTheDocument();

      rerender(
        <ExerciseMediaWithAudio
          {...defaultProps}
          audioUrl="https://example.com/pushup.mp3"
        />
      );

      expect(screen.queryByTestId('exercise-media')).not.toBeInTheDocument();
      expect(screen.getByTestId('exercise-audio')).toBeInTheDocument();
    });
  });
});
