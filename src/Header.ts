import * as styles from './Header.module.css';

export class Header {
  readonly domNode = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['header']);

    this.domNode.textContent = 'Find';
  }
}
