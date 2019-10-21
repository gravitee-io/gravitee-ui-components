function getPropertyValue (element, propertyName) {
  /* global getComputedStyle */
  return getComputedStyle(element).getPropertyValue(propertyName);
}

export function getCssVar (element, variableName) {
  if (variableName.startsWith('--')) {
    return getPropertyValue(element, variableName);
  }
  return getPropertyValue(element, `--${variableName}`);
}
