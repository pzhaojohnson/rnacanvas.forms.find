import * as styles from './TextInput.module.css';

export class TextInput {
  readonly domNode = document.createElement('input');

  /**
   * Called on blur and Enter key press.
   */
  onSubmit?: () => void;

  constructor() {
    this.domNode.type = 'text';

    this.domNode.classList.add(styles['text-input']);

    this.domNode.addEventListener('blur', () => this.#submit());

    this.domNode.addEventListener('keydown', event => {
      if (event.key.toLowerCase() == 'enter') {
        this.domNode.blur();
      }
    });
  }

  get onChange() {
    return this.domNode.onchange;
  }

  set onChange(onChange) {
    this.domNode.onchange = onChange;
  }

  #submit(): void {
    if (this.onSubmit) {
      this.onSubmit();
    }
  }

  disable(): void {
    this.domNode.classList.add(styles['disabled']);

    this.domNode.blur();
    this.domNode.tabIndex = -1;
  }

  enable(): void {
    this.domNode.classList.remove(styles['disabled']);

    this.domNode.tabIndex = 0;
  }
}
