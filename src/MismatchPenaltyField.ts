import { NumberInput } from './NumberInput';

import { TextField } from './TextField';

export class MismatchPenaltyField {
  readonly #input;

  readonly #field;

  constructor() {
    this.#input = new NumberInput();

    // default value
    this.#input.domNode.value = '-1';

    this.#field = new TextField('Mismatch penalty', this.#input.domNode);

    this.domNode.style.marginTop = '9px';
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value() {
    return this.#input.value;
  }

  get onSubmit() {
    return this.#input.onSubmit;
  }

  set onSubmit(onSubmit) {
    this.#input.onSubmit = onSubmit;
  }
}
