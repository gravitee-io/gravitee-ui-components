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
import { sequence } from './sequence';
import customElements from '../../.docs/custom-elements.json';

export function makeStory(...configs) {
  const {
    name,
    docs,
    css,
    component,
    dom,
    items: rawItems = [{}],
    events = [],
    simulations = [],
    docsOnly = false,
  } = Object.assign({}, ...configs);
  const customElement = customElements.tags.find((tag) => tag.name === component) || {};
  const _events = customElement.events ? [...new Set([...events, ...customElement.events.map((e) => e.name)])] : events;

  const items = typeof rawItems === 'function' ? rawItems() : rawItems;

  const storyFn = (args) => {
    const container = document.createElement('div');
    const shadow = container.attachShadow({ mode: 'open' });

    if (css != null) {
      const styles = document.createElement('style');
      styles.innerHTML = css;
      shadow.appendChild(styles);
    }

    if (dom != null) {
      const wrapper = document.createElement('div');
      shadow.appendChild(wrapper);
      dom(wrapper);
      return container;
    }
    const items = typeof rawItems === 'function' ? rawItems() : rawItems;

    const components = items.map((props) => {
      let element = document.createElement(component);
      element = assignPropsToElement(element, props);
      element = assignArgsToElement(customElement, element, args);
      shadow.appendChild(element);
      return element;
    });

    sequence(async (wait) => {
      for (const { delay, callback } of simulations) {
        await wait(delay);
        callback(components);
      }
    });

    if (customElement.cssProperties) {
      customElement.cssProperties.forEach((cssProperty) => {
        const value = args[cssProperty.name] != null ? args[cssProperty.name] : cssProperty.default.replace(/"/g, '');
        container.style.setProperty(cssProperty.name, value);
      });
    }
    return container;
  };

  const generatedSource = () =>
    items
      .map(({ innerHTML = '', ...props }) => {
        const variables = [];
        const allPropertiesAndAttributes = Object.entries(props)
          .map(([name, value]) => {
            if (value === true) {
              return `${name}`;
            }
            if (typeof value === 'string' || typeof value === 'number') {
              return `${name}=${JSON.stringify(String(value))}`;
            }
            if (typeof value === 'object') {
              variables.push({ name, value });
              const variableName = '${' + name + '}';
              return `.${name}='${variableName}'`;
            }
            return null;
          })
          .filter((a) => a != null);

        const attrsAndProps = allPropertiesAndAttributes.length > 0 ? ' ' + allPropertiesAndAttributes.join(' ') : '';

        const variablesAsJavascript = variables.map(({ name, value }) => {
          return `const ${name} = ${JSON.stringify(value, null, 2)}`;
        });

        return `${variablesAsJavascript.join('\n')}\n<${component}${attrsAndProps}>${innerHTML}</${component}>`;
      })
      .join('\n');

  const domSource = () => {
    const container = document.createElement('div');
    dom(container);
    return container.innerHTML.replace(/<!---->/g, '').trim();
  };

  const mdxSource = dom != null ? domSource() : generatedSource();

  storyFn.docs = docs;
  storyFn.css = css;
  storyFn.component = component;
  storyFn.items = items;
  storyFn.parameters = {
    actions: {
      handles: [..._events],
    },
    docsOnly,
    docs: {
      storyDescription: (docs || '').trim(),
    },
    storySource: {
      source: mdxSource,
    },
  };

  // Disable Chromatic for stories with `skeleton` or `loading` properties or
  // with async process using `simulations` fields. Otherwise there are some
  // false positive changes related to animation etc
  const hasItemWithLoadingAttribute = items.some((item) => item.loading);
  const hasItemWithSkeletonAttribute = items.some((item) => item.skeleton);
  const automaticallyDisableChromatic = simulations.length > 0 || hasItemWithLoadingAttribute || hasItemWithSkeletonAttribute;

  if (automaticallyDisableChromatic === true) {
    storyFn.parameters.chromatic = { disable: automaticallyDisableChromatic };
  }

  const argTypes = {};
  if (customElement.attributes) {
    customElement.attributes.forEach((attr) => {
      let options = [];
      let type = attr.type.toLowerCase();
      if (type.startsWith('enum')) {
        options = type.replace('enum{', '').replace('}', '').split('|');
        type = 'select';
      } else if (type.startsWith('string')) {
        type = 'text';
      } else if (type.startsWith('length') || type.startsWith('number')) {
        type = 'number';
      } else if (type.startsWith('array') || type.startsWith('object')) {
        type = 'object';
      } else if (type.startsWith('boolean')) {
        type = 'boolean';
      } else if (type.startsWith('promise')) {
        type = 'object';
      }
      argTypes[attr.name] = { control: { type }, options };
    });
  }
  if (customElement.cssProperties) {
    customElement.cssProperties.forEach((cssProperty) => {
      const value = cssProperty.default.replace(/"/g, '');
      let type = 'text';
      if (cssProperty.type.toLowerCase() === 'color') {
        type = 'color';
      }
      argTypes[cssProperty.name] = { control: { type, value } };
    });
  }

  storyFn.argTypes = argTypes;
  if (name != null) {
    storyFn.name = name;
  }

  return storyFn;
}

export function storyWait(delay, callback) {
  return { delay, callback };
}

function assignPropsToElement(element, props = {}) {
  Object.entries(props).forEach(([name, value]) => {
    if (name === 'style' || name === 'class') {
      element.setAttribute(name, value);
    }
    if (name === 'children') {
      value().forEach((child) => element.appendChild(child));
    }
    if (name === 'innerHTML') {
      element.innerHTML = value;
    } else if (typeof value === 'function') {
      if (name.startsWith('@')) {
        const eventName = name.substring(1);
        element.addEventListener(eventName, (e) => value(e, element));
      } else {
        element[name] = value;
      }
    } else if (typeof value === 'object') {
      element[name] = value;
    } else {
      element.setAttribute(name, value);
    }
  });
  return element;
}

function assignArgsToElement(customElement, element, args = {}) {
  Object.keys(args)
    .filter((arg) => !arg.startsWith('--gv-'))
    .forEach((arg) => {
      const argType = customElement.attributes.find((t) => t.name === arg);
      const value = args[arg];
      if (argType) {
        const isBoolean = argType.type.toLowerCase().startsWith('boolean');
        if (isBoolean && value === true) {
          element.setAttribute(arg, '');
        } else if (!isBoolean && value != null) {
          element.setAttribute(arg, value);
        } else {
          element.removeAttribute(arg);
        }
      }
    });
  return element;
}
