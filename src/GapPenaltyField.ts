import { NumberInput } from './NumberInput';

import { TextField } from './TextField';

export class GapPenaltyField {
  readonly #input;

  readonly #field;

  constructor() {
    this.#input = new NumberInput();

    // default value
    this.#input.domNode.value = '-1.5';

    this.#field = new TextField('Gap penalty', this.#input.domNode);

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
