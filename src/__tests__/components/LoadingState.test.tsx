import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingState from '@/ui/shared/atoms/LoadingState';

describe('LoadingState', () => {
  it('should render with default props', () => {
    const { container } = render(<LoadingState />);

    const loadingElement = container.querySelector(
      '.flex.justify-center.items-center'
    );
    expect(loadingElement).toBeInTheDocument();
    expect(loadingElement).toHaveClass(
      'flex',
      'justify-center',
      'items-center'
    );
  });

  it('should render with custom size', () => {
    const { container } = render(<LoadingState size="lg" />);

    const loadingDots = container.querySelector('.loading-dots');
    expect(loadingDots).toHaveClass('loading-lg');
  });

  it('should render with custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />);

    const loadingElement = container.querySelector(
      '.flex.justify-center.items-center'
    );
    expect(loadingElement).toHaveClass('custom-class');
  });
});
