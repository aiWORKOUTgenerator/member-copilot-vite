import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';
import { CardBody } from '../CardBody';

describe('Card', () => {
  it('renders with default props', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );

    const card = screen
      .getByText('Card content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      'bg-gradient-to-br',
      'from-base-200/20',
      'via-base-100/10',
      'to-base-200/5'
    );
  });

  it('renders selectable variant correctly', () => {
    render(
      <Card variant="selectable" colorScheme="primary">
        <div>Selectable content</div>
      </Card>
    );

    const card = screen
      .getByText('Selectable content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).toHaveClass(
      'bg-gradient-to-br',
      'from-base-200/20',
      'via-base-100/10',
      'to-base-200/5'
    );
  });

  it('renders selected state correctly', () => {
    render(
      <Card variant="selectable" colorScheme="primary" isSelected={true}>
        <div>Selected content</div>
      </Card>
    );

    const card = screen
      .getByText('Selected content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).toHaveClass(
      'bg-gradient-to-br',
      'from-primary/30',
      'via-primary/20',
      'to-primary/10'
    );
    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders path variant correctly', () => {
    render(
      <Card variant="path" colorScheme="primary">
        <div>Path content</div>
      </Card>
    );

    const card = screen
      .getByText('Path content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).toHaveClass(
      'bg-gradient-to-br',
      'from-primary/20',
      'via-primary/10',
      'to-primary/5'
    );
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Clickable content</div>
      </Card>
    );

    const card = screen
      .getByText('Clickable content')
      .closest('div[class*="relative overflow-hidden"]');
    fireEvent.click(card!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <div>Keyboard content</div>
      </Card>
    );

    const card = screen
      .getByText('Keyboard content')
      .closest('div[class*="relative overflow-hidden"]');
    fireEvent.keyDown(card!, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick} disabled>
        <div>Disabled content</div>
      </Card>
    );

    const card = screen
      .getByText('Disabled content')
      .closest('div[class*="relative overflow-hidden"]');
    fireEvent.click(card!);
    expect(handleClick).not.toHaveBeenCalled();
    expect(card).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <div>Custom content</div>
      </Card>
    );

    const card = screen
      .getByText('Custom content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes when interactive', () => {
    render(
      <Card onClick={() => {}}>
        <div>Interactive content</div>
      </Card>
    );

    const card = screen
      .getByText('Interactive content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).toHaveAttribute('data-interactive', 'true');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('does not have accessibility attributes when not interactive', () => {
    render(
      <Card>
        <div>Non-interactive content</div>
      </Card>
    );

    const card = screen
      .getByText('Non-interactive content')
      .closest('div[class*="relative overflow-hidden"]');
    expect(card).not.toHaveAttribute('data-interactive');
    expect(card).not.toHaveAttribute('tabIndex');
  });
});

describe('CardBody', () => {
  it('renders with default padding', () => {
    render(
      <CardBody>
        <div>Body content</div>
      </CardBody>
    );

    const body = screen.getByText('Body content').closest('.card-body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('p-4');
  });

  it('renders with custom padding', () => {
    render(
      <CardBody padding="lg">
        <div>Large padding content</div>
      </CardBody>
    );

    const body = screen
      .getByText('Large padding content')
      .closest('.card-body');
    expect(body).toHaveClass('p-5');
  });

  it('applies custom className', () => {
    render(
      <CardBody className="custom-body-class">
        <div>Custom body content</div>
      </CardBody>
    );

    const body = screen.getByText('Custom body content').closest('.card-body');
    expect(body).toHaveClass('custom-body-class');
  });
});
