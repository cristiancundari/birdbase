import { Deque } from "./dequee";
import { IToken, TokenEnum } from "./token";
import { tokenize } from "./tokenizer";

enum OrdineCalcolo {
  LeftToRight,
  RightToLeft,
  Nessuno,
}

interface Operator {
  [key: string]: {
    precedenza: number;
    ordine: OrdineCalcolo;
  };
}

export function parse(input: string) {
  const tokens = tokenize(input);

  const outDeque = new Deque<IToken>();
  const opDeque = new Deque<IToken>();
  const operators: Operator = {
    "+": {
      precedenza: 1,
      ordine: OrdineCalcolo.LeftToRight,
    },
    "-": {
      precedenza: 1,
      ordine: OrdineCalcolo.LeftToRight,
    },
    "*": {
      precedenza: 2,
      ordine: OrdineCalcolo.LeftToRight,
    },
    "/": {
      precedenza: 2,
      ordine: OrdineCalcolo.LeftToRight,
    },
    "^": {
      precedenza: 3,
      ordine: OrdineCalcolo.RightToLeft,
    },
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type == TokenEnum.NUMERO || token.type == TokenEnum.VARIABILE) {
      outDeque.pushFront(token);
    } else if (token.type == TokenEnum.OPERATORE) {
      const op = operators[token.value];
      token.op_precedenza = op.precedenza;
      token.op_arguments = 2;

      // Consideriamo i simboli '+' e '-' come 'segni' in determinati casi
      if (token.value == "+" || token.value == "-") {
        if (i == 0 || tokens[i - 1].type == TokenEnum.OPERATORE || tokens[i - 1].type == TokenEnum.PARENTESI_APERTA) {
          token.op_precedenza = 100;
          token.op_arguments = 1;
        }
      }

      // Spostiamo sull'output gli operatori dallo stack (se necessario)
      while (
        opDeque.size() > 0 &&
        (opDeque.peekFront().type == TokenEnum.FUNZIONE ||
          (opDeque.peekFront().type == TokenEnum.OPERATORE &&
            (op.ordine == OrdineCalcolo.LeftToRight
              ? opDeque.peekFront().op_precedenza! >= token.op_precedenza
              : opDeque.peekFront().op_precedenza! > token.op_precedenza)))
      ) {
        const value = opDeque.popFront();
        outDeque.pushFront(value!);
      }

      opDeque.pushFront(token);
    } else if (token.type == TokenEnum.FUNZIONE || token.type == TokenEnum.PARENTESI_APERTA) {
      opDeque.pushFront(token);
    } else if (token.type == TokenEnum.PARENTESI_CHIUSA) {
      // Spostiamo sull'output gli operatori dallo stack fin quando non troviamo una parentesi di apertura corrispondente
      while (opDeque.size() > 0 && opDeque.peekFront().type != TokenEnum.PARENTESI_APERTA) {
        const value = opDeque.popFront();
        outDeque.pushFront(value!);
      }
      if (opDeque.size() == 0) {
        // Se ho esaurito lo stack senza trovare una parentesi di apertura corrispondente
        throw new Error("Alla parentesi di chiusura manca una parentesi di apertura corrispondente");
      }
      opDeque.popFront(); // Rimuovo dallo stack degli operatori la parentesi di apertura rimasta
    } else {
      throw new Error("Simbolo non riconosciuto");
    }
  }

  // Se rimane qualcosa nello stack degli operatori li spostiamo sull'output
  while (opDeque.size() > 0) {
    const value = opDeque.popFront();
    if (value!.type == TokenEnum.PARENTESI_APERTA) {
      throw new Error("Parentesi non bilanciate");
    }
    outDeque.pushFront(value!);
  }

  const output = [];
  while (outDeque.size() > 0) {
    output.push(outDeque.popBack()!);
  }

  return output;
}

export function parseToStr(input: string) {
  const tokens = parse(input);

  // Costruiamo la stringa di output da ritornare
  return tokens.map((t) => t.value).join("");
}
