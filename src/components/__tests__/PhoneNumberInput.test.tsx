import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhoneNumberInput } from "../PhoneNumberInput";

// Mock the usePhoneVerificationStatus hook directly
vi.mock("@/hooks/usePhoneNumber", () => ({
  usePhoneVerificationStatus: () => ({
    hasPhoneNumber: false,
    isVerified: false,
    verificationDate: null,
    isPending: false,
    canVerify: false,
    status: "not_provided",
  }),
}));

describe("PhoneNumberInput", () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders with aria-label", () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        aria-label="Phone number"
      />,
    );

    expect(screen.getByLabelText("Phone number")).toBeInTheDocument();
  });

  it("displays current value", () => {
    render(
      <PhoneNumberInput
        value="+1234567890"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    expect(input).toHaveValue("+1 234 567 890");
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    await user.type(input, "1234567890");

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onBlur when input loses focus", async () => {
    const user = userEvent.setup();
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    await user.click(input);
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("shows error message when provided", () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        error="Invalid phone number"
        aria-label="Phone number"
      />,
    );

    expect(screen.getByText("Invalid phone number")).toBeInTheDocument();
  });

  it("applies error styling when error is present", () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        error="Invalid phone number"
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    expect(input).toHaveClass("PhoneInputInput");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        disabled
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    expect(input).toBeDisabled();
  });

  it("shows placeholder when provided", () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        placeholder="Enter your phone number"
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    expect(input).toHaveAttribute("placeholder", "Enter your phone number");
  });

  it("forwards additional props", () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        data-testid="phone-input"
        aria-describedby="phone-help"
        aria-label="Phone number"
      />,
    );

    const input = screen.getByLabelText("Phone number");
    expect(input).toHaveAttribute("aria-describedby", "phone-help");
  });
});
