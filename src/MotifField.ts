import * as styles from './MotifField.module.css';

import { TextInput } from './TextInput';

export class MotifField {
  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #input = new TextInput();

  readonly #iupacCodesNote = new IUPACCodesNote();

  onChange?: () => void;

  constructor() {
    this.domNode.classList.add(styles['motif-field']);

    this.#label.classList.add(styles['label']);

    this.#label.textContent = 'Motif *:';

    this.domNode.append(this.#label);

    this.#input.domNode.style.width = '240px';

    this.#input.domNode.addEventListener('focus', () => this.#label.style.color = 'yellow');
    this.#input.domNode.addEventListener('blur', () => this.#label.style.color = '');

    this.#input.domNode.oninput = () => {
      this.onChange ? this.onChange() : {};
    };

    this.domNode.append(this.#input.domNode);

    this.domNode.append(this.#iupacCodesNote.domNode);

    this.#input.domNode.addEventListener('focus', () => this.#iupacCodesNote.domNode.style.color = 'yellow');
    this.#input.domNode.addEventListener('blur', () => this.#iupacCodesNote.domNode.style.color = '');
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

class IUPACCodesNote {
  readonly domNode = document.createElement('p');

  readonly #link = document.createElement('a');

  constructor() {
    this.domNode.classList.add(styles['iupac-codes-note']);

    this.#link.classList.add(styles['iupac-codes-link']);

    this.#link.href = 'https://www.bioinformatics.org/sms/iupac.html';
    this.#link.target = '_blank';

    this.#link.textContent = 'IUPAC codes';

    this.domNode.append('* ', this.#link, ' are recognized.');
  }
}
