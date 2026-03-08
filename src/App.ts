import type { Nucleobase } from './Nucleobase';

import type { LiveCollection } from './LiveCollection';

import type { SearchHighlighting } from './SearchHighlighting';

import type { Box } from '@rnacanvas/boxes';

/**
 * The app interface used by the Find form.
 */
export interface App {
  readonly drawing: {
    readonly bases: Iterable<Nucleobase>;
  }

  readonly selectedBases: LiveCollection<Nucleobase>;

  /**
   * Adds search highlighting for the specified elements.
   */
  addSearchHighlighting(bases: Iterable<Nucleobase>): SearchHighlighting;

  /**
   * Deselects any elements that were previously selected.
   */
  select(bases: Iterable<Nucleobase>): void;

  addToSelected(bases: Iterable<Nucleobase>): void;

  /**
   * Deselect any selected elements.
   */
  deselect(): void;

  /**
   * The user's view of the drawing.
   */
  readonly view: {
    fitTo(box: Box): void;
  }
}
