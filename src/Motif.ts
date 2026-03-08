import type { Nucleobase } from './Nucleobase';

import type { LiveCollection } from './LiveCollection';

import { min, max } from '@rnacanvas/math';

import { isNumber } from '@rnacanvas/value-check';

export class Motif {
  #definition;

  constructor(...definition: MotifDefinition) {
    this.#definition = definition;
  }

  toString(): string {
    if (typeof this.#definition[0] == 'string') {
      return this.#definition[0];
    }

    let selectedBases = [...this.#definition[0]];

    let selectedBasesSet = new Set(selectedBases);

    if (!this.#definition[1]) {
      return selectedBases.map(b => b.textContent).join('');
    }

    let parentSequence = [...this.#definition[1]];

    let allIndices = new Map<Nucleobase, number>();

    parentSequence.forEach((b, i) => allIndices.set(b, i));

    let selectedIndices = selectedBases.map(b => allIndices.get(b));

    // if not every selected base is in the parent sequence
    if (!selectedIndices.every(isNumber)) {
      throw new Error('Not all selected bases are present in the parent sequence.');
    }

    let minIndex = min(selectedIndices);
    let maxIndex = max(selectedIndices);

    // return N's in place of intervening bases that are not selected
    return parentSequence
      .slice(minIndex, maxIndex + 1)
      .map(b => selectedBasesSet.has(b) ? b.textContent : 'N')
      .join('');
  }
}

type MotifDefinition = (
  [string]
  | [Iterable<Nucleobase>]
  | [SelectedBases, ParentSequence]
);

type SelectedBases = LiveCollection<Nucleobase>;

type ParentSequence = Iterable<Nucleobase>;
