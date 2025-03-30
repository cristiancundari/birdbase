import { IToken } from "./token";

export class Deque<T> {
  items: T[];

  constructor() {
    this.items = [];
  }

  // Aggiunge un elemento alla fine della coda
  pushBack(element: T) {
    this.items.push(element);
  }

  // Aggiunge un elemento all'inizio della coda
  pushFront(element: T) {
    this.items.unshift(element);
  }

  // Rimuove un elemento dalla fine della coda (LIFO)
  popBack() {
    return this.items.pop();
  }

  // Rimuove un elemento dall'inizio della coda (FIFO)
  popFront() {
    return this.items.shift();
  }

  // Ritorna l'elemento in fondo senza rimuoverlo
  peekBack() {
    return this.items[this.items.length - 1];
  }

  // Ritorna l'elemento in testa senza rimuoverlo
  peekFront() {
    return this.items[0];
  }

  // Controlla se la coda è vuota
  isEmpty() {
    return this.items.length === 0;
  }

  // Restituisce la dimensione della coda
  size() {
    return this.items.length;
  }

  // Pulisce la coda
  clear() {
    this.items = [];
  }
}
