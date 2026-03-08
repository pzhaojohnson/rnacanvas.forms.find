import { NumberField } from './NumberField';

import { TextInput } from './TextInput';

export class GapPenaltyField {
  readonly #input;

  readonly #field;

  constructor() {
    this.#input = new TextInput();

    // default value
    this.#input.domNode.value = '-1.5';

    this.#field = new NumberField('Gap penalty', this.#input.domNode);

    this.domNode.style.marginTop = '4px';
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value() {
    return this.#field.value;
  }
}
