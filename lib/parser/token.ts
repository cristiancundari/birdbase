export enum TokenEnum {
  SCONOSCIUTO,
  NUMERO,
  OPERATORE,
  FUNZIONE,
  PARENTESI_APERTA,
  PARENTESI_CHIUSA,
  VARIABILE,
}

export interface IToken {
  value: string;
  type: TokenEnum;
  op_arguments?: number;
  op_precedenza?: number;
}
