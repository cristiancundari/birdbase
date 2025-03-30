import { describe, expect, it } from "vitest";
import { parseToStr } from "./parser";

describe("Parser", () => {
  it("converte una formula dal formato infix a postfix", () => {
    const output = parseToStr("5+3*8-4/2");
    expect(output).toBe("538*+42/-");
  });

  it("calcola l'ordine corretto dell'esponenziale", () => {
    const output1 = parseToStr("5^2^3");
    expect(output1).toBe("523^^");
    const output2 = parseToStr("2*5^2^3");
    expect(output2).toBe("2523^^*");
  });

  it("dovrebbe calcolare prima il risultato dell'espressione tra parentesi", () => {
    const output = parseToStr("(5^2)^3");
    expect(output).toBe("52^3^");
  });

  it("dovrebbe dare un errore se le parentesi non sono bilanciate", () => {
    expect(() => parseToStr("(5^2^3")).toThrow();
    expect(() => parseToStr("(5^2))^3")).toThrow();
  });

  it("dovrebbe dare un errore se l'espressione contiene caratteri non validi", () => {
    expect(() => parseToStr("(5^2)@^3")).toThrow();
  });

  it("dovrebbe considerare le funzioni", () => {
    const output = parseToStr("sin(5)+8");
    expect(output).toBe("5sin8+");
  });

  it("dovrebbe considerare i segni", () => {
    const output = parseToStr("-sin(-5)*+8");
    expect(output).toBe("5-sin-8+*");
  });

  it("dovrebbe considerare la variabile x come un numero", () => {
    const output = parseToStr("-sin(-x)*+8");
    expect(output).toBe("x-sin-8+*");
  });

  it("dovrebbe calcolare il seguente esempio correttamente: -ln(x/2)*3^2/5-sin(1+x)", () => {
    const output = parseToStr("-ln(x/2)*3^2/5-sin(1+x)");
    expect(output).toBe("x2/ln-32^*5/1x+sin-");
  });
});
