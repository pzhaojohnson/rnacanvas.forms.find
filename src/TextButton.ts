import * as styles from './TextButton.module.css';

import { Tooltip } from '@rnacanvas/tooltips';

export class TextButton {
  readonly domNode = document.createElement('div');

  readonly #text = document.createElement('p');

  readonly tooltip = new Tooltip('');

  constructor(textContent?: string, onClick?: () => void) {
    onClick ? this.domNode.onclick = onClick : {};

    this.domNode.classList.add(styles['text-button']);

    this.#text.classList.add(styles['text']);
    this.#text.textContent = textContent ?? '';

    this.domNode.append(this.#text);

    this.tooltip.owner = this.domNode;
  }

  get textContent() {
    return this.#text.textContent;
  }

  set textContent(textContent) {
    this.#text.textContent = textContent;
  }

  get onClick() {
    return this.domNode.onclick;
  }

  set onClick(onClick) {
    this.domNode.onclick = onClick;
  }

  disable() {
    this.domNode.classList.add(styles['disabled']);
  }

  enable() {
    this.domNode.classList.remove(styles['disabled']);
  }
}
