import { NumberField } from './NumberField';

import { TextInput } from './TextInput';

export class WobblePenaltyField {
  readonly #input;

  readonly #field;

  constructor() {
    this.#input = new TextInput();

    // default value
    this.#input.domNode.value = '-0.5';

    this.#field = new NumberField('Wobble penalty', this.#input.domNode);

    this.domNode.style.marginTop = '9px';
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value() {
    return this.#field.value;
  }

  hide(): void {
    this.domNode.style.visibility = 'hidden';
  }

  unhide(): void {
    this.domNode.style.visibility = '';
  }
}
