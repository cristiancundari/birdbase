import { IToken, TokenEnum } from "./token";

const numbers = "0123456789.";
const operators = "+-*/^";

enum Stato {
  NUOVO_TOKEN,
  NUMERO,
  FUNZIONE,
  COMPLETATO,
}

export function tokenize(input: string) {
  let index = 0;
  let currTokenValue = "";

  const possibiliFunzioni = ["log", "ln", "sin", "cos", "tan", "sqrt"];

  let currentState = Stato.NUOVO_TOKEN;
  let nextState = Stato.NUOVO_TOKEN;

  let currentToken: IToken = {
    type: TokenEnum.SCONOSCIUTO,
    value: "",
  };

  const output: IToken[] = [];

  while (index <= input.length) {
    const char = input[index];
    if (char == " ") {
      index++;
      continue;
    }

    switch (currentState as Stato) {
      case Stato.NUOVO_TOKEN:
        if (char == undefined) {
          index++;
        } else if (numbers.includes(char)) {
          currTokenValue = char;
          index++;
          nextState = Stato.NUMERO;
        } else if (operators.includes(char)) {
          currTokenValue = "";
          currentToken = {
            type: TokenEnum.OPERATORE,
            value: char,
          };
          index++;
          nextState = Stato.COMPLETATO;
        } else if (char == "x") {
          currTokenValue = "";
          currentToken = {
            type: TokenEnum.VARIABILE,
            value: char,
          };
          index++;
          nextState = Stato.COMPLETATO;
        } else if (char == "(") {
          currTokenValue = "";
          currentToken = {
            type: TokenEnum.PARENTESI_APERTA,
            value: char,
          };
          index++;
          nextState = Stato.COMPLETATO;
        } else if (char == ")") {
          currTokenValue = "";
          currentToken = {
            type: TokenEnum.PARENTESI_CHIUSA,
            value: char,
          };
          index++;
          nextState = Stato.COMPLETATO;
        } else if (possibiliFunzioni.some((f) => f.startsWith(char))) {
          // Potrebbe essere una funziona (log, ln, sqrt, sin, cos, tan, ...)
          currTokenValue = char;
          index++;
          nextState = Stato.FUNZIONE;
        } else {
          throw new Error(`Simbolo [${char}] non riconosciuto`);
        }
        break;
      case Stato.NUMERO:
        if (numbers.includes(char)) {
          currTokenValue += char;
          const numPunti = currTokenValue.split(".").length - 1;
          if (numPunti > 1) {
            throw new Error(`Il numero [${currTokenValue}] ha più separatori decimali`);
          }
          index++;
          nextState = Stato.NUMERO;
        } else {
          if (currTokenValue.startsWith(".") || currTokenValue.endsWith(".")) {
            throw new Error(`Il numero [${currTokenValue}] ha un separatore decimale non valido`);
          }
          currentToken = {
            type: TokenEnum.NUMERO,
            value: currTokenValue,
          };
          nextState = Stato.COMPLETATO;
        }
        break;
      case Stato.FUNZIONE:
        if (possibiliFunzioni.some((f) => f.startsWith(currTokenValue + char))) {
          currTokenValue += char;
          index++;
          nextState = Stato.FUNZIONE;
        } else if (possibiliFunzioni.includes(currTokenValue)) {
          currentToken = {
            type: TokenEnum.FUNZIONE,
            value: currTokenValue,
          };
          nextState = Stato.COMPLETATO;
        } else {
          throw new Error(`[${currTokenValue}] non è una funzione valida`);
        }
        break;
      case Stato.COMPLETATO:
        output.push(currentToken);
        nextState = Stato.NUOVO_TOKEN;
        break;
    }
    currentState = nextState;
  }
  return output;
}
