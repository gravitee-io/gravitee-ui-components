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
import '../../src/molecules/gv-expression-language';
import grammar from '../resources/el-grammar.json';

describe('<gv-expression-language>', () => {
  let page;
  let component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-expression-language', { grammar, rows: 1 });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-expression-language')).toBeDefined();
    expect(querySelector('gv-expression-language')).toBeDefined();
  });

  test('should get current EL with caret position', () => {
    expect(component.getCurrentEl(0)).toBeNull();

    component.value = `{ request }`;
    expect(component.getCurrentEl(5)).toBeNull();

    component.value = `{ #request }`;
    expect(component.getCurrentEl(5)).toEqual({ caretPosition: 5, el: '{ #request }', end: 12, start: 0 });

    component.value = `{#request}`;
    expect(component.getCurrentEl(5)).toEqual({ caretPosition: 5, el: '{#request}', end: 10, start: 0 });

    component.value = ` {#request} {#response.headers}`;
    expect(component.getCurrentEl(0)).toBeNull();

    component.value = ` {#request} {#response.headers}`;
    expect(component.getCurrentEl(2)).toEqual({ caretPosition: 2, el: '{#request}', end: 11, start: 1 });

    component.value = ` {#request} {#response.headers}`;
    expect(component.getCurrentEl(11)).toBeNull();

    component.value = ` {#request} {#response.headers}`;
    expect(component.getCurrentEl(12)).toBeNull();

    component.value = ` {#request} {#response.headers[#headers['application/json']] == ''} `;
    expect(component.getCurrentEl(13)).toEqual({
      caretPosition: 13,
      el: `{#response.headers[#headers['application/json']] == ''}`,
      end: 67,
      start: 12,
    });

    component.value = `{#response.headers.getFirst('')}`;
    expect(component.getCurrentEl(28)).toEqual({
      caretPosition: 28,
      el: `{#response.headers.getFirst('')}`,
      end: 32,
      start: 0,
    });

    component.value = `println 'Hello'                                 

     int power(int n) { 2**n }                       
     {#request} {#response.headers[#headers['application/json']] == ''} 
     println "2^6==power(6)"`;

    expect(component.getCurrentEl(28, 3)).toEqual({
      caretPosition: 28,
      el: `{#response.headers[#headers['application/json']] == ''}`,
      end: 71,
      start: 16,
    });
  });

  test('should analyse EL with caret position', () => {
    expect(component.analyse({ caretPosition: 0, el: '{#request}', end: 11, start: 1 })).toEqual({
      key: null,
      sentence: '',
      words: [
        {
          fn: false,
          term: '',
        },
      ],
    });
    expect(component.analyse({ caretPosition: 1, el: '{#request}', end: 11, start: 1 })).toEqual({
      key: null,
      sentence: '',
      words: [
        {
          fn: false,
          term: '',
        },
      ],
    });
    expect(component.analyse({ caretPosition: 2, el: '{#request}', end: 11, start: 1 })).toEqual({
      key: null,
      sentence: '',
      words: [
        {
          fn: false,
          term: '',
        },
      ],
    });
    expect(component.analyse({ caretPosition: 3, el: '{#request}', end: 11, start: 1 })).toEqual({
      key: null,
      sentence: '#',
      words: [
        {
          fn: false,
          term: '#',
        },
      ],
    });
    expect(component.analyse({ caretPosition: 7, el: '{ #request }', end: 11, start: 1 })).toEqual({
      key: 'req',
      sentence: '#req',
      words: [
        {
          fn: false,
          term: '#req',
        },
      ],
    });
    expect(
      component.analyse({
        caretPosition: 11,
        el: '{#request.head}',
        end: 17,
        start: 1,
      }),
    ).toEqual({
      key: 'request.',
      sentence: '#request.',
      words: [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: '',
        },
      ],
    });
    expect(
      component.analyse({
        caretPosition: 13,
        el: '{#request.head}',
        end: 17,
        start: 1,
      }),
    ).toEqual({
      key: 'request.he',
      sentence: '#request.he',
      words: [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: 'he',
        },
      ],
    });
    expect(
      component.analyse({
        caretPosition: 40,
        el: `{#response.headers[#headers['application/json']] == ''}`,
        end: 17,
        start: 1,
      }),
    ).toEqual({
      key: 'headers',
      sentence: "#response.headers[#headers['applicatio",
      words: [
        {
          fn: false,
          term: '#response',
        },
        {
          fn: false,
          term: "headers[#headers['applicatio",
        },
      ],
    });

    expect(
      component.analyse({
        caretPosition: 43,
        el: '{#request.headers.getFirst("Content-Type")}',
        end: 45,
        start: 1,
      }),
    ).toEqual({
      key: 'request.headers',
      sentence: '#request.headers',
      words: [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: 'headers',
        },
        {
          fn: true,
          term: 'getFirst',
        },
      ],
    });
  });

  test('should get previous key', () => {
    expect(component.getPreviousKey('request')).toEqual(null);
    expect(component.getPreviousKey('request.hea')).toEqual('request');
    expect(component.getPreviousKey('request.headers.foobar')).toEqual('request.headers');
  });

  test('should get grammar with context', () => {
    expect(component.getGrammar({ key: 'resp', sentence: '#resp' })).toEqual({
      list: [
        {
          displayText: 'request',
          text: 'request',
        },
        {
          displayText: 'endpoints[]',
          text: 'endpoints[]',
        },
        {
          displayText: 'response',
          text: 'response',
        },
        {
          displayText: 'context',
          text: 'context',
        },
        {
          displayText: 'properties[]',
          text: 'properties[]',
        },
        {
          displayText: 'dictionaries[]',
          text: 'dictionaries[]',
        },
      ],
    });
    expect(component.getGrammar({ key: 'response' })).toEqual({
      list: [],
    });
    expect(component.getGrammar({ key: 'response.' })).toEqual({
      list: [
        {
          displayText: "headers[''][0]",
          text: "headers[''][0]",
        },
        {
          displayText: 'content',
          text: 'content',
        },
        {
          displayText: 'status',
          text: 'status',
        },
      ],
    });
    expect(component.getGrammar({ key: 'response.hea' })).toEqual({
      list: [
        {
          displayText: "headers[''][0]",
          text: "headers[''][0]",
        },
        {
          displayText: 'content',
          text: 'content',
        },
        {
          displayText: 'status',
          text: 'status',
        },
      ],
    });
  });

  test('should get type by id', () => {
    expect(component.getType('FakeType')).toBeUndefined();
    expect(component.getType('HttpHeaders')).toBeDefined();
  });

  test('should get enum by id', () => {
    expect(component.getEnum('FakeType')).toBeUndefined();
    expect(component.getEnum('HttpHeaders')).toBeDefined();
  });

  test('should get enum term', () => {
    expect(component.getEnumTerm(`headers['Acc`)).toEqual('Acc');
    expect(component.getEnumTerm(`FakeMap['Content-`)).toEqual('Content-');
  });

  test('should find return type', () => {
    expect(component.findReturnType('FakeType', [])).toBeUndefined();
    expect(
      component.findReturnType('HttpHeaders', [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: 'headers',
        },
        {
          fn: false,
          term: '',
        },
      ]),
    ).toEqual(component.getType('HttpHeaders'));
    expect(
      component.findReturnType('MultiValueMap', [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: 'headers',
        },
        {
          fn: true,
          term: 'get',
        },
      ]),
    ).toEqual(component.getType('Object'));
    expect(
      component.findReturnType('MultiValueMap', [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: 'headers',
        },
        {
          fn: true,
          term: 'get',
        },
        {
          fn: true,
          term: 'toString',
        },
      ]),
    ).toEqual(component.getType('String'));

    expect(
      component.findReturnType('MultiValueMap', [
        {
          fn: false,
          term: '#request',
        },
        {
          fn: false,
          term: 'headers',
        },
        {
          fn: true,
          term: 'containsKey',
        },
      ]),
    ).toEqual(component.getType('boolean'));
  });
});
