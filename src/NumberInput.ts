import { TextInput } from './TextInput';

export class NumberInput {
  /**
   * Wrapped text input.
   */
  readonly #input = new TextInput();

  /**
   * User-defined callback on submit.
   */
  #onSubmit?: () => void;

  constructor() {
    // initialize default behavior on submit
    this.onSubmit = undefined;
  }

  get domNode() {
    return this.#input.domNode;
  }

  get value(): number {
    return Number.parseFloat(this.#input.domNode.value);
  }

  get onSubmit() {
    return this.#onSubmit;
  }

  set onSubmit(onSubmit) {
    this.#onSubmit = onSubmit;

    this.#input.onSubmit = () => {
      // show parsed value
      this.#input.domNode.value = `${this.value}`;

      // call user-defined callback on submit
      onSubmit ? onSubmit() : {};
    };
  }
}
