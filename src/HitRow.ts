import type { Hit } from './Hit';

import * as styles from './HitRow.module.css';

import { TextButton } from './TextButton';

export class HitRow {
  readonly domNode = document.createElement('div');

  readonly #position = document.createElement('p');

  readonly #sequence = document.createElement('p');

  readonly #spacer = document.createElement('div');

  readonly buttons = {
    'Select': new SelectButton(),
    'Add to Selected': new AddToSelectedButton(),
  };

  #onClick?: () => void;

  constructor(readonly hit: Hit) {
    this.domNode.classList.add(styles['hit-row']);

    this.#position.classList.add(styles['position']);
    this.#position.textContent = `${hit.position}`;

    this.domNode.append(this.#position);

    this.#sequence.classList.add(styles['sequence']);
    this.#sequence.textContent = hit.toString();

    this.domNode.append(this.#sequence);

    this.#spacer.classList.add(styles['spacer']);

    this.domNode.append(this.#spacer);

    this.domNode.append(
      this.buttons['Select'].domNode,
      this.buttons['Add to Selected'].domNode,
    );

    // avoid overlapping clicks with "Select" and "Add to Selected" buttons
    this.domNode.addEventListener('click', event => {
      if (event.target === this.domNode) {
        this.#onClick ? this.#onClick() : {};
      }
    });
  }

  get onClick() {
    return this.#onClick;
  }

  set onClick(onClick) {
    this.#onClick = onClick;
  }

  isHighlighted(): boolean {
    return this.domNode.classList.contains(styles['highlighted']);
  }

  highlight(): void {
    this.domNode.classList.add(styles['highlighted']);
  }

  dehighlight(): void {
    this.domNode.classList.remove(styles['highlighted']);
  }
}

class SelectButton {
  readonly #textButton = new TextButton('Select');

  constructor() {
    this.domNode.classList.add(styles['select-button']);

    this.#textButton.tooltip.textContent = 'Select hit.';
  }

  get domNode() {
    return this.#textButton.domNode;
  }

  get onClick() {
    return this.#textButton.onClick;
  }

  set onClick(onClick) {
    this.#textButton.onClick = onClick;
  }
}

class AddToSelectedButton {
  readonly #textButton = new TextButton('⇧');

  constructor() {
    this.domNode.classList.add(styles['add-to-selected-button']);

    this.#textButton.tooltip.textContent = 'Add hit to selected.';
  }

  get domNode() {
    return this.#textButton.domNode;
  }

  get onClick() {
    return this.#textButton.onClick;
  }

  set onClick(onClick) {
    this.#textButton.onClick = onClick;
  }
}
