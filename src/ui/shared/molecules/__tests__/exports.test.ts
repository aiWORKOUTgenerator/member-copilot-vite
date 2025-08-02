import { describe, it, expect } from "vitest";
import {
  DetailedSelector,
} from "../index";

describe("UI Library Exports", () => {
  it("exports DetailedSelector component", () => {
    expect(DetailedSelector).toBeDefined();
    expect(typeof DetailedSelector).toBe("function");
  });
}); 