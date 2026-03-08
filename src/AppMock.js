export class AppMock {
  drawing = {
    bases: [],
  };

  selectedBases = {
    [Symbol.iterator]() {
      return [].values();
    },

    addEventListener() {},
  };

  addSearchHighlighting() {}

  select() {}

  addToSelected() {}

  deselect() {}

  view = {
    fitTo() {},
  };
}
