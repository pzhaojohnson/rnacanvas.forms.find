import * as styles from './MotifField.module.css';

import { TextInput } from './TextInput';

export class MotifField {
  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #input = new TextInput();

  onChange?: () => void;

  constructor() {
    this.domNode.classList.add(styles['motif-field']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Motif:'

    this.domNode.append(this.#label);

    this.#input.domNode.style.width = '225x';

    this.#input.domNode.addEventListener('focus', () => this.#label.style.color = 'yellow');
    this.#input.domNode.addEventListener('blur', () => this.#label.style.color = '');

    this.#input.domNode.oninput = () => {
      this.onChange ? this.onChange() : {};
    };

    this.domNode.append(this.#input.domNode);
  }

  get value(): string {
    return this.#input.domNode.value;
  }

  set value(value) {
    this.#input.domNode.value = value;

    this.onChange ? this.onChange() : {};
  }

  disable(): void {
    this.#input.disable();
  }

  enable(): void {
    this.#input.enable();
  }
}
