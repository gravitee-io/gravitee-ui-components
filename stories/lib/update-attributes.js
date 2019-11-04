export function updateBooleanAttributes (nodeList, attribute, value) {
  if (value) {
    nodeList.forEach((e) => e.setAttribute(attribute, ''));
  }
  else {
    nodeList.forEach((e) => e.removeAttribute(attribute));
  }
}

export function updateTextAttributes (nodeList, attribute, value) {
  nodeList.forEach((e) => e.setAttribute(attribute, value));
}
