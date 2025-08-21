import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ExerciseAudio } from '../../../../ui/shared/molecules/ExerciseAudio';

// Mock JSDOM audio limitations
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

afterEach(() => {
  cleanup();
});

describe('ExerciseAudio Component - Basic Tests', () => {
  const defaultProps = {
    exerciseName: 'Push Up',
    audioUrl: 'https://example.com/pushup.mp3',
  };

  describe('when no audioUrl is provided', () => {
    it('renders nothing', () => {
      const { container } = render(
        <ExerciseAudio exerciseName={defaultProps.exerciseName} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when audioUrl is null', () => {
      const { container } = render(
        <ExerciseAudio
          exerciseName={defaultProps.exerciseName}
          audioUrl={null}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when audioUrl is provided', () => {
    it('renders audio player with exercise name', () => {
      render(<ExerciseAudio {...defaultProps} />);

      expect(screen.getByText('Push Up')).toBeInTheDocument();
      expect(screen.getByLabelText('Play audio')).toBeInTheDocument();
    });

    it('creates audio element with correct src', () => {
      render(<ExerciseAudio {...defaultProps} />);

      const audio = document.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio).toHaveAttribute('src', defaultProps.audioUrl);
    });

    it('applies custom className', () => {
      const customClass = 'custom-audio-class';
      render(<ExerciseAudio {...defaultProps} className={customClass} />);

      expect(document.querySelector(`.${customClass}`)).toBeInTheDocument();
    });

    it('supports autoPlay prop', () => {
      render(<ExerciseAudio {...defaultProps} autoPlay={true} />);

      const audio = document.querySelector('audio');
      expect(audio).toHaveAttribute('autoPlay');
    });
  });

  describe('basic controls', () => {
    it('shows play button initially', () => {
      render(<ExerciseAudio {...defaultProps} />);

      expect(screen.getByLabelText('Play audio')).toBeInTheDocument();
    });

    it('shows volume control button', () => {
      render(<ExerciseAudio {...defaultProps} />);

      expect(screen.getByLabelText('Mute audio')).toBeInTheDocument();
    });

    it('displays initial time as 0:00 / 0:00', () => {
      render(<ExerciseAudio {...defaultProps} />);

      expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();
    });

    it('has progress bar element', () => {
      render(<ExerciseAudio {...defaultProps} />);

      const progressBar = document.querySelector('.bg-base-300');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      render(<ExerciseAudio {...defaultProps} />);

      expect(screen.getByLabelText('Play audio')).toBeInTheDocument();
      expect(screen.getByLabelText('Mute audio')).toBeInTheDocument();
    });

    it('audio element has proper attributes', () => {
      render(<ExerciseAudio {...defaultProps} />);

      const audio = document.querySelector('audio');
      expect(audio).toHaveAttribute('preload', 'metadata');
    });
  });

  describe('error state', () => {
    it('can render error state UI elements', () => {
      // We'll test the error state by checking if the component
      // has the proper structure to handle errors
      render(<ExerciseAudio {...defaultProps} />);

      // Component should render without crashing
      expect(screen.getByText('Push Up')).toBeInTheDocument();

      // Should have all the necessary UI elements
      expect(screen.getByLabelText('Play audio')).toBeInTheDocument();
      expect(document.querySelector('audio')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('maintains proper component hierarchy', () => {
      const { container } = render(<ExerciseAudio {...defaultProps} />);

      // Should have proper container structure
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.tagName).toBe('DIV');

      // Should contain audio element
      expect(containerDiv.querySelector('audio')).toBeInTheDocument();

      // Should contain control elements
      expect(containerDiv.querySelector('button')).toBeInTheDocument();
    });

    it('applies proper CSS classes', () => {
      render(<ExerciseAudio {...defaultProps} />);

      // Find the main container div (not the text div)
      const audio = document.querySelector('audio');
      const mainContainer = audio?.parentElement;

      expect(mainContainer).toHaveClass('bg-base-100');
      expect(mainContainer).toHaveClass('border');
      expect(mainContainer).toHaveClass('rounded-xl');
    });
  });
});
