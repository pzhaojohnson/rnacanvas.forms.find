import * as styles from './Field.module.css';

export class Field {
  readonly domNode = document.createElement('label');

  readonly #inputElement;

  readonly #nameAnchor;

  constructor(name: string, inputElement: HTMLInputElement) {
    this.domNode.classList.add(styles['field']);

    this.#inputElement = inputElement;

    this.#nameAnchor = document.createElement('a');
    this.#nameAnchor.textContent = name;

    this.#nameAnchor.target = '_blank';
    this.#nameAnchor.rel = 'noopener noreferrer';

    this.#nameAnchor.style.marginLeft = '8px';

    this.domNode.append(inputElement, this.#nameAnchor);
  }

  get label() {
    let setColor = (color: string) => this.#nameAnchor.style.color = color;

    return {
      setColor,
    };
  }
}
