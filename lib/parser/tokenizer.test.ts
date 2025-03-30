import { expect } from "vitest";
import { tokenize } from "./tokenizer";
import { TokenEnum } from "./token";

describe("Tokenizer", () => {
  it("dovrebbe rilevare un numero", () => {
    const result = tokenize("25");
    expect(result.length).toBe(1);
    expect(result[0].value).toBe("25");
    expect(result[0].type).toBe(TokenEnum.NUMERO);
  });

  it("dovrebbe rilevare un addizione di due numeri", () => {
    const result = tokenize("25+50");
    expect(result.length).toBe(3);
    expect(result[0].value).toBe("25");
    expect(result[0].type).toBe(TokenEnum.NUMERO);
    expect(result[1].value).toBe("+");
    expect(result[1].type).toBe(TokenEnum.OPERATORE);
    expect(result[2].value).toBe("50");
    expect(result[2].type).toBe(TokenEnum.NUMERO);
  });

  it("dovrebbe gestire i numeri float con il .", () => {
    const result = tokenize("25.10");
    expect(result.length).toBe(1);
    expect(result[0].value).toBe("25.10");
    expect(result[0].type).toBe(TokenEnum.NUMERO);
  });

  it("dovrebbe generare un errore se ci sono più punti decimali", () => {
    expect(() => tokenize("25.1.0")).toThrow();
  });

  it("dovrebbe generare un errore se il punto decimale è posizionato all'inizio o alla fine", () => {
    expect(() => tokenize(".2510")).toThrow();
    expect(() => tokenize("2510.")).toThrow();
  });

  it("dovrebbe rilevare correttamente le parentesi", () => {
    const result1 = tokenize("(");
    const result2 = tokenize(")");
    expect(result1[0].type).toBe(TokenEnum.PARENTESI_APERTA);
    expect(result2[0].type).toBe(TokenEnum.PARENTESI_CHIUSA);
  });

  it("dovrebbe rilevare correttamente le funzioni", () => {
    const result = tokenize("sin");
    expect(result[0].type).toBe(TokenEnum.FUNZIONE);
    expect(result[0].value).toBe("sin");
  });

  it("dovrebbe ignorare gli spazi", () => {
    const result = tokenize("37 +   5.2  ");
    expect(result.length).toBe(3);
  });

  it("dovrebbe rilevare una x come variabile", () => {
    const result = tokenize("x");
    expect(result.length).toBe(1);
    expect(result[0].type).toBe(TokenEnum.VARIABILE);
    expect(result[0].value).toBe("x");
  });

  it("dovrebbe risolvere la funzione 11.3+8.7/2*sin(2^x)/ln(5)", () => {
    const result = tokenize(" 11.3+8.7/2* sin(2^x) / ln(5)");
    const atteso = [
      {
        type: TokenEnum.NUMERO,
        value: "11.3",
      },
      {
        type: TokenEnum.OPERATORE,
        value: "+",
      },
      {
        type: TokenEnum.NUMERO,
        value: "8.7",
      },
      {
        type: TokenEnum.OPERATORE,
        value: "/",
      },
      {
        type: TokenEnum.NUMERO,
        value: "2",
      },
      {
        type: TokenEnum.OPERATORE,
        value: "*",
      },
      {
        type: TokenEnum.FUNZIONE,
        value: "sin",
      },
      {
        type: TokenEnum.PARENTESI_APERTA,
        value: "(",
      },
      {
        type: TokenEnum.NUMERO,
        value: "2",
      },
      {
        type: TokenEnum.OPERATORE,
        value: "^",
      },
      {
        type: TokenEnum.VARIABILE,
        value: "x",
      },
      {
        type: TokenEnum.PARENTESI_CHIUSA,
        value: ")",
      },
      {
        type: TokenEnum.OPERATORE,
        value: "/",
      },
      {
        type: TokenEnum.FUNZIONE,
        value: "ln",
      },
      {
        type: TokenEnum.PARENTESI_APERTA,
        value: "(",
      },
      {
        type: TokenEnum.NUMERO,
        value: "5",
      },
      {
        type: TokenEnum.PARENTESI_CHIUSA,
        value: ")",
      },
    ];

    for (let i = 0; i < atteso.length; i++) {
      expect(result[i].type).toBe(atteso[i].type);
      expect(result[i].value).toBe(atteso[i].value);
    }
  });
});
