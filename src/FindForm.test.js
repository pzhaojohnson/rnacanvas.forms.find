/**
 * @jest-environment jsdom
 */

import { FindForm } from './FindForm';

import { AppMock } from './AppMock';

beforeAll(() => {
  global.MutationObserver = class {
    constructor() {}
    observe() {}
    disconnect() {}
  }
});

describe('`class FindForm`', () => {
  test('`constructor()`', () => {
    var targetApp = new AppMock();

    var findForm = new FindForm(targetApp);

    // renders
    document.body.append(findForm.domNode);
  });
});
