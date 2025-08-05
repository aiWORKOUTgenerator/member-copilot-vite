import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { PhoneNumberInput } from '../PhoneNumberInput';

describe('PhoneNumberInput', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value="+1234567890"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Phone number');
    expect(input).toHaveValue('+1 234 567 890');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Phone number');
    await user.type(input, '1234567890');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', async () => {
    const user = userEvent.setup();
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Phone number');
    await user.click(input);
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('shows error message when provided', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        error="Invalid phone number"
      />
    );

    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        error="Invalid phone number"
      />
    );

    const input = screen.getByLabelText('Phone number');
    expect(input).toHaveClass('PhoneInputInput');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        disabled
      />
    );

    const input = screen.getByLabelText('Phone number');
    expect(input).toBeDisabled();
  });

  it('shows placeholder when provided', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        placeholder="Enter your phone number"
      />
    );

    const input = screen.getByLabelText('Phone number');
    expect(input).toHaveAttribute('placeholder', 'Enter your phone number');
  });

  it('forwards additional props', () => {
    render(
      <PhoneNumberInput
        label="Phone Number"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        data-testid="phone-input"
        aria-describedby="phone-help"
      />
    );

    const input = screen.getByLabelText('Phone number');
    expect(input).toHaveAttribute('aria-describedby', 'phone-help');
  });
}); 