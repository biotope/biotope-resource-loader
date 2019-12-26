const registerPlugin = (plugin: FunctionConstructor, pluginName: string): void => {
  window['biotope'] = window['biotope'] || {};
  window['biotope']['plugins'] = window['biotope']['plugins'] || {};

  window['biotope']['plugins'][pluginName] = (element, options) => {
    (() => {
      new plugin(element, options);
    })();
  };
}

export default registerPlugin;
