import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn", "btn-primary");
  });

  it("renders with custom variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button", { name: /secondary button/i });
    expect(button).toHaveClass("btn", "btn-secondary");
  });

  it("renders with custom size", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("btn", "btn-primary", "btn-lg");
  });

  it("renders with loading state", () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole("button", { name: /loading button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("btn", "btn-primary", "loading");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>,
    );

    const button = screen.getByRole("button", { name: /disabled button/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass("btn", "btn-primary", "custom-class");
  });

  it("forwards additional props", () => {
    render(
      <Button data-testid="test-button" aria-label="Test button">
        Test Button
      </Button>,
    );

    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("aria-label", "Test button");
  });
});
