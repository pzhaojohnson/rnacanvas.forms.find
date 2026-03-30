import type { Nucleobase } from './Nucleobase';

import type { LiveCollection } from './LiveCollection';

import type { SearchHighlighting } from './SearchHighlighting';

import type { Point } from './Point';

/**
 * The app interface used by the Find form.
 */
export interface App {
  readonly drawing: {
    readonly domNode: SVGSVGElement;

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
    /**
     * Can be set to set the center point of the user's view of the drawing.
     */
    centerPoint: Point;
  }
}
