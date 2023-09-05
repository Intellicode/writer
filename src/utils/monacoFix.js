const OriginalResizeObserver = window.ResizeObserver;

window.ResizeObserver = function (callback) {
  const wrappedCallback = (entries, observer) => {
    window.requestAnimationFrame(() => {
      callback(entries, observer);
    });
  };

  // Create an instance of the original ResizeObserver
  // with the wrapped callback
  return new OriginalResizeObserver(wrappedCallback);
};

// Copy over static methods, if any
for (const staticMethod in OriginalResizeObserver) {
  // eslint-disable-next-line no-prototype-builtins
  if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
    window.ResizeObserver[staticMethod] = OriginalResizeObserver[staticMethod];
  }
}
