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

    this.domNode.style.marginTop = '9px';
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value() {
    return this.#field.value;
  }

  get onSubmit() {
    return this.#input.onSubmit;
  }

  set onSubmit(onSubmit) {
    this.#input.onSubmit = onSubmit;
  }
}
