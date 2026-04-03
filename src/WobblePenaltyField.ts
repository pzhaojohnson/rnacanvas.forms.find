import * as styles from './WobblePenaltyField.module.css';

import { NumberInput } from './NumberInput';

import { TextField } from './TextField';

export class WobblePenaltyField {
  readonly domNode = document.createElement('div');

  readonly #input;

  readonly #field;

  readonly #wobblePenaltyNote = new WobblePenaltyNote();

  constructor() {
    this.#input = new NumberInput();

    // default value
    this.#input.domNode.value = '0';

    this.#field = new TextField('Wobble penalty *', this.#input.domNode);

    this.domNode.append(this.#field.domNode);

    this.domNode.append(this.#wobblePenaltyNote.domNode);

    this.#input.domNode.addEventListener('focus', () => this.#wobblePenaltyNote.domNode.style.color = 'yellow');
    this.#input.domNode.addEventListener('blur', () => this.#wobblePenaltyNote.domNode.style.color = '');

    this.domNode.style.marginTop = '9px';
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

  hide(): void {
    this.domNode.style.display = 'none';
  }

  unhide(): void {
    this.domNode.style.display = '';
  }
}

class WobblePenaltyNote {
  readonly domNode = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['wobble-penalty-note']);

    this.domNode.textContent = '* For G:U and G:T pairs.';
  }
}
