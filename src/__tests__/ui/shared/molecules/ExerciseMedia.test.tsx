import { render, screen, waitFor, act } from '@testing-library/react';
import { ExerciseMedia } from '@/ui/shared/molecules/ExerciseMedia';

describe('ExerciseMedia Component', () => {
  const defaultProps = {
    alt: 'Test Exercise',
  };

  describe('when no imageUrl is provided', () => {
    it('renders no image available state', () => {
      render(<ExerciseMedia {...defaultProps} />);

      expect(screen.getByText('No image available')).toBeInTheDocument();
      // Check for the SVG icon by looking for the ImageIcon component
      const svgIcon = document.querySelector('svg.lucide-image');
      expect(svgIcon).toBeInTheDocument();
    });
  });

  describe('when imageUrl is null', () => {
    it('renders no image available state', () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={null} />);

      expect(screen.getByText('No image available')).toBeInTheDocument();
    });
  });

  describe('when imageUrl is provided', () => {
    const imageUrl = 'https://example.com/exercise.jpg';

    it('renders image with correct src and alt', () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', imageUrl);
      expect(image).toHaveAttribute('alt', defaultProps.alt);
    });

    it('applies correct size classes', () => {
      const { rerender } = render(
        <ExerciseMedia {...defaultProps} imageUrl={imageUrl} size="sm" />
      );
      expect(screen.getByRole('img').parentElement).toHaveClass('max-h-40');

      rerender(
        <ExerciseMedia {...defaultProps} imageUrl={imageUrl} size="md" />
      );
      expect(screen.getByRole('img').parentElement).toHaveClass('max-h-56');

      rerender(
        <ExerciseMedia {...defaultProps} imageUrl={imageUrl} size="lg" />
      );
      expect(screen.getByRole('img').parentElement).toHaveClass('max-h-72');
    });

    it('applies correct rounded classes', () => {
      const { rerender } = render(
        <ExerciseMedia {...defaultProps} imageUrl={imageUrl} rounded="lg" />
      );
      expect(screen.getByRole('img').parentElement).toHaveClass('rounded-lg');

      rerender(
        <ExerciseMedia {...defaultProps} imageUrl={imageUrl} rounded="xl" />
      );
      expect(screen.getByRole('img').parentElement).toHaveClass('rounded-xl');

      rerender(
        <ExerciseMedia {...defaultProps} imageUrl={imageUrl} rounded="2xl" />
      );
      expect(screen.getByRole('img').parentElement).toHaveClass('rounded-2xl');
    });

    it('shows skeleton while loading by default', () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      expect(document.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('hides skeleton when showSkeleton is false', () => {
      render(
        <ExerciseMedia
          {...defaultProps}
          imageUrl={imageUrl}
          showSkeleton={false}
        />
      );

      expect(document.querySelector('.skeleton')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-test-class';
      render(
        <ExerciseMedia
          {...defaultProps}
          imageUrl={imageUrl}
          className={customClass}
        />
      );

      expect(screen.getByRole('img').parentElement).toHaveClass(customClass);
    });
  });

  describe('image loading states', () => {
    const imageUrl = 'https://example.com/exercise.jpg';

    it('handles image load success', async () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      const image = screen.getByRole('img');

      // Initially has opacity-0 (loading state)
      expect(image).toHaveClass('opacity-0');

      // Simulate successful load
      Object.defineProperty(image, 'complete', { value: true });
      Object.defineProperty(image, 'naturalWidth', { value: 100 });

      // Trigger load event
      await act(async () => {
        const loadEvent = new Event('load');
        image.dispatchEvent(loadEvent);
      });

      await waitFor(() => {
        expect(image).toHaveClass('opacity-100');
      });
    });

    it('handles image load error', async () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      const image = screen.getByRole('img');

      // Trigger error event
      await act(async () => {
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);
      });

      await waitFor(() => {
        expect(screen.getByText('Image unavailable')).toBeInTheDocument();
      });

      // Image should not be visible after error
      expect(image).not.toBeVisible();
    });
  });

  describe('accessibility', () => {
    const imageUrl = 'https://example.com/exercise.jpg';

    it('has proper loading and decoding attributes', () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
    });

    it('has proper sizes attribute for responsive images', () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute(
        'sizes',
        '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
      );
    });

    it('maintains aspect ratio', () => {
      render(<ExerciseMedia {...defaultProps} imageUrl={imageUrl} />);

      expect(screen.getByRole('img').parentElement).toHaveClass('aspect-video');
    });
  });
});
