import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/ui/shared/atoms/Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('should render with custom variant and size', () => {
    render(
      <Button variant="secondary" size="lg">
        Large Secondary
      </Button>
    );

    const button = screen.getByRole('button', { name: /large secondary/i });
    expect(button).toHaveClass('btn', 'btn-secondary', 'btn-lg');
  });

  it('should show loading state', () => {
    render(<Button isLoading>Loading Button</Button>);

    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('loading');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Test Click Button</Button>);

    const button = screen.getByRole('button', { name: /test click button/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
