import type { App } from './App';

import type { Hit } from './Hit';

import type { SearchHighlighting } from './SearchHighlighting';

import { next } from './next';

import { previous } from './previous';

import { first, last } from '@rnacanvas/utilities';

import { Box } from '@rnacanvas/boxes';

import * as styles from './HitsList.module.css';

import { HighlightAutomaticallyField } from './HighlightAutomaticallyField';

import { HitRow } from './HitRow';

import { TextButton } from './TextButton';

import { Tooltip } from '@rnacanvas/tooltips';

export class HitsList {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #highlightAutomaticallyField = new HighlightAutomaticallyField();

  readonly #header = new Header();

  readonly #rowsContainer;

  #searchHighlightings = new Map<Hit, SearchHighlighting>();

  #focusedHit?: Hit;

  readonly #formRemovalObserver;

  #wasOpen = false;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['hits-list']);

    this.domNode.append(this.#highlightAutomaticallyField.domNode);

    this.domNode.append(this.#header.domNode);

    this.#header.buttons['Select All'].onClick = () => this.#selectAll();

    this.#header.buttons['Add All to Selected'].onClick = () => this.#addAllToSelected();

    this.#header.buttons['Next'].onClick = () => this.#next();
    this.#header.buttons['Previous'].onClick = () => this.#previous();

    this.#rowsContainer = new RowsContainer(targetApp);

    this.domNode.append(this.#rowsContainer.domNode);

    // for when the Find form is opened or closed
    this.#formRemovalObserver = new MutationObserver(() => {
      if (!document.body.contains(this.domNode) && this.#wasOpen) {
        this.#handleClose();
      }

      if (document.body.contains(this.domNode) && !this.#wasOpen) {
        this.#handleOpen();
      }
    });

    this.#formRemovalObserver.observe(document.body, { childList: true, subtree: true });
  }

  get hits() {
    return this.#rowsContainer.hits;
  }

  set hits(hits) {
    // changing the hits list will recreate rows
    // (only recreate rows when the hits list changes to avoid unnecessary scrollbar movement)
    this.#rowsContainer.hits = hits;

    this.#rowsContainer.rows.forEach(row => {
      row.domNode.addEventListener('click', () => this.#isFocused(row.hit) ? this.#blur() : this.#focus(row.hit));
    });

    this.#focusedHit = undefined;

    this.refresh();
  }

  #isFocused(hit: Hit): boolean {
    return hit == this.#focusedHit;
  }

  #focus(hit: Hit): void {
    this.#focusedHit = hit;

    this.refresh();

    let bbox = Box.bounding([...hit].map(b => b.domNode.getBBox()));

    // center the user's view on the hit-to-focus
    this.#targetApp.view.centerPoint = { x: bbox.centerX, y: bbox.centerY };
  }

  /**
   * Unfocus the currently focused hit.
   */
  #blur() {
    this.#focusedHit = undefined;

    this.refresh();
  }

  #selectAll() {
    // cache hits before deselecting (since the hits list might change after changing the current selection)
    let hits = [...this.hits];

    this.#targetApp.deselect();

    hits.forEach(hit => this.#targetApp.addToSelected(hit));
  }

  #addAllToSelected() {
    // use spread operator (since the hits list might change as hits are added to the current selection if the Use-selected field is checked)
    [...this.hits].forEach(hit => this.#targetApp.addToSelected(hit));
  }

  #next() {
    if (this.hits.length == 0) {
      // nothing to do
      return;
    }

    if (!this.#focusedHit) {
      this.#focus(first(this.hits));
    } else {
      this.#focus(next(this.#focusedHit, this.hits));
    }
  }

  #previous() {
    if (this.hits.length == 0) {
      // nothing to do
      return;
    }

    if (!this.#focusedHit) {
      this.#focus(last(this.hits));
    } else {
      this.#focus(previous(this.#focusedHit, this.hits));
    }
  }

  /**
   * Handle closing of the Find form.
   */
  #handleClose() {
    // hide any search highlightings currently being shown
    this.#dehighlightAll();

    this.#wasOpen = false;
  }

  /**
   * Handle opening of the Find form.
   */
  #handleOpen() {
    this.refresh();

    this.#wasOpen = true;
  }

  refresh(): void {
    this.#header.numHitsP.setNum(this.hits.length);

    // highlight the row for the focused hit (if present) and dehighlight all other rows
    this.#rowsContainer.rows.forEach(row => {
      this.#isFocused(row.hit) ? row.highlight() : row.dehighlight();
    });

    let hits = new Set(this.hits);

    // remove any lingering search highlightings
    // (use spread operator to avoid iterating over the highlightings map while modifying it)
    [...this.#searchHighlightings]
      .filter(([hit, _]) => !hits.has(hit))
      .forEach(([hit, _]) => this.#dehighlight(hit));

    // make sure every hit is highlighted (if the Highlight-automatically field is checked)
    if (this.#highlightAutomaticallyField.isChecked()) {
      this.hits.forEach(hit => !this.#isHighlighted(hit) ? this.#highlight(hit) : {});
    }

    // just highlight the focused hit (if the Highlight-automatically field is not checked)
    if (!this.#highlightAutomaticallyField.isChecked()) {
      if (this.#focusedHit) {
        !this.#isHighlighted(this.#focusedHit) ? this.#highlight(this.#focusedHit) : {};
      }
    }
  }

  #isHighlighted(hit: Hit): boolean {
    return this.#searchHighlightings.has(hit);
  }

  #highlight(hit: Hit) {
    // don't add duplicate highlightings
    if (this.#isHighlighted(hit)) {
      return;
    }

    let searchHighlighting = this.#targetApp.addSearchHighlighting(hit);

    this.#searchHighlightings.set(hit, searchHighlighting);
  }

  #dehighlight(hit: Hit) {
    this.#searchHighlightings.get(hit)?.remove();

    this.#searchHighlightings.delete(hit);
  }

  /**
   * Removes all search highlightings.
   */
  #dehighlightAll() {
    // use spread operator to avoid modifying the highlightings map while iterating over it
    [...this.#searchHighlightings].forEach(([hit, _]) => this.#dehighlight(hit));
  }
}

