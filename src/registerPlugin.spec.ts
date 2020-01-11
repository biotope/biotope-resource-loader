import registerScript from './registerScript';

describe('#registerScript', () => {
  class TestPlugin {
    public element;
    public options;

    constructor(element: HTMLElement, options: Object) {
      this.element = element;
      this.options = { ...options };
    }
  }

  registerScript((TestPlugin as any), 'TestPlugin');

  test('Creates biotope on window', () => {
    expect(window).toHaveProperty('biotope')
  });

  test('Creates plugins object on biotope', () => {
    expect((window as any).biotope).toHaveProperty('scripts')
  });

  test('Creates plugin on window.biotope.scripts', () => {
    expect((window as any).biotope.scripts.TestPlugin).toBeInstanceOf(Function);
  });
})
