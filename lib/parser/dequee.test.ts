import { describe, expect, it } from "vitest";
import { Deque } from "./dequee";

describe("Dequee - coda FIFO/LIFO", () => {
  it("dovrebbe aggiungere due elementi alla coda (FIFO)", () => {
    const coda = new Deque();
    coda.pushFront("5");
    coda.pushFront("9");
    expect(coda.size()).toBe(2);
  });
  it("dovrebbe permettere operazioni FIFO", () => {
    const coda = new Deque();
    coda.pushBack("5");
    coda.pushBack("9");
    const first = coda.popFront();
    const second = coda.popFront();
    expect(first).toBe("5");
    expect(second).toBe("9");
    expect(coda.size()).toBe(0);
  });

  it("dovrebbe permettere operazioni LIFO", () => {
    const coda = new Deque();
    coda.pushFront("5");
    coda.pushFront("9");
    const first = coda.popFront();
    const second = coda.popFront();
    expect(first).toBe("9");
    expect(second).toBe("5");
    expect(coda.size()).toBe(0);
  });
});
