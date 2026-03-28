import * as styles from './WobblePenaltyField.module.css';

import { NumberField } from './NumberField';

import { TextInput } from './TextInput';

export class WobblePenaltyField {
  readonly domNode = document.createElement('div');

  readonly #input;

  readonly #field;

  readonly #wobblePenaltyNote = new WobblePenaltyNote();

  constructor() {
    this.#input = new TextInput();

    // default value
    this.#input.domNode.value = '-0.5';

    this.#field = new NumberField('Wobble penalty *', this.#input.domNode);

    this.domNode.append(this.#field.domNode);

    this.domNode.append(this.#wobblePenaltyNote.domNode);

    this.domNode.style.marginTop = '9px';
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

class WobblePenaltyNote {
  readonly domNode = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['wobble-penalty-note']);

    this.domNode.textContent = '* For G:U and G:T pairs.';
  }
}
