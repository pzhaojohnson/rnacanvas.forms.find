import * as styles from './CloseButton.module.css';

export class CloseButton {
  readonly domNode = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['close-button']);

    this.domNode.textContent = 'Close';
  }

  get onClick() {
    return this.domNode.onclick;
  }

  set onClick(onClick) {
    this.domNode.onclick = onClick;
  }
}
