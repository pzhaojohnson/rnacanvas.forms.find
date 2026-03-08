import { CheckboxField } from './CheckboxField';

import { Checkbox } from './Checkbox';

export class UseSelectedField {
  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor() {
    // unchecked by default
    this.#checkbox.domNode.checked = false;

    this.#field = new CheckboxField('Use selected bases', this.#checkbox.domNode);

    this.domNode.style.marginTop = '4px';
    this.domNode.style.marginLeft = '4px';
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
