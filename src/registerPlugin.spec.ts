import registerPLugin from './registerPlugin';

describe('#registerPlugin', () => {
  class TestPlugin {
    public element;
    public options;

    constructor(element: HTMLElement, options: Object) {
      this.element = element;
      this.options = { ...options };
    }
  }

  registerPLugin((TestPlugin as any), 'TestPlugin');

  test('Creates biotope on window', () => {
    expect(window).toHaveProperty('biotope')
  });

  test('Creates plugins object on biotope', () => {
    expect((window as any).biotope).toHaveProperty('plugins')
  });

  test('Creates plugin on window.biotope.plugins', () => {
    expect((window as any).biotope.plugins.TestPlugin).toBeInstanceOf(Function);
  });
})
