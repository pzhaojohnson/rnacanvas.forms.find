import { TextField } from './TextField';

export class NumberField {
  readonly #input;

  readonly #field;

  constructor(name: string, input: HTMLInputElement) {
    this.#input = input;

    this.#field = new TextField(name, input);
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value(): number {
    return Number.parseFloat(this.#input.value);
  }
}
