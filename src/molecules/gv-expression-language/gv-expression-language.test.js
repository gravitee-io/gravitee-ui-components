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
import './gv-expression-language';
import { CompletionContext } from '@codemirror/autocomplete';
import grammar from '../../../testing/resources/el-grammar.json';

describe('<gv-expression-language>', () => {
  let page;
  const DEFAULT_VALUE = 'FOOBAR';

  beforeEach(() => {
    page = new Page();
    page.create('gv-expression-language', {
      value: DEFAULT_VALUE,
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should find default handler without EL grammar', async () => {
    const component = querySelector('gv-expression-language');
    component.value = '{#';
    await component.updateComplete;
    const { handler, match } = component.findBestAutocompleteHandler(
      new CompletionContext(component._editorView.state, component.value.length),
    );
    expect(match).toBeTruthy();
    expect(handler).toBeDefined();
    expect(handler.expr).not.toBeDefined();
  });

  test('should find default handler with EL grammar', async () => {
    const component = querySelector('gv-expression-language');
    component.grammar = grammar;
    component.value = 'co';
    await component.updateComplete;
    const { handler, match } = component.findBestAutocompleteHandler(
      new CompletionContext(component._editorView.state, component.value.length),
    );
    expect(match).toBeTruthy();
    expect(handler).toBeDefined();
    expect(handler.expr).not.toBeDefined();
  });

  test('should find handler for {#', async () => {
    const component = querySelector('gv-expression-language');
    component.grammar = grammar;
    component.value = '{#';
    await component.updateComplete;
    const { handler, match } = component.findBestAutocompleteHandler(
      new CompletionContext(component._editorView.state, component.value.length),
    );
    expect(match).toBeTruthy();
    expect(handler).toBeDefined();
    expect(handler.expr).toEqual(component.expressionLanguageCompletionHandlers[0].expr);
  });

  test('should find handler for {#request.', async () => {
    const component = querySelector('gv-expression-language');
    component.grammar = grammar;
    component.value = '{#request.';
    await component.updateComplete;
    const { handler, match } = component.findBestAutocompleteHandler(
      new CompletionContext(component._editorView.state, component.value.length),
    );
    expect(match).toBeTruthy();
    expect(handler).toBeDefined();
    expect(handler.expr).toEqual(component.expressionLanguageCompletionHandlers[1].expr);
  });

  test('should find handler for {#request.headers.', async () => {
    const component = querySelector('gv-expression-language');
    component.grammar = grammar;
    component.value = '{#request.headers.';
    await component.updateComplete;
    const { handler, match } = component.findBestAutocompleteHandler(
      new CompletionContext(component._editorView.state, component.value.length),
    );
    expect(match).toBeTruthy();
    expect(handler).toBeDefined();
    expect(handler.expr).toEqual(component.expressionLanguageCompletionHandlers[2].expr);
  });
});
