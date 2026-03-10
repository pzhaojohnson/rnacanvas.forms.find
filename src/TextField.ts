import { Field } from './Field';

export class TextField {
  readonly #field;

  constructor(name: string, inputElement: HTMLInputElement) {
    this.#field = new Field(name, inputElement);

    this.domNode.style.cursor = 'text';

    inputElement.addEventListener('focus', () => this.domNode.style.color = 'yellow');

    inputElement.addEventListener('blur', () => this.domNode.style.color = '');
  }

  get domNode() {
    return this.#field.domNode;
  }
}
