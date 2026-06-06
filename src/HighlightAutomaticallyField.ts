import { CheckboxField } from './CheckboxField';

import { Checkbox } from './Checkbox';

export class HighlightAutomaticallyField {
  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor() {
    // unchecked by default
    this.#checkbox.uncheck();

    this.#field = new CheckboxField('Highlight automatically', this.#checkbox.domNode);

    this.domNode.style.marginTop = '9px';

    this.domNode.style.alignSelf = 'start';
  }

  get domNode() {
    return this.#field.domNode;
  }

  isChecked() {
    return this.#checkbox.isChecked();
  }

  get onChange() {
    return this.#checkbox.domNode.onchange;
  }

  set onChange(onChange) {
    this.#checkbox.domNode.onchange = onChange;
  }
}
