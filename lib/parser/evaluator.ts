import { Deque } from "./dequee";
import { parse } from "./parser";
import { IToken, TokenEnum } from "./token";

function strToNumber(input: string) {
  const value = Number(input);
  if (isNaN(value)) throw new Error(`Il valore ${input} non è un numero valido.`);
  return value;
}

export function evaluate(input: string, x?: number) {
  const dequeValues = new Deque<number>();

  const tokens = parse(input);
  for (const token of tokens) {
    if (token.type == TokenEnum.NUMERO) {
      const value = strToNumber(token.value);
      dequeValues.pushFront(value);
    } else if (token.type == TokenEnum.OPERATORE) {
      switch (token.value) {
        case "+": {
          if (token.op_arguments == 1) {
            const num = dequeValues.popFront();
            if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
            dequeValues.pushFront(num);
          } else {
            const num1 = dequeValues.popFront();
            const num2 = dequeValues.popFront();
            if (num1 == undefined || num2 == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
            dequeValues.pushFront(num2 + num1);
          }
          break;
        }
        case "-": {
          if (token.op_arguments == 1) {
            const num = dequeValues.popFront();
            if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
            dequeValues.pushFront(-num);
          } else {
            const num1 = dequeValues.popFront();
            const num2 = dequeValues.popFront();
            if (num1 == undefined || num2 == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
            dequeValues.pushFront(num2 - num1);
          }
          break;
        }
        case "*": {
          const num1 = dequeValues.popFront();
          const num2 = dequeValues.popFront();
          if (num1 == undefined || num2 == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          dequeValues.pushFront(num2 * num1);
          break;
        }
        case "/": {
          const num1 = dequeValues.popFront();
          const num2 = dequeValues.popFront();
          if (num1 == undefined || num2 == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          if (num1 == 0) throw new Error("Impossibile dividere per 0");
          dequeValues.pushFront(num2 / num1);
          break;
        }
        case "^": {
          const num1 = dequeValues.popFront();
          const num2 = dequeValues.popFront();
          if (num1 == undefined || num2 == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          dequeValues.pushFront(num2 ** num1);
          break;
        }
        default: {
          throw new Error(`L'operatore ${token.value} non è gestito`);
        }
      }
    } else if (token.type == TokenEnum.VARIABILE) {
      if (x === undefined) throw new Error("È necessario specificare una variabile");
      dequeValues.pushFront(x);
    } else if (token.type == TokenEnum.FUNZIONE) {
      switch (token.value) {
        case "log": {
          const num = dequeValues.popFront();
          if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          if (num <= 0) throw new Error(`La funzione non è calcolabile per il valore ${num}`);
          dequeValues.pushFront(Math.log10(num));
          break;
        }
        case "ln": {
          const num = dequeValues.popFront();
          if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          if (num <= 0) throw new Error(`La funzione non è calcolabile per il valore ${num}`);
          dequeValues.pushFront(Math.log(num));
          break;
        }
        case "sin": {
          const num = dequeValues.popFront();
          if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          dequeValues.pushFront(Math.sin(num));
          break;
        }
        case "cos": {
          const num = dequeValues.popFront();
          if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          dequeValues.pushFront(Math.cos(num));
          break;
        }
        case "tan": {
          const num = dequeValues.popFront();
          if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          if (Math.cos(num) == 0) throw new Error(`La funzione non è calcolabile per il valore ${num}`);
          dequeValues.pushFront(Math.tan(num));
          break;
        }
        case "sqrt": {
          const num = dequeValues.popFront();
          if (num == undefined) throw new Error(`Non ci sono abbastanza valori per l'operatore ${token.value}`);
          if (num < 0) throw new Error(`La funzione non è calcolabile per il valore ${num}`);
          dequeValues.pushFront(Math.sqrt(num));
          break;
        }
        default: {
          throw new Error(`La funzione ${token.value} non è gestita`);
        }
      }
    } else {
      throw new Error("L'input non è corretto");
    }
  }
  if (dequeValues.size() != 1) throw new Error("L'input non è corretto");
  return dequeValues.popFront();
}
