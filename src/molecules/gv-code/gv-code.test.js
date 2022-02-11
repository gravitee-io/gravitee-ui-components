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
import { Page, querySelector } from '../../../testing/lib/test-utils';
import './gv-code';
import { shapeClipboard } from '../../styles/shapes';
import { GvCode } from '.';

describe('<gv-code>', () => {
  let page;
  const DEFAULT_VALUE = 'FOOBAR';

  beforeEach(() => {
    page = new Page();
    page.create('gv-code', {
      value: DEFAULT_VALUE,
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', async () => {
    expect(window.customElements.get('gv-code')).toBeDefined();
    const component = querySelector('gv-code');
    await component.updateComplete;
    expect(component).toBeDefined();
    expect(component.value).toEqual(DEFAULT_VALUE);
    expect(component.readonly).toEqual(false);
    expect(component.autofocus).toEqual(false);
    expect(component.clipboard).toEqual(false);
    expect(component._clipboardIcon).toEqual(shapeClipboard);
    expect(component._id).toMatch(/^gv-code-[a-z0-9-]{36}$/gm);
  });

  test('should have initialize edit area', () => {
    const component = querySelector('gv-code');
    const editArea = component.shadowRoot.querySelector(`#${component._id}`);
    expect(editArea).toBeDefined();
  });

  test('should update state when update value', async () => {
    const component = querySelector('gv-code');
    expect(component._editorView).toBeDefined();
    expect(component._editorView.state.doc.text[0]).toEqual(DEFAULT_VALUE);
    component.value = '{#';
    await component.updateComplete;
    expect(component._editorView.state.doc.text[0]).toEqual('{#');
  });

  test('should find required languages by type or by content-type', async () => {
    let jsonLang = await GvCode.findLanguage('json');
    expect(jsonLang).toBeDefined();
    expect(jsonLang.name).toEqual('JSON');
    jsonLang = await GvCode.findLanguage('application/json');
    expect(jsonLang).toBeDefined();
    expect(jsonLang.name).toEqual('JSON');

    let xmlLang = await GvCode.findLanguage('xml');
    expect(xmlLang).toBeDefined();
    expect(xmlLang.name).toEqual('XML');
    xmlLang = await GvCode.findLanguage('application/xml');
    expect(xmlLang).toBeDefined();
    expect(xmlLang.name).toEqual('XML');

    let htmlLang = await GvCode.findLanguage('html');
    expect(htmlLang).toBeDefined();
    expect(htmlLang.name).toEqual('HTML');
    htmlLang = await GvCode.findLanguage('text/html');
    expect(htmlLang).toBeDefined();
    expect(htmlLang.name).toEqual('HTML');

    let javascriptLang = await GvCode.findLanguage('javascript');
    expect(javascriptLang).toBeDefined();
    expect(javascriptLang.name).toEqual('JavaScript');
    javascriptLang = await GvCode.findLanguage('application/javascript');
    expect(javascriptLang).toBeDefined();
    expect(javascriptLang.name).toEqual('JavaScript');

    const groovyLang = await GvCode.findLanguage('groovy');
    expect(groovyLang).toBeDefined();
    expect(groovyLang.name).toEqual('Groovy');

    const markdownLang = await GvCode.findLanguage('markdown');
    expect(markdownLang).toBeDefined();
    expect(markdownLang.name).toEqual('Markdown');

    const shellLang = await GvCode.findLanguage('shell');
    expect(shellLang).toBeDefined();
    expect(shellLang.name).toEqual('Shell');

    const asciidocLang = await GvCode.findLanguage('asciidoc');
    expect(asciidocLang).toBeDefined();
    expect(asciidocLang.name).toEqual('asciidoc');
  });
});
