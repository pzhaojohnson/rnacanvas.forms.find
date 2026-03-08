import type { HitParameters } from './HitParameters';

import type { Nucleobase } from './Nucleobase';

export class Hit {
  readonly #params;

  readonly #parentSequence;

  constructor(params: HitParameters, parentSequence: Nucleobase[]) {
    this.#params = { ...params };

    this.#parentSequence = parentSequence
  }

  [Symbol.iterator]() {
    return this.#parentSequence.slice(this.index, this.index + this.length).values();
  }

  get index() {
    return this.#params.index;
  }

  get position() {
    return this.#params.position;
  }

  get length() {
    return this.#params.length;
  }

  toString(): string {
    return [...this].map(b => b.textContent).join('');
  }
}
