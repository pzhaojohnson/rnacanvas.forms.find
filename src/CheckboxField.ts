import { Field } from './Field';

export class CheckboxField {
  readonly #field;

  constructor(readonly name: string, inputElement: HTMLInputElement) {
    this.#field = new Field(name, inputElement);

    this.domNode.style.cursor = 'pointer';
  }

  get domNode() {
    return this.#field.domNode;
  }
}
