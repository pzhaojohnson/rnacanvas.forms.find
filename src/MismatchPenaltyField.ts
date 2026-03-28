import { NumberField } from './NumberField';

import { TextInput } from './TextInput';

export class MismatchPenaltyField {
  readonly #input;

  readonly #field;

  constructor() {
    this.#input = new TextInput();

    // default value
    this.#input.domNode.value = '-1';

    this.#field = new NumberField('Mismatch penalty', this.#input.domNode);

    this.domNode.style.marginTop = '9px';
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value() {
    return this.#field.value;
  }
}
