import { CheckboxField } from './CheckboxField';

import { Checkbox } from './Checkbox';

export class UseSelectedField {
  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor() {
    // unchecked by default
    this.#checkbox.domNode.checked = false;

    this.#field = new CheckboxField('Use selected bases', this.#checkbox.domNode);

    this.domNode.style.marginTop = '9px';
    this.domNode.style.marginLeft = '9px';
  }

  get domNode() {
    return this.#field.domNode;
  }

  isChecked(): boolean {
    return this.#checkbox.domNode.checked;
  }

  get onChange() {
    return this.#checkbox.domNode.onchange;
  }

  set onChange(onChange) {
    this.#checkbox.domNode.onchange = onChange;
  }
}
