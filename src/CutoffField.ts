import { NumberField } from './NumberField';

import { TextInput } from './TextInput';

export class CutoffField {
  readonly #input;

  readonly #field;

  /**
   * User-defined callback on submit.
   */
  #onSubmit?: () => void;

  constructor() {
    this.#input = new TextInput();

    // default value
    this.value = 0.9;

    this.#field = new NumberField('Cutoff', this.#input.domNode);

    this.domNode.style.marginTop = '0px';

    // initialize default behavior on submit
    this.onSubmit = undefined;
  }

  get domNode() {
    return this.#field.domNode;
  }

  get value() {
    return this.#field.value / 100;
  }

  set value(value) {
    let percentage = 100 * value;

    if (Number.isFinite(percentage)) {
      this.#input.domNode.value = `${percentage.toFixed(2)}%`;
    } else {
      this.#input.domNode.value = `${percentage}`;
    }
  }

  get onSubmit() {
    return this.#onSubmit;
  }

  set onSubmit(onSubmit) {
    this.#onSubmit = onSubmit;

    this.#input.onSubmit = () => {
      // format displayed value
      this.value = this.value;

      onSubmit ? onSubmit() : {};
    };
  }
}
