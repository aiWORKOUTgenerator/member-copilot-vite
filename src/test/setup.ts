import "@testing-library/jest-dom";

// Mock IntersectionObserver if needed
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  },
});

// Mock ResizeObserver if needed
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  },
});
