import { Field } from './Field';

export class TextField {
  readonly #field;

  constructor(name: string, inputElement: HTMLInputElement) {
    this.#field = new Field(name, inputElement);

    this.domNode.style.cursor = 'text';
  }

  get domNode() {
    return this.#field.domNode;
  }
}
