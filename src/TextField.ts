import { Field } from './Field';

export class TextField {
  readonly #field;

  constructor(name: string, inputElement: HTMLInputElement) {
    this.#field = new Field(name, inputElement);

    this.domNode.style.cursor = 'text';

    inputElement.addEventListener('focus', () => this.#field.label.setColor('yellow'));

    inputElement.addEventListener('blur', () => this.#field.label.setColor(''));
  }

  get domNode() {
    return this.#field.domNode;
  }
}
