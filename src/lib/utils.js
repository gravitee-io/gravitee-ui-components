/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export function truncate(text, limit = 250, suffix = '...') {
  return text && text.length > limit ? `${text.substring(0, limit)}${suffix}` : text;
}

export function isSameRoutes(routes, futureRoutes) {
  if (routes && futureRoutes) {
    return JSON.stringify(routes.map((r) => r.path + r.active)) === JSON.stringify(futureRoutes.map((r) => r.path + r.active));
  }
  return false;
}

export function appendDraggableImage(src, size = 100, defaultIcon = 'communication:shield-thunder') {
  // Usefull when image src is svg
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.left = '-999px';
  div.style.top = '-999px';
  div.style.zIndex = 1000;
  if (src != null) {
    const image = new Image();
    image.src = src;
    image.style = `width:${size}px;height:${size}px`;
    div.appendChild(image);
  } else {
    const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const useElem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', defaultIcon);
    svgElem.appendChild(useElem);
    div.appendChild(svgElem);
  }
  document.body.appendChild(div);
  return div;
}

export function flatDeep(arr) {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), []);
}

export function flatObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (Array.isArray(obj[k])) acc[pre + k] = obj[k];
    else if (typeof obj[k] === 'object') Object.assign(acc, flatObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
}

export function deepClone(obj) {
  if (obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  return obj;
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function deepEqual(a, b, withoutOrder = false) {
  if (Array.isArray(a) && Array.isArray(b) && withoutOrder) {
    if (a.length !== b.length) return false;
    const uniqueValues = new Set([...a, ...b]);
    for (const v of uniqueValues) {
      const aCount = a.filter((e) => e === v).length;
      const bCount = b.filter((e) => e === v).length;
      if (aCount !== bCount) return false;
    }
    return true;
  }

  const keys1 = a != null ? Object.keys(a) : [];
  const keys2 = b != null ? Object.keys(b) : [];

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = a[key];
    const val2 = b[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }
  return true;
}

export function isObject(object) {
  return object != null && typeof object === 'object';
}
