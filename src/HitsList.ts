import type { App } from './App';

import type { Hit } from './Hit';

import type { SearchHighlighting } from './SearchHighlighting';

import { next } from './next';

import { previous } from './previous';

import { first, last } from '@rnacanvas/utilities';

import { Box } from '@rnacanvas/boxes';

import { max } from '@rnacanvas/math';

import * as styles from './HitsList.module.css';

import { HitRow } from './HitRow';

import { TextButton } from './TextButton';

import { Tooltip } from '@rnacanvas/tooltips';

export class HitsList {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #header = new Header();

  readonly #rowsContainer = document.createElement('div');

  #hits: Hit[] = [];

  #highlightedHit?: Hit;

  #searchHighlighting?: SearchHighlighting;

  #rows: HitRow[] = [];

  readonly #formRemovalObserver;

  #wasOpen = false;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['hits-list']);

    this.domNode.append(this.#header.domNode);

    this.#header.buttons['Select All'].onClick = () => this.#selectAll();

    this.#header.buttons['Add All to Selected'].onClick = () => this.#addAllToSelected();

    this.#header.buttons['Next'].onClick = () => this.#next();
    this.#header.buttons['Previous'].onClick = () => this.#previous();

    this.domNode.append(this.#rowsContainer);

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
    return this.#hits;
  }

  set hits(hits) {
    this.#hits = hits;

    // remove any prior search highlighting
    this.#searchHighlighting?.remove();

    this.#highlightedHit = undefined;

    this.refresh();
  }

  refresh(): void {
    this.#header.numHitsP.setNum(this.#hits.length);

    this.#hits.length == 0 ? this.#header.collapse() : this.#header.expand();

    // remove all prior rows
    this.#rows = [];
    this.#rowsContainer.innerHTML = '';

    this.#rows = this.#hits.map(hit => {
      let row = new HitRow(hit);

      row.onClick = () => this.#highlight(hit);

      row.buttons['Select'].onClick = () => this.#select(hit);

      row.buttons['Add to Selected'].onClick = () => this.#addToSelected(hit);

      return row;
    });

    this.#rowsContainer.append(...this.#rows.map(row => row.domNode));
  }

  #highlight(hit: Hit) {
    // remove any prior search highlighting
    this.#searchHighlighting?.remove();

    this.#searchHighlighting = this.#targetApp.addSearchHighlighting(hit);

    this.#highlightedHit = hit;

    let bbox = Box.bounding([...hit].map(b => b.domNode.getBBox()));

    this.#targetApp.view.fitTo(bbox.padded(max([bbox.width, bbox.height]) / 2));

    // dehighlight any previously highlighted rows
    this.#rows.forEach(row => row.dehighlight());

    // highlight the row with the hit
    this.#rows.find(row => row.hit === hit)?.highlight();
  }

  #select(hit: Hit) {
    this.#targetApp.select(hit);
  }

  #addToSelected(hit: Hit) {
    this.#targetApp.addToSelected(hit);
  }

  #selectAll() {
    this.#targetApp.deselect();

    this.#hits.forEach(hit => this.#targetApp.addToSelected(hit));
  }

  #addAllToSelected() {
    this.#hits.forEach(hit => this.#targetApp.addToSelected(hit));
  }

  #next() {
    if (this.#hits.length == 0) {
      // nothing to do
      return;
    }

    if (!this.#highlightedHit) {
      this.#highlight(first(this.#hits));
    } else {
      this.#highlight(next(this.#highlightedHit, this.#hits));
    }
  }

  #previous() {
    if (this.#hits.length == 0) {
      // nothing to do
      return;
    }

    if (!this.#highlightedHit) {
      this.#highlight(last(this.#hits));
    } else {
      this.#highlight(previous(this.#highlightedHit, this.#hits));
    }

  }

  /**
   * Handle closing of the Find form.
   */
  #handleClose() {
    // hide any search highlighting currently being shown
    this.#searchHighlighting?.remove();

    this.#wasOpen = false;
  }

  /**
   * Handle opening of the Find form.
   */
  #handleOpen() {
    if (this.#highlightedHit) {
      // remove any prior search highlighting
      this.#searchHighlighting?.remove();

      this.#searchHighlighting = this.#targetApp.addSearchHighlighting(this.#highlightedHit);
    }

    this.#wasOpen = true;
  }
}

class Header {
  readonly domNode = document.createElement('div');

  /**
   * Shows the number of hits.
   */
  readonly numHitsP = new NumHitsP();

  readonly #buttonsContainer = document.createElement('div');

  readonly buttons = {
    'Select All': new SelectAllButton(),
    'Add All to Selected': new AddAllToSelectedButton(),
    'Next': new NextButton(),
    'Previous': new PreviousButton(),
  };

  constructor() {
    this.domNode.classList.add(styles['header']);

    this.domNode.append(this.numHitsP.domNode);

    this.#buttonsContainer.classList.add(styles['header-buttons-container']);

    this.domNode.append(this.#buttonsContainer);

    this.#buttonsContainer.append(
      this.buttons['Select All'].domNode,
      this.buttons['Add All to Selected'].domNode,
      this.buttons['Next'].domNode,
      this.buttons['Previous'].domNode,
    );
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

  readonly #tooltip = new Tooltip('Next.');

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

  readonly #tooltip = new Tooltip('Previous.');

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
