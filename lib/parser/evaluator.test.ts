import { expect } from "vitest";
import { evaluate } from "./evaluator";

describe("Evaluator", () => {
  it("dovrebbe calcolare 5+7*2", () => {
    const res = evaluate("5+7*2");
    expect(res).toBe(19);
  });
  it("dovrebbe calcolare 2^3+3/2+sqrt(4)+0.5", () => {
    const res = evaluate("2^3+3/2+sqrt(4)+0.5");
    expect(res).toBe(12);
  });
  it("dovrebbe calcolare 0.125+sin(3.1415)*3/4^2/-2*ln(3)", () => {
    const res = evaluate("0.125+sin(3.1415)*3/4^2/-2*ln(3)");
    expect(res).toBeCloseTo(0.12499, 5);
  });
  it("dovrebbe calcolare una funzione con variabile", () => {
    const res1 = evaluate("(5+7-1*x)*2+x", 5);
    expect(res1).toBe(19);
    const res2 = evaluate("3*x", 0);
    expect(res2).toBe(0);
  });
  it("dovrebbe scoprire errori di sintassi", () => {
    expect(() => evaluate("(5+*7)")).toThrow();
    expect(() => evaluate("(5+7)+log(-3)")).toThrow();
    expect(() => evaluate("(5+7)+sqrt(-1)")).toThrow();
    expect(() => evaluate("(5+)7)")).toThrow();
    expect(() => evaluate("(5+x)7)")).toThrow();
  });
});
