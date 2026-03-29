import { NumberField } from './NumberField';

import { TextInput } from './TextInput';

export class CutoffField {
  readonly #input;

  readonly #field;

  constructor() {
    this.#input = new TextInput();

    // default value
    this.#input.domNode.value = '0.9';

    this.#field = new NumberField('Cutoff', this.#input.domNode);

    this.domNode.style.marginTop = '0px';
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
