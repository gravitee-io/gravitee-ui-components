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
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { Page, querySelector } from '../lib/test-utils';
import '../../src/molecules/gv-code';
import { shapeClipboard } from '../../src/styles/shapes';

describe('<gv-code>', () => {
  let page;
  const DEFAULT_VALUE = 'FOOBAR';

  beforeEach(() => {
    page = new Page();
    page.create('gv-code', {
      value: DEFAULT_VALUE,
      options: {
        lineNumbers: true,
        mode: 'shell',
      },
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-code')).toBeDefined();
    const component = querySelector('gv-code');
    expect(component).toBeDefined();
    expect(component.value).toEqual(DEFAULT_VALUE);
    expect(component.options.lineNumbers).toEqual(true);
    expect(component.options.mode).toEqual('shell');
    expect(component.readonly).toEqual(false);
    expect(component.autofocus).toEqual(false);
    expect(component.clipboard).toEqual(false);
    expect(component._clipboardIcon).toEqual(shapeClipboard);
    expect(component._id).toMatch(/^gv-code-[a-z0-9-]{36}$/gm);
  });

  test('should have initialize textArea', () => {
    const component = querySelector('gv-code');
    const textArea = component.shadowRoot.querySelector(`#${component._id}`);
    expect(textArea).toBeDefined();
    expect(textArea.innerHTML).toEqual(`<!---->${DEFAULT_VALUE}<!---->`);
  });

  test('should convert "json" mode to "javascript" mode for CodeMirror compatibility', () => {
    const component = querySelector('gv-code');
    // default
    expect(component._getProcessedOptions().mode).toEqual('shell');

    // with json
    component.options.mode = 'json';
    expect(component._getProcessedOptions().mode).toEqual({ name: 'javascript', json: true });

    // with application/json
    component.options.mode = 'application/json';
    expect(component._getProcessedOptions().mode).toEqual({ name: 'javascript', json: true });
  });
});