class Header {
  readonly domNode = document.createElement('div');

  /**
   * Shows the number of hits.
   */
  readonly #numHitsP = new NumHitsP();

  readonly #buttonsContainer = document.createElement('div');

  readonly buttons = {
    'Select All': new SelectAllButton(),
    'Add All to Selected': new AddAllToSelectedButton(),
    'Next': new NextButton(),
    'Previous': new PreviousButton(),
  };

  constructor() {
    this.domNode.classList.add(styles['header']);

    this.domNode.append(this.#numHitsP.domNode);

    this.#buttonsContainer.classList.add(styles['header-buttons-container']);

    this.domNode.append(this.#buttonsContainer);

    this.#buttonsContainer.append(
      this.buttons['Select All'].domNode,
      this.buttons['Add All to Selected'].domNode,
      this.buttons['Next'].domNode,
      this.buttons['Previous'].domNode,
    );
  }

  get numHitsP() {
    return {
      setNum: (num: number) => {
        this.#numHitsP.setNum(num);

        num == 0 ? this.collapse() : this.expand();
      },
    };
  }

  isCollapsed(): boolean {
    return this.#buttonsContainer.style.visibility == 'collapse';
  }

  collapse(): void {
    this.#buttonsContainer.style.visibility = 'collapse';
  }

  expand(): void {
    this.#buttonsContainer.style.visibility = 'visible';
  }
}

class NumHitsP {
  readonly domNode = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['num-hits-p']);

    // show zero by default
    this.setNum(0);
  }

  setNum(num: number): void {
    this.domNode.textContent = `${num}` + (
      num == 0 ? (
        ' hits.'
      ) : num == 1 ? (
        ' hit:'
      ) : (
        ' hits:'
      )
    );
  }
}

class SelectAllButton {
  readonly #button = new TextButton('Select All');

  constructor() {
    this.#button.tooltip.textContent = 'Select all hits.';

    this.domNode.style.marginRight = '9px';
  }

  get domNode() {
    return this.#button.domNode;
  }

  get onClick() {
    return this.#button.domNode.onclick;
  }

  set onClick(onClick) {
    this.#button.domNode.onclick = onClick;
  }
}

class AddAllToSelectedButton {
  readonly #button = new TextButton('⇧');

  constructor() {
    this.#button.tooltip.textContent = 'Add all hits to selected.';

    this.domNode.style.marginRight = '8px';
  }

  get domNode() {
    return this.#button.domNode;
  }

  get onClick() {
    return this.#button.domNode.onclick;
  }

  set onClick(onClick) {
    this.#button.domNode.onclick = onClick;
  }
}

class NextButton {
  readonly domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  readonly #tooltip = new Tooltip('Next hit.');

  constructor() {
    this.domNode.setAttribute('viewBox', '0 0 6 10');

    this.domNode.setAttribute('width', '6');
    this.domNode.setAttribute('height', '10');

    this.domNode.innerHTML = `
      <path
        d="M 1 1 L 5 5 L 1 9"
        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        fill="none"
      ></path>
    `;

    this.domNode.classList.add(styles['next-button']);

    this.#tooltip.owner = this.domNode;
  }

  get onClick() {
    return this.domNode.onclick;
  }

  set onClick(onClick) {
    this.domNode.onclick = onClick;
  }
}

class PreviousButton {
  readonly domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  readonly #tooltip = new Tooltip('Previous hit.');

  constructor() {
    this.domNode.setAttribute('viewBox', '0 0 6 10');

    this.domNode.setAttribute('width', '6');
    this.domNode.setAttribute('height', '10');

    this.domNode.innerHTML = `
      <path
        d="M 1 1 L 5 5 L 1 9"
        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        fill="none"
      ></path>
    `;

    this.domNode.classList.add(styles['previous-button']);

    this.#tooltip.owner = this.domNode;
  }

  get onClick() {
    return this.domNode.onclick;
  }

  set onClick(onClick) {
    this.domNode.onclick = onClick;
  }
}

class RowsContainer {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  #hits: Hit[] = [];

  rows: HitRow[] = [];

  constructor(targetApp: App) {
    this.#targetApp = targetApp;
  }

  get hits() {
    return this.#hits;
  }

  set hits(hits) {
    this.#hits = hits;

    // remove all prior rows
    this.rows = [];
    this.domNode.innerHTML = '';

    // recreate rows when the hits list changes
    this.rows = this.#hits.map(hit => {
      let row = new HitRow(hit);

      row.buttons['Select'].onClick = () => this.#targetApp.select(hit);

      row.buttons['Add to Selected'].onClick = () => this.#targetApp.addToSelected(hit);

      return row;
    });

    this.domNode.append(...this.rows.map(row => row.domNode));
  }
}
