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
import '../../src/molecules/gv-scroll-layout';

describe('<gv-scroll-layout>', () => {
  let page;
  let component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-scroll-layout', {
      items: [
        {
          innerHTML: `
      <div slot="header-left">Left</div>
    
      <div slot="header-title">The title</div>
    
      <div slot="header-right">Right</div>
    
      <div slot="content">
        The Long content
        <div style="height:800px"></div>
        The End
      </div>
    `,
        },
      ],
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-scroll-layout')).toBeDefined();
    expect(component).toEqual(querySelector('gv-scroll-layout'));
  });
});
