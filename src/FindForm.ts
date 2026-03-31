import type { App } from './App';

import { motifSearch, complementsSearch } from '@rnacanvas/search';

import { Motif } from './Motif';

import { Hit } from './Hit';

import * as styles from './FindForm.module.css';

import { Header } from './Header';

import { MotifField } from './MotifField';

import { UseSelectedField } from './UseSelectedField';

import { SectionToggle } from './SectionToggle';

import { CutoffField } from './CutoffField';

import { FindComplementsField } from './FindComplementsField';

import { MismatchPenaltyField } from './MismatchPenaltyField';

import { GapPenaltyField } from './GapPenaltyField';

import { WobblePenaltyField } from './WobblePenaltyField';

import { HitsList } from './HitsList';

import { CloseButton } from './CloseButton';

import { DragTranslater as DragHandler } from '@rnacanvas/forms';

export class FindForm {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #header = new Header();

  readonly #contentContainer = document.createElement('div');

  readonly #motifField = new MotifField();

  readonly #useSelectedField = new UseSelectedField();

  readonly #findComplementsField = new FindComplementsField();

  readonly #optionFieldsToggle = new SectionToggle('Options', () => {
    if (this.#optionFieldsContainer.style.display == 'none') {
      this.#optionFieldsContainer.style.display = '';
      this.#optionFieldsToggle.caret.pointDown();
    } else {
      this.#optionFieldsContainer.style.display = 'none';
      this.#optionFieldsToggle.caret.pointRight();
    }
  });

  readonly #optionFieldsContainer = document.createElement('div');

  readonly #cutoffField = new CutoffField();
  readonly #mismatchPenaltyField = new MismatchPenaltyField();
  readonly #gapPenaltyField = new GapPenaltyField();
  readonly #wobblePenaltyField = new WobblePenaltyField();

  readonly #hitsList;

  /**
   * Refresh the find form whenever:
   *   - The text contents of bases change.
   *   - Bases are added or removed from the drawing.
   *   - The ordering of bases changes.
   *
   * Changes to the ordering of bases are detected through the addition or removal of primary bonds from the drawing.
   */
  readonly #drawingObserver = new MutationObserver(() => {
    this.#isOpen() ? this.refresh() : {};
  });

  readonly #closeButton = new CloseButton();

  readonly #dragHandler;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['find-form']);

    this.domNode.append(this.#header.domNode);

    this.#contentContainer.classList.add(styles['content-container']);

    this.domNode.append(this.#contentContainer);

    this.#contentContainer.append(this.#motifField.domNode);

    this.#motifField.onChange = () => this.#refreshHits();

    this.#contentContainer.append(this.#useSelectedField.domNode);

    // show the selected motif in the motif field when checked
    this.#useSelectedField.onChange = () => {
      if (this.#useSelectedField.isChecked()) {
        this.#motifField.value = this.#selectedMotif;
      }
    };

    targetApp.selectedBases.addEventListener('change', () => {
      if (this.#isOpen() && this.#useSelectedField.isChecked()) {
        this.#motifField.value = this.#selectedMotif;
      }
    });

    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, characterData: true, subtree: true });

    this.#contentContainer.append(this.#findComplementsField.domNode);

    this.#optionFieldsToggle.domNode.style.marginTop = '33px';

    this.#contentContainer.append(this.#optionFieldsToggle.domNode);

    // option fields are shown by default
    this.#optionFieldsToggle.caret.pointDown();

    [
      this.#cutoffField,
      this.#mismatchPenaltyField,
      this.#gapPenaltyField,
      this.#wobblePenaltyField,
    ].forEach(field => {
      field.onSubmit = () => this.#refreshHits();
    });

    this.#optionFieldsContainer.style.margin = '8px 0px 0px 8px';

    this.#optionFieldsContainer.append(
      this.#cutoffField.domNode,
      this.#mismatchPenaltyField.domNode,
      this.#gapPenaltyField.domNode,
      this.#wobblePenaltyField.domNode,
    );

    this.#contentContainer.append(this.#optionFieldsContainer);

    this.#findComplementsField.onChange = () => {
      if (this.#findComplementsField.isChecked()) {
        this.#wobblePenaltyField.unhide();
      } else {
        this.#wobblePenaltyField.hide();
      }

      this.#refreshHits();
    };

    this.#hitsList = new HitsList(targetApp);

    this.#contentContainer.append(this.#hitsList.domNode);

    this.#closeButton.onClick = () => this.close();

    // add last to place on top of everything else
    this.domNode.append(this.#closeButton.domNode);

    // make form draggable
    this.#dragHandler = new DragHandler(this.domNode);
  }

  #isOpen(): boolean {
    return document.body.contains(this.domNode);
  }

  #isClosed(): boolean {
    return !this.#isOpen();
  }

  /**
   * The motif formed by the selected bases.
   */
  get #selectedMotif() {
    let selectedBases = this.#targetApp.selectedBases;

    let parentSequence = this.#targetApp.drawing.bases;

    return (new Motif(selectedBases, parentSequence)).toString();
  }

  refresh(): void {
    let currentMotif = this.#motifField.value;

    // trigger change callbacks to be called
    this.#motifField.value = '';

    // trigger hits list (and/or selected motif) to be refreshed
    if (this.#useSelectedField.isChecked()) {
      this.#motifField.value = this.#selectedMotif;
    } else {
      this.#motifField.value = currentMotif;
    }
  }

  #refreshHits() {
    let motif = this.#motifField.value;

    let parentSequence = [...this.#targetApp.drawing.bases].map(b => ({
      domNode: b.domNode,
      textContent: b.textContent ?? '',
    }));

    let options = {
      cutoff: this.#cutoffField.value,
      mismatchPenalty: this.#mismatchPenaltyField.value,
      gapPenalty: this.#gapPenaltyField.value,
      wobblePenalty: this.#wobblePenaltyField.value,
    };

    let hits;

    if (this.#findComplementsField.isChecked()) {
      hits = [...complementsSearch(motif, parentSequence, options)];
    } else {
      hits = [...motifSearch(motif, parentSequence, options)];
    }

    this.#hitsList.hits = hits.map(hit => new Hit(hit, parentSequence));
  }

  /**
   * Removes the form from the document body.
   */
  close(): void {
    this.domNode.remove();
  }
}
