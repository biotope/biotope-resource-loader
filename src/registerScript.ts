const registerScript = (plugin: FunctionConstructor, pluginName: string): void => {
  window['biotope'] = window['biotope'] || {};
  window['biotope']['scripts'] = window['biotope']['scripts'] || {};

  window['biotope']['scripts'][pluginName] = (element, options) => {
    (() => {
      new plugin(element, options);
    })();
  };
}

export default registerScript;
