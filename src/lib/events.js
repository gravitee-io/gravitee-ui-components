export function dispatchCustomEvent (node, suffix, detail, options = {}) {
  const eventName = `${node.nodeName.toLocaleLowerCase()}_${suffix}`;
  /* global CustomEvent */
  node.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true, ...options }));
}
